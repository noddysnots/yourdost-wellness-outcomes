// ============================================
// MOCK DATA GENERATOR
// Generates realistic but synthetic wellness data
// ============================================

import { 
  User, 
  Organization, 
  ClinicalScores, 
  FollowUpScore,
  ProductivityMetrics,
  EngagementData 
} from '../types';

// Seeded random for reproducibility
let seed = 12345;
function seededRandom(): number {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}

function randomInt(min: number, max: number): number {
  return Math.floor(seededRandom() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  const val = seededRandom() * (max - min) + min;
  return Number(val.toFixed(decimals));
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(seededRandom() * arr.length)];
}

// Generate baseline clinical scores with different severity profiles
function generateBaselineScores(severityProfile: 'mild' | 'moderate' | 'severe'): ClinicalScores {
  const profiles = {
    mild: { phq9: [5, 12], gad7: [4, 10], who5: [45, 65] },
    moderate: { phq9: [10, 18], gad7: [8, 15], who5: [30, 50] },
    severe: { phq9: [15, 25], gad7: [12, 20], who5: [15, 35] },
  };
  
  const profile = profiles[severityProfile];
  return {
    phq9: randomInt(profile.phq9[0], profile.phq9[1]),
    gad7: randomInt(profile.gad7[0], profile.gad7[1]),
    who5: randomInt(profile.who5[0], profile.who5[1]),
  };
}

// Generate follow-up scores with realistic improvement patterns
function generateFollowUpScores(
  baseline: ClinicalScores, 
  engagement: EngagementData,
  weekCount: number = 12
): FollowUpScore[] {
  const scores: FollowUpScore[] = [];
  let currentScores = { ...baseline };
  
  // Improvement factors based on engagement
  const engagementFactor = engagement.dropout ? 0.3 : 
    engagement.sessions >= 8 ? 1.0 : 
    engagement.sessions >= 4 ? 0.7 : 0.4;
  
  // Weekly improvement rate (higher for more severe cases)
  const phq9ImprovementRate = (baseline.phq9 > 15 ? 0.8 : baseline.phq9 > 10 ? 0.5 : 0.3) * engagementFactor;
  const gad7ImprovementRate = (baseline.gad7 > 12 ? 0.6 : baseline.gad7 > 8 ? 0.4 : 0.2) * engagementFactor;
  const who5ImprovementRate = (baseline.who5 < 40 ? 2.5 : baseline.who5 < 55 ? 1.8 : 1.0) * engagementFactor;
  
  const startDate = new Date('2025-07-01');
  
  for (let week = 1; week <= weekCount; week++) {
    // Add some variance (+/- 15%)
    const variance = 0.85 + seededRandom() * 0.3;
    
    // Calculate new scores with diminishing returns
    const diminishingFactor = 1 - (week / (weekCount + 5));
    
    currentScores.phq9 = Math.max(0, Math.min(27, 
      currentScores.phq9 - (phq9ImprovementRate * diminishingFactor * variance) + (seededRandom() - 0.6) * 1.5
    ));
    
    currentScores.gad7 = Math.max(0, Math.min(21, 
      currentScores.gad7 - (gad7ImprovementRate * diminishingFactor * variance) + (seededRandom() - 0.6) * 1.2
    ));
    
    currentScores.who5 = Math.max(0, Math.min(100, 
      currentScores.who5 + (who5ImprovementRate * diminishingFactor * variance) + (seededRandom() - 0.4) * 3
    ));
    
    const date = new Date(startDate);
    date.setDate(date.getDate() + week * 7);
    
    scores.push({
      date: date.toISOString().split('T')[0],
      weekNumber: week,
      phq9: Math.round(currentScores.phq9),
      gad7: Math.round(currentScores.gad7),
      who5: Math.round(currentScores.who5),
    });
  }
  
  return scores;
}

// Generate productivity metrics
function generateBaselineProductivity(severityProfile: 'mild' | 'moderate' | 'severe'): ProductivityMetrics {
  const profiles = {
    mild: { absenteeism: [4, 12], presenteeism: [10, 25] },
    moderate: { absenteeism: [8, 20], presenteeism: [20, 40] },
    severe: { absenteeism: [16, 32], presenteeism: [35, 55] },
  };
  
  const profile = profiles[severityProfile];
  return {
    absenteeismHours: randomInt(profile.absenteeism[0], profile.absenteeism[1]),
    presenteeismPercent: randomInt(profile.presenteeism[0], profile.presenteeism[1]),
  };
}

