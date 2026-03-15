/**
 * Risk Score Calculator
 * 
 * Formula: Risk Score = (CVSS Score × Exploitability Factor × Urgency Factor) / 10 × 100
 * 
 * Exploitability Factors:
 * - KNOWN_EXPLOIT: 1.0 (highest risk - active exploitation)
 * - POC: 0.7 (moderate risk - proof of concept exists)
 * - THEORETICAL: 0.3 (lower risk - no public exploit)
 * - UNKNOWN: 0.1 (minimal risk - no known exploitation)
 * 
 * Urgency Factor: (30 - days since discovery) / 30, capped at 1.0
 * - Recent vulnerabilities have higher urgency
 * - Older vulnerabilities (>30 days) have urgency = 0.1 minimum
 */

export const EXPLOITABILITY_FACTORS = {
  KNOWN_EXPLOIT: 1.0,
  POC: 0.7,
  THEORETICAL: 0.3,
  UNKNOWN: 0.1,
};

/**
 * Calculate risk score for a vulnerability (0-100)
 * @param {Object} vuln - Vulnerability object
 * @returns {number} Risk score 0-100
 */
export function calculateRiskScore(vuln) {
  const cvss = vuln.cvssScore ?? 5.0;
  const exploitFactor = EXPLOITABILITY_FACTORS[vuln.exploitability] ?? 0.1;
  const days = vuln.daysDiscovered ?? 0;
  
  // Urgency decreases as more time passes (30 day window)
  const urgency = Math.max(0.1, Math.min(1.0, (30 - Math.min(days, 30)) / 30 + 0.1));
  
  // Calculate raw score
  const raw = (cvss / 10) * exploitFactor * urgency * 100;
  
  return Math.min(100, Math.round(raw));
}

/**
 * Calculate overall risk score for a list of vulnerabilities
 */
export function calculateOverallRiskScore(vulnList) {
  if (!vulnList.length) return 0;
  
  const scores = vulnList.map(calculateRiskScore);
  const max = Math.max(...scores);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  // Weight: 70% max risk + 30% average
  return Math.round(max * 0.7 + avg * 0.3);
}

/**
 * Get severity distribution from vulnerability list
 */
export function getSeverityDistribution(vulnList) {
  return {
    CRITICAL: vulnList.filter(v => v.severity === 'CRITICAL').length,
    HIGH: vulnList.filter(v => v.severity === 'HIGH').length,
    MEDIUM: vulnList.filter(v => v.severity === 'MEDIUM').length,
    LOW: vulnList.filter(v => v.severity === 'LOW').length,
  };
}

/**
 * Get exploitability distribution
 */
export function getExploitabilityDistribution(vulnList) {
  return {
    KNOWN_EXPLOIT: vulnList.filter(v => v.exploitability === 'KNOWN_EXPLOIT').length,
    POC: vulnList.filter(v => v.exploitability === 'POC').length,
    THEORETICAL: vulnList.filter(v => v.exploitability === 'THEORETICAL').length,
    UNKNOWN: vulnList.filter(v => v.exploitability === 'UNKNOWN').length,
  };
}
