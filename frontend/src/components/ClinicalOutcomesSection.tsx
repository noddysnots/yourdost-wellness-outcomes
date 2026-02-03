// ============================================
// CLINICAL OUTCOMES SECTION
// ============================================

import React from 'react';
import { OrganizationAnalytics } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { TrendingDown, TrendingUp, Activity, Info } from 'lucide-react';

interface Props {
  analytics: OrganizationAnalytics;
}

const SEVERITY_COLORS = ['#10B981', '#84CC16', '#F59E0B', '#F97316', '#EF4444'];

function Tooltip_({ children, content }: { children: React.ReactNode; content: string }) {
  const [show, setShow] = React.useState(false);
  
  return (
    <span 
      className="relative inline-flex items-center cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50">
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
        </span>
      )}
    </span>
  );
}

export function ClinicalOutcomesSection({ analytics }: Props) {
  const { clinical, timeSeries } = analytics;

  // Prepare improvement comparison data
  const improvementData = [
    { name: 'PHQ-9 (Depression)', improved: clinical.phq9.clinicallyImprovedPercent, notImproved: 100 - clinical.phq9.clinicallyImprovedPercent },
    { name: 'GAD-7 (Anxiety)', improved: clinical.gad7.clinicallyImprovedPercent, notImproved: 100 - clinical.gad7.clinicallyImprovedPercent },
    { name: 'WHO-5 (Well-being)', improved: clinical.who5.meaningfullyImprovedPercent, notImproved: 100 - clinical.who5.meaningfullyImprovedPercent },
  ];

  // Prepare severity movement data for pie chart
  const movementData = [
    { name: 'Improved', value: clinical.phq9.severityMovement.improved, color: '#10B981' },
    { name: 'Maintained', value: clinical.phq9.severityMovement.maintained, color: '#6B7280' },
    { name: 'Worsened', value: clinical.phq9.severityMovement.worsened, color: '#EF4444' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Clinical Outcomes</h3>
        </div>
        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-medium">
          OUTCOME METRICS
        </span>
      </div>

      {/* Score Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* PHQ-9 Card */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">PHQ-9 Depression</span>
            <Tooltip_ content="Patient Health Questionnaire-9. Lower is better. Range: 0-27">
              <Info className="w-4 h-4 text-gray-400" />
            </Tooltip_>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-gray-900">{clinical.phq9.currentMean}</span>
            <div className="flex items-center gap-1 text-green-600 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-medium">-{clinical.phq9.meanChange} pts</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Baseline: {clinical.phq9.baselineMean} → Current: {clinical.phq9.currentMean}
          </div>
          <div className="mt-3 pt-3 border-t border-blue-100">
            <span className="text-green-600 font-semibold">{clinical.phq9.clinicallyImprovedPercent}%</span>
            <span className="text-gray-500 text-sm"> clinically improved (≥5pt reduction)</span>
          </div>
        </div>

        {/* GAD-7 Card */}
        <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">GAD-7 Anxiety</span>
            <Tooltip_ content="Generalized Anxiety Disorder-7. Lower is better. Range: 0-21">
              <Info className="w-4 h-4 text-gray-400" />
            </Tooltip_>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-gray-900">{clinical.gad7.currentMean}</span>
            <div className="flex items-center gap-1 text-green-600 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-medium">-{clinical.gad7.meanChange} pts</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Baseline: {clinical.gad7.baselineMean} → Current: {clinical.gad7.currentMean}
          </div>
          <div className="mt-3 pt-3 border-t border-purple-100">
            <span className="text-green-600 font-semibold">{clinical.gad7.clinicallyImprovedPercent}%</span>
            <span className="text-gray-500 text-sm"> clinically improved (≥4pt reduction)</span>
          </div>
        </div>

        {/* WHO-5 Card */}
        <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">WHO-5 Well-being</span>
            <Tooltip_ content="WHO Well-Being Index. Higher is better. Range: 0-100">
              <Info className="w-4 h-4 text-gray-400" />
            </Tooltip_>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-gray-900">{clinical.who5.currentMean}</span>
            <div className="flex items-center gap-1 text-green-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+{clinical.who5.meanChange} pts</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Baseline: {clinical.who5.baselineMean} → Current: {clinical.who5.currentMean}
          </div>
          <div className="mt-3 pt-3 border-t border-green-100">
            <span className="text-green-600 font-semibold">{clinical.who5.meaningfullyImprovedPercent}%</span>
            <span className="text-gray-500 text-sm"> meaningfully improved (≥10pt increase)</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Score Trends Over Time</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="week" 
                  tickFormatter={(v) => v === 0 ? 'Baseline' : `Wk ${v}`}
                  tick={{ fontSize: 11 }}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    value.toFixed(1), 
                    name === 'phq9Mean' ? 'PHQ-9' : name === 'who5Mean' ? 'WHO-5' : 'GAD-7'
                  ]}
                  labelFormatter={(v) => v === 0 ? 'Baseline' : `Week ${v}`}
                />
                <Legend 
                  formatter={(value) => 
                    value === 'phq9Mean' ? 'PHQ-9 (Depression)' : 
                    value === 'who5Mean' ? 'WHO-5 (Well-being)' : 'GAD-7 (Anxiety)'
                  }
                />
                <Line 
                  type="monotone" 
                  dataKey="phq9Mean" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="who5Mean" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Improvement Bar Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Clinically Meaningful Improvement</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={improvementData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                <Tooltip formatter={(v: number) => [`${v.toFixed(1)}%`]} />
                <Bar dataKey="improved" stackId="a" fill="#10B981" name="Improved" />
                <Bar dataKey="notImproved" stackId="a" fill="#E5E7EB" name="Not Improved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Severity Distribution */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">PHQ-9 Severity Movement</h4>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Baseline Distribution */}
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-3">Baseline Distribution</h5>
            <div className="space-y-2">
              {clinical.phq9.baselineSeverityDistribution.map((band, idx) => (
                <div key={band.label} className="flex items-center gap-2">
                  <span className="text-xs w-24 text-gray-600">{band.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ width: `${band.percentage}%`, backgroundColor: SEVERITY_COLORS[idx] }}
                    />
                  </div>
                  <span className="text-xs font-medium w-12 text-right">{band.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Movement Summary */}
          <div className="flex items-center justify-center">
            <div className="h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={movementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {movementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [v, 'Employees']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Current Distribution */}
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-3">Current Distribution</h5>
            <div className="space-y-2">
              {clinical.phq9.currentSeverityDistribution.map((band, idx) => (
                <div key={band.label} className="flex items-center gap-2">
                  <span className="text-xs w-24 text-gray-600">{band.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ width: `${band.percentage}%`, backgroundColor: SEVERITY_COLORS[idx] }}
                    />
                  </div>
                  <span className="text-xs font-medium w-12 text-right">{band.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
