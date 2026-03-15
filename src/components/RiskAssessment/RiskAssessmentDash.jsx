import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Target, Clock } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { vulnerabilities, dashboardMetrics } from '../../services/mockData';
import { calculateRiskScore, getSeverityDistribution } from '../../utils/riskScorer';
import { clsx } from 'clsx';

/**
 * RiskAssessmentDash - Risk metrics and trend analysis
 * 
 * Risk Formula:
 * Risk Score = (CVSS/10) × Exploitability Factor × Urgency Factor × 100
 * 
 * This page helps prioritize which vulnerabilities to fix first.
 */
const RiskAssessmentDash = () => {
  const severityDist = getSeverityDistribution(vulnerabilities);

  const severityData = [
    { name: 'Critical', count: severityDist.CRITICAL, fill: '#DC2626' },
    { name: 'High', count: severityDist.HIGH, fill: '#EA580C' },
    { name: 'Medium', count: severityDist.MEDIUM, fill: '#D97706' },
    { name: 'Low', count: severityDist.LOW, fill: '#16A34A' },
  ];

  const exploitabilityData = [
    { name: 'Known Exploit', value: 8 },
    { name: 'PoC', value: 7 },
    { name: 'Theoretical', value: 10 },
    { name: 'Unknown', value: 5 },
  ];

  const topRiskVulns = [...vulnerabilities]
    .map(v => ({ ...v, riskScore: calculateRiskScore(v) }))
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 10);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-500" />
          Risk Assessment Dashboard
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Prioritized risk scoring to help you decide what to fix first
        </p>
      </div>

      {/* Risk Formula Explainer */}
      <div className="card bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">
              📐 Risk Score Formula
            </p>
            <div className="mt-2 font-mono text-xs text-purple-600 dark:text-purple-500 bg-purple-100 dark:bg-purple-900/30 px-3 py-2 rounded">
              Risk Score = (CVSS/10) × Exploitability Factor × Urgency Factor × 100
            </div>
            <div className="mt-2 text-xs text-purple-600 dark:text-purple-500 grid grid-cols-2 gap-2">
              <span>• Known Exploit = 1.0 factor</span>
              <span>• PoC = 0.7 factor</span>
              <span>• Theoretical = 0.3 factor</span>
              <span>• Urgency: newer = higher</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard title="Avg CVSS Score" value="7.8" icon={Target} color="text-orange-600" />
        <SummaryCard title="Avg Time to Patch" value="23 days" icon={Clock} color="text-blue-600" />
        <SummaryCard title="Fix Rate" value="68%" icon={TrendingUp} color="text-green-600" />
        <SummaryCard title="New This Month" value="+7" icon={TrendingUp} color="text-red-600" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Severity Distribution Bar Chart */}
        <div className="card">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Severity Distribution
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={severityData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b', border: '1px solid #334155',
                  borderRadius: '8px', color: '#f1f5f9',
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {severityData.map((entry) => (
                  <rect key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Exploitability Distribution */}
        <div className="card">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Exploitability Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={exploitabilityData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b', border: '1px solid #334155',
                  borderRadius: '8px', color: '#f1f5f9',
                }}
              />
              <Bar dataKey="value" fill="#7C3AED" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Risk Vulnerabilities */}
      <div className="card">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">
          Top 10 Highest Risk Vulnerabilities
        </h3>
        <div className="space-y-2">
          {topRiskVulns.map((vuln, i) => (
            <div key={vuln.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
              <span className="text-sm font-bold text-slate-400 w-6">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-xs text-blue-600 dark:text-blue-400">{vuln.id}</code>
                  <span className="text-sm text-slate-600 dark:text-slate-400 truncate">{vuln.name.slice(0, 40)}...</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-slate-500 dark:text-slate-400">CVSS: {vuln.cvssScore}</span>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${vuln.riskScore}%`,
                        backgroundColor: vuln.riskScore >= 75 ? '#DC2626' : vuln.riskScore >= 50 ? '#EA580C' : '#D97706'
                      }}
                    />
                  </div>
                  <span className={clsx(
                    'text-sm font-bold w-8 text-right',
                    vuln.riskScore >= 75 ? 'text-red-600 dark:text-red-400' :
                    vuln.riskScore >= 50 ? 'text-orange-600 dark:text-orange-400' : 'text-amber-600 dark:text-amber-400'
                  )}>
                    {vuln.riskScore}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon: Icon, color }) => (
  <div className="card">
    <div className="flex items-center justify-between mb-2">
      <Icon className={clsx('w-5 h-5', color)} />
    </div>
    <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{title}</p>
  </div>
);

export default RiskAssessmentDash;
