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

export function InsightSection({ title, rating, headerIcon, children, className = '', transparent = false }) {
  const trend = ratingToTrend[rating];

  return (
    <section className={`${transparent ? 'bg-transparent' : 'bg-background-100 border border-border'} rounded-lg overflow-hidden ${className}`}>
      {/* Header bar: title left, icon/badge right */}
      <div className={`flex items-center justify-between ${transparent ? 'px-0 py-2 border-b border-gong-purple/20' : 'px-6 py-4 border-b border-border'}`}>
        <h3 className={`text-base font-semibold tracking-tight ${transparent ? 'text-gong-purple-dark' : 'text-foreground'}`}>
          {title}
        </h3>
        {headerIcon ?? (trend && <Badge trend={trend} />)}
      </div>

      {/* Content area */}
      <div className={transparent ? 'py-3 px-0' : 'p-6'}>
        {children}
      </div>
    </section>
  );
}
