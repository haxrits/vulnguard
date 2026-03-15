import React from 'react';
import { getRiskLabel, getRiskColor, getRiskExplanation } from '../../utils/riskScoring';
import { Info } from 'lucide-react';

/**
 * RiskScoreCard - Displays overall risk score with visual gauge.
 *
 * Score ranges:
 *   75–100 → Critical Risk  (red)
 *   50–74  → High Risk      (orange)
 *   25–49  → Medium Risk    (yellow)
 *   1–24   → Low Risk       (green)
 *   0      → No Risk        (gray)
 */
const RiskScoreCard = ({ score, criticalCount = 0, highCount = 0, totalPackages = 0 }) => {
  const label = getRiskLabel(score);
  const hexColor = getRiskColor(score);
  const explanation = getRiskExplanation(score, criticalCount, highCount, totalPackages);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="card flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-2 mb-4 self-start">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200">Overall Risk Score</h3>
        <div className="group relative">
          <Info className="w-4 h-4 text-slate-400 cursor-help" />
          <div className="absolute hidden group-hover:block bottom-6 left-0 w-56 p-2 bg-slate-800 text-white text-xs rounded-lg z-10">
            Weighted severity score: Critical×40, High×25, Medium×15, Low×5 divided by maximum possible danger. Scores range 0-100.
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
            stroke={hexColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: hexColor }}>
            {score}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">/100</span>
        </div>
      </div>

      <span className="text-lg font-semibold" style={{ color: hexColor }}>
        {label}
      </span>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">
        {explanation}
      </p>
    </div>
  );
};

export default RiskScoreCard;
