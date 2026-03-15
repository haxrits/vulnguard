import React from 'react';
import { clsx } from 'clsx';
import { Package, AlertOctagon, AlertTriangle, FolderOpen, TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

/**
 * KeyMetrics - 4 key metric cards for dashboard overview
 * Shows the most important security KPIs at a glance
 */
const MetricCard = ({ title, value, subtitle, icon: Icon, colorClass, trend, trendLabel }) => (
  <div className="card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        <p className={clsx('text-3xl font-bold mt-1', colorClass)}>{formatNumber(value)}</p>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
      <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center', `${colorClass} bg-opacity-10`)}>
        <Icon className={clsx('w-6 h-6', colorClass)} />
      </div>
    </div>
    {trend !== undefined && (
      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
        {trend > 0 ? (
          <TrendingUp className="w-4 h-4 text-red-500" />
        ) : (
          <TrendingDown className="w-4 h-4 text-green-500" />
        )}
        <span className={clsx('text-xs font-medium', trend > 0 ? 'text-red-500' : 'text-green-500')}>
          {Math.abs(trend)}% {trendLabel}
        </span>
      </div>
    )}
  </div>
);

const KeyMetrics = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <MetricCard
        title="Total Dependencies"
        value={metrics.totalDependencies}
        subtitle="Across all projects"
        icon={Package}
        colorClass="text-blue-600"
        trend={5}
        trendLabel="from last scan"
      />
      <MetricCard
        title="Critical Vulnerabilities"
        value={metrics.criticalCount}
        subtitle="Requires immediate action"
        icon={AlertOctagon}
        colorClass="text-red-600"
        trend={25}
        trendLabel="increase this month"
      />
      <MetricCard
        title="High Severity"
        value={metrics.highCount}
        subtitle="Important to address"
        icon={AlertTriangle}
        colorClass="text-orange-600"
        trend={10}
        trendLabel="increase this month"
      />
      <MetricCard
        title="Projects at Risk"
        value={metrics.projectsAtRisk}
        subtitle="Need security review"
        icon={FolderOpen}
        colorClass="text-amber-600"
        trend={0}
        trendLabel="no change"
      />
    </div>
  );
};

export default KeyMetrics;
