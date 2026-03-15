/**
 * scanService.js
 * Handles file reading, dependency parsing, OSV.dev API querying, and result building.
 */

const OSV_BATCH_URL = 'https://api.osv.dev/v1/querybatch';

const SUPPORTED_FILENAMES = ['package.json', 'requirements.txt', 'pom.xml', 'go.mod', 'Cargo.toml'];

/** @typedef {{ name: string, version: string, ecosystem: string }} ParsedPackage */

/**
 * @typedef {{ name: string, version: string, ecosystem: string, severity: string, cvss: number, cves: string[], fixVersion: string }} Dependency
 */

/**
 * @typedef {{ totalPackages: number, vulnerableCount: number, criticalCount: number, highCount: number, mediumCount: number, lowCount: number, safeCount: number, avgCvss: number, dependencies: Dependency[], scannedAt: Date }} ScanResult
 */

/**
 * Reads a file using the FileReader API and returns its text content.
 * @param {File} file - The File object to read
 * @returns {Promise<string>} The file content as text
 */
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}

/**
 * Cleans a semver version string by stripping leading range operators.
 * @param {string} version
 * @returns {string}
 */
function cleanVersion(version) {
  return version.replace(/^[\^~>=<\s]+/, '').trim();
}

/**
 * Parses package.json content and returns npm packages.
 * @param {string} content
 * @returns {ParsedPackage[]}
 */
function parsePackageJson(content) {
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('This file has a JSON syntax error. Check for missing commas or brackets.');
  }

  const deps = {
    ...(parsed.dependencies || {}),
    ...(parsed.devDependencies || {}),
  };

  const packages = Object.entries(deps).map(([name, version]) => ({
    name,
    version: cleanVersion(String(version)),
    ecosystem: 'npm',
  }));

  if (packages.length === 0) {
    throw new Error('No dependencies found in this file. Make sure your file contains a valid dependency list.');
  }

  return packages;
}

/**
 * Parses requirements.txt content and returns PyPI packages.
 * @param {string} content
 * @returns {ParsedPackage[]}
 */
function parseRequirementsTxt(content) {
  const lines = content.split('\n');
  const packages = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    // Strip inline comments
    const commentIdx = line.indexOf(' #');
    const cleanLine = commentIdx !== -1 ? line.slice(0, commentIdx).trim() : line;

    // Split on version specifiers: ==, ~=, >=, <=, >, <
    const match = cleanLine.match(/^([A-Za-z0-9_.\-[\]]+)\s*(?:==|~=|>=|<=|>|<)\s*([^\s,;]+)/);
    if (match) {
      packages.push({
        name: match[1].trim(),
        version: match[2].trim(),
        ecosystem: 'PyPI',
      });
    } else if (/^[A-Za-z0-9_.\-[\]]+$/.test(cleanLine)) {
      // Package listed without version — skip, can't query OSV without version
    }
  }

  if (packages.length === 0) {
    throw new Error('No dependencies found in this file. Make sure your file contains a valid dependency list.');
  }

  return packages;
}

/**
 * Parses pom.xml content and returns Maven packages.
 * @param {string} content
 * @returns {ParsedPackage[]}
 */
function parsePomXml(content) {
  let doc;
  try {
    const parser = new DOMParser();
    doc = parser.parseFromString(content, 'application/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) throw new Error('Invalid XML');
  } catch {
    throw new Error('This file has an XML syntax error. Check for missing tags or invalid characters.');
  }

  const dependencyNodes = doc.querySelectorAll('dependency');
  const packages = [];

  dependencyNodes.forEach((dep) => {
    const artifactId = dep.querySelector('artifactId')?.textContent?.trim();
    const version = dep.querySelector('version')?.textContent?.trim();
    if (artifactId && version && !version.startsWith('${')) {
      packages.push({ name: artifactId, version, ecosystem: 'Maven' });
    }
  });

  if (packages.length === 0) {
    throw new Error('No dependencies found in this file. Make sure your file contains a valid dependency list.');
  }

  return packages;
}

/**
 * Parses go.mod content and returns Go packages.
 * @param {string} content
 * @returns {ParsedPackage[]}
 */
function parseGoMod(content) {
  const packages = [];
  const lines = content.split('\n');
  let inRequireBlock = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === 'require (') {
      inRequireBlock = true;
      continue;
    }
    if (inRequireBlock && line === ')') {
      inRequireBlock = false;
      continue;
    }

    // Inline require: "require module version"
    const inlineMatch = line.match(/^require\s+(\S+)\s+(\S+)/);
    if (inlineMatch) {
      packages.push({ name: inlineMatch[1], version: inlineMatch[2].replace(/^v/, ''), ecosystem: 'Go' });
      continue;
    }

    // Inside block: "module version"
    if (inRequireBlock) {
      const blockMatch = line.match(/^(\S+)\s+(\S+)/);
      if (blockMatch && !line.startsWith('//')) {
        packages.push({ name: blockMatch[1], version: blockMatch[2].replace(/^v/, ''), ecosystem: 'Go' });
      }
    }
  }

  if (packages.length === 0) {
    throw new Error('No dependencies found in this file. Make sure your file contains a valid dependency list.');
  }

  return packages;
}

