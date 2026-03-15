import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Package,
  BarChart3,
  BookOpen,
  FileText,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { clsx } from 'clsx';
import useScanStore from '../../store/scanStore';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { path: '/vulnerabilities', icon: ShieldAlert, label: 'Vulnerabilities', badge: '30' },
  { path: '/dependencies', icon: Package, label: 'Dependencies', badge: null },
  { path: '/risk-assessment', icon: BarChart3, label: 'Risk Assessment', badge: null },
  { path: '/education', icon: BookOpen, label: 'Education Hub', badge: null },
  { path: '/sbom', icon: FileText, label: 'SBOM & Export', badge: null },
  { path: '/projects', icon: FolderOpen, label: 'Projects', badge: '5' },
];

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { scanResult } = useScanStore();

  const criticalCount = scanResult?.criticalCount ?? 0;

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className={clsx(
      'bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700',
      'flex flex-col transition-all duration-300 h-full',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 mb-4">
          {!collapsed && (
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Main Menu
            </p>
          )}
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium',
                      active
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                    )}
                  >
                    <Icon className={clsx('w-5 h-5 flex-shrink-0', active ? 'text-blue-600 dark:text-blue-400' : '')} />
                    {!collapsed && (
                      <span className="flex-1">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className={clsx(
                        'text-xs px-2 py-0.5 rounded-full font-medium',
                        active
                          ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Critical Alert Banner — only shown after a scan with critical vulns */}
      {!collapsed && scanResult && criticalCount > 0 && (
        <div className="mx-3 mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-red-700 dark:text-red-400">Critical Alert</p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">
                {criticalCount} critical{' '}
                {criticalCount === 1 ? 'vulnerability requires' : 'vulnerabilities require'}{' '}
                immediate attention
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="ml-2 text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
