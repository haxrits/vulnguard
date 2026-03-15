import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { vulnerabilities } from '../../services/mockData';
import SeverityBadge from '../Common/Badge';
import { formatCVSS, formatExploitability } from '../../utils/formatters';

/**
 * TopVulnerabilities - Quick-view table of the 5 most critical vulnerabilities
 * Uses CVSS score as primary sort, with exploitability as secondary sort
 */
const TopVulnerabilities = () => {
  const top5 = [...vulnerabilities]
    .filter(v => v.cvssScore !== null)
    .sort((a, b) => (b.cvssScore ?? 0) - (a.cvssScore ?? 0))
    .slice(0, 5);

  const getCVSSColorClass = (score) => {
    if (score >= 9.0) return 'text-red-600 dark:text-red-400 font-bold';
    if (score >= 7.0) return 'text-orange-600 dark:text-orange-400 font-semibold';
    if (score >= 4.0) return 'text-amber-600 dark:text-amber-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">Top Critical Vulnerabilities</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Highest CVSS score vulnerabilities</p>
        </div>
        <Link
          to="/vulnerabilities"
          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm hover:underline"
        >
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="table-header rounded-l-lg">CVE ID</th>
              <th className="table-header">Package</th>
              <th className="table-header">CVSS</th>
              <th className="table-header">Severity</th>
              <th className="table-header rounded-r-lg">Exploitability</th>
            </tr>
          </thead>
          <tbody>
            {top5.map((vuln) => (
              <tr key={vuln.id} className="table-row">
                <td className="px-4 py-3">
                  <a
                    href={`https://nvd.nist.gov/vuln/detail/${vuln.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-mono text-xs"
                  >
                    {vuln.id}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">
                  {vuln.package}
                </td>
                <td className="px-4 py-3">
                  <span className={getCVSSColorClass(vuln.cvssScore)}>
                    {formatCVSS(vuln.cvssScore)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={vuln.severity} />
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">
                  {formatExploitability(vuln.exploitability)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopVulnerabilities;
