// ============================================
// MAIN APP COMPONENT
// Wellness Outcomes Platform Dashboard
// ============================================

import React, { useState, useEffect } from 'react';
import { getOrganizations, getOrganizationAnalytics } from './services/api';
import { Organization, OrganizationAnalytics } from './types';
import { Dashboard } from './components/Dashboard';
import { OrganizationSelector } from './components/OrganizationSelector';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/LoadingSpinner';

function App() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<OrganizationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch organizations on mount
  useEffect(() => {
    async function loadOrganizations() {
      try {
        const orgs = await getOrganizations();
        setOrganizations(orgs);
        if (orgs.length > 0) {
          setSelectedOrgId(orgs[0].orgId);
        }
      } catch (err) {
        setError('Failed to load organizations. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    }
    loadOrganizations();
  }, []);

  // Fetch analytics when organization changes
  useEffect(() => {
    if (!selectedOrgId) return;

    async function loadAnalytics() {
      setLoading(true);
      try {
        const data = await getOrganizationAnalytics(selectedOrgId!);
        setAnalytics(data);
        setError(null);
      } catch (err) {
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [selectedOrgId]);

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please ensure the backend server is running on port 3001.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrganizationSelector
          organizations={organizations}
          selectedOrgId={selectedOrgId}
          onSelect={setSelectedOrgId}
        />
        
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : analytics ? (
          <Dashboard analytics={analytics} />
        ) : null}
      </main>
      
      {/* Footer Disclaimer */}
      <footer className="bg-amber-50 border-t border-amber-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-amber-800 text-sm text-center">
            <strong>⚠️ Prototype Demonstration:</strong> All data shown is synthetic and generated for demonstration purposes only. 
            This is not a clinical tool and should not be used for diagnostic or treatment decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
