// ============================================
// EXECUTIVE SUMMARY SECTION
// ============================================

import React from 'react';
import { OrganizationAnalytics } from '../types';
import { 
  Users, 
  TrendingDown, 
  Heart, 
  Clock, 
  DollarSign, 
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface Props {
  analytics: OrganizationAnalytics;
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  highlight?: boolean;
}

function MetricCard({ icon, label, value, subtext, trend, trendValue, highlight }: MetricCardProps) {
  return (
    <div className={`
      p-5 rounded-xl border transition-all h-full flex flex-col
      ${highlight 
        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600' 
        : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-md'
      }
    `}>
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${highlight ? 'bg-blue-500/30' : 'bg-blue-50'}`}>
          {icon}
        </div>
        {trend && trendValue && (
          <div className={`
            flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
            ${highlight 
              ? 'bg-white/20 text-white' 
              : trend === 'up' 
                ? 'bg-green-100 text-green-700'
                : trend === 'down'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
            }
          `}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="mt-4 flex-grow flex flex-col">
        <div className={`text-3xl font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </div>
        <div className={`text-sm font-medium mt-1 ${highlight ? 'text-blue-100' : 'text-gray-500'}`}>
          {label}
        </div>
        {subtext && (
          <div className={`text-xs mt-auto pt-1 ${highlight ? 'text-blue-200' : 'text-gray-400'}`}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
}

export function ExecutiveSummary({ analytics }: Props) {
  const { clinical, productivity, engagement, roi, organization } = analytics;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Executive Summary</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Key Outcomes</span>
      </div>
      
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <MetricCard
          icon={<Users className="w-5 h-5 text-blue-600" />}
          label="Enrolled"
          value={engagement.enrolledCount.toLocaleString()}
          subtext={`${((engagement.enrolledCount / organization.totalEmployees) * 100).toFixed(1)}% of workforce`}
        />
        
        <MetricCard
          icon={<Target className="w-5 h-5 text-blue-600" />}
          label="Engaged"
          value={`${engagement.engagementRate}%`}
          subtext={`${engagement.engagedCount.toLocaleString()} active users`}
        />
        
        <MetricCard
          icon={<TrendingDown className="w-5 h-5 text-blue-600" />}
          label="Avg PHQ-9 Change"
          value={`-${clinical.phq9.meanChange}`}
          subtext="points reduced"
          trend="down"
          trendValue={`${((clinical.phq9.meanChange / clinical.phq9.baselineMean) * 100).toFixed(0)}%`}
        />
        
        <MetricCard
          icon={<Heart className="w-5 h-5 text-blue-600" />}
          label="Clinically Improved"
          value={`${clinical.phq9.clinicallyImprovedPercent}%`}
          subtext={`${clinical.phq9.clinicallyImprovedCount} employees`}
          trend="up"
          trendValue="PHQ-9 ≥5pt"
        />
        
        <MetricCard
          icon={<Clock className="w-5 h-5 text-blue-600" />}
          label="Hours Regained"
          value={productivity.hoursRegained.annualized.toLocaleString()}
          subtext="annualized total"
          trend="up"
          trendValue={`${productivity.hoursRegained.perEmployee}/emp`}
        />
        
        <MetricCard
          icon={<DollarSign className="w-5 h-5 text-blue-600" />}
          label="Est. Annual Savings"
          value={formatCurrency(productivity.costSavings.annualized)}
          subtext="productivity gains"
        />
        
        <MetricCard
          icon={<Target className="w-5 h-5 text-white" />}
          label="Return on Investment"
          value={`${roi.roi}%`}
          subtext={`Payback: ${roi.paybackPeriod}`}
          highlight
        />
      </div>
    </div>
  );
}
