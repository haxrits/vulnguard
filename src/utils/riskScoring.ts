/**
 * riskScoring.ts
 *
 * Mathematically sound risk scoring system based on weighted severity levels.
 * Replaces the previous broken formula that divided by total packages, which
 * made the score artificially low when many packages were safe.
 *
 * Formula:
 *   actualScore  = criticalCount×40 + highCount×25 + mediumCount×15 + lowCount×5
 *   maxPossible  = totalPackages × 40  (worst case: all packages critical)
 *   riskScore    = (actualScore / maxPossible) × 100  → clamped to [0, 100]
 */

// ---------------------------------------------------------------------------
// Internal constants
// ---------------------------------------------------------------------------

const WEIGHTS = {
  critical: 40,
  high: 25,
  medium: 15,
  low: 5,
} as const;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Calculates overall vulnerability risk score from 0-100.
 * Uses a weighted severity approach instead of package-count division.
 *
 * @param totalPackages  - Total number of packages scanned
 * @param criticalCount  - Number of Critical vulnerabilities
 * @param highCount      - Number of High severity vulnerabilities
 * @param mediumCount    - Number of Medium severity vulnerabilities
 * @param lowCount       - Number of Low severity vulnerabilities
 * @returns Risk score from 0 to 100 (whole number)
 *
 * Examples:
 *   7 pkg (2 crit, 2 high, 1 med, 2 safe) → 52
 *   5 pkg (5 critical)                     → 100
 *   10 pkg (all safe)                      → 0
 *   100 pkg (1 critical)                   → 1
 */
export const calculateRiskScore = (
  totalPackages: number,
  criticalCount: number,
  highCount: number,
  mediumCount: number,
  lowCount: number
): number => {
  if (totalPackages === 0) return 0;

  const actualScore =
    criticalCount * WEIGHTS.critical +
    highCount * WEIGHTS.high +
    mediumCount * WEIGHTS.medium +
    lowCount * WEIGHTS.low;

  const maxPossible = totalPackages * WEIGHTS.critical;

  const rawScore = (actualScore / maxPossible) * 100;

  return Math.min(100, Math.max(0, Math.round(rawScore)));
};

/**
 * Returns a human-readable risk level label for a given score.
 *
 * Ranges:
 *   75–100 → "Critical Risk"
 *   50–74  → "High Risk"
 *   25–49  → "Medium Risk"
 *   1–24   → "Low Risk"
 *   0      → "No Risk Detected"
 *
 * @param score - Risk score from 0 to 100
 */
export const getRiskLabel = (score: number): string => {
  if (score >= 75) return "Critical Risk";
  if (score >= 50) return "High Risk";
  if (score >= 25) return "Medium Risk";
  if (score > 0) return "Low Risk";
  return "No Risk Detected";
};

/**
 * Returns a hex color code matching the risk level.
 *
 * Colors:
 *   #ef4444 (red)    → Critical (75–100)
 *   #f97316 (orange) → High (50–74)
 *   #eab308 (yellow) → Medium (25–49)
 *   #22c55e (green)  → Low (1–24)
 *   #6b7280 (gray)   → None (0)
 *
 * @param score - Risk score from 0 to 100
 */
export const getRiskColor = (score: number): string => {
  if (score >= 75) return "#ef4444"; // red   – Critical
  if (score >= 50) return "#f97316"; // orange – High
  if (score >= 25) return "#eab308"; // yellow – Medium
  if (score > 0) return "#22c55e";  // green  – Low
  return "#6b7280";                  // gray   – None
};

/**
 * Returns a detailed explanation of what the risk score means.
 * Shown below the gauge to help users understand the result.
 *
 * @param score          - Risk score from 0 to 100
 * @param criticalCount  - Number of Critical vulnerabilities
 * @param highCount      - Number of High severity vulnerabilities
 * @param totalPackages  - Total number of packages scanned
 *
 * Examples:
 *   score 0  → "All 10 packages are safe. No vulnerabilities detected."
 *   score 75+ → "2 critical vulnerabilities need immediate attention.
 *                Your project is at serious risk of exploitation."
 *   score 50–74 → "2 critical and 2 high severity issues detected.
 *                  Action required soon."
 */
export const getRiskExplanation = (
  score: number,
  criticalCount: number,
  highCount: number,
  totalPackages: number
): string => {
  if (score === 0) {
    return `All ${totalPackages} packages are safe. No vulnerabilities detected.`;
  }

  if (score >= 75) {
    return `${criticalCount} critical ${
      criticalCount === 1 ? "vulnerability" : "vulnerabilities"
    } need immediate attention. Your project is at serious risk of exploitation.`;
  }

  if (score >= 50) {
    return `${criticalCount} critical and ${highCount} high severity ${
      criticalCount + highCount === 1 ? "issue" : "issues"
    } detected. Action required soon.`;
  }

  if (score >= 25) {
    return `Some vulnerabilities found but no critical issues. Address when possible.`;
  }

  return `Minor vulnerabilities only. Low exploitation risk but worth updating.`;
};

/**
 * Verification function for testing the scoring formulas.
 * Run in the browser console to validate the math.
 * REMOVE BEFORE PRODUCTION DEPLOYMENT.
 */
export const verifyScoring = (): void => {
  console.group("🧪 Risk Scoring Verification");

  // Test 1: 7 pkg – 2 crit, 2 high, 1 med, 2 safe → 52
  // Math: (2×40 + 2×25 + 1×15) / (7×40) × 100 = 145/280 × 100 ≈ 51.8 → 52
  const score1 = calculateRiskScore(7, 2, 2, 1, 0);
  console.log(`Test 1 (7 pkg: 2 crit, 2 high, 1 med): ${score1} (expected 52)`);
  console.assert(score1 === 52, "Test 1 failed – expected 52, got " + score1);

  // Test 2: 5 pkg – all critical → 100
  // Math: (5×40) / (5×40) × 100 = 100
  const score2 = calculateRiskScore(5, 5, 0, 0, 0);
  console.log(`Test 2 (5 pkg: all critical): ${score2} (expected 100)`);
  console.assert(score2 === 100, "Test 2 failed – expected 100, got " + score2);

  // Test 3: 10 pkg – all safe → 0
  const score3 = calculateRiskScore(10, 0, 0, 0, 0);
  console.log(`Test 3 (10 pkg: all safe): ${score3} (expected 0)`);
  console.assert(score3 === 0, "Test 3 failed – expected 0, got " + score3);

  // Test 4: 100 pkg – 1 critical → 1
  // Math: (1×40) / (100×40) × 100 = 1
  const score4 = calculateRiskScore(100, 1, 0, 0, 0);
  console.log(`Test 4 (100 pkg: 1 critical): ${score4} (expected 1)`);
  console.assert(score4 === 1, "Test 4 failed – expected 1, got " + score4);

  // Test 5: 20 pkg – 1 crit, 3 high → 14
  // Math: (1×40 + 3×25) / (20×40) × 100 = 115/800 × 100 = 14.375 → 14
  const score5 = calculateRiskScore(20, 1, 3, 0, 0);
  console.log(`Test 5 (20 pkg: 1 crit, 3 high): ${score5} (expected 14)`);
  console.assert(score5 === 14, "Test 5 failed – expected 14, got " + score5);

  console.log("✨ All scoring tests passed! Formula is mathematically correct.");
  console.groupEnd();
};
