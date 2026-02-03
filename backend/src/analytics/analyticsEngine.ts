// ============================================
// ANALYTICS ENGINE
// Computes all wellness outcome metrics
// ============================================

import {
  User,
  Organization,
  OrganizationAnalytics,
  ClinicalOutcomes,
  ProductivityOutcomes,
  EngagementMetrics,
  ROIMetrics,
  TimeSeriesDataPoint,
  SeverityBand,
  SeverityMovement,
  PHQ9_SEVERITY_BANDS,
  CLINICAL_THRESHOLDS,
} from '../types';
import { getUsersByOrg, getOrganization } from '../data/mockDataGenerator';

// ============================================
// HELPER FUNCTIONS
// ============================================

function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function getPHQ9SeverityLabel(score: number): string {
  const band = PHQ9_SEVERITY_BANDS.find(b => score >= b.min && score <= b.max);
  return band?.label || 'Unknown';
}

function getPHQ9SeverityIndex(score: number): number {
  return PHQ9_SEVERITY_BANDS.findIndex(b => score >= b.min && score <= b.max);
}

function getLatestScores(user: User) {
  const followUps = user.followUpScores;
  if (followUps.length === 0) return user.baselineScores;
  return followUps[followUps.length - 1];
}

// ============================================
// CLINICAL OUTCOMES CALCULATION
// ============================================

function calculateClinicalOutcomes(users: User[]): ClinicalOutcomes {
  const baselinePHQ9 = users.map(u => u.baselineScores.phq9);
  const baselineGAD7 = users.map(u => u.baselineScores.gad7);
  const baselineWHO5 = users.map(u => u.baselineScores.who5);
  
  const currentPHQ9 = users.map(u => getLatestScores(u).phq9);
  const currentGAD7 = users.map(u => getLatestScores(u).gad7);
  const currentWHO5 = users.map(u => getLatestScores(u).who5);
  
  // PHQ-9 Analysis
  const phq9Changes = users.map(u => u.baselineScores.phq9 - getLatestScores(u).phq9);
  const phq9ClinicallyImproved = phq9Changes.filter(c => c >= CLINICAL_THRESHOLDS.PHQ9_MEANINGFUL_IMPROVEMENT).length;
  
  // GAD-7 Analysis
  const gad7Changes = users.map(u => u.baselineScores.gad7 - getLatestScores(u).gad7);
  const gad7ClinicallyImproved = gad7Changes.filter(c => c >= CLINICAL_THRESHOLDS.GAD7_MEANINGFUL_IMPROVEMENT).length;
  
  // WHO-5 Analysis
  const who5Changes = users.map(u => getLatestScores(u).who5 - u.baselineScores.who5);
  const who5MeaningfullyImproved = who5Changes.filter(c => c >= CLINICAL_THRESHOLDS.WHO5_MEANINGFUL_IMPROVEMENT).length;
  
  // Severity Distribution
  const baselineSeverityDistribution = calculateSeverityDistribution(baselinePHQ9);
  const currentSeverityDistribution = calculateSeverityDistribution(currentPHQ9);
  
  // Severity Movement
  const severityMovement = calculateSeverityMovement(users);
  
  return {
    phq9: {
      baselineMean: Number(mean(baselinePHQ9).toFixed(1)),
      currentMean: Number(mean(currentPHQ9).toFixed(1)),
      meanChange: Number((mean(baselinePHQ9) - mean(currentPHQ9)).toFixed(1)),
      clinicallyImprovedCount: phq9ClinicallyImproved,
      clinicallyImprovedPercent: Number(((phq9ClinicallyImproved / users.length) * 100).toFixed(1)),
      severityMovement,
      baselineSeverityDistribution,
      currentSeverityDistribution,
    },
    gad7: {
      baselineMean: Number(mean(baselineGAD7).toFixed(1)),
      currentMean: Number(mean(currentGAD7).toFixed(1)),
      meanChange: Number((mean(baselineGAD7) - mean(currentGAD7)).toFixed(1)),
      clinicallyImprovedCount: gad7ClinicallyImproved,
      clinicallyImprovedPercent: Number(((gad7ClinicallyImproved / users.length) * 100).toFixed(1)),
    },
    who5: {
      baselineMean: Number(mean(baselineWHO5).toFixed(1)),
      currentMean: Number(mean(currentWHO5).toFixed(1)),
      meanChange: Number((mean(currentWHO5) - mean(baselineWHO5)).toFixed(1)),
      meaningfullyImprovedCount: who5MeaningfullyImproved,
      meaningfullyImprovedPercent: Number(((who5MeaningfullyImproved / users.length) * 100).toFixed(1)),
    },
  };
}

