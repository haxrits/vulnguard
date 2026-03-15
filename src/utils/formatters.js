/**
 * Formatting utilities for dates, numbers, and text
 */
import { format, formatDistanceToNow, parseISO, differenceInDays } from 'date-fns';

/**
 * Format a date string to human-readable format
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'Unknown';
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
}

/**
 * Format a date as relative time (e.g., "3 days ago")
 */
export function formatRelativeDate(dateStr) {
  if (!dateStr) return 'Unknown';
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

/**
 * Calculate days since a date
 */
export function daysSince(dateStr) {
  if (!dateStr) return null;
  try {
    return differenceInDays(new Date(), parseISO(dateStr));
  } catch {
    return null;
  }
}

/**
 * Format CVSS score with consistent decimal places
 */
export function formatCVSS(score) {
  if (score === null || score === undefined) return 'N/A';
  return score.toFixed(1);
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert severity enum to display label
 */
export function formatSeverity(severity) {
  if (!severity) return 'Unknown';
  return capitalize(severity);
}

/**
 * Format exploitability enum to display label
 */
export function formatExploitability(exploitability) {
  const map = {
    KNOWN_EXPLOIT: 'Known Exploit',
    POC: 'PoC Available',
    THEORETICAL: 'Theoretical',
    UNKNOWN: 'Unknown',
  };
  return map[exploitability] || exploitability || 'Unknown';
}

/**
 * Get days text (singular/plural)
 */
export function formatDays(days) {
  if (days === null || days === undefined) return 'Unknown';
  return `${days} ${days === 1 ? 'day' : 'days'}`;
}
