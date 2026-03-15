import React from 'react';
import RiskScoreCard from './RiskScoreCard';
import KeyMetrics from './KeyMetrics';
import TrendChart from './TrendChart';
import TopVulnerabilities from './TopVulnerabilities';
import SeverityDistribution from './SeverityDistribution';
import LastScanInfo from './LastScanInfo';
import { dashboardMetrics } from '../../services/mockData';

/**
 * DashboardOverview - Main dashboard page component
 * 
 * This is the command center for your supply chain security posture.
 * It answers the key question: "How secure are my dependencies right now?"
 */
const DashboardOverview = () => {
  return (
    <div className="space-y-5">
      {/* Last Scan Banner */}
      <LastScanInfo />

      {/* Top Row: Risk Score + Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <RiskScoreCard score={dashboardMetrics.overallRiskScore} />
        <div className="md:col-span-2">
          <KeyMetrics metrics={dashboardMetrics} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        <SeverityDistribution />
      </div>

      {/* Top Vulnerabilities Table */}
      <TopVulnerabilities />
    </div>
  );
};

export default DashboardOverview;
