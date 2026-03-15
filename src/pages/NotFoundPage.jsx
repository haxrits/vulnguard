import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home } from 'lucide-react';

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
      <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
    </div>
    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">404</h1>
    <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">Page not found</p>
    <Link to="/" className="btn-primary flex items-center gap-2">
      <Home className="w-4 h-4" />
      Back to Dashboard
    </Link>
  </div>
);

export default NotFoundPage;
