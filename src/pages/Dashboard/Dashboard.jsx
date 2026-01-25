/**
 * Dashboard - Main page showing all managers in a grid layout
 *
 * Features:
 * - Responsive 2-column grid for manager cards
 * - TimeframeToggle in header for global timeframe switching
 * - Click navigation to manager detail pages
 */
import { useNavigate } from 'react-router';
import { ManagerCard } from '@/components/cards';
import { TimeframeToggle } from '@/components/input';
import { managers } from '@/data';

export function Dashboard() {
  const navigate = useNavigate();

  const handleCardClick = (managerId) => {
    navigate(`/manager/${managerId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header row */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Team Overview</h1>
        <TimeframeToggle />
      </div>

      {/* Manager card grid - responsive 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {managers.map((manager) => (
          <ManagerCard
            key={manager.id}
            managerId={manager.id}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
}
