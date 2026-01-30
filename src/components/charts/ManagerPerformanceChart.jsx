/**
 * ManagerPerformanceChart - Line chart showing daily coaching activities over time
 * Line rises on active days, drops to 0 on inactive days.
 * Hover on line shows detailed activity card with pointer arrow.
 * Driven by master timeframe: shows data up to selected period (30/60/90 days).
 */
import { useState, useRef, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTimeframeStore } from '@/stores';
import { InsightSection } from '@/components/sections';
import { managers } from '@/data/managers';
import { feedbackLog } from '@/data/feedback';

const TOOLTIP_PROXIMITY_PX = 30;

// Manager colors - using distinct, accessible colors
const MANAGER_COLORS = {
  MGR001: '#0070f3', // Blue - Sarah Chen
  MGR002: '#7928ca', // Violet - Marcus Jones
  MGR003: '#f5a623', // Warning/Orange - Jennifer Walsh
  MGR004: '#ee0000', // Error/Red - David Park
};

function formatDateShort(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateFull(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function toDateKey(d) {
  return d.toISOString().slice(0, 10);
}

// Deterministic pseudo-random based on seed (consistent across renders)
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Build a map of activities per manager per day from feedbackLog
function buildActivityMap() {
  const map = {}; // { managerId: { dateKey: count } }
  feedbackLog.forEach((f) => {
    if (!map[f.manager_id]) map[f.manager_id] = {};
    if (!map[f.manager_id][f.date]) map[f.manager_id][f.date] = 0;
    map[f.manager_id][f.date] += 1;
  });
  return map;
}

// One point per day for the selected period (30, 60, or 90 days).
// Line shows activity with organic variation - not perfectly predictable patterns.
function prepareChartData(selectedTimeframe) {
  const days = Number(selectedTimeframe) || 30;
  if (!feedbackLog || !managers.length) return [{ period: '—', dateLabel: '—', dateKey: '' }];

  const activityMap = buildActivityMap();
  // Use fixed reference date to match mock data (Jan 30, 2026)
  const end = new Date('2026-01-30');

  // Track current line value per manager (starts at 0, decays gradually)
  const currentValue = {};
  // Different base decay rates per manager for variety
  const decayRates = {};
  managers.forEach((m) => {
    currentValue[m.id] = 0;
    // Base decay rate varies by manager (0.25 to 0.55)
    decayRates[m.id] = 0.25 + seededRandom(hashString(m.id)) * 0.3;
  });

  return Array.from({ length: days }, (_, i) => {
    const dayFromStart = i + 1; // 1 to N (oldest to newest)
    const date = new Date(end);
    date.setDate(date.getDate() - (days - dayFromStart));
    const dateLabel = formatDateFull(date);
    const dateKey = toDateKey(date);
    const data = { period: formatDateShort(date), dateLabel, dateKey };

    managers.forEach((manager) => {
      // Get actual activities for this day from feedback log
      const baseActivities = activityMap[manager.id]?.[dateKey] || 0;

      // Add deterministic noise to the day's seed
      const daySeed = hashString(manager.id + dateKey);
      const noise = seededRandom(daySeed);

      if (baseActivities > 0) {
        // Activity day: add some variation (+/- 0.5) to break up identical peaks
        const variation = (noise - 0.5) * 1.0;
        currentValue[manager.id] = baseActivities + variation;
      } else {
        // No activity: decay with variable rate
        // Add day-specific variation to decay (0.7x to 1.3x base rate)
        const decayVariation = 0.7 + noise * 0.6;
        const todayDecay = decayRates[manager.id] * decayVariation;
        currentValue[manager.id] = Math.max(0, currentValue[manager.id] - todayDecay);

        // Occasionally add small "background" activity for active managers
        if (manager.id === 'MGR001' && noise > 0.85) {
          currentValue[manager.id] = Math.max(currentValue[manager.id], 0.3 + noise * 0.4);
        } else if (manager.id === 'MGR002' && noise > 0.9) {
          currentValue[manager.id] = Math.max(currentValue[manager.id], 0.2 + noise * 0.3);
        }
      }

      data[`${manager.id}_coaching`] = Math.max(0, currentValue[manager.id]);
      data[`${manager.id}_activities`] = baseActivities;
    });

    return data;
  });
}

// Activities for a manager on a given day: type + AE from feedback log
function getActivitiesForDay(managerId, dateKey) {
  return feedbackLog
    .filter((f) => f.manager_id === managerId && f.date === dateKey)
    .map((f) => {
      let type = f.type === 'scorecard' ? 'Scorecard' : 'Comment';
      if (f.attended) type += ' (attended)';
      return { type, ae_name: f.ae_name };
    });
}

// Hover card with pointer arrow and activity details
function HoverCard({ active, payload, label, coordinate, hoveredManagerId, managerColors, mouseY, chartHeight, yAxisMax, yAxisMin = -1 }) {
  if (!active || !payload?.length || !label) return null;
  if (mouseY == null || !coordinate) return null;

  const dataRow = payload[0].payload;
  const suffix = '_coaching';

  // Find the closest manager's line to the cursor
  let closestManagerId = null;
  let closestDist = Infinity;

  // Chart area margins from LineChart
  const chartAreaTop = 20;
  const chartAreaBottom = 10;
  const chartAreaHeight = chartHeight - chartAreaTop - chartAreaBottom;
  const yRange = yAxisMax - yAxisMin;

  for (const entry of payload) {
    const dataKey = entry.dataKey;
    if (!dataKey.endsWith(suffix)) continue;

    const managerId = dataKey.replace(suffix, '');
    const value = entry.value;
    if (value == null) continue;

    const pixelY = chartAreaTop + ((yAxisMax - value) / yRange) * chartAreaHeight;

    const dist = Math.abs(mouseY - pixelY);
    if (dist < closestDist) {
      closestDist = dist;
      closestManagerId = managerId;
    }
  }

  // If nothing is close enough, don't show
  if (closestDist > TOOLTIP_PROXIMITY_PX || !closestManagerId) return null;

  // Use the closest manager (ignore hoveredManagerId for accuracy)
  const managerId = closestManagerId;
  const manager = managers.find((m) => m.id === managerId);
  const name = manager?.name || managerId;
  const color = managerColors[managerId] ?? '#666';
  const dateKey = dataRow.dateKey;
  const dateDisplay = dataRow.dateLabel ?? label;
  const activities = getActivitiesForDay(managerId, dateKey);

  return (
    <div
      className="relative"
      style={{
        animation: 'hover-card-open 0.15s ease-out forwards',
      }}
    >
      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="font-medium text-gray-900">{name}</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-600 text-sm">{dateDisplay}</span>
        </div>

        {/* Activities */}
        <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1.5">Activities that day</div>
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500">No activities recorded.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {activities.map((a, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span className="text-gray-600">{a.type}</span>
                <span className="font-medium text-gray-900">{a.ae_name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pointer arrow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
        style={{
          bottom: '-8px',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid white',
          filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))',
        }}
      />
    </div>
  );
}

// Legend: manager colors
function CustomLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {managers.map((manager) => (
        <div key={manager.id} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: MANAGER_COLORS[manager.id] }}
          />
          <span className="text-sm text-gray-600">{manager.name}</span>
        </div>
      ))}
    </div>
  );
}

