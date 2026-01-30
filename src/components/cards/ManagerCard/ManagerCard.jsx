/**
 * ManagerCard - Gong-style card showing manager coaching effectiveness
 * Uses actual manager data: Sarah Chen, Marcus Jones, Jennifer Walsh, David Park
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { Tooltip, InfoIcon } from '@/components/ui';
import { useTimeframeStore, useAlertsStore } from '@/stores';
import { getTimeframeData, getManagerById } from '@/data';

// Trend indicator icon using Heroicons (circled arrows)
// direction: 'up' = green up arrow, 'down' = red down arrow, 'stable' = black right arrow
function TrendIcon({ direction }) {
  if (direction === 'up') {
    return (
      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    );
  }
  if (direction === 'down') {
    return (
      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    );
  }
  // Stable/default - right-facing circled arrow
  return (
    <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

// Determine icon direction based on metric value
// Quota: >= 100% = up (green), < 80% = down (red), else stable (black)
// Coaching: >= 75% = up (green), < 50% = down (red), else stable (black)
function getQuotaTrend(quota) {
  if (quota >= 100) return 'up';
  if (quota < 80) return 'down';
  return 'stable';
}

function getCoachingTrend(score) {
  if (score >= 75) return 'up';
  if (score < 50) return 'down';
  return 'stable';
}

export function ManagerCard({ managerId, onClick, variant = 'default' }) {
  const [managerAlertEnabled, setManagerAlertEnabled] = useState(true);
  const timeframe = useTimeframeStore(state => state.timeframe);
  const alertsEnabled = useAlertsStore(state => state.alertsEnabled);
  const timeframeData = getTimeframeData(timeframe);
  const manager = getManagerById(managerId);
  const managerMetrics = timeframeData?.managers?.[managerId];

  // Handle missing manager data
  if (!manager) {
    return (
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <span className="text-gray-400 text-sm">Manager not found: {managerId}</span>
      </div>
    );
  }

  // Use timeframe data when available so card reflects selected period
  const coachingScore = managerMetrics?.coaching_score ?? manager.coaching_score;
  const quotaAttainment = managerMetrics?.quota_attainment ?? manager.quota_attainment;

  // Calculate total sources from manager.sources
  const totalSources = manager.sources
    ? Object.values(manager.sources).reduce((sum, val) => sum + val, 0)
    : 0;

  const handleClick = () => onClick?.(managerId);

  const handleBellClick = (e) => {
    e.stopPropagation(); // Prevent card click
    const newState = !managerAlertEnabled;
    setManagerAlertEnabled(newState);
    if (newState) {
      toast.success(`Alerts for ${manager.name} turned on`);
    } else {
      toast.info(`Alerts for ${manager.name} turned off`);
    }
  };

  return (
    <div
      onClick={handleClick}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
      className="bg-white rounded-xl border border-gray-200 cursor-pointer transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative focus:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2"
      role="button"
      aria-label={`View details for ${manager.name}`}
    >
      {/* Info tooltip - top right */}
      <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
        <Tooltip content="Based on active coaching days, feedback on reviewed calls, scorecards, live attendance, and coverage across all AEs.">
          <span className="text-gray-400 hover:text-gray-600 cursor-help">
            <InfoIcon />
          </span>
        </Tooltip>
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">Sales Manager</p>
          <h3 className="text-3xl font-semibold text-gray-900">{manager.name}</h3>
        </div>

        {/* Metrics Row */}
        <div className="flex gap-8 mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">Team Quota</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{quotaAttainment}%</span>
              <TrendIcon direction={getQuotaTrend(quotaAttainment)} />
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">Coaching</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{coachingScore}%</span>
              <TrendIcon direction={getCoachingTrend(coachingScore)} />
            </div>
          </div>
        </div>

        {/* AI Summary - fixed height for alignment */}
        <p className="text-sm text-gray-600 leading-relaxed mb-6 h-[5rem]">
          {manager.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
            <span>Activities</span>
            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-medium">{totalSources}</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBellClick}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors focus-ring"
            >
              {alertsEnabled && managerAlertEnabled ? (
                <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.143 17.082a24.248 24.248 0 0 0 3.844.148m-3.844-.148a23.856 23.856 0 0 1-5.455-1.31 8.964 8.964 0 0 0 2.3-5.542m3.155 6.852a3 3 0 0 0 5.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 0 0 3.536-1.003A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53" />
                </svg>
              )}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleClick(); }}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors focus-ring"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
