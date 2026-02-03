// ============================================
// ORGANIZATION SELECTOR COMPONENT
// ============================================

import React from 'react';
import { Building2 } from 'lucide-react';
import { Organization } from '../types';

interface Props {
  organizations: Organization[];
  selectedOrgId: string | null;
  onSelect: (orgId: string) => void;
}

export function OrganizationSelector({ organizations, selectedOrgId, onSelect }: Props) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Organization
      </label>
      <div className="flex flex-wrap gap-3">
        {organizations.map((org) => (
          <button
            key={org.orgId}
            onClick={() => onSelect(org.orgId)}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all
              ${selectedOrgId === org.orgId
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <Building2 className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">{org.name}</div>
              <div className="text-xs opacity-75">{org.industry} • {org.enrolledEmployees.toLocaleString()} enrolled</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