/**
 * Parses Cargo.toml content and returns Cargo packages.
 * @param {string} content
 * @returns {ParsedPackage[]}
 */
function parseCargoToml(content) {
  const packages = [];
  const lines = content.split('\n');
  let inDepsSection = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === '[dependencies]' || line === '[dev-dependencies]' || line === '[build-dependencies]') {
      inDepsSection = true;
      continue;
    }
    if (line.startsWith('[') && inDepsSection) {
      inDepsSection = false;
    }

    if (!inDepsSection) continue;
    if (!line || line.startsWith('#')) continue;

    // name = "version"
    const simpleMatch = line.match(/^([A-Za-z0-9_\-]+)\s*=\s*"([^"]+)"/);
    if (simpleMatch) {
      packages.push({ name: simpleMatch[1], version: simpleMatch[2], ecosystem: 'crates.io' });
      continue;
    }

    // name = { version = "version", ... }
    const tableMatch = line.match(/^([A-Za-z0-9_\-]+)\s*=\s*\{[^}]*version\s*=\s*"([^"]+)"/);
    if (tableMatch) {
      packages.push({ name: tableMatch[1], version: tableMatch[2], ecosystem: 'crates.io' });
    }
  }

  if (packages.length === 0) {
    throw new Error('No dependencies found in this file. Make sure your file contains a valid dependency list.');
  }

  return packages;
}

/**
 * Parses a dependency file and extracts package information.
 * Supports: package.json, requirements.txt, pom.xml, go.mod, Cargo.toml
 * @param {string} filename - Name of the file (determines parser type)
 * @param {string} content - File content as string
 * @returns {ParsedPackage[]} Array of parsed packages
 */
function parseFile(filename, content) {
  const lower = filename.toLowerCase();

  if (lower === 'package.json') return parsePackageJson(content);
  if (lower === 'requirements.txt') return parseRequirementsTxt(content);
  if (lower === 'pom.xml') return parsePomXml(content);
  if (lower === 'go.mod') return parseGoMod(content);
  if (lower === 'cargo.toml') return parseCargoToml(content);

  throw new Error(
    'Please upload a supported dependency file (package.json, requirements.txt, pom.xml, go.mod, or Cargo.toml)'
  );
}

/**
 * Checks packages against OSV.dev vulnerability database.
 * @param {ParsedPackage[]} packages - Array of ParsedPackage objects to check
 * @returns {Promise<object>} OSV API response
 */
async function checkWithOSV(packages) {
  const queries = packages.map((pkg) => ({
    package: { name: pkg.name, ecosystem: pkg.ecosystem },
    version: pkg.version,
  }));

  let response;
  try {
    response = await fetch(OSV_BATCH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queries }),
    });
  } catch {
    throw new Error('Could not connect to vulnerability database. Check your internet connection.');
  }

  if (!response.ok) {
    throw new Error('Could not connect to vulnerability database. Check your internet connection.');
  }

  return response.json();
}

/**
 * Maps OSV severity string to a numeric CVSS score.
 * @param {string} severity
 * @returns {number}
 */
function severityToCvss(severity) {
  switch ((severity || '').toUpperCase()) {
    case 'CRITICAL': return 9.5;
    case 'HIGH': return 7.5;
    case 'MODERATE': return 5.0;
    case 'MEDIUM': return 5.0;
    case 'LOW': return 2.0;
    default: return 3.0;
  }
}

/**
 * Maps a CVSS score to a severity label.
 * @param {number} cvss
 * @returns {string}
 */