function generateCurrentProductivity(
  baseline: ProductivityMetrics, 
  clinicalImprovement: number,
  engagementFactor: number
): ProductivityMetrics {
  // Productivity improvement correlates with clinical improvement
  const improvementFactor = (clinicalImprovement / 10) * engagementFactor;
  
  return {
    absenteeismHours: Math.max(0, Math.round(
      baseline.absenteeismHours * (1 - improvementFactor * 0.4 - seededRandom() * 0.15)
    )),
    presenteeismPercent: Math.max(0, Math.round(
      baseline.presenteeismPercent * (1 - improvementFactor * 0.35 - seededRandom() * 0.1)
    )),
  };
}

// Generate engagement data
function generateEngagement(): EngagementData {
  const dropout = seededRandom() < 0.18; // ~18% dropout rate
  const sessions = dropout 
    ? randomInt(1, 3) 
    : randomInt(4, 14);
  
  return {
    sessions,
    modality: randomChoice(['video', 'chat', 'phone', 'mixed']),
    timeToFirstSession: randomInt(1, 14),
    dropout,
  };
}

// Generate a single user
function generateUser(userId: string, orgId: string): User {
  const severityProfile = randomChoice(['mild', 'moderate', 'moderate', 'severe']) as 'mild' | 'moderate' | 'severe';
  const baselineScores = generateBaselineScores(severityProfile);
  const engagement = generateEngagement();
  const followUpScores = generateFollowUpScores(baselineScores, engagement);
  const baselineProductivity = generateBaselineProductivity(severityProfile);
  
  // Calculate clinical improvement for productivity correlation
  const latestScores = followUpScores[followUpScores.length - 1];
  const clinicalImprovement = baselineScores.phq9 - latestScores.phq9;
  const engagementFactor = engagement.dropout ? 0.3 : engagement.sessions >= 6 ? 1.0 : 0.6;
  
  const currentProductivity = generateCurrentProductivity(
    baselineProductivity, 
    clinicalImprovement, 
    engagementFactor
  );
  
  return {
    userId,
    orgId,
    enrollmentDate: '2025-07-01',
    baselineScores,
    followUpScores,
    baselineProductivity,
    currentProductivity,
    engagement,
  };
}

// Organization configurations
const ORGANIZATIONS_CONFIG = [
  {
    orgId: 'org-techcorp',
    name: 'TechCorp Industries',
    industry: 'Technology',
    totalEmployees: 2500,
    enrolledEmployees: 320,
    avgHourlyCost: 75,
    programCost: 180000,
  },
  {
    orgId: 'org-financeplus',
    name: 'FinancePlus Bank',
    industry: 'Financial Services',
    totalEmployees: 4200,
    enrolledEmployees: 485,
    avgHourlyCost: 85,
    programCost: 275000,
  },
  {
    orgId: 'org-healthwise',
    name: 'HealthWise Medical',
    industry: 'Healthcare',
    totalEmployees: 1800,
    enrolledEmployees: 210,
    avgHourlyCost: 65,
    programCost: 125000,
  },
  {
    orgId: 'org-retailmax',
    name: 'RetailMax Group',
    industry: 'Retail',
    totalEmployees: 8500,
    enrolledEmployees: 680,
    avgHourlyCost: 35,
    programCost: 320000,
  },
];

// Generate all mock data
export function generateMockData(): { organizations: Organization[]; users: User[] } {
  seed = 12345; // Reset seed for consistent data
  
  const organizations: Organization[] = ORGANIZATIONS_CONFIG.map(config => ({
    ...config,
    reportingPeriod: {
      start: '2025-07-01',
      end: '2025-09-30',
    },
  }));
  
  const users: User[] = [];
  
  organizations.forEach(org => {
    for (let i = 0; i < org.enrolledEmployees; i++) {
      users.push(generateUser(`user-${org.orgId}-${i}`, org.orgId));
    }
  });
  
  return { organizations, users };
}

// Export singleton data
let cachedData: { organizations: Organization[]; users: User[] } | null = null;

export function getMockData(): { organizations: Organization[]; users: User[] } {
  if (!cachedData) {
    cachedData = generateMockData();
  }
  return cachedData;
}

export function getUsersByOrg(orgId: string): User[] {
  const { users } = getMockData();
  return users.filter(u => u.orgId === orgId);
}

export function getOrganization(orgId: string): Organization | undefined {
  const { organizations } = getMockData();
  return organizations.find(o => o.orgId === orgId);
}

export function getAllOrganizations(): Organization[] {
  const { organizations } = getMockData();
  return organizations;
}
