import React, { useState } from 'react';
import { clsx } from 'clsx';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import SeverityBadge from '../Common/Badge';

const SEVERITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3, Safe: 4 };

/**
 * Returns a CVSS color class based on score.
 * @param {number} score
 * @returns {string}
 */
function getCvssClass(score) {
  if (score >= 9.0) return 'text-red-600 dark:text-red-400 font-bold';
  if (score >= 7.0) return 'text-orange-600 dark:text-orange-400 font-semibold';
  if (score >= 4.0) return 'text-amber-600 dark:text-amber-400';
  if (score > 0) return 'text-green-600 dark:text-green-400';
  return 'text-slate-400 dark:text-slate-500';
}

/**
 * ScanResultsTable — Displays real dependency scan results.
 * @param {{ dependencies: object[], avgCvss: number }} props
 */
const ScanResultsTable = ({ dependencies, avgCvss }) => {
  const [sortField, setSortField] = useState('cvss');
  const [sortDir, setSortDir] = useState('desc');
  const [showAll, setShowAll] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sorted = [...dependencies].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'cvss') cmp = a.cvss - b.cvss;
    else if (sortField === 'severity')
      cmp = (SEVERITY_ORDER[a.severity] ?? 5) - (SEVERITY_ORDER[b.severity] ?? 5);
    else if (sortField === 'name') cmp = a.name.localeCompare(b.name);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const displayed = showAll ? sorted : sorted.slice(0, 10);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? (
      <ChevronUp className="w-3 h-3 inline ml-0.5" />
    ) : (
      <ChevronDown className="w-3 h-3 inline ml-0.5" />
    );
  };

  const thClass =
    'table-header cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200 transition-colors';

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">Scan Results</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {dependencies.length} packages scanned · Avg CVSS{' '}
            <span className={clsx('font-semibold', getCvssClass(avgCvss))}>{avgCvss}</span>
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className={clsx(thClass, 'rounded-l-lg')} onClick={() => handleSort('name')}>
                Package <SortIcon field="name" />
              </th>
              <th className={thClass}>Version</th>
              <th className={thClass}>Ecosystem</th>
              <th className={clsx(thClass)} onClick={() => handleSort('cvss')}>
                CVSS <SortIcon field="cvss" />
              </th>
              <th className={clsx(thClass)} onClick={() => handleSort('severity')}>
                Severity <SortIcon field="severity" />
              </th>
              <th className={thClass}>CVEs</th>
              <th className={clsx(thClass, 'rounded-r-lg')}>Fix Version</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((dep, idx) => (
              <tr key={`${dep.name}-${idx}`} className="table-row">
                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                  {dep.name}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                  {dep.version}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">
                  {dep.ecosystem}
                </td>
                <td className="px-4 py-3">
                  <span className={getCvssClass(dep.cvss)}>
                    {dep.cvss > 0 ? dep.cvss.toFixed(1) : '—'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={dep.severity.toUpperCase()} />
                </td>
                <td className="px-4 py-3">
                  {dep.cves.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {dep.cves.slice(0, 2).map((cve) => (
                        <a
                          key={cve}
                          href={`https://nvd.nist.gov/vuln/detail/${cve}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400 font-mono text-xs hover:underline"
                          aria-label={`View ${cve} on NVD`}
                        >
                          {cve}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                      {dep.cves.length > 2 && (
                        <span className="text-xs text-slate-400">+{dep.cves.length - 2}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                  {dep.fixVersion || (dep.severity !== 'Safe' ? 'No fix' : '—')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dependencies.length > 10 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showAll ? 'Show fewer' : `Show all ${dependencies.length} packages`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ScanResultsTable;
