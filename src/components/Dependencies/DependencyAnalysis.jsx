import React from 'react';
import { Package, AlertTriangle, CheckCircle, XCircle, Archive, Wrench } from 'lucide-react';
import { dependencies } from '../../services/mockData';
import SeverityBadge from '../Common/Badge';
import { clsx } from 'clsx';

/**
 * DependencyAnalysis - Visual dependency assessment page
 * 
 * Key concepts:
 * - Direct dependencies: explicitly listed in package.json
 * - Transitive dependencies: dependencies of your dependencies
 * - License compliance: ensuring compatible licenses
 * - Maintenance status: is the package still actively maintained?
 */
const StatusBadge = ({ status }) => {
  const configs = {
    active: { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', icon: CheckCircle, label: 'Active' },
    deprecated: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', icon: XCircle, label: 'Deprecated' },
    maintenance: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', icon: Wrench, label: 'Maintenance' },
    archived: { color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-700', icon: Archive, label: 'Archived' },
  };
  const config = configs[status] || configs.active;
  const Icon = config.icon;

  return (
    <span className={clsx('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium', config.bg, config.color)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

const DependencyAnalysis = () => {
  const directDeps = dependencies.filter(d => d.directDependency);
  const transitiveDeps = dependencies.filter(d => !d.directDependency);
  const vulnerableDeps = dependencies.filter(d => d.vulnerabilityCount > 0);
  const deprecatedDeps = dependencies.filter(d => d.maintenanceStatus === 'deprecated');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-500" />
          Dependency Analysis
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Analyze your dependency tree for vulnerabilities, license issues, and maintenance status
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Direct Dependencies" value={directDeps.length} subtitle="In package.json" color="text-blue-600" />
        <MetricCard title="Transitive Dependencies" value={transitiveDeps.length} subtitle="Dependencies of deps" color="text-indigo-600" />
        <MetricCard title="Vulnerable Packages" value={vulnerableDeps.length} subtitle="Have known CVEs" color="text-red-600" />
        <MetricCard title="Deprecated Packages" value={deprecatedDeps.length} subtitle="Need replacement" color="text-orange-600" />
      </div>

      {/* Educational Note */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              💡 Supply Chain Security Insight
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-500 mt-1">
              Most vulnerabilities come from <strong>transitive dependencies</strong> — packages your packages depend on. 
              The average Node.js project has 5-10x more transitive dependencies than direct ones. 
              This is why SBOM (Software Bill of Materials) tracking is critical.
            </p>
          </div>
        </div>
      </div>

      {/* Dependency Table */}
      <div className="card overflow-hidden p-0">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">All Tracked Dependencies</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="table-header rounded-l-lg">Package</th>
                <th className="table-header">Version</th>
                <th className="table-header">License</th>
                <th className="table-header">Type</th>
                <th className="table-header">Maintenance</th>
                <th className="table-header">Vulnerabilities</th>
                <th className="table-header rounded-r-lg">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {dependencies.map((dep) => (
                <tr key={dep.id} className="table-row">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300">{dep.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{dep.description}</p>
                    </div>
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
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {dep.directDependency ? '📦 Direct' : '🔗 Transitive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={dep.maintenanceStatus} />
                  </td>
                  <td className="px-4 py-3">
                    {dep.vulnerabilityCount > 0 ? (
                      <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                        {dep.vulnerabilityCount} CVE{dep.vulnerabilityCount > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
                        <CheckCircle className="w-3 h-3" /> Clean
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {dep.isOutdated ? (
                      <div className="text-xs">
                        <span className="text-orange-600 dark:text-orange-400 font-medium">⚠ Outdated</span>
                        <span className="text-slate-400 dark:text-slate-500 ml-1">→ v{dep.latestVersion}</span>
                      </div>
                    ) : (
                      <span className="text-green-600 dark:text-green-400 text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Up to date
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* License Compliance */}
      <div className="card">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">License Compliance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['MIT', 'Apache-2.0', 'BSD-3-Clause', 'GPL/Proprietary'].map((license) => {
            const count = dependencies.filter(d => {
              if (license === 'GPL/Proprietary') return d.license.includes('GPL') || d.license.includes('BSD/GPL');
              return d.license === license;
            }).length;
            const isProblematic = license.includes('GPL');
            return (
              <div key={license} className={clsx(
                'p-3 rounded-lg border',
                isProblematic
                  ? 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50'
              )}>
                <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{count}</p>
                <p className={clsx('text-xs font-medium', isProblematic ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500 dark:text-slate-400')}>
                  {license}
                </p>
                {isProblematic && (
                  <p className="text-xs text-orange-500 mt-1">⚠ Review required</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, subtitle, color }) => (
  <div className="card">
    <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    <p className={clsx('text-sm font-medium mt-1', color)}>{title}</p>
    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
  </div>
);

export default DependencyAnalysis;
