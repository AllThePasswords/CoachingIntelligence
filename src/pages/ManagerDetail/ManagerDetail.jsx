/**
 * ManagerDetail - Detail page for individual manager
 *
 * Hero section displays:
 * - Manager name and region
 * - Key metrics (attainment, coaching score)
 * - AI-generated headline summary
 * - Timeframe toggle for metrics
 * - Back navigation to dashboard
 */
import { useParams, Link } from 'react-router';
import { getManagerById, getSummaryByManager, getTimeframeData } from '@/data';
import { TimeframeToggle } from '@/components/input';
import { useTimeframeStore } from '@/stores';

export function ManagerDetail() {
  const { managerId } = useParams();
  const manager = getManagerById(managerId);

  // Timeframe-aware data
  const timeframe = useTimeframeStore(state => state.timeframe);
  const timeframeData = getTimeframeData(timeframe);

  // Get AI summary for headline
  const summary = getSummaryByManager(managerId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        to="/"
        className="text-sm text-gray-500 hover:text-foreground mb-4 inline-block"
      >
        &larr; Back to Dashboard
      </Link>

      {!manager ? (
        // Manager not found state
        <div className="mt-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Manager not found
          </h1>
          <p className="text-gray-500">
            No manager found with ID: {managerId}
          </p>
        </div>
      ) : (
        // Manager found - show hero section
        <div className="mt-4">
          {/* Row 1: Manager name + TimeframeToggle */}
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {manager.name}
            </h1>
            <TimeframeToggle />
          </div>

          {/* Row 2: Region */}
          <p className="text-gray-500 mb-6">
            {manager.region} Region
          </p>

          {/* Row 3: Metrics row */}
          <div className="flex gap-8 mt-6">
            {/* Attainment */}
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                Attainment
              </div>
              <div className="text-2xl font-bold">
                {manager.quota_attainment}%
              </div>
            </div>

            {/* Coaching Score */}
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                Coaching Score
              </div>
              <div className="text-2xl font-bold">
                {timeframeData?.managers?.[managerId]?.coaching_score ?? manager.coaching_score}%
              </div>
            </div>
          </div>

          {/* Row 4: AI headline */}
          {summary && (
            <p className="mt-6 text-lg text-gray-700">
              {summary.headline}
            </p>
          )}

          {/* Insight sections will be added in Plan 04-02 */}
          <div className="mt-8 space-y-6">
            <p className="text-sm text-gray-400 p-4 bg-background-100 border border-border rounded-lg">
              Insight sections coming in Plan 04-02
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
