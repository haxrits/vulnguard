import React from 'react';
import { clsx } from 'clsx';
import { getRiskScoreTextClass, getRiskScoreColor } from '../../utils/colorMap';
import { Info } from 'lucide-react';

/**
 * RiskScoreCard - Displays overall risk score with visual traffic light
 * 
 * Risk Score Scale:
 * - 0-24: Low (Green) - minimal exposure
 * - 25-49: Medium (Amber) - moderate risk
 * - 50-74: High (Orange) - significant risk
 * - 75-100: Critical (Red) - immediate action required
 */
const RiskScoreCard = ({ score, totalVulns }) => {
  const getLabel = (s) => {
    if (s >= 75) return { text: 'Critical Risk', color: 'text-red-600 dark:text-red-400', ring: 'border-red-500' };
    if (s >= 50) return { text: 'High Risk', color: 'text-orange-600 dark:text-orange-400', ring: 'border-orange-500' };
    if (s >= 25) return { text: 'Medium Risk', color: 'text-amber-600 dark:text-amber-400', ring: 'border-amber-500' };
    return { text: 'Low Risk', color: 'text-green-600 dark:text-green-400', ring: 'border-green-500' };
  };

  const label = getLabel(score);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="card flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-2 mb-4 self-start">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200">Overall Risk Score</h3>
        <div className="group relative">
          <Info className="w-4 h-4 text-slate-400 cursor-help" />
          <div className="absolute hidden group-hover:block bottom-6 left-0 w-56 p-2 bg-slate-800 text-white text-xs rounded-lg z-10">
            Calculated using: CVSS Score × Exploitability Factor × Urgency. Scores range 0-100.
          </div>
        </div>
      </div>

      {/* Circular Progress */}
      <div className="relative w-36 h-36 mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-200 dark:text-slate-700"
          />
          {/* Progress circle */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={getRiskScoreColor(score)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={clsx('text-3xl font-bold', getRiskScoreTextClass(score))}>
            {score}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">/100</span>
        </div>
      </div>

      <span className={clsx('text-lg font-semibold', label.color)}>
        {label.text}
      </span>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">
        Based on {totalVulns !== null && totalVulns !== undefined ? `${totalVulns} active` : '30 active'} vulnerabilities
      </p>
    </div>
  );
};

export default RiskScoreCard;
