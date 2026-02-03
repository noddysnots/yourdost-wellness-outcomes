// ============================================
// HEADER COMPONENT
// ============================================

import React from 'react';
import { Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Wellness Outcomes Platform</h1>
              <p className="text-sm text-gray-500">Corporate Mental Health Analytics</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              Demo Prototype
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