function calculateSeverityDistribution(scores: number[]): SeverityBand[] {
  const total = scores.length;
  return PHQ9_SEVERITY_BANDS.map(band => {
    const count = scores.filter(s => s >= band.min && s <= band.max).length;
    return {
      label: band.label,
      count,
      percentage: Number(((count / total) * 100).toFixed(1)),
    };
  });
}

function calculateSeverityMovement(users: User[]): SeverityMovement {
  let improved = 0;
  let maintained = 0;
  let worsened = 0;
  
  users.forEach(user => {
    const baselineIndex = getPHQ9SeverityIndex(user.baselineScores.phq9);
    const currentIndex = getPHQ9SeverityIndex(getLatestScores(user).phq9);
    
    if (currentIndex < baselineIndex) improved++;
    else if (currentIndex > baselineIndex) worsened++;
    else maintained++;
  });
  
  return { improved, maintained, worsened };
}

// ============================================
// PRODUCTIVITY OUTCOMES CALCULATION
// ============================================

function calculateProductivityOutcomes(users: User[], organization: Organization): ProductivityOutcomes {
  const baselineAbsenteeism = users.map(u => u.baselineProductivity.absenteeismHours);
  const currentAbsenteeism = users.map(u => u.currentProductivity.absenteeismHours);
  
  const baselinePresenteeism = users.map(u => u.baselineProductivity.presenteeismPercent);
  const currentPresenteeism = users.map(u => u.currentProductivity.presenteeismPercent);
  
  const absenteeismReduction = mean(baselineAbsenteeism) - mean(currentAbsenteeism);
  const presenteeismReduction = mean(baselinePresenteeism) - mean(currentPresenteeism);
  
  // Calculate hours regained
  // Presenteeism hours = (presenteeism% / 100) * standard monthly hours (160)
  const MONTHLY_HOURS = 160;
  const baselinePresenteeismHours = (mean(baselinePresenteeism) / 100) * MONTHLY_HOURS;
  const currentPresenteeismHours = (mean(currentPresenteeism) / 100) * MONTHLY_HOURS;
  
  const hoursRegainedPerEmployee = absenteeismReduction + (baselinePresenteeismHours - currentPresenteeismHours);
  const totalHoursRegained = hoursRegainedPerEmployee * users.length;
  
  // Annualize (multiply by 12 months)
  const annualizedHours = totalHoursRegained * 4; // Quarterly data × 4
  
  // Cost savings calculation
  const hourlyCost = organization.avgHourlyCost;
  const midSavings = totalHoursRegained * hourlyCost;
  const lowSavings = midSavings * 0.7;  // Conservative: 70%
  const highSavings = midSavings * 1.3; // Optimistic: 130%
  const annualizedSavings = midSavings * 4;
  
  return {
    absenteeism: {
      baselineMean: Number(mean(baselineAbsenteeism).toFixed(1)),
      currentMean: Number(mean(currentAbsenteeism).toFixed(1)),
      reduction: Number(absenteeismReduction.toFixed(1)),
      reductionPercent: Number(((absenteeismReduction / mean(baselineAbsenteeism)) * 100).toFixed(1)),
    },
    presenteeism: {
      baselineMean: Number(mean(baselinePresenteeism).toFixed(1)),
      currentMean: Number(mean(currentPresenteeism).toFixed(1)),
      reduction: Number(presenteeismReduction.toFixed(1)),
      reductionPercent: Number(((presenteeismReduction / mean(baselinePresenteeism)) * 100).toFixed(1)),
    },
    hoursRegained: {
      total: Math.round(totalHoursRegained),
      perEmployee: Number(hoursRegainedPerEmployee.toFixed(1)),
      annualized: Math.round(annualizedHours),
    },
    costSavings: {
      low: Math.round(lowSavings),
      mid: Math.round(midSavings),
      high: Math.round(highSavings),
      annualized: Math.round(annualizedSavings),
    },
  };
}

// ============================================
// ENGAGEMENT METRICS CALCULATION
// ============================================

