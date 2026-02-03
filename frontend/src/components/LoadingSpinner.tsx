// ============================================
// LOADING SPINNER COMPONENT
// ============================================

import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-500 text-sm">Loading analytics...</p>
    </div>
  );
}
