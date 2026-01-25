// TimeframeToggle - Selector for 30/60/90 day timeframe views
// Connected to Zustand store for global state management
import { useTimeframeStore } from '@/stores';

export function TimeframeToggle() {
  // Use selective subscriptions for optimal re-render performance
  const timeframe = useTimeframeStore((state) => state.timeframe);
  const setTimeframe = useTimeframeStore((state) => state.setTimeframe);

  return (
    <div className="inline-flex gap-1 p-1 bg-gray-100 rounded-lg">
      {['30', '60', '90'].map((value) => (
        <button
          key={value}
          onClick={() => setTimeframe(value)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            timeframe === value
              ? 'bg-foreground text-background-100 shadow-sm'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          {value} Days
        </button>
      ))}
    </div>
  );
}
