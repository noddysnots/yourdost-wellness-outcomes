// ============================================
// API SERVICE
// Handles all backend communication
// ============================================

import { Organization, OrganizationAnalytics, ApiResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL + '/api';

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`);
  const data: ApiResponse<T> = await response.json();
  
  if (!data.success || !data.data) {
    throw new Error(data.error || 'API request failed');
  }
  
  return data.data;
}

export async function getOrganizations(): Promise<Organization[]> {
  return fetchApi<Organization[]>('/organizations');
}

export async function getOrganizationAnalytics(orgId: string): Promise<OrganizationAnalytics> {
  return fetchApi<OrganizationAnalytics>(`/analytics/${orgId}`);
}

export async function getAllAnalytics(): Promise<OrganizationAnalytics[]> {
  return fetchApi<OrganizationAnalytics[]>('/analytics');
}

export function downloadPdfReport(orgId: string, orgName: string): void {
  const url = `${API_BASE}/reports/${orgId}/pdf`;
  const filename = `${orgName.replace(/\s+/g, '_')}_Wellness_Report.pdf`;
  
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
