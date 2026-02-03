// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

import React from 'react';
import { OrganizationAnalytics } from '../types';
import { ExecutiveSummary } from './ExecutiveSummary';
import { ClinicalOutcomesSection } from './ClinicalOutcomesSection';
import { ProductivitySection } from './ProductivitySection';
import { EngagementSection } from './EngagementSection';
import { AssumptionsPanel } from './AssumptionsPanel';
import { downloadPdfReport } from '../services/api';
import { FileDown, Calendar } from 'lucide-react';

interface Props {
  analytics: OrganizationAnalytics;
}

export function Dashboard({ analytics }: Props) {
  const { organization } = analytics;

  const handleDownloadPdf = () => {
    downloadPdfReport(organization.orgId, organization.name);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{organization.name}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {organization.reportingPeriod.start} to {organization.reportingPeriod.end}
              </span>
              <span>•</span>
              <span>{organization.industry}</span>
              <span>•</span>
              <span>{organization.totalEmployees.toLocaleString()} total employees</span>
            </div>
          </div>
          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <FileDown className="w-5 h-5" />
            Download Executive Report (PDF)
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <ExecutiveSummary analytics={analytics} />

      {/* Clinical Outcomes */}
      <ClinicalOutcomesSection analytics={analytics} />

      {/* Productivity Impact */}
      <ProductivitySection analytics={analytics} />

      {/* Engagement Section */}
      <EngagementSection analytics={analytics} />

      {/* Assumptions Panel */}
      <AssumptionsPanel analytics={analytics} />
    </div>
  );
}
