// ============================================
// FRONTEND TYPE DEFINITIONS
// Mirrors backend types for API responses
// ============================================

export interface Organization {
  orgId: string;
  name: string;
  industry: string;
  totalEmployees: number;
  enrolledEmployees: number;
  avgHourlyCost: number;
  programCost: number;
  reportingPeriod: {
    start: string;
    end: string;
  };
}

export interface SeverityBand {
  label: string;
  count: number;
  percentage: number;
}

export interface SeverityMovement {
  improved: number;
  maintained: number;
  worsened: number;
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
    low: number;
    mid: number;
    high: number;
    annualized: number;
  };
}

export interface EngagementMetrics {
  enrolledCount: number;
  engagedCount: number;
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
  roi: number;
  paybackPeriod: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