export function ManagerPerformanceChart() {
  const [hoveredManagerId, setHoveredManagerId] = useState(null);
  const [mouseY, setMouseY] = useState(null);
  const chartRef = useRef(null);
  const timeframe = useTimeframeStore((s) => s.timeframe);
  const data = prepareChartData(timeframe);

  // Calculate dynamic Y-axis max based on highest activities
  const maxActivities = data.reduce((max, row) => {
    managers.forEach((m) => {
      const val = row[`${m.id}_coaching`] || 0;
      if (val > max) max = val;
    });
    return max;
  }, 0);
  // Round up to a nice number for the Y-axis (at least 5)
  const yAxisMax = Math.max(5, Math.ceil(maxActivities / 5) * 5);

  const handleChartMouseMove = useCallback((e) => {
    const el = chartRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMouseY(e.clientY - rect.top);
  }, []);

  const handleChartMouseLeave = useCallback(() => {
    setHoveredManagerId(null);
    setMouseY(null);
  }, []);

  return (
    <InsightSection title="Coaching Activity Trend">
      <style>{`
        @keyframes hover-card-open {
          from { opacity: 0; transform: scale(0.95) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      <div
        ref={chartRef}
        className="w-full"
        onMouseMove={handleChartMouseMove}
        onMouseLeave={handleChartMouseLeave}
      >
        <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
          <XAxis
            dataKey="period"
            tick={{ fill: '#666666', fontSize: 11 }}
            axisLine={{ stroke: '#eaeaea' }}
            interval={Math.max(0, Math.floor((data.length - 1) / 8))}
          />
          <YAxis
            domain={[-1, yAxisMax]}
            tick={{ fill: '#666666', fontSize: 12 }}
            axisLine={{ stroke: '#eaeaea' }}
            allowDataOverflow={false}
          />
          <Tooltip
            content={(props) => (
              <HoverCard
                {...props}
                hoveredManagerId={hoveredManagerId}
                managerColors={MANAGER_COLORS}
                mouseY={mouseY}
                chartHeight={350}
                yAxisMax={yAxisMax}
              />
            )}
            shared={true}
            animationDuration={0}
            cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
            allowEscapeViewBox={{ x: false, y: true }}
            wrapperStyle={{ pointerEvents: 'none' }}
          />

          {managers.map((manager) => (
            <Line
              key={`${manager.id}_coaching`}
              type="monotone"
              dataKey={`${manager.id}_coaching`}
              stroke={MANAGER_COLORS[manager.id]}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 6,
                fill: MANAGER_COLORS[manager.id],
                stroke: MANAGER_COLORS[manager.id],
                strokeWidth: 2,
              }}
              isAnimationActive={false}
              name={`${manager.name} Coaching`}
              onMouseEnter={() => setHoveredManagerId(manager.id)}
              onMouseLeave={() => setHoveredManagerId(null)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
        <CustomLegend />
      </div>
    </InsightSection>
  );
}
