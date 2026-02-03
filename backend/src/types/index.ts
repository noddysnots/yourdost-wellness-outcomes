// ============================================
// DATA MODELS - Wellness Outcomes Platform
// ============================================

// Clinical Score Interfaces
export interface ClinicalScores {
  phq9: number;  // 0-27 Depression
  gad7: number;  // 0-21 Anxiety
  who5: number;  // 0-100 Well-being (scaled)
}

export interface FollowUpScore extends ClinicalScores {
  date: string;  // ISO date string
  weekNumber: number;
}

// Productivity Metrics
export interface ProductivityMetrics {
  absenteeismHours: number;  // Hours missed per month
  presenteeismPercent: number;  // % productivity loss (0-100)
}

// Engagement Data
export interface EngagementData {
  sessions: number;
  modality: 'video' | 'chat' | 'phone' | 'mixed';
  timeToFirstSession: number;  // Days from enrollment
  dropout: boolean;
}

// User Model
export interface User {
  userId: string;
  orgId: string;
  enrollmentDate: string;
  baselineScores: ClinicalScores;
  followUpScores: FollowUpScore[];
  baselineProductivity: ProductivityMetrics;
  currentProductivity: ProductivityMetrics;
  engagement: EngagementData;
}

// Organization Model
export interface Organization {
  orgId: string;
  name: string;
  industry: string;
  totalEmployees: number;
  enrolledEmployees: number;
  avgHourlyCost: number;  // Average hourly cost per employee
  programCost: number;  // Total program cost
  reportingPeriod: {
    start: string;
    end: string;
  };
}

// ============================================
// ANALYTICS RESULT INTERFACES
// ============================================

export interface SeverityBand {
  label: string;
  count: number;
  percentage: number;
}

export interface SeverityMovement {
  improved: number;  // Moved to lower severity
  maintained: number;  // Same severity
  worsened: number;  // Moved to higher severity
}

export interface ClinicalOutcomes {
  phq9: {
    baselineMean: number;
    currentMean: number;
    meanChange: number;
    clinicallyImprovedCount: number;
    clinicallyImprovedPercent: number;
    severityMovement: SeverityMovement;
    baselineSeverityDistribution: SeverityBand[];
    currentSeverityDistribution: SeverityBand[];
  };
  gad7: {
    baselineMean: number;
    currentMean: number;
    meanChange: number;
    clinicallyImprovedCount: number;
    clinicallyImprovedPercent: number;
  };
  who5: {
    baselineMean: number;
    currentMean: number;
    meanChange: number;
    meaningfullyImprovedCount: number;
    meaningfullyImprovedPercent: number;
  };
}

export interface ProductivityOutcomes {
  absenteeism: {
    baselineMean: number;
    currentMean: number;
    reduction: number;
    reductionPercent: number;
  };
  presenteeism: {
    baselineMean: number;
    currentMean: number;
    reduction: number;
    reductionPercent: number;
  };
  hoursRegained: {
    total: number;
    perEmployee: number;
    annualized: number;
  };
  costSavings: {
    low: number;    // Conservative estimate
    mid: number;    // Mid estimate
    high: number;   // Optimistic estimate
    annualized: number;
  };
}

export interface EngagementMetrics {
  enrolledCount: number;
  engagedCount: number;  // At least 1 session
  engagementRate: number;
  avgSessionsPerUser: number;
  dropoutRate: number;
  avgTimeToFirstSession: number;
  modalitySplit: {
    video: number;
    chat: number;
    phone: number;
    mixed: number;
  };
}

export interface ROIMetrics {
  programCost: number;
  totalSavings: number;
  netBenefit: number;
  roi: number;  // (Savings - Cost) / Cost * 100
  paybackPeriod: string;  // In months
}

export interface TimeSeriesDataPoint {
  date: string;
  week: number;
  phq9Mean: number;
  gad7Mean: number;
  who5Mean: number;
  sampleSize: number;
}

export interface OrganizationAnalytics {
  organization: Organization;
  clinical: ClinicalOutcomes;
  productivity: ProductivityOutcomes;
  engagement: EngagementMetrics;
  roi: ROIMetrics;
  timeSeries: TimeSeriesDataPoint[];
  generatedAt: string;
  disclaimer: string;
  minimumCohortMet: boolean;
}

// ============================================
// CLINICAL SEVERITY DEFINITIONS
// ============================================

export const PHQ9_SEVERITY_BANDS = [
  { min: 0, max: 4, label: 'Minimal', color: '#10B981' },
  { min: 5, max: 9, label: 'Mild', color: '#84CC16' },
  { min: 10, max: 14, label: 'Moderate', color: '#F59E0B' },
  { min: 15, max: 19, label: 'Moderately Severe', color: '#F97316' },
  { min: 20, max: 27, label: 'Severe', color: '#EF4444' },
] as const;

export const CLINICAL_THRESHOLDS = {
  PHQ9_MEANINGFUL_IMPROVEMENT: 5,  // Reduction ≥ 5 points
  GAD7_MEANINGFUL_IMPROVEMENT: 4,  // Reduction ≥ 4 points
  WHO5_MEANINGFUL_IMPROVEMENT: 10, // Increase ≥ 10 points
  MINIMUM_COHORT_SIZE: 5,  // Privacy threshold
} as const;
