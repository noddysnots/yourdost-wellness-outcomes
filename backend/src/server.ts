// ============================================
// WELLNESS OUTCOMES PLATFORM - API SERVER
// ============================================

import express, { Request, Response } from 'express';
import cors from 'cors';
import { getAllOrganizations, getOrganization, getMockData } from './data/mockDataGenerator';
import { getOrganizationAnalytics, getAllOrganizationsAnalytics } from './analytics/analyticsEngine';
import { generatePDFReport } from './services/pdfGenerator';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all organizations (list view)
app.get('/api/organizations', (req: Request, res: Response) => {
  try {
    const organizations = getAllOrganizations();
    res.json({ success: true, data: organizations });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch organizations' });
  }
});

// Get single organization details
app.get('/api/organizations/:orgId', (req: Request, res: Response) => {
  try {
    const organization = getOrganization(req.params.orgId);
    if (!organization) {
      return res.status(404).json({ success: false, error: 'Organization not found' });
    }
    res.json({ success: true, data: organization });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch organization' });
  }
});

// Get analytics for single organization
app.get('/api/analytics/:orgId', (req: Request, res: Response) => {
  try {
    const analytics = getOrganizationAnalytics(req.params.orgId);
    if (!analytics) {
      return res.status(404).json({ success: false, error: 'Organization not found' });
    }
    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, error: 'Failed to compute analytics' });
  }
});

// Get analytics for all organizations (summary view)
app.get('/api/analytics', (req: Request, res: Response) => {
  try {
    const analytics = getAllOrganizationsAnalytics();
    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, error: 'Failed to compute analytics' });
  }
});

// Generate PDF report for organization
app.get('/api/reports/:orgId/pdf', async (req: Request, res: Response) => {
  try {
    const analytics = getOrganizationAnalytics(req.params.orgId);
    if (!analytics) {
      return res.status(404).json({ success: false, error: 'Organization not found' });
    }
    
    if (!analytics.minimumCohortMet) {
      return res.status(400).json({ 
        success: false, 
        error: 'Minimum cohort size not met for privacy compliance' 
      });
    }
    
    const pdfBuffer = await generatePDFReport(analytics);
    
    const filename = `${analytics.organization.name.replace(/\s+/g, '_')}_Wellness_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate PDF report' });
  }
});

// Get mock data statistics (for debugging/demo)
app.get('/api/debug/stats', (req: Request, res: Response) => {
  try {
    const { organizations, users } = getMockData();
    res.json({
      success: true,
      data: {
        totalOrganizations: organizations.length,
        totalUsers: users.length,
        usersByOrg: organizations.map(org => ({
          orgId: org.orgId,
          name: org.name,
          userCount: users.filter(u => u.orgId === org.orgId).length,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║   Wellness Outcomes Platform - API Server                  ║
║   Running on http://localhost:${PORT}                         ║
╠════════════════════════════════════════════════════════════╣
║   Endpoints:                                               ║
║   GET  /api/health              - Health check             ║
║   GET  /api/organizations       - List all orgs            ║
║   GET  /api/organizations/:id   - Get org details          ║
║   GET  /api/analytics/:id       - Get org analytics        ║
║   GET  /api/analytics           - Get all analytics        ║
║   GET  /api/reports/:id/pdf     - Download PDF report      ║
╚════════════════════════════════════════════════════════════╝
  `);
  
  // Initialize mock data on startup
  getMockData();
  console.log('✓ Mock data initialized');
});
