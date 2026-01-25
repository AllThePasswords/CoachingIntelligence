/**
 * MetricDisplay - Shows a metric with label, value, unit, and optional tooltip
 * Extracted from App.jsx lines 194-207
 *
 * Uses Geist styling with tabular-nums for aligned numbers
 */
import { Tooltip, InfoIcon } from '@/components/ui';

export function MetricDisplay({ label, value, unit = '%', tooltip }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <p className="text-[11px] uppercase tracking-wider text-gray-400">{label}</p>
        {tooltip && (
          <Tooltip content={tooltip}>
            <span className="text-gray-300 hover:text-gray-500 cursor-help transition-colors">
              <InfoIcon />
            </span>
          </Tooltip>
        )}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold text-foreground tabular-nums">{value}</span>
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
    </div>
  );
}
