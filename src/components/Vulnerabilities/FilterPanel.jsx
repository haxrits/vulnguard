import React from 'react';
import { clsx } from 'clsx';
import { Filter, X } from 'lucide-react';

const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const EXPLOITABILITIES = [
  { value: 'KNOWN_EXPLOIT', label: 'Known Exploit' },
  { value: 'POC', label: 'PoC Available' },
  { value: 'THEORETICAL', label: 'Theoretical' },
  { value: 'UNKNOWN', label: 'Unknown' },
];

const severityColors = {
  CRITICAL: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200',
  MEDIUM: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200',
  LOW: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200',
};

/**
 * FilterPanel - Advanced filtering for vulnerability explorer
 */
const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  const toggleSeverity = (sev) => {
    const current = filters.severity;
    const updated = current.includes(sev)
      ? current.filter(s => s !== sev)
      : [...current, sev];
    onFilterChange('severity', updated);
  };

  const toggleExploitability = (exp) => {
    const current = filters.exploitability;
    const updated = current.includes(exp)
      ? current.filter(e => e !== exp)
      : [...current, exp];
    onFilterChange('exploitability', updated);
  };

  const hasActiveFilters = filters.severity.length > 0 || filters.exploitability.length > 0 || filters.fixAvailable !== null;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Severity Filter */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Severity</p>
        <div className="flex flex-wrap gap-2">
          {SEVERITIES.map((sev) => (
            <button
              key={sev}
              onClick={() => toggleSeverity(sev)}
              className={clsx(
                'text-xs px-3 py-1 rounded-full border font-semibold transition-all',
                filters.severity.includes(sev)
                  ? severityColors[sev]
                  : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              )}
            >
              {sev.charAt(0) + sev.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Exploitability Filter */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Exploitability</p>
        <div className="flex flex-wrap gap-2">
          {EXPLOITABILITIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => toggleExploitability(value)}
              className={clsx(
                'text-xs px-3 py-1 rounded-full border font-medium transition-all',
                filters.exploitability.includes(value)
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200'
                  : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Fix Available Filter */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Fix Status</p>
        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange('fixAvailable', filters.fixAvailable === true ? null : true)}
            className={clsx(
              'text-xs px-3 py-1 rounded-full border font-medium transition-all',
              filters.fixAvailable === true
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200'
                : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            )}
          >
            Fix Available
          </button>
          <button
            onClick={() => onFilterChange('fixAvailable', filters.fixAvailable === false ? null : false)}
            className={clsx(
              'text-xs px-3 py-1 rounded-full border font-medium transition-all',
              filters.fixAvailable === false
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200'
                : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            )}
          >
            No Fix
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
