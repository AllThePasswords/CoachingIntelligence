/**
 * Dashboard - Gong-style coaching effectiveness page
 *
 * Features:
 * - Page header with title and description
 * - Filter row with team, timeframe, and call type selectors
 * - 4-column grid for manager cards
 */
import { useNavigate } from 'react-router';
import { ManagerCard } from '@/components/cards';
import { TimeframeToggle } from '@/components/input';
import { managers } from '@/data';
import { useTimeframeStore } from '@/stores';

// Dropdown selector component
function FilterSelect({ label, value, icon }) {
  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 min-w-[180px]">
      {icon && <span className="text-gray-400">{icon}</span>}
      <div className="flex-1">
        <span className="text-sm text-gray-700">{value}</span>
      </div>
      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const timeframe = useTimeframeStore(state => state.timeframe);

  const handleCardClick = (managerId) => {
    navigate(`/manager/${managerId}`);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Coaching Effectiveness</h1>
        <p className="text-sm text-gray-500">Detect misalignment early and protect revenue leakage</p>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-4 mb-6">
        <FilterSelect
          value="Ryan Jackson's Team"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <FilterSelect
          value={`Last ${timeframe} days`}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <FilterSelect
          value="External calls"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
        />
        <div className="ml-auto">
          <TimeframeToggle />
        </div>
      </div>

      {/* Team Name */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ann Martinez's Team</h2>

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
