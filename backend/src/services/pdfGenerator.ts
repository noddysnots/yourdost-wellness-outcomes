// ============================================
// PDF REPORT GENERATOR
// Generates executive-friendly PDF reports
// ============================================

import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { OrganizationAnalytics } from "../types";

/* ------------------ Helpers ------------------ */

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

function generateSeverityChart(
  distribution: { label: string; percentage: number }[],
  title: string
): string {
  const colors = ["#10B981", "#84CC16", "#F59E0B", "#F97316", "#EF4444"];

  const bars = distribution
    .map(
      (band, i) => `
      <div style="display:flex;align-items:center;margin:4px 0;">
        <div style="width:100px;font-size:11px;">${band.label}</div>
        <div style="flex:1;background:#E5E7EB;height:18px;border-radius:4px;overflow:hidden;">
          <div style="width:${band.percentage}%;background:${colors[i]};height:100%;display:flex;align-items:center;justify-content:flex-end;padding-right:4px;">
            <span style="font-size:10px;color:white;font-weight:600;">
              ${band.percentage}%
            </span>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  return `
    <div style="margin:15px 0;">
      <div style="font-size:12px;font-weight:600;margin-bottom:8px;color:#374151;">
        ${title}
      </div>
      ${bars}
    </div>
  `;
}

/* ------------------ HTML Builder ------------------ */

function generateHTMLReport(analytics: OrganizationAnalytics): string {
  const { organization, clinical, productivity, engagement, roi } = analytics;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Segoe UI',Arial,sans-serif; color:#1F2937; line-height:1.5; }

.page { page-break-after:always; padding:40px; min-height:100vh; }
.page:last-child { page-break-after:auto; }

.header { border-bottom:3px solid #3B82F6; padding-bottom:15px; margin-bottom:25px; }
.header h1 { font-size:24px; color:#1E3A8A; margin-bottom:5px; }
.header .subtitle { font-size:14px; color:#6B7280; }
.header .period { font-size:12px; color:#9CA3AF; margin-top:5px; }

.section { margin-bottom:25px; }
.section-title {
  font-size:16px;
  font-weight:600;
  color:#1E3A8A;
  margin-bottom:12px;
  padding-bottom:5px;
  border-bottom:1px solid #E5E7EB;
}

.metrics-grid {
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:15px;
  margin-bottom:20px;
}

.metric-card {
  background:#F9FAFB;
  padding:15px;
  border-radius:8px;
  border-left:4px solid #3B82F6;
}

.metric-card.success { border-left-color:#10B981; }

.metric-value { font-size:24px; font-weight:700; }
.metric-label {
  font-size:11px;
  color:#6B7280;
  text-transform:uppercase;
  letter-spacing:0.5px;
  margin-top:4px;
}
.metric-subtext { font-size:10px; color:#9CA3AF; }

.two-col { display:grid; grid-template-columns:1fr 1fr; gap:25px; }
.three-col { display:grid; grid-template-columns:repeat(3,1fr); gap:15px; }

.data-table { width:100%; border-collapse:collapse; font-size:12px; }
.data-table th { background:#F3F4F6; padding:10px; text-align:left; }
.data-table td { padding:10px; border-bottom:1px solid #E5E7EB; }
.data-table tr:nth-child(even) { background:#F9FAFB; }

.highlight-box {
  background:linear-gradient(135deg,#3B82F6 0%,#1E40AF 100%);
  color:white;
  padding:20px;
  border-radius:10px;
  margin-bottom:20px;
}

.highlight-box .big-number { font-size:36px; font-weight:700; }

.improvement-indicator {
  display:inline-block;
  padding:2px 8px;
  border-radius:4px;
  font-size:11px;
  font-weight:600;
}

.improvement-indicator.positive { background:#D1FAE5; color:#065F46; }

.footer {
  margin-top:30px;
  padding-top:15px;
  border-top:1px solid #E5E7EB;
  font-size:10px;
  color:#9CA3AF;
}
</style>
</head>

<body>

<!-- PAGE 1: EXECUTIVE SUMMARY -->
<div class="page">
  <div class="header">
    <h1>${organization.name}</h1>
    <div class="subtitle">Mental Wellness Program – Executive Outcomes Report</div>
    <div class="period">
      Reporting Period: ${organization.reportingPeriod.start} to ${organization.reportingPeriod.end}
    </div>
  </div>

  <div class="highlight-box">
    <h3>Return on Investment</h3>
    <div class="big-number">${roi.roi}%</div>
    <div>
      Program investment of ${formatCurrency(roi.programCost)}
      generated ${formatCurrency(roi.totalSavings)} in estimated savings
    </div>
  </div>

  <div class="section">
    <div class="section-title">Key Performance Indicators</div>
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-value">${formatNumber(engagement.enrolledCount)}</div>
        <div class="metric-label">Employees Enrolled</div>
      </div>
      <div class="metric-card success">
        <div class="metric-value">${engagement.engagementRate}%</div>
        <div class="metric-label">Engagement Rate</div>
      </div>
      <div class="metric-card success">
        <div class="metric-value">${clinical.phq9.clinicallyImprovedPercent}%</div>
        <div class="metric-label">Clinically Improved</div>
      </div>
      <div class="metric-card success">
        <div class="metric-value">${formatNumber(productivity.hoursRegained.annualized)}</div>
        <div class="metric-label">Hours Regained</div>
      </div>
    </div>
  </div>
</div>

<!-- PAGE 2: CLINICAL OUTCOMES -->
<div class="page">
  <div class="header">
    <h1>Clinical Outcomes</h1>
    <div class="subtitle">${organization.name}</div>
  </div>

  ${generateSeverityChart(
    clinical.phq9.baselineSeverityDistribution,
    "PHQ-9 Baseline Severity"
  )}
  ${generateSeverityChart(
    clinical.phq9.currentSeverityDistribution,
    "PHQ-9 Current Severity"
  )}
</div>

<!-- PAGE 3: BUSINESS IMPACT -->
<div class="page">
  <div class="header">
    <h1>Business Impact</h1>
  </div>

  <div class="highlight-box">
    <h3>Annual Productivity Savings</h3>
    <div class="big-number">
      ${formatCurrency(productivity.costSavings.annualized)}
    </div>
  </div>
</div>

<!-- PAGE 4: METHODOLOGY -->
<div class="page">
  <div class="header">
    <h1>Methodology & Disclaimer</h1>
  </div>

  <p>
    This report is a prototype demonstration. All data shown is synthetic
    and intended for illustrative purposes only.
  </p>
</div>

</body>
</html>
`;
}

/* ------------------ PDF Generator ------------------ */

export async function generatePDFReport(
  analytics: OrganizationAnalytics
): Promise<Buffer> {
  const html = generateHTMLReport(analytics);

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

export { generateHTMLReport };
