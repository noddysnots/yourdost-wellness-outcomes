// ============================================
// ASSUMPTIONS PANEL
// Explains methodology and ROI logic
// ============================================

import React, { useState } from 'react';
import { OrganizationAnalytics } from '../types';
import { ChevronDown, ChevronUp, Info, Shield, Calculator, FileText } from 'lucide-react';

interface Props {
  analytics: OrganizationAnalytics;
}

export function AssumptionsPanel({ analytics }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { organization } = analytics;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Methodology & Assumptions</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="p-6 space-y-6">
          {/* Clinical Measures */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
              <FileText className="w-4 h-4" />
              Clinical Measures Used
            </h4>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Measure</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Range</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Meaningful Change</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Direction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-medium">PHQ-9 (Depression)</td>
                    <td className="px-4 py-3">0-27</td>
                    <td className="px-4 py-3">≥5 point reduction</td>
                    <td className="px-4 py-3 text-green-600">Lower is better</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">GAD-7 (Anxiety)</td>
                    <td className="px-4 py-3">0-21</td>
                    <td className="px-4 py-3">≥4 point reduction</td>
                    <td className="px-4 py-3 text-green-600">Lower is better</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">WHO-5 (Well-being)</td>
                    <td className="px-4 py-3">0-100</td>
                    <td className="px-4 py-3">≥10 point increase</td>
                    <td className="px-4 py-3 text-green-600">Higher is better</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PHQ-9 Severity Bands */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
              PHQ-9 Severity Classification
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {[
                { range: '0-4', label: 'Minimal', color: 'bg-green-100 text-green-800' },
                { range: '5-9', label: 'Mild', color: 'bg-lime-100 text-lime-800' },
                { range: '10-14', label: 'Moderate', color: 'bg-amber-100 text-amber-800' },
                { range: '15-19', label: 'Mod. Severe', color: 'bg-orange-100 text-orange-800' },
                { range: '20-27', label: 'Severe', color: 'bg-red-100 text-red-800' },
              ].map((band) => (
                <div key={band.label} className={`p-3 rounded-lg text-center ${band.color}`}>
                  <div className="font-semibold text-sm">{band.range}</div>
                  <div className="text-xs mt-1">{band.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ROI Calculation */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
              <Calculator className="w-4 h-4" />
              ROI Calculation Logic
            </h4>
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Average Hourly Cost:</span>
                  <span className="ml-2 font-medium">{formatCurrency(organization.avgHourlyCost)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Monthly Work Hours (assumed):</span>
                  <span className="ml-2 font-medium">160 hours</span>
                </div>
              </div>
              <div className="pt-3 border-t border-blue-200 space-y-2 text-sm text-gray-700">
                <p><strong>Hours Regained</strong> = (Baseline Absenteeism - Current Absenteeism) + (Baseline Presenteeism Hours - Current Presenteeism Hours)</p>
                <p><strong>Presenteeism Hours</strong> = (Presenteeism % / 100) × Monthly Work Hours</p>
                <p><strong>Cost Savings</strong> = Hours Regained × Average Hourly Cost</p>
                <p><strong>ROI</strong> = (Annual Savings - Program Cost) / Program Cost × 100</p>
              </div>
            </div>
          </div>

          {/* Privacy & Aggregation */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
              <Shield className="w-4 h-4" />
              Privacy & Data Aggregation
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                All data is aggregated at the organization level — no individual employee data is displayed
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                Minimum cohort size of 5 employees required before displaying metrics
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                PDF reports contain only aggregated, anonymized data
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                Individual scores are never exported or shared with employers
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-2">⚠️ Important Disclaimer</h4>
            <p className="text-sm text-amber-700">
              This is a <strong>prototype demonstration</strong> using synthetic data. 
              The metrics, calculations, and outcomes shown are for demonstration purposes only and should not be used for:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-amber-700 list-disc list-inside">
              <li>Clinical diagnostic decisions</li>
              <li>Individual employee assessments</li>
              <li>Medical treatment planning</li>
              <li>Compliance or regulatory reporting</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
