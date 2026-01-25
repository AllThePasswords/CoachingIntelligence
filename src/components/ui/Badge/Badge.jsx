import { TrendArrow } from '../TrendArrow';

/**
 * Badge - Status badge with trend icon
 * Displays improving/declining/steady states with appropriate colors
 *
 * Styling matches App.jsx Geist-style badge patterns
 */

const trendConfig = {
  improving: {
    className: 'bg-success/10 text-success',
    direction: 'up',
    label: 'Improving'
  },
  declining: {
    className: 'bg-error/10 text-error',
    direction: 'down',
    label: 'Declining'
  },
  steady: {
    className: 'bg-gray-100 text-foreground',
    direction: 'steady',
    label: 'Steady'
  }
};

export function Badge({ trend, showIcon = true }) {
  const config = trendConfig[trend] || trendConfig.steady;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${config.className}`}>
      {showIcon && <TrendArrow direction={config.direction} />}
      {config.label}
    </span>
  );
}
