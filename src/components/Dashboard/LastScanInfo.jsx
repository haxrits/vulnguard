import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatDate, formatRelativeDate } from '../../utils/formatters';
import { dashboardMetrics } from '../../services/mockData';

/**
 * LastScanInfo - Shows when the last security scan was performed
 * Regular scanning is a key security best practice
 */
const LastScanInfo = () => {
  return (
    <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Last Security Scan</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatDate(dashboardMetrics.lastScanDate)} • {formatRelativeDate(dashboardMetrics.lastScanDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-green-600">{dashboardMetrics.fixAvailableCount}</span> fix available
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-red-600">{dashboardMetrics.noFixCount}</span> no fix
            </span>
          </div>
          <button className="btn-primary text-sm py-1.5 px-4">
            Run Scan Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LastScanInfo;
