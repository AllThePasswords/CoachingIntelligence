/**
 * ManagerCard - Main dashboard card showing manager info, metrics, and AI summary
 * Composite component using Badge, MetricDisplay, and Zustand store
 *
 * Re-renders automatically when global timeframe changes
 */
import { Badge } from '@/components/ui';
import { MetricDisplay } from '@/components/display';
import { useTimeframeStore } from '@/stores';
import { getTimeframeData, getManagerById } from '@/data';

export function ManagerCard({ managerId, onClick, variant = 'border', gradient = false }) {
  // Selective subscription - only re-renders when timeframe changes
  const timeframe = useTimeframeStore(state => state.timeframe);

  // Get timeframe-specific metrics and base manager data
  const timeframeData = getTimeframeData(timeframe);
  const manager = getManagerById(managerId);
  const managerMetrics = timeframeData?.managers[managerId];

  // Handle missing data
  if (!manager || !managerMetrics) {
    return (
      <div className="bg-background-100 border border-border rounded-xl p-5 text-gray-400">
        Manager not found: {managerId}
      </div>
    );
  }

  // Determine trend from timeframe data
  const trend = managerMetrics.trend_vs_prior === 'stable' ? 'steady' : managerMetrics.trend_vs_prior;

  // Variant-specific styling - when gradient is true, inner card needs adjusted rounding
  const innerRounding = gradient ? 'rounded-[calc(0.75rem-2px)]' : 'rounded-xl';
  const variantClasses = variant === 'shadow'
    ? `bg-background-100 ${innerRounding} p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]`
    : `bg-background-100 border border-border ${innerRounding} p-5`;

  const handleClick = () => {
    if (onClick) {
      onClick(managerId);
    }
  };

  const cardContent = (
    <div className={variantClasses}>
      {/* Header row */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground tracking-tight">{manager.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{manager.region} Region</p>
        </div>
        <Badge trend={trend} />
      </div>

      {/* Metrics row */}
      <div className="flex gap-8 mb-5">
        <MetricDisplay
          label="Attainment"
          value={manager.quota_attainment}
          unit="%"
          tooltip="Team quota attainment vs. target"
        />
        <MetricDisplay
          label="Coaching"
          value={managerMetrics.coaching_score}
          unit="%"
          tooltip="Calls reviewed, commented, or scored"
        />
      </div>

      {/* AI Summary */}
      <p className="text-[13px] text-gray-500 leading-relaxed mb-5">
        {manager.summary}
      </p>

      {/* Action Button - Geist style */}
      <button
        onClick={handleClick}
        className="h-10 px-4 bg-foreground text-background-100 rounded-md text-sm font-medium transition-all hover:bg-gray-700 active:scale-[0.98]"
      >
        View Details
      </button>
    </div>
  );

  // Wrap with gradient border if enabled
  if (gradient) {
    return (
      <div className="p-0.5 bg-gradient-to-r from-[#ff0080] to-[#f81ce5] rounded-xl">
        {cardContent}
      </div>
    );
  }

  return cardContent;
}
