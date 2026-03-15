/**
 * Color mapping utilities for severity levels
 * CVSS Severity Scale:
 * - Critical: 9.0-10.0 (Red)
 * - High: 7.0-8.9 (Orange)
 * - Medium: 4.0-6.9 (Amber)
 * - Low: 0.1-3.9 (Green)
 * - None: 0.0 (Gray)
 */

export const SEVERITY_COLORS = {
  CRITICAL: '#DC2626',
  HIGH: '#EA580C',
  MEDIUM: '#D97706',
  LOW: '#16A34A',
  INFO: '#2563EB',
  UNKNOWN: '#6B7280',
  NONE: '#6B7280',
};

export const SEVERITY_BG_CLASSES = {
  CRITICAL: 'badge-critical',
  HIGH: 'badge-high',
  MEDIUM: 'badge-medium',
  LOW: 'badge-low',
};

export const EXPLOITABILITY_COLORS = {
  KNOWN_EXPLOIT: '#DC2626',
  POC: '#EA580C',
  THEORETICAL: '#D97706',
  UNKNOWN: '#6B7280',
};

/**
 * Get Tailwind text color class for a severity level
 */
export function getSeverityTextClass(severity) {
  const map = {
    CRITICAL: 'text-red-600 dark:text-red-400',
    HIGH: 'text-orange-600 dark:text-orange-400',
    MEDIUM: 'text-amber-600 dark:text-amber-400',
    LOW: 'text-green-600 dark:text-green-400',
    UNKNOWN: 'text-slate-500 dark:text-slate-400',
  };
  return map[severity] || map.UNKNOWN;
}

/**
 * Get Tailwind badge class for severity
 */
export function getSeverityBadgeClass(severity) {
  const map = {
    CRITICAL: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    MEDIUM: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    LOW: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    UNKNOWN: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  };
  return map[severity] || map.UNKNOWN;
}

/**
 * Get risk score color based on 0-100 score
 */
export function getRiskScoreColor(score) {
  if (score >= 75) return SEVERITY_COLORS.CRITICAL;
  if (score >= 50) return SEVERITY_COLORS.HIGH;
  if (score >= 25) return SEVERITY_COLORS.MEDIUM;
  return SEVERITY_COLORS.LOW;
}

/**
 * Get risk score text class based on 0-100 score
 */
export function getRiskScoreTextClass(score) {
  if (score >= 75) return 'text-red-600 dark:text-red-400';
  if (score >= 50) return 'text-orange-600 dark:text-orange-400';
  if (score >= 25) return 'text-amber-600 dark:text-amber-400';
  return 'text-green-600 dark:text-green-400';
}

/**
 * Get CVSS score color based on CVSS score
 */
export function getCVSSColor(score) {
  if (score === null || score === undefined) return SEVERITY_COLORS.UNKNOWN;
  if (score >= 9.0) return SEVERITY_COLORS.CRITICAL;
  if (score >= 7.0) return SEVERITY_COLORS.HIGH;
  if (score >= 4.0) return SEVERITY_COLORS.MEDIUM;
  if (score > 0) return SEVERITY_COLORS.LOW;
  return SEVERITY_COLORS.NONE;
}

/**
 * Get CVSS severity label from score
 */
export function getCVSSSeverityLabel(score) {
  if (score === null || score === undefined) return 'Unknown';
  if (score >= 9.0) return 'Critical';
  if (score >= 7.0) return 'High';
  if (score >= 4.0) return 'Medium';
  if (score > 0) return 'Low';
  return 'None';
}

export const RECHARTS_COLORS = ['#DC2626', '#EA580C', '#D97706', '#16A34A', '#2563EB', '#7C3AED'];
