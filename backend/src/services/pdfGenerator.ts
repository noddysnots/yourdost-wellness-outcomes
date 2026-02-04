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

  return `
    <div style="margin:15px 0;">
      <div style="font-size:12px;font-weight:600;margin-bottom:8px;color:#374151;">
        ${title}
      </div>
      ${distribution
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
        .join("")}
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
<meta charset="UTF-8" />
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, sans-serif; color:#1F2937; }
  .page { padding:40px; page-break-after: always; }
  .page:last-child { page-break-after: auto; }
</style>
</head>
<body>

<div class="page">
  <h1>${organization.name}</h1>
  <p>Reporting Period: ${organization.reportingPeriod.start} – ${organization.reportingPeriod.end}</p>

  <h2>ROI</h2>
  <p><strong>${roi.roi}%</strong> return on investment</p>

  <h2>Key Metrics</h2>
  <ul>
    <li>Employees Enrolled: ${engagement.enrolledCount}</li>
    <li>Engagement Rate: ${engagement.engagementRate}%</li>
    <li>Clinically Improved (PHQ-9): ${clinical.phq9.clinicallyImprovedPercent}%</li>
    <li>Annual Hours Regained: ${formatNumber(productivity.hoursRegained.annualized)}</li>
  </ul>
</div>

<div class="page">
  <h2>Clinical Outcomes</h2>
  ${generateSeverityChart(
    clinical.phq9.baselineSeverityDistribution,
    "PHQ-9 Baseline Severity"
  )}
  ${generateSeverityChart(
    clinical.phq9.currentSeverityDistribution,
    "PHQ-9 Current Severity"
  )}
</div>

<div class="page">
  <h2>Business Impact</h2>
  <p>Annual Productivity Savings: ${formatCurrency(
    productivity.costSavings.annualized
  )}</p>
</div>

<div class="page">
  <h2>Disclaimer</h2>
  <p>This is a prototype. Data is synthetic and for demo purposes only.</p>
</div>

</body>
</html>
`;
}

/* ------------------ PDF Generator ------------------ */

export async function generatePDFReport(
  analytics: OrganizationAnalytics
): Promise<Buffer> {
  let browser;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true, // explicitly set, no typing issue
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const html = generateHTMLReport(analytics);

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return Buffer.from(pdf);
  } catch (err) {
    console.error("PDF generation failed:", err);
    throw err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export { generateHTMLReport };