function cvssToSeverityLabel(cvss) {
  if (cvss >= 9.0) return 'Critical';
  if (cvss >= 7.0) return 'High';
  if (cvss >= 4.0) return 'Medium';
  if (cvss > 0) return 'Low';
  return 'Safe';
}

/**
 * Transforms OSV API response into structured Dependency objects.
 * @param {ParsedPackage[]} packages - Original ParsedPackage array
 * @param {object} osvResponse - Response from OSV.dev API
 * @returns {Dependency[]} Sorted by CVSS descending
 */
function buildResults(packages, osvResponse) {
  const results = osvResponse?.results ?? [];

  const dependencies = packages.map((pkg, i) => {
    const result = results[i];
    const vulns = result?.vulns;

    if (!vulns || vulns.length === 0) {
      return {
        name: pkg.name,
        version: pkg.version,
        ecosystem: pkg.ecosystem,
        severity: 'Safe',
        cvss: 0,
        cves: [],
        fixVersion: '',
      };
    }

    // Extract CVEs from aliases
    const cves = [];
    for (const vuln of vulns) {
      for (const alias of vuln.aliases || []) {
        if (alias.startsWith('CVE-')) {
          cves.push(alias);
        }
      }
    }

    // Get severity from first vuln
    const rawSeverity = vulns[0]?.database_specific?.severity ?? '';
    const cvss = severityToCvss(rawSeverity);
    const severity = cvssToSeverityLabel(cvss);

    // Get fix version
    let fixVersion = '';
    const events = vulns[0]?.affected?.[0]?.ranges?.[0]?.events ?? [];
    for (const event of events) {
      if (event.fixed !== undefined) {
        fixVersion = event.fixed;
        break;
      }
    }

    return {
      name: pkg.name,
      version: pkg.version,
      ecosystem: pkg.ecosystem,
      severity,
      cvss,
      cves,
      fixVersion,
    };
  });

  // Sort by CVSS descending (highest risk first)
  return dependencies.sort((a, b) => b.cvss - a.cvss);
}

/**
 * Main scanning function — orchestrates the entire scanning process.
 * Reads file → Parses dependencies → Checks OSV → Builds results
 * @param {File} file - The file to scan
 * @param {(progress: number, message: string) => void} onProgress - Callback for progress updates
 * @returns {Promise<ScanResult>} Complete scan results
 */
export async function runScan(file, onProgress) {
  // Validate file type
  const lower = file.name.toLowerCase();
  if (!SUPPORTED_FILENAMES.some((n) => n.toLowerCase() === lower)) {
    throw new Error(
      'Please upload a supported dependency file (package.json, requirements.txt, pom.xml, go.mod, or Cargo.toml)'
    );
  }

  // Validate file size (max 500KB)
  if (file.size > 500 * 1024) {
    throw new Error('File too large. Maximum size is 500KB');
  }

  try {
    onProgress(10, 'Reading file...');
    const content = await readFile(file);

    onProgress(25, 'Parsing dependencies...');
    const packages = parseFile(file.name, content);

    onProgress(45, `Checking ${packages.length} packages...`);
    const osvResponse = await checkWithOSV(packages);

    onProgress(80, 'Building risk report...');
    const dependencies = buildResults(packages, osvResponse);

    onProgress(100, 'Scan complete');

    const vulnerableCount = dependencies.filter((d) => d.severity !== 'Safe').length;
    const criticalCount = dependencies.filter((d) => d.severity === 'Critical').length;
    const highCount = dependencies.filter((d) => d.severity === 'High').length;
    const mediumCount = dependencies.filter((d) => d.severity === 'Medium').length;
    const lowCount = dependencies.filter((d) => d.severity === 'Low').length;
    const safeCount = dependencies.filter((d) => d.severity === 'Safe').length;

    const totalCvss = dependencies.reduce((sum, d) => sum + d.cvss, 0);
    const avgCvss = dependencies.length > 0
      ? Math.round((totalCvss / dependencies.length) * 10) / 10
      : 0;

    return {
      totalPackages: packages.length,
      vulnerableCount,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      safeCount,
      avgCvss,
      dependencies,
      scannedAt: new Date(),
    };
  } catch (err) {
    if (
      err.message.includes('Could not connect') ||
      err.message.includes('JSON syntax error') ||
      err.message.includes('No dependencies found') ||
      err.message.includes('Please upload a supported') ||
      err.message.includes('File too large') ||
      err.message.includes('XML syntax error')
    ) {
      throw err;
    }
    throw new Error('Scan failed. Please try again.');
  }
}
