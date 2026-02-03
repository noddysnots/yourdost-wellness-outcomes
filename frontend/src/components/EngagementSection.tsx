// ============================================
// ENGAGEMENT & DELIVERY SECTION
// Clearly labeled as CONTEXT, not Outcome
// ============================================

import React from 'react';
import { OrganizationAnalytics } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Users, MessageCircle, Video, Phone, Shuffle, AlertCircle } from 'lucide-react';

interface Props {
  analytics: OrganizationAnalytics;
}

const MODALITY_COLORS = {
  video: '#3B82F6',
  chat: '#10B981',
  phone: '#F59E0B',
  mixed: '#8B5CF6',
};

export function EngagementSection({ analytics }: Props) {
  const { engagement, organization } = analytics;

  // Prepare modality data for pie chart
  const modalityData = [
    { name: 'Video', value: engagement.modalitySplit.video, color: MODALITY_COLORS.video },
    { name: 'Chat', value: engagement.modalitySplit.chat, color: MODALITY_COLORS.chat },
    { name: 'Phone', value: engagement.modalitySplit.phone, color: MODALITY_COLORS.phone },
    { name: 'Mixed', value: engagement.modalitySplit.mixed, color: MODALITY_COLORS.mixed },
  ].filter(d => d.value > 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Engagement & Delivery</h3>
        </div>
        <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded font-medium border border-amber-200">
          CONTEXT, NOT OUTCOME
        </span>
      </div>
      
      {/* Context Explanation */}
      <div className="flex items-start gap-2 mb-6 p-3 bg-amber-50 rounded-lg border border-amber-100">
        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          Engagement metrics provide context for interpreting outcomes. High engagement does not guarantee clinical improvement, 
          and low engagement does not indicate program failure. These metrics help understand delivery patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Metrics */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Participation Overview</h4>
          <div className="space-y-4">
            {/* Enrollment */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Enrolled Employees</div>
                  <div className="text-xs text-gray-500">Out of {organization.totalEmployees.toLocaleString()} total</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{engagement.enrolledCount.toLocaleString()}</div>
                <div className="text-xs text-gray-500">
                  {((engagement.enrolledCount / organization.totalEmployees) * 100).toFixed(1)}% participation
                </div>
              </div>
            </div>

            {/* Engagement Rate */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Active Engagement</div>
                  <div className="text-xs text-gray-500">Had at least 1 session</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{engagement.engagementRate}%</div>
                <div className="text-xs text-gray-500">{engagement.engagedCount.toLocaleString()} users</div>
              </div>
            </div>

            {/* Average Sessions */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Avg Sessions/User</div>
                <div className="text-xs text-gray-500">Among engaged users</div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{engagement.avgSessionsPerUser}</div>
            </div>

            {/* Time to First Session */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Avg Time to First Session</div>
                <div className="text-xs text-gray-500">Days from enrollment</div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{engagement.avgTimeToFirstSession} days</div>
            </div>

            {/* Dropout Rate */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Dropout Rate</div>
                <div className="text-xs text-gray-500">Disengaged after starting</div>
              </div>
              <div className="text-2xl font-bold text-amber-600">{engagement.dropoutRate}%</div>
            </div>
          </div>
        </div>

        {/* Modality Distribution */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Delivery Modality Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modalityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {modalityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v} users`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Modality Legend */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
              <Video className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Video: {engagement.modalitySplit.video}</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Chat: {engagement.modalitySplit.chat}</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
              <Phone className="w-4 h-4 text-amber-600" />
              <span className="text-sm">Phone: {engagement.modalitySplit.phone}</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
              <Shuffle className="w-4 h-4 text-purple-600" />
              <span className="text-sm">Mixed: {engagement.modalitySplit.mixed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
