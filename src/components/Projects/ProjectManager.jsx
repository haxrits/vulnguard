import React, { useState } from 'react';
import { FolderOpen, Plus, Shield, AlertTriangle, Package, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * ProjectManager - Multi-project management
 * Allows users to track security posture across multiple projects
 */
const MOCK_PROJECTS = [
  {
    id: 1,
    name: 'E-Commerce Platform',
    description: 'Main customer-facing web application',
    riskScore: 82,
    criticalCount: 5,
    totalDeps: 245,
    lastScan: '2025-03-14',
    language: 'Node.js',
    status: 'critical',
  },
  {
    id: 2,
    name: 'Internal Dashboard',
    description: 'Admin portal for internal team',
    riskScore: 45,
    criticalCount: 1,
    totalDeps: 89,
    lastScan: '2025-03-13',
    language: 'React',
    status: 'medium',
  },
  {
    id: 3,
    name: 'Payment Service',
    description: 'PCI-DSS compliant payment processing',
    riskScore: 67,
    criticalCount: 3,
    totalDeps: 42,
    lastScan: '2025-03-15',
    language: 'Java',
    status: 'high',
  },
  {
    id: 4,
    name: 'Mobile API',
    description: 'Backend API for iOS/Android apps',
    riskScore: 23,
    criticalCount: 0,
    totalDeps: 67,
    lastScan: '2025-03-12',
    language: 'Python',
    status: 'low',
  },
  {
    id: 5,
    name: 'Analytics Pipeline',
    description: 'Data processing and reporting service',
    riskScore: 55,
    criticalCount: 2,
    totalDeps: 128,
    lastScan: '2025-03-10',
    language: 'Python',
    status: 'medium',
  },
];

const StatusColors = {
  critical: 'border-l-red-500',
  high: 'border-l-orange-500',
  medium: 'border-l-amber-500',
  low: 'border-l-green-500',
};

const ProjectCard = ({ project }) => {
  const getRiskColor = (score) => {
    if (score >= 75) return 'text-red-600 dark:text-red-400';
    if (score >= 50) return 'text-orange-600 dark:text-orange-400';
    if (score >= 25) return 'text-amber-600 dark:text-amber-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className={clsx(
      'card border-l-4 hover:shadow-md transition-shadow cursor-pointer',
      StatusColors[project.status]
    )}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">{project.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{project.description}</p>
        </div>
        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-medium">
          {project.language}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <p className={clsx('text-xl font-bold', getRiskColor(project.riskScore))}>
            {project.riskScore}
          </p>
          <p className="text-xs text-slate-400">Risk Score</p>
        </div>
        <div>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">{project.criticalCount}</p>
          <p className="text-xs text-slate-400">Critical CVEs</p>
        </div>
        <div>
          <p className="text-xl font-bold text-slate-700 dark:text-slate-300">{project.totalDeps}</p>
          <p className="text-xs text-slate-400">Dependencies</p>
        </div>
      </div>

      {/* Risk Score Bar */}
      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full"
          style={{
            width: `${project.riskScore}%`,
            backgroundColor: project.riskScore >= 75 ? '#DC2626' :
              project.riskScore >= 50 ? '#EA580C' :
              project.riskScore >= 25 ? '#D97706' : '#16A34A'
          }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Last scan: {project.lastScan}</span>
        <button className="text-blue-600 dark:text-blue-400 hover:underline">View Details</button>
      </div>
    </div>
  );
};

const ProjectManager = () => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-amber-500" />
            Project Management
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track security posture across all your projects
          </p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Add Project Panel */}
      {showUpload && (
        <div className="card border-dashed border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Add New Project</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Project Name
              </label>
              <input
                type="text"
                placeholder="My Application"
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Upload Manifest
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".json,.txt,.xml"
                  className="text-sm text-slate-500 dark:text-slate-400 flex-1"
                />
                <span className="text-xs text-slate-400">package.json, requirements.txt, pom.xml</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn-primary text-sm">Scan Project</button>
            <button onClick={() => setShowUpload(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Projects" value={MOCK_PROJECTS.length} icon={FolderOpen} color="text-blue-600" />
        <MetricCard title="Critical Risk" value={MOCK_PROJECTS.filter(p => p.status === 'critical').length} icon={AlertTriangle} color="text-red-600" />
        <MetricCard title="Total Dependencies" value={MOCK_PROJECTS.reduce((sum, p) => sum + p.totalDeps, 0)} icon={Package} color="text-indigo-600" />
        <MetricCard title="Avg Risk Score" value={Math.round(MOCK_PROJECTS.reduce((sum, p) => sum + p.riskScore, 0) / MOCK_PROJECTS.length)} icon={Shield} color="text-orange-600" />
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, color }) => (
  <div className="card">
    <Icon className={clsx('w-5 h-5 mb-2', color)} />
    <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{title}</p>
  </div>
);

export default ProjectManager;
