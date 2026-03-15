import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle, XCircle } from 'lucide-react';

/**
 * FixAvailableBadge - Shows whether a fix/patch is available for a vulnerability
 * 
 * Key concept: Not all vulnerabilities have available fixes!
 * This is especially dangerous for deprecated packages (like vm2, request).
 * When no fix exists, you must replace the dependency entirely.
 */
const FixAvailableBadge = ({ fixAvailable, fixedVersion }) => {
  if (fixAvailable) {
    return (
      <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-400 text-xs font-semibold">
        <CheckCircle className="w-3.5 h-3.5" />
        {fixedVersion ? `v${fixedVersion}` : 'Available'}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 text-xs font-semibold">
      <XCircle className="w-3.5 h-3.5" />
      No Fix
    </span>
  );
};

export default FixAvailableBadge;
