import React, { useState } from 'react';
import { FileText, Download, CheckCircle, XCircle, Package } from 'lucide-react';
import { dependencies, vulnerabilities } from '../../services/mockData';
import { formatDate } from '../../utils/formatters';
import { clsx } from 'clsx';

/**
 * SBOMViewer - Software Bill of Materials viewer and exporter
 * 
 * SBOM (Software Bill of Materials) is:
 * - A complete inventory of all components in your software
 * - Required by US Executive Order 14028 for federal software
 * - Essential for vulnerability management and compliance
 * 
 * Standard formats:
 * - CycloneDX: OWASP standard, security-focused
 * - SPDX: Linux Foundation standard, compliance-focused
 */
const SBOMViewer = () => {
  const [exportFormat, setExportFormat] = useState(null);

  const exportData = {
    cyclonedx: () => {
      const sbom = {
        bomFormat: "CycloneDX",
        specVersion: "1.4",
        serialNumber: `urn:uuid:${Date.now()}`,
        version: 1,
        metadata: {
          timestamp: new Date().toISOString(),
          tools: [{ vendor: "VulnGuard", name: "VulnGuard SBOM", version: "1.0.0" }],
          component: { type: "application", name: "VulnGuard Project", version: "1.0.0" }
        },
        components: dependencies.map(dep => ({
          type: "library",
          name: dep.name,
          version: dep.version,
          purl: `pkg:npm/${dep.name}@${dep.version}`,
          licenses: [{ license: { id: dep.license } }],
          description: dep.description,
        })),
        vulnerabilities: vulnerabilities.slice(0, 5).map(v => ({
          id: v.id,
          source: { name: "NVD", url: `https://nvd.nist.gov/vuln/detail/${v.id}` },
          ratings: [{ source: { name: "NVD" }, score: v.cvssScore, severity: v.severity?.toLowerCase() }],
          description: v.description,
          affects: [{ ref: v.package }],
        }))
      };
      downloadJSON(sbom, 'sbom-cyclonedx.json');
    },
    spdx: () => {
      const spdx = {
        SPDXID: "SPDXRef-DOCUMENT",
        spdxVersion: "SPDX-2.3",
        creationInfo: {
          created: new Date().toISOString(),
          creators: ["Tool: VulnGuard-1.0.0"],
        },
        name: "VulnGuard-SBOM",
        dataLicense: "CC0-1.0",
        documentNamespace: `https://vulnguard.dev/sbom/${Date.now()}`,
        packages: dependencies.map(dep => ({
          SPDXID: `SPDXRef-${dep.name}`,
          name: dep.name,
          versionInfo: dep.version,
          downloadLocation: `https://registry.npmjs.org/${dep.name}`,
          licenseConcluded: dep.license,
          licenseDeclared: dep.license,
          copyrightText: "NOASSERTION",
        })),
      };
      downloadJSON(spdx, 'sbom-spdx.json');
    },
    csv: () => {
      const headers = ['Name', 'Version', 'License', 'Type', 'Maintenance', 'Vulnerabilities', 'Latest Version'];
      const rows = dependencies.map(dep => [
        dep.name, dep.version, dep.license,
        dep.directDependency ? 'Direct' : 'Transitive',
        dep.maintenanceStatus, dep.vulnerabilityCount, dep.latestVersion || dep.version
      ]);
      const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
      downloadText(csv, 'sbom-export.csv', 'text/csv');
    },
    json: () => {
      downloadJSON({ dependencies, vulnerabilities, exportedAt: new Date().toISOString() }, 'vulnguard-full-export.json');
    },
  };

  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, filename);
  };

  const downloadText = (text, filename, mimeType) => {
    const blob = new Blob([text], { type: mimeType });
    downloadBlob(blob, filename);
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportOptions = [
    { id: 'cyclonedx', label: 'CycloneDX JSON', desc: 'OWASP industry standard', icon: '🔄', action: exportData.cyclonedx },
    { id: 'spdx', label: 'SPDX JSON', desc: 'Linux Foundation standard', icon: '📋', action: exportData.spdx },
    { id: 'csv', label: 'CSV Spreadsheet', desc: 'For spreadsheet analysis', icon: '📊', action: exportData.csv },
    { id: 'json', label: 'Full JSON Export', desc: 'Complete data dump', icon: '💾', action: exportData.json },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-teal-500" />
          SBOM & Export
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Software Bill of Materials — your complete dependency inventory
        </p>
      </div>

      {/* Educational Note */}
      <div className="card bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800">
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-teal-700 dark:text-teal-400">
              📦 What is an SBOM?
            </p>
            <p className="text-sm text-teal-600 dark:text-teal-500 mt-1">
              An SBOM (Software Bill of Materials) is like an ingredient list for software. 
              It lists every component, library, and dependency. Required by US Executive Order 14028 
              for federal software. Helps organizations rapidly identify if they're affected when new CVEs emerge.
            </p>
          </div>
        </div>
      </div>

      {/* Export Panel */}
      <div className="card">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Export SBOM</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {exportOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={opt.action}
              className="flex flex-col items-center gap-2 p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all group"
            >
              <span className="text-3xl">{opt.icon}</span>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {opt.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Dependency Table */}
      <div className="card overflow-hidden p-0">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">
            SBOM Table ({dependencies.length} packages)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="table-header rounded-l-lg">Package</th>
                <th className="table-header">Version</th>
                <th className="table-header">License</th>
                <th className="table-header">Maintenance</th>
                <th className="table-header rounded-r-lg">Known CVEs</th>
              </tr>
            </thead>
            <tbody>
              {dependencies.map((dep) => (
                <tr key={dep.id} className="table-row">
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                    {dep.name}
                    <span className="ml-2 text-xs text-slate-400">
                      {dep.directDependency ? '(direct)' : '(transitive)'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                      v{dep.version}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx(
                      'text-xs font-medium px-2 py-0.5 rounded',
                      dep.license.includes('GPL')
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    )}>
                      {dep.license}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx(
                      'text-xs px-2 py-0.5 rounded font-medium',
                      dep.maintenanceStatus === 'active' ? 'text-green-600 dark:text-green-400' :
                      dep.maintenanceStatus === 'deprecated' ? 'text-red-600 dark:text-red-400' :
                      'text-amber-600 dark:text-amber-400'
                    )}>
                      {dep.maintenanceStatus.charAt(0).toUpperCase() + dep.maintenanceStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {dep.vulnerabilityCount > 0 ? (
                      <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-xs font-semibold">
                        <XCircle className="w-3 h-3" /> {dep.vulnerabilityCount}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
                        <CheckCircle className="w-3 h-3" /> 0
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SBOMViewer;
