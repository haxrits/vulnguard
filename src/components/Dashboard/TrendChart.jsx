import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { trendData } from '../../services/mockData';

/**
 * TrendChart - Line chart showing vulnerability discovery over 12 months
 * 
 * This chart helps answer: "Is our vulnerability count increasing or decreasing?"
 * Key insight: An upward trend may indicate: new dependencies added, better scanning, 
 * or increased attack surface. Analyze context carefully.
 */
const TrendChart = () => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">Vulnerability Trend</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            12-month discovery trend by severity
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-red-500 inline-block rounded"></span> Critical
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-orange-500 inline-block rounded"></span> High
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-amber-500 inline-block rounded"></span> Medium
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
          />
          <Line
            type="monotone"
            dataKey="critical"
            stroke="#DC2626"
            strokeWidth={2}
            dot={{ fill: '#DC2626', r: 3 }}
            name="Critical"
          />
          <Line
            type="monotone"
            dataKey="high"
            stroke="#EA580C"
            strokeWidth={2}
            dot={{ fill: '#EA580C', r: 3 }}
            name="High"
          />
          <Line
            type="monotone"
            dataKey="medium"
            stroke="#D97706"
            strokeWidth={2}
            dot={{ fill: '#D97706', r: 3 }}
            name="Medium"
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#2563EB"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Total"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
