import React from 'react';
import { clsx } from 'clsx';
import { getSeverityBadgeClass } from '../../utils/colorMap';
import { formatSeverity } from '../../utils/formatters';

/**
 * SeverityBadge - Color-coded badge showing vulnerability severity
 * 
 * CVSS Severity Scale:
 * - Critical (9.0-10.0): Red background
 * - High (7.0-8.9): Orange background
 * - Medium (4.0-6.9): Amber background
 * - Low (0.1-3.9): Green background
 */
const SeverityBadge = ({ severity, size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span className={clsx(
      'inline-flex items-center rounded-full font-semibold',
      getSeverityBadgeClass(severity),
      sizeClasses[size] || sizeClasses.sm,
      className
    )}>
      {formatSeverity(severity)}
    </span>
  );
};

export default SeverityBadge;
