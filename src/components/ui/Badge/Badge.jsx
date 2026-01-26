import { TrendArrow } from '../TrendArrow';

/**
 * Badge - Status badge with trend icon
 * Displays improving/declining/steady states with appropriate colors
 *
 * Styling matches App.jsx Geist-style badge patterns
 */

const trendConfig = {
  improving: {
    bgClassName: 'bg-success/10',
    textClassName: 'text-success',
    direction: 'up',
    label: 'Improving'
  },
  declining: {
    bgClassName: 'bg-error/10',
    textClassName: 'text-error',
    direction: 'down',
    label: 'Declining'
  },
  steady: {
    bgClassName: 'bg-gray-100',
    textClassName: 'text-foreground',
    direction: 'steady',
    label: 'Steady'
  }
};

export function Badge({ trend, showIcon = true }) {
  const config = trendConfig[trend] || trendConfig.steady;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${config.bgClassName}`}>
      {showIcon && <TrendArrow direction={config.direction} />}
      <span className={config.textClassName}>{config.label}</span>
    </span>
  );
}
