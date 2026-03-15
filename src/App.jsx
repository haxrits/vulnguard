import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Common/Header';
import Sidebar from './components/Common/Sidebar';
import useThemeStore from './store/themeStore';

// Pages (lazy-loaded for performance)
import DashboardPage from './pages/DashboardPage';
import VulnerabilitiesPage from './pages/VulnerabilitiesPage';
import DependenciesPage from './pages/DependenciesPage';
import RiskAssessmentPage from './pages/RiskAssessmentPage';
import EducationPage from './pages/EducationPage';
import SBOMPage from './pages/SBOMPage';
import ProjectsPage from './pages/ProjectsPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * App - Root application component
 *
 * Architecture:
 * - React Router: Multi-page navigation without page reloads
 * - Zustand: Global state management for theme, vulnerabilities, filters
 * - Tailwind CSS: Utility-first styling with dark mode support
 *
 * Supply Chain Security Dashboard Layout:
 * ┌─────────────────────────────────────────┐
 * │  Header (Logo, Page Title, Actions)     │
 * ├──────────┬──────────────────────────────┤
 * │          │                              │
 * │ Sidebar  │  Main Content (Page Views)   │
 * │  (Nav)   │                              │
 * │          │                              │
 * └──────────┴──────────────────────────────┘
 */
function App() {
  const { theme } = useThemeStore();

  // Apply dark mode class to <html> element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        {/* Top navigation bar */}
        <Header />

        {/* Main layout: Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left navigation sidebar */}
          <Sidebar />

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/vulnerabilities" element={<VulnerabilitiesPage />} />
              <Route path="/dependencies" element={<DependenciesPage />} />
              <Route path="/risk-assessment" element={<RiskAssessmentPage />} />
              <Route path="/education" element={<EducationPage />} />
              <Route path="/sbom" element={<SBOMPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
