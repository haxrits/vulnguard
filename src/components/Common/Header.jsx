import React from 'react';
import { Shield, Sun, Moon, Bell, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useThemeStore from '../../store/themeStore';

const Header = () => {
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path.includes('vulnerabilities')) return 'Vulnerability Explorer';
    if (path.includes('dependencies')) return 'Dependency Analysis';
    if (path.includes('risk')) return 'Risk Assessment';
    if (path.includes('education')) return 'Education Hub';
    if (path.includes('sbom')) return 'SBOM & Export';
    if (path.includes('projects')) return 'Project Management';
    return 'VulnGuard';
  };

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center px-6 sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mr-8">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg text-slate-900 dark:text-white">VulnGuard</span>
      </Link>

      {/* Page Title */}
      <h1 className="text-lg font-semibold text-slate-700 dark:text-slate-200 flex-1">
        {getPageTitle()}
      </h1>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Alert badge */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium cursor-pointer">
          S
        </div>
      </div>
    </header>
  );
};

export default Header;
