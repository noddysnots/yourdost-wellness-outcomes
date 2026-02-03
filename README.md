# Wellness Outcomes Platform

A B2B mental wellness outcomes platform prototype demonstrating how wellness outcomes are measured, analyzed, and reported to corporate clients beyond engagement metrics.

## Overview

This prototype showcases:
- **Outcome Measurement**: Clinical scores (PHQ-9, GAD-7, WHO-5) tracking
- **Business Translation**: Productivity metrics and ROI calculations
- **Corporate Dashboards**: Executive-friendly analytics views
- **Privacy-Safe Aggregation**: Organization-level data only
- **PDF Reports**: Downloadable executive summaries per company

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install:all
```

### Running the Application

```bash
# Run both backend and frontend concurrently
npm run dev
```

Or run separately:
```bash
# Terminal 1: Backend (port 3001)
cd backend && npm run dev

# Terminal 2: Frontend (port 3000)
cd frontend && npm run dev
```

Visit: **http://localhost:3000**

---

## Clinical Metrics Used

### PHQ-9 (Patient Health Questionnaire-9)
- **Purpose**: Depression severity screening
- **Score Range**: 0-27 (lower is better)
- **Severity Bands**:
  | Score | Severity |
  |-------|----------|
  | 0-4 | Minimal |
  | 5-9 | Mild |
  | 10-14 | Moderate |
  | 15-19 | Moderately Severe |
  | 20-27 | Severe |
- **Clinically Meaningful Improvement**: ≥5 point reduction

### GAD-7 (Generalized Anxiety Disorder-7)
- **Purpose**: Anxiety severity screening
- **Score Range**: 0-21 (lower is better)
- **Clinically Meaningful Improvement**: ≥4 point reduction

### WHO-5 (WHO Well-Being Index)
- **Purpose**: General psychological well-being
- **Score Range**: 0-100 (higher is better)
- **Meaningful Improvement**: ≥10 point increase

---

## Outcome Definitions

### Clinical Outcomes
- **Mean Score Change**: Average change across all users from baseline to current
- **Clinically Improved %**: Percentage of users achieving meaningful improvement threshold
- **Severity Movement**: Users who moved to a lower/higher severity band

### Productivity Metrics (WPAI/WHO-HPQ style, simplified)
- **Absenteeism**: Hours missed from work per month
- **Presenteeism**: Percentage of productivity loss while at work
- **Hours Regained**: `(Baseline Absenteeism - Current Absenteeism) + (Baseline Presenteeism Hours - Current Presenteeism Hours)`
- **Presenteeism Hours**: `(Presenteeism % / 100) × 160 monthly hours`

---

## Business Translation Logic

### ROI Calculation
```
Cost Savings = Hours Regained × Average Hourly Cost
Annual Savings = Quarterly Savings × 4
Net Benefit = Annual Savings - Program Cost
ROI = (Annual Savings - Program Cost) / Program Cost × 100
```

### Sensitivity Analysis
- **Conservative Estimate**: 70% of mid estimate
- **Mid Estimate**: Direct calculation from hours regained
- **Optimistic Estimate**: 130% of mid estimate

---

## PDF Report Generation

### Technology
- **Puppeteer**: Headless Chrome for high-quality PDF rendering
- **HTML/CSS**: Clean, print-optimized layouts

### Report Structure (4 Pages)

**Page 1: Executive Summary**
- Company name and reporting period
- Key performance indicators
- ROI highlight
- Clinical and productivity summary

**Page 2: Clinical Outcomes**
- PHQ-9 detailed analysis
- Severity distribution (baseline vs current)
- WHO-5 and GAD-7 metrics
- Severity movement visualization

**Page 3: Business Impact**
- Absenteeism/presenteeism reduction
- Hours regained calculation
- Cost savings with sensitivity range
- ROI analysis table

**Page 4: Methodology & Disclaimer**
- Metrics definitions
- Severity band reference
- Privacy notes
- Demo disclaimer

### Triggering PDF Download
Click the "Download Executive Report (PDF)" button on any organization dashboard.

---

## Privacy Assumptions

1. **Organization-Level Aggregation Only**: No individual employee data displayed
2. **Minimum Cohort Size**: 5 employees required before showing metrics
3. **No Individual Exports**: PDF reports contain only aggregated data
4. **Anonymization**: Employee identifiers are never exposed to employers
5. **Clear Labeling**: All reports include privacy disclaimers

---

## Project Structure

```
wellness-outcomes-platform/
├── backend/
│   ├── src/
│   │   ├── types/           # TypeScript interfaces
│   │   ├── data/            # Mock data generator
│   │   ├── analytics/       # Analytics engine
│   │   ├── services/        # PDF generation
│   │   └── server.ts        # Express API server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript interfaces
│   │   ├── App.tsx          # Main application
│   │   └── main.tsx         # Entry point
│   ├── index.html
│   └── package.json
├── package.json             # Root package with scripts
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/organizations` | List all organizations |
| GET | `/api/organizations/:orgId` | Get organization details |
| GET | `/api/analytics/:orgId` | Get organization analytics |
| GET | `/api/analytics` | Get all organizations analytics |
| GET | `/api/reports/:orgId/pdf` | Download PDF report |

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Node.js, Express, TypeScript
- **PDF Generation**: Puppeteer
- **Build Tools**: Vite
- **Data**: In-memory mock data (no database required)

---

## Demo Data

The prototype includes 4 mock organizations:
1. **TechCorp Industries** (Technology) - 320 enrolled
2. **FinancePlus Bank** (Financial Services) - 485 enrolled
3. **HealthWise Medical** (Healthcare) - 210 enrolled
4. **RetailMax Group** (Retail) - 680 enrolled

Data is generated with:
- Realistic baseline severity distributions
- Plausible improvement patterns based on engagement
- Correlated productivity improvements
- Various engagement patterns and modalities

---

## Limitations

This is a **prototype demonstration** with the following limitations:

1. **Synthetic Data**: All data is randomly generated and does not represent real clinical outcomes
2. **Simplified Scoring**: Uses numeric inputs only, not actual questionnaire administration
3. **No Authentication**: No user login or role-based access
4. **No Persistence**: Data resets on server restart
5. **Simplified ROI**: Real ROI calculations require more sophisticated modeling
6. **Not Clinically Validated**: Should not be used for actual clinical decisions

---

## Disclaimer

⚠️ **This is a prototype demonstration only.**

- All data shown is synthetic and generated for demonstration purposes
- Not intended for clinical diagnostic decisions
- Not intended for individual employee assessments
- Not suitable for compliance or regulatory reporting
- Metrics are simplified representations of validated instruments

---

## License

MIT License - For demonstration purposes only.
