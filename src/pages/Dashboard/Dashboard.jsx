/**
 * Dashboard - Gong-style coaching effectiveness page
 *
 * Features:
 * - Page header with title and description
 * - Filter row with team, timeframe (master), and call type selectors
 * - All content (insight, chart, cards) driven by selected timeframe
 * - 4-column grid for manager cards
 * Note: Chat is only available on individual manager pages
 */
import { useNavigate } from 'react-router';
import { ManagerCard } from '@/components/cards';
import { CoachingInsight, InsightSection } from '@/components/sections';
import { FilterRow } from '@/components/filters';
import { ManagerPerformanceChart } from '@/components/charts';
import { useTimeframeStore } from '@/stores';
import { managers, getTimeframeData } from '@/data';

// Period-specific intro so each timeframe clearly loads a different insight
const PERIOD_INTRO = {
  '30': 'In the last 30 days,',
  '60': 'Over the past 60 days,',
  '90': 'Across the past 90 days,',
};

// Build insight copy from timeframe data for the selected period only
function getInsightForTimeframe(timeframe) {
  const tf = getTimeframeData(timeframe);
  const days = timeframe === '30' ? 30 : timeframe === '60' ? 60 : 90;
  const intro = PERIOD_INTRO[timeframe] ?? `In the last ${days} days,`;

  if (!tf?.managers) {
    return (
      <>
        {intro} <strong>1 manager requires immediate intervention.</strong> David Park's team quota is the lowest across all regions. Compare to Sarah Chen's team.
      </>
    );
  }

  const david = tf.managers.MGR004;
  const sarah = tf.managers.MGR001;
  const davidQuota = david?.quota_attainment ?? 62;
  const sarahActivities = sarah?.calls_with_feedback ?? 112;

  return (
    <>
      {intro} <strong>1 manager requires immediate intervention.</strong> David Park's team quota ({davidQuota}%) is the lowest across all regions and correlates directly with coaching absence. Three of four AEs have received <strong>zero meaningful coaching</strong> in {days} days. Compare to Sarah Chen's team, where all 4 AEs are above quota with {sarahActivities} coaching activities in the same period.
    </>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const timeframe = useTimeframeStore((s) => s.timeframe);

  const handleCardClick = (managerId) => {
    navigate(`/manager/${managerId}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Coaching Intelligence</h1>
        <p className="text-sm text-gray-500">Detect misalignment early and protect revenue leakage</p>
      </div>

      {/* Filter Row - timeframe dropdown drives all content */}
      <FilterRow />

      {/* Coaching Intelligence Insight - reflects selected timeframe */}
      <div className="mb-6">
        <CoachingInsight>
          {getInsightForTimeframe(timeframe)}
        </CoachingInsight>
      </div>

      {/* Manager card grid - metrics for selected timeframe */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {managers.map((manager) => (
          <ManagerCard
            key={manager.id}
            managerId={manager.id}
            onClick={handleCardClick}
            gradient
          />
        ))}
      </div>

      {/* Performance Chart - shows data up to selected period */}
      <div className="mb-6">
        <ManagerPerformanceChart />
      </div>
    </div>
  );
}
