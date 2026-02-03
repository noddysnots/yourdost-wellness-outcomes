// ============================================
// PRODUCTIVITY IMPACT SECTION
// ============================================

import React from 'react';
import { OrganizationAnalytics } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Briefcase, Clock, DollarSign, TrendingDown, Info } from 'lucide-react';

interface Props {
  analytics: OrganizationAnalytics;
}

export function ProductivitySection({ analytics }: Props) {
  const { productivity, roi, organization } = analytics;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Comparison data for charts
  const absenteeismData = [
    { name: 'Baseline', value: productivity.absenteeism.baselineMean, fill: '#9CA3AF' },
    { name: 'Current', value: productivity.absenteeism.currentMean, fill: '#10B981' },
  ];

  const presenteeismData = [
    { name: 'Baseline', value: productivity.presenteeism.baselineMean, fill: '#9CA3AF' },
    { name: 'Current', value: productivity.presenteeism.currentMean, fill: '#10B981' },
  ];

  const savingsData = [
    { name: 'Conservative', value: productivity.costSavings.low * 4, fill: '#FDE68A' },
    { name: 'Mid Estimate', value: productivity.costSavings.annualized, fill: '#10B981' },
    { name: 'Optimistic', value: productivity.costSavings.high * 4, fill: '#6EE7B7' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Productivity Impact</h3>
        </div>
        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-medium">
          BUSINESS IMPACT
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-500">Absenteeism Reduction</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{productivity.absenteeism.reduction} hrs</div>
          <div className="text-xs text-green-600 mt-1">↓ {productivity.absenteeism.reductionPercent}% per month</div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-500">Presenteeism Reduction</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{productivity.presenteeism.reduction}%</div>
          <div className="text-xs text-green-600 mt-1">↓ {productivity.presenteeism.reductionPercent}% improvement</div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-500">Hours Regained (Annual)</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{productivity.hoursRegained.annualized.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">{productivity.hoursRegained.perEmployee} hrs/employee</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-100" />
            <span className="text-xs font-medium text-green-100">Est. Annual Savings</span>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(productivity.costSavings.annualized)}</div>
          <div className="text-xs text-green-100 mt-1">Based on {formatCurrency(organization.avgHourlyCost)}/hr</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Absenteeism Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Absenteeism (hrs/month)</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={absenteeismData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
                <Tooltip formatter={(v: number) => [`${v.toFixed(1)} hours`]} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {absenteeismData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Presenteeism Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Presenteeism (% loss)</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={presenteeismData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
                <Tooltip formatter={(v: number) => [`${v.toFixed(1)}%`]} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {presenteeismData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Savings Range Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Annual Savings Estimate</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={savingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), 'Savings']} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {savingsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROI Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Return on Investment Analysis
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-gray-500">Program Investment</div>
            <div className="text-xl font-bold text-gray-900">{formatCurrency(roi.programCost)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Estimated Annual Savings</div>
            <div className="text-xl font-bold text-green-600">{formatCurrency(roi.totalSavings)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Net Benefit</div>
            <div className="text-xl font-bold text-green-600">{formatCurrency(roi.netBenefit)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">ROI / Payback</div>
            <div className="text-xl font-bold text-blue-600">{roi.roi}% / {roi.paybackPeriod}</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200/50 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-600">
            ROI is calculated as (Annual Savings - Program Cost) / Program Cost. 
            Savings estimates are based on hours regained multiplied by average fully-loaded hourly cost.
            Actual results may vary based on individual circumstances.
          </p>
        </div>
      </div>
    </div>
  );
}
