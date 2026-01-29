/**
 * Dashboard - Gong-style coaching effectiveness page
 *
 * Features:
 * - Page header with title and description
 * - Filter row with team, timeframe, and call type selectors
 * - 90-day performance chart showing coaching scores vs quota for all managers
 * - 4-column grid for manager cards
 * Note: Chat is only available on individual manager pages
 */
import { useNavigate } from 'react-router';
import { ManagerCard } from '@/components/cards';
import { CoachingInsight, InsightSection } from '@/components/sections';
import { FilterRow } from '@/components/filters';
import { ManagerPerformanceChart } from '@/components/charts';
import { managers } from '@/data';

export function Dashboard() {
  const navigate = useNavigate();

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

      {/* Filter Row */}
      <FilterRow />

      {/* Coaching Intelligence Insight */}
      <div className="mb-6">
        <CoachingInsight>
          <strong>1 manager requires immediate intervention.</strong> David Park's team quota (62%) is the lowest across all regions and correlates directly with coaching absence. Three of four AEs have received <strong>zero meaningful coaching</strong> in 30 days. Compare to Sarah Chen's team where all 4 AEs are above quota with 171 coaching activities in the same period.
        </CoachingInsight>
      </div>

      {/* 90-Day Performance Chart */}
      <div className="mb-6">
        <InsightSection title="90-Day Coaching & Quota Trends">
          <ManagerPerformanceChart />
        </InsightSection>
      </div>

      {/* Manager card grid - 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {managers.map((manager) => (
          <ManagerCard
            key={manager.id}
            managerId={manager.id}
            onClick={handleCardClick}
            gradient
          />
        ))}
      </div>
    </div>
  );
}