function calculateEngagementMetrics(users: User[], organization: Organization): EngagementMetrics {
  const engagedUsers = users.filter(u => u.engagement.sessions >= 1);
  const droppedUsers = users.filter(u => u.engagement.dropout);
  
  const modalityCounts = {
    video: users.filter(u => u.engagement.modality === 'video').length,
    chat: users.filter(u => u.engagement.modality === 'chat').length,
    phone: users.filter(u => u.engagement.modality === 'phone').length,
    mixed: users.filter(u => u.engagement.modality === 'mixed').length,
  };
  
  return {
    enrolledCount: users.length,
    engagedCount: engagedUsers.length,
    engagementRate: Number(((engagedUsers.length / users.length) * 100).toFixed(1)),
    avgSessionsPerUser: Number(mean(users.map(u => u.engagement.sessions)).toFixed(1)),
    dropoutRate: Number(((droppedUsers.length / users.length) * 100).toFixed(1)),
    avgTimeToFirstSession: Number(mean(users.map(u => u.engagement.timeToFirstSession)).toFixed(1)),
    modalitySplit: modalityCounts,
  };
}

// ============================================
// ROI CALCULATION
// ============================================

function calculateROI(productivity: ProductivityOutcomes, organization: Organization): ROIMetrics {
  const totalSavings = productivity.costSavings.annualized;
  const programCost = organization.programCost;
  const netBenefit = totalSavings - programCost;
  const roi = ((totalSavings - programCost) / programCost) * 100;
  
  // Payback period in months
  const monthlySavings = totalSavings / 12;
  const paybackMonths = programCost / monthlySavings;
  
  let paybackPeriod: string;
  if (paybackMonths <= 12) {
    paybackPeriod = `${Math.round(paybackMonths)} months`;
  } else {
    paybackPeriod = `${(paybackMonths / 12).toFixed(1)} years`;
  }
  
  return {
    programCost,
    totalSavings: Math.round(totalSavings),
    netBenefit: Math.round(netBenefit),
    roi: Number(roi.toFixed(1)),
    paybackPeriod,
  };
}

// ============================================
// TIME SERIES DATA
// ============================================

function generateTimeSeries(users: User[]): TimeSeriesDataPoint[] {
  const weekCount = 12;
  const timeSeries: TimeSeriesDataPoint[] = [];
  
  // Add baseline
  const startDate = new Date('2025-07-01');
  timeSeries.push({
    date: startDate.toISOString().split('T')[0],
    week: 0,
    phq9Mean: Number(mean(users.map(u => u.baselineScores.phq9)).toFixed(1)),
    gad7Mean: Number(mean(users.map(u => u.baselineScores.gad7)).toFixed(1)),
    who5Mean: Number(mean(users.map(u => u.baselineScores.who5)).toFixed(1)),
    sampleSize: users.length,
  });
  
  // Add weekly data points
  for (let week = 1; week <= weekCount; week++) {
    const weekDate = new Date(startDate);
    weekDate.setDate(weekDate.getDate() + week * 7);
    
    const usersWithData = users.filter(u => u.followUpScores.length >= week);
    
    if (usersWithData.length >= CLINICAL_THRESHOLDS.MINIMUM_COHORT_SIZE) {
      timeSeries.push({
        date: weekDate.toISOString().split('T')[0],
        week,
        phq9Mean: Number(mean(usersWithData.map(u => u.followUpScores[week - 1].phq9)).toFixed(1)),
        gad7Mean: Number(mean(usersWithData.map(u => u.followUpScores[week - 1].gad7)).toFixed(1)),
        who5Mean: Number(mean(usersWithData.map(u => u.followUpScores[week - 1].who5)).toFixed(1)),
        sampleSize: usersWithData.length,
      });
    }
  }
  
  return timeSeries;
}

// ============================================
// MAIN ANALYTICS FUNCTION
// ============================================

export function getOrganizationAnalytics(orgId: string): OrganizationAnalytics | null {
  const organization = getOrganization(orgId);
  if (!organization) return null;
  
  const users = getUsersByOrg(orgId);
  
  // Privacy check
  const minimumCohortMet = users.length >= CLINICAL_THRESHOLDS.MINIMUM_COHORT_SIZE;
  
  const clinical = calculateClinicalOutcomes(users);
  const productivity = calculateProductivityOutcomes(users, organization);
  const engagement = calculateEngagementMetrics(users, organization);
  const roi = calculateROI(productivity, organization);
  const timeSeries = generateTimeSeries(users);
  
  return {
    organization,
    clinical,
    productivity,
    engagement,
    roi,
    timeSeries,
    generatedAt: new Date().toISOString(),
    disclaimer: 'All data is aggregated and anonymized. This is a prototype demonstration and should not be used for clinical decisions.',
    minimumCohortMet,
  };
}

export function getAllOrganizationsAnalytics(): OrganizationAnalytics[] {
  const { organizations } = require('../data/mockDataGenerator').getMockData();
  return organizations.map((org: Organization) => getOrganizationAnalytics(org.orgId)).filter(Boolean);
}
