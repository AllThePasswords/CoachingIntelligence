/**
 * InsightSection - Titled section container with optional rating badge
 * Used on Manager Detail pages for each coaching dimension
 *
 * Children can be text, lists, charts, or other components
 */
import { Badge } from '@/components/ui';

// Map rating values to Badge trend values
const ratingToTrend = {
  improving: 'improving',
  declining: 'declining',
  steady: 'steady'
};

export function InsightSection({ title, rating, children, className = '' }) {
  const trend = ratingToTrend[rating];

  return (
    <section className={`bg-background-100 border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h3 className="text-base font-semibold text-foreground tracking-tight">
          {title}
        </h3>
        {trend && <Badge trend={trend} />}
      </div>

      {/* Content area */}
      <div className="p-6">
        {children}
      </div>
    </section>
  );
}
