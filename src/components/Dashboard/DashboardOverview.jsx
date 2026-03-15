import React, { useState } from 'react';
import { ShieldQuestion } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import RiskScoreCard from './RiskScoreCard';
import KeyMetrics from './KeyMetrics';
import TrendChart from './TrendChart';
import TopVulnerabilities from './TopVulnerabilities';
import SeverityDistribution from './SeverityDistribution';
import LastScanInfo from './LastScanInfo';
import ScanModal from '../scanner/ScanModal';
import ScanResultsTable from './ScanResultsTable';
import { dashboardMetrics } from '../../services/mockData';

/**
 * DashboardOverview - Main dashboard page component
 *
 * This is the command center for your supply chain security posture.
 * It answers the key question: "How secure are my dependencies right now?"
 */
const DashboardOverview = () => {
  const [showModal, setShowModal] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [lastScanTime, setLastScanTime] = useState(null);

  const handleScanComplete = (result) => {
    setScanResult(result);
    setLastScanTime(new Date());
    setShowModal(false);
  };

  // Compute risk score from real data when available
  const riskScore = scanResult
    ? Math.min(
        100,
        Math.round(
          ((scanResult.criticalCount * 10 +
            scanResult.highCount * 7 +
            scanResult.mediumCount * 4 +
            scanResult.lowCount * 1) /
            Math.max(scanResult.totalPackages, 1)) *
            10
        )
      )
    : dashboardMetrics.overallRiskScore;

  // Metrics object — use real scan data when available, fall back to mock
  const metrics = scanResult
    ? {
        totalDependencies: scanResult.totalPackages,
        criticalCount: scanResult.criticalCount,
        highCount: scanResult.highCount,
        mediumCount: scanResult.mediumCount,
        lowCount: scanResult.lowCount,
        projectsAtRisk: dashboardMetrics.projectsAtRisk,
        fixAvailableCount: scanResult.dependencies.filter((d) => d.fixVersion).length,
        noFixCount: scanResult.dependencies.filter(
          (d) => d.severity !== 'Safe' && !d.fixVersion
        ).length,
      }
    : dashboardMetrics;

  const lastScanLabel = lastScanTime
    ? formatDistanceToNow(lastScanTime, { addSuffix: true })
    : null;

  return (
    <div className="space-y-5">
      {/* Scan modal */}
      <ScanModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onScanComplete={handleScanComplete}
      />

      {/* Last Scan Banner */}
      <LastScanInfo
        metrics={metrics}
        lastScanLabel={lastScanLabel}
        onScanClick={() => setShowModal(true)}
      />

      {/* Critical alert — only shown when real critical vulns exist */}
      {scanResult && scanResult.criticalCount > 0 && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            {scanResult.criticalCount} critical{' '}
            {scanResult.criticalCount === 1 ? 'vulnerability requires' : 'vulnerabilities require'}{' '}
            immediate attention
          </p>
        </div>
      )}

      {/* Empty state — no scan yet */}
      {!scanResult && (
        <div className="card flex flex-col items-center justify-center py-16 gap-4 text-center">
          <ShieldQuestion className="w-16 h-16 text-slate-300 dark:text-slate-600" />
          <div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">No scan results yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Upload your project dependency file to check for known vulnerabilities
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary text-base py-2.5 px-8 mt-2"
          >
            Upload &amp; Scan Now
          </button>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Supports package.json · requirements.txt · pom.xml · go.mod · Cargo.toml
          </p>
        </div>
      )}

      {/* Dashboard content — shown once a scan has been run */}
      {scanResult && (
        <>
          {/* Top Row: Risk Score + Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <RiskScoreCard score={riskScore} totalVulns={scanResult.vulnerableCount} />
            <div className="md:col-span-2">
              <KeyMetrics metrics={metrics} />
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <TrendChart />
            </div>
            <SeverityDistribution metrics={metrics} />
          </div>

          {/* Real scan results table */}
          <ScanResultsTable dependencies={scanResult.dependencies} avgCvss={scanResult.avgCvss} />
        </>
      )}

      {/* Always show historical trend and top CVEs from mock data below */}
      {!scanResult && (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <TrendChart />
            </div>
            <SeverityDistribution metrics={dashboardMetrics} />
          </div>

          {/* Top Vulnerabilities Table (mock data) */}
          <TopVulnerabilities />
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
