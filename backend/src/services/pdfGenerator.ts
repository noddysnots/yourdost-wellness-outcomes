// ============================================
// PDF REPORT GENERATOR
// Generates executive-friendly PDF reports
// ============================================

import puppeteer from 'puppeteer';
import { OrganizationAnalytics } from '../types';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

function generateSeverityChart(distribution: { label: string; percentage: number }[], title: string): string {
  const colors = ['#10B981', '#84CC16', '#F59E0B', '#F97316', '#EF4444'];
  const bars = distribution.map((band, i) => `
    <div style="display: flex; align-items: center; margin: 4px 0;">
      <div style="width: 100px; font-size: 11px;">${band.label}</div>
      <div style="flex: 1; background: #E5E7EB; height: 18px; border-radius: 4px; overflow: hidden;">
        <div style="width: ${band.percentage}%; background: ${colors[i]}; height: 100%; display: flex; align-items: center; justify-content: flex-end; padding-right: 4px;">
          <span style="font-size: 10px; color: white; font-weight: 600;">${band.percentage}%</span>
        </div>
      </div>
    </div>
  `).join('');
  
  return `
    <div style="margin: 15px 0;">
      <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px; color: #374151;">${title}</div>
      ${bars}
    </div>
  `;
}

function generateHTMLReport(analytics: OrganizationAnalytics): string {
  const { organization, clinical, productivity, engagement, roi, timeSeries } = analytics;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1F2937; line-height: 1.5; }
    
    .page { page-break-after: always; padding: 40px; min-height: 100vh; }
    .page:last-child { page-break-after: auto; }
    
    .header { border-bottom: 3px solid #3B82F6; padding-bottom: 15px; margin-bottom: 25px; }
    .header h1 { font-size: 24px; color: #1E3A8A; margin-bottom: 5px; }
    .header .subtitle { font-size: 14px; color: #6B7280; }
    .header .period { font-size: 12px; color: #9CA3AF; margin-top: 5px; }
    
    .section { margin-bottom: 25px; }
    .section-title { font-size: 16px; font-weight: 600; color: #1E3A8A; margin-bottom: 12px; padding-bottom: 5px; border-bottom: 1px solid #E5E7EB; }
    
    .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
    .metric-card { background: #F9FAFB; padding: 15px; border-radius: 8px; border-left: 4px solid #3B82F6; }
    .metric-card.success { border-left-color: #10B981; }
    .metric-card.warning { border-left-color: #F59E0B; }
    .metric-value { font-size: 24px; font-weight: 700; color: #1F2937; }
    .metric-label { font-size: 11px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
    .metric-subtext { font-size: 10px; color: #9CA3AF; margin-top: 2px; }
    
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
    .three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
    
    .data-table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .data-table th { background: #F3F4F6; padding: 10px; text-align: left; font-weight: 600; }
    .data-table td { padding: 10px; border-bottom: 1px solid #E5E7EB; }
    .data-table tr:nth-child(even) { background: #F9FAFB; }
    
    .highlight-box { background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
    .highlight-box h3 { font-size: 14px; opacity: 0.9; margin-bottom: 8px; }
    .highlight-box .big-number { font-size: 36px; font-weight: 700; }
    .highlight-box .context { font-size: 12px; opacity: 0.8; margin-top: 5px; }
    
    .improvement-indicator { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .improvement-indicator.positive { background: #D1FAE5; color: #065F46; }
    .improvement-indicator.negative { background: #FEE2E2; color: #991B1B; }
    
    .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #E5E7EB; font-size: 10px; color: #9CA3AF; }
    
    .disclaimer { background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; border-radius: 8px; margin-top: 20px; }
    .disclaimer-title { font-weight: 600; color: #92400E; font-size: 12px; margin-bottom: 5px; }
    .disclaimer-text { font-size: 11px; color: #78350F; }
    
    .severity-movement { display: flex; gap: 20px; margin: 15px 0; }
    .movement-item { flex: 1; text-align: center; padding: 15px; background: #F9FAFB; border-radius: 8px; }
    .movement-value { font-size: 28px; font-weight: 700; }
    .movement-label { font-size: 11px; color: #6B7280; margin-top: 5px; }
    .movement-item.improved .movement-value { color: #10B981; }
    .movement-item.maintained .movement-value { color: #6B7280; }
    .movement-item.worsened .movement-value { color: #EF4444; }
  </style>
</head>
<body>
  <!-- PAGE 1: Executive Summary -->
  <div class="page">
    <div class="header">
      <h1>${organization.name}</h1>
      <div class="subtitle">Mental Wellness Program - Executive Outcomes Report</div>
      <div class="period">Reporting Period: ${organization.reportingPeriod.start} to ${organization.reportingPeriod.end}</div>
    </div>
    
    <div class="highlight-box">
      <h3>Return on Investment</h3>
      <div class="big-number">${roi.roi}%</div>
      <div class="context">Program investment of ${formatCurrency(roi.programCost)} generated ${formatCurrency(roi.totalSavings)} in estimated annual savings</div>
    </div>
    
    <div class="section">
      <div class="section-title">Key Performance Indicators</div>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">${formatNumber(engagement.enrolledCount)}</div>
          <div class="metric-label">Employees Enrolled</div>
          <div class="metric-subtext">${((engagement.enrolledCount / organization.totalEmployees) * 100).toFixed(1)}% of workforce</div>
        </div>
        <div class="metric-card success">
          <div class="metric-value">${engagement.engagementRate}%</div>
          <div class="metric-label">Engagement Rate</div>
          <div class="metric-subtext">${engagement.engagedCount} actively participated</div>
        </div>
        <div class="metric-card success">
          <div class="metric-value">${clinical.phq9.clinicallyImprovedPercent}%</div>
          <div class="metric-label">Clinically Improved</div>
          <div class="metric-subtext">PHQ-9 reduction ≥5 points</div>
        </div>
        <div class="metric-card success">
          <div class="metric-value">${formatNumber(productivity.hoursRegained.annualized)}</div>
          <div class="metric-label">Hours Regained (Annual)</div>
          <div class="metric-subtext">${productivity.hoursRegained.perEmployee} hrs/employee</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Program Impact Summary</div>
      <div class="two-col">
        <div>
          <h4 style="font-size: 13px; margin-bottom: 10px; color: #374151;">Clinical Outcomes</h4>
          <table class="data-table">
            <tr><td>Mean PHQ-9 Change</td><td><span class="improvement-indicator positive">↓ ${clinical.phq9.meanChange} points</span></td></tr>
            <tr><td>Mean WHO-5 Change</td><td><span class="improvement-indicator positive">↑ ${clinical.who5.meanChange} points</span></td></tr>
            <tr><td>Anxiety Improvement (GAD-7)</td><td><span class="improvement-indicator positive">${clinical.gad7.clinicallyImprovedPercent}% improved</span></td></tr>
          </table>
        </div>
        <div>
          <h4 style="font-size: 13px; margin-bottom: 10px; color: #374151;">Productivity Impact</h4>
          <table class="data-table">
            <tr><td>Absenteeism Reduction</td><td><span class="improvement-indicator positive">↓ ${productivity.absenteeism.reduction} hrs/mo</span></td></tr>
            <tr><td>Presenteeism Reduction</td><td><span class="improvement-indicator positive">↓ ${productivity.presenteeism.reduction}%</span></td></tr>
            <tr><td>Estimated Annual Savings</td><td><strong>${formatCurrency(productivity.costSavings.annualized)}</strong></td></tr>
          </table>
        </div>
      </div>
    </div>
    
    <div class="footer">
      Report generated: ${new Date().toLocaleDateString()} | All data aggregated and anonymized | Minimum cohort size: 5
    </div>
  </div>
  
  <!-- PAGE 2: Clinical Outcomes -->
  <div class="page">
    <div class="header">
      <h1>Clinical Outcomes</h1>
      <div class="subtitle">${organization.name} - Detailed Analysis</div>
    </div>
    
    <div class="section">
      <div class="section-title">Depression Severity (PHQ-9)</div>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">${clinical.phq9.baselineMean}</div>
          <div class="metric-label">Baseline Mean</div>
        </div>
        <div class="metric-card success">
          <div class="metric-value">${clinical.phq9.currentMean}</div>
          <div class="metric-label">Current Mean</div>
        </div>
        <div class="metric-card success">
          <div class="metric-value">-${clinical.phq9.meanChange}</div>
          <div class="metric-label">Mean Reduction</div>
        </div>
        <div class="metric-card success">
          <div class="metric-value">${clinical.phq9.clinicallyImprovedPercent}%</div>
          <div class="metric-label">Clinically Improved</div>
        </div>
      </div>
      
      <div class="two-col">
        ${generateSeverityChart(clinical.phq9.baselineSeverityDistribution, 'Baseline Severity Distribution')}
        ${generateSeverityChart(clinical.phq9.currentSeverityDistribution, 'Current Severity Distribution')}
      </div>
      
      <div class="severity-movement">
        <div class="movement-item improved">
          <div class="movement-value">${clinical.phq9.severityMovement.improved}</div>
          <div class="movement-label">Improved to Lower Severity</div>
        </div>
        <div class="movement-item maintained">
          <div class="movement-value">${clinical.phq9.severityMovement.maintained}</div>
          <div class="movement-label">Maintained Severity</div>
        </div>
        <div class="movement-item worsened">
          <div class="movement-value">${clinical.phq9.severityMovement.worsened}</div>
          <div class="movement-label">Moved to Higher Severity</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Well-being & Anxiety</div>
      <div class="two-col">
        <div>
          <h4 style="font-size: 13px; margin-bottom: 10px;">WHO-5 Well-being Index</h4>
          <div class="three-col">
            <div class="metric-card">
              <div class="metric-value">${clinical.who5.baselineMean}</div>
              <div class="metric-label">Baseline</div>
            </div>
            <div class="metric-card success">
              <div class="metric-value">${clinical.who5.currentMean}</div>
              <div class="metric-label">Current</div>
            </div>
            <div class="metric-card success">
              <div class="metric-value">${clinical.who5.meaningfullyImprovedPercent}%</div>
              <div class="metric-label">Improved ≥10pts</div>
            </div>
          </div>
        </div>
        <div>
          <h4 style="font-size: 13px; margin-bottom: 10px;">GAD-7 Anxiety</h4>
          <div class="three-col">
            <div class="metric-card">
              <div class="metric-value">${clinical.gad7.baselineMean}</div>
              <div class="metric-label">Baseline</div>
            </div>
            <div class="metric-card success">
              <div class="metric-value">${clinical.gad7.currentMean}</div>
              <div class="metric-label">Current</div>
            </div>
            <div class="metric-card success">
              <div class="metric-value">${clinical.gad7.clinicallyImprovedPercent}%</div>
              <div class="metric-label">Improved ≥4pts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      PHQ-9 range: 0-27 (lower is better) | WHO-5 range: 0-100 (higher is better) | GAD-7 range: 0-21 (lower is better)
    </div>
  </div>
  
  <!-- PAGE 3: Business Impact -->
  <div class="page">
    <div class="header">
      <h1>Business Impact</h1>
      <div class="subtitle">${organization.name} - Productivity & Cost Analysis</div>
    </div>
    
    <div class="highlight-box" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%);">
      <h3>Total Estimated Annual Savings</h3>
      <div class="big-number">${formatCurrency(productivity.costSavings.annualized)}</div>
      <div class="context">Based on ${formatNumber(productivity.hoursRegained.annualized)} productivity hours regained at ${formatCurrency(organization.avgHourlyCost)}/hr average cost</div>
    </div>
    
    <div class="section">
      <div class="section-title">Absenteeism & Presenteeism Reduction</div>
      <div class="two-col">
        <div>
          <h4 style="font-size: 13px; margin-bottom: 15px;">Absenteeism (Hours Missed/Month)</h4>
          <table class="data-table">
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Baseline Average</td><td>${productivity.absenteeism.baselineMean} hours</td></tr>
            <tr><td>Current Average</td><td>${productivity.absenteeism.currentMean} hours</td></tr>
            <tr><td>Reduction</td><td><span class="improvement-indicator positive">${productivity.absenteeism.reduction} hours (${productivity.absenteeism.reductionPercent}%)</span></td></tr>
          </table>
        </div>
        <div>
          <h4 style="font-size: 13px; margin-bottom: 15px;">Presenteeism (% Productivity Loss)</h4>
          <table class="data-table">
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Baseline Average</td><td>${productivity.presenteeism.baselineMean}%</td></tr>
            <tr><td>Current Average</td><td>${productivity.presenteeism.currentMean}%</td></tr>
            <tr><td>Reduction</td><td><span class="improvement-indicator positive">${productivity.presenteeism.reduction} percentage points (${productivity.presenteeism.reductionPercent}%)</span></td></tr>
          </table>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">ROI Analysis</div>
      <table class="data-table">
        <tr><th>Component</th><th>Amount</th><th>Notes</th></tr>
        <tr><td>Program Investment</td><td>${formatCurrency(roi.programCost)}</td><td>Annual program cost</td></tr>
        <tr><td>Estimated Savings (Conservative)</td><td>${formatCurrency(productivity.costSavings.low * 4)}</td><td>70% of mid estimate</td></tr>
        <tr><td>Estimated Savings (Mid)</td><td>${formatCurrency(productivity.costSavings.annualized)}</td><td>Based on hours regained × hourly cost</td></tr>
        <tr><td>Estimated Savings (Optimistic)</td><td>${formatCurrency(productivity.costSavings.high * 4)}</td><td>130% of mid estimate</td></tr>
        <tr style="background: #D1FAE5;"><td><strong>Net Benefit (Mid)</strong></td><td><strong>${formatCurrency(roi.netBenefit)}</strong></td><td>Savings minus investment</td></tr>
        <tr style="background: #DBEAFE;"><td><strong>Return on Investment</strong></td><td><strong>${roi.roi}%</strong></td><td>Payback period: ${roi.paybackPeriod}</td></tr>
      </table>
    </div>
    
    <div class="section">
      <div class="section-title">Cost Assumptions</div>
      <div class="three-col">
        <div class="metric-card">
          <div class="metric-value">${formatCurrency(organization.avgHourlyCost)}</div>
          <div class="metric-label">Avg Hourly Cost</div>
          <div class="metric-subtext">Fully loaded employee cost</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">160</div>
          <div class="metric-label">Monthly Work Hours</div>
          <div class="metric-subtext">Standard assumption</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${productivity.hoursRegained.perEmployee}</div>
          <div class="metric-label">Hours/Employee</div>
          <div class="metric-subtext">Productivity regained</div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      Savings calculations are estimates based on industry-standard productivity metrics (WPAI/WHO-HPQ methodology).
    </div>
  </div>
  
  <!-- PAGE 4: Methodology & Disclaimer -->
  <div class="page">
    <div class="header">
      <h1>Methodology & Disclaimer</h1>
      <div class="subtitle">Understanding the Metrics</div>
    </div>
    
    <div class="section">
      <div class="section-title">Clinical Measures Used</div>
      <table class="data-table">
        <tr><th>Measure</th><th>Range</th><th>Meaningful Improvement</th><th>Purpose</th></tr>
        <tr>
          <td><strong>PHQ-9</strong></td>
          <td>0-27</td>
          <td>≥5 point reduction</td>
          <td>Depression severity screening</td>
        </tr>
        <tr>
          <td><strong>GAD-7</strong></td>
          <td>0-21</td>
          <td>≥4 point reduction</td>
          <td>Anxiety severity screening</td>
        </tr>
        <tr>
          <td><strong>WHO-5</strong></td>
          <td>0-100</td>
          <td>≥10 point increase</td>
          <td>General well-being index</td>
        </tr>
      </table>
    </div>
    
    <div class="section">
      <div class="section-title">PHQ-9 Severity Bands</div>
      <table class="data-table">
        <tr><th>Score Range</th><th>Severity Level</th></tr>
        <tr><td>0-4</td><td>Minimal</td></tr>
        <tr><td>5-9</td><td>Mild</td></tr>
        <tr><td>10-14</td><td>Moderate</td></tr>
        <tr><td>15-19</td><td>Moderately Severe</td></tr>
        <tr><td>20-27</td><td>Severe</td></tr>
      </table>
    </div>
    
    <div class="section">
      <div class="section-title">Productivity Metrics</div>
      <table class="data-table">
        <tr><th>Metric</th><th>Definition</th><th>Calculation</th></tr>
        <tr>
          <td><strong>Absenteeism</strong></td>
          <td>Hours missed from work per month</td>
          <td>Self-reported work hours missed</td>
        </tr>
        <tr>
          <td><strong>Presenteeism</strong></td>
          <td>Productivity loss while at work</td>
          <td>% of standard output not achieved</td>
        </tr>
        <tr>
          <td><strong>Hours Regained</strong></td>
          <td>Productivity restored through program</td>
          <td>(Baseline - Current) absenteeism + presenteeism hours</td>
        </tr>
      </table>
    </div>
    
    <div class="section">
      <div class="section-title">Data Privacy & Aggregation</div>
      <ul style="font-size: 12px; color: #374151; padding-left: 20px;">
        <li>All data is aggregated at the organization level</li>
        <li>No individual employee data is shown or exported</li>
        <li>Minimum cohort size of 5 required before displaying metrics</li>
        <li>Data is anonymized before analysis</li>
      </ul>
    </div>
    
    <div class="disclaimer">
      <div class="disclaimer-title">⚠️ Important Disclaimer</div>
      <div class="disclaimer-text">
        <p><strong>This is a prototype demonstration.</strong> The data presented in this report is synthetic and generated for demonstration purposes only.</p>
        <br>
        <p>This report should NOT be used for:</p>
        <ul style="margin-left: 20px; margin-top: 5px;">
          <li>Clinical diagnostic decisions</li>
          <li>Individual employee assessments</li>
          <li>Medical treatment planning</li>
          <li>Compliance or regulatory reporting</li>
        </ul>
        <br>
        <p>The metrics, calculations, and assumptions shown are simplified representations of industry-standard methodologies (PHQ-9, GAD-7, WHO-5, WPAI) for demonstration purposes.</p>
      </div>
    </div>
    
    <div class="footer" style="margin-top: 40px;">
      <div style="text-align: center; color: #6B7280;">
        <p>Wellness Outcomes Platform - Prototype Demo</p>
        <p>Report Generated: ${new Date().toLocaleString()}</p>
        <p style="margin-top: 10px; font-size: 9px;">© 2025 Wellness Analytics Demo. All data is synthetic.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export async function generatePDFReport(analytics: OrganizationAnalytics): Promise<Buffer> {
  const html = generateHTMLReport(analytics);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

export { generateHTMLReport };
