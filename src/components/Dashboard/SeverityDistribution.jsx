import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardMetrics } from '../../services/mockData';

const COLORS = {
  Critical: '#DC2626',
  High: '#EA580C',
  Medium: '#D97706',
  Low: '#16A34A',
};

/**
 * SeverityDistribution - Pie chart showing breakdown of vulnerabilities by severity.
 * Accepts optional `metrics` prop; falls back to mock data.
 * @param {{ metrics?: object }} props
 */
const SeverityDistribution = ({ metrics = dashboardMetrics }) => {
  const data = [
    { name: 'Critical', value: metrics.criticalCount, color: COLORS.Critical },
    { name: 'High', value: metrics.highCount, color: COLORS.High },
    { name: 'Medium', value: metrics.mediumCount, color: COLORS.Medium },
    { name: 'Low', value: metrics.lowCount, color: COLORS.Low },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Severity Distribution</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        {total} total vulnerabilities
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
            formatter={(value, name) => [`${value} (${((value/total)*100).toFixed(1)}%)`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeverityDistribution;
