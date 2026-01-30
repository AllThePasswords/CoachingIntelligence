/**
 * ManagerPerformanceChart - Line chart showing coaching score and quota attainment
 * Driven by master timeframe: shows data up to selected period (30/60/90 days).
 * Filter to show either Team Quota or Coaching (one at a time).
 * Tooltip only within ~30px of line; stacked layout. Click line → day-detail modal.
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
import { timeframes } from '@/data/timeframes';
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

// Seeded pseudo-random for small daily jitter (deterministic)
function seededRandom(seed) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Small daily variation for visual smoothness (±3 points max)
function dailyVariation(dayIndex, managerId, seed = 0) {
  const s = managerId.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + seed;
  const noise = seededRandom(s + dayIndex * 7) * 2 - 1; // -1 to 1
  return Math.round(noise * 3);
}

function clamp(value, min, max) {
  return Math.min(Math.max(Math.round(value), min), max);
}

function formatDateShort(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateFull(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function toDateKey(d) {
  return d.toISOString().slice(0, 10);
}

// Interpolate value between timeframe snapshots based on day position
// Day 1 = oldest (90 days ago), Day 90 = most recent (today)
function getInterpolatedValue(managerId, dayFromStart, totalDays, metric) {
  const tf90 = timeframes['90']?.managers[managerId];
  const tf60 = timeframes['60']?.managers[managerId];
  const tf30 = timeframes['30']?.managers[managerId];

  if (!tf90 || !tf60 || !tf30) return 0;

  // Values at each snapshot (day 1, day 30, day 60, day 90 from start)
  // 90-day snapshot represents cumulative at day 1-90, but the "state" at day ~1-30
  // We interpret: tf90 = state during days 1-30, tf60 = state during days 31-60, tf30 = state during days 61-90
  const val90 = tf90[metric] ?? 0; // oldest period (days 1-30)
  const val60 = tf60[metric] ?? 0; // middle period (days 31-60)
  const val30 = tf30[metric] ?? 0; // most recent (days 61-90)

  if (totalDays <= 30) {
    // Only showing last 30 days - use tf30 with small variation
    return val30;
  }

  if (totalDays <= 60) {
    // Showing 60 days: interpolate between tf60 (start) and tf30 (end)
    const t = dayFromStart / totalDays;
    return val60 + (val30 - val60) * t;
  }

  // Showing 90 days: 3 segments
  if (dayFromStart <= 30) {
    // First third: interpolate from tf90 toward tf60
    const t = dayFromStart / 30;
    return val90 + (val60 - val90) * t;
  } else if (dayFromStart <= 60) {
    // Middle third: interpolate from tf60 toward tf30
    const t = (dayFromStart - 30) / 30;
    return val60 + (val30 - val60) * t;
  } else {
    // Last third: stay around tf30 value
    const t = (dayFromStart - 60) / 30;
    return val30; // most recent period
  }
}

// One point per day for the selected period (30, 60, or 90 days).
function prepareChartData(selectedTimeframe) {
  const days = Number(selectedTimeframe) || 30;
  if (!timeframes['30']?.managers) return [{ period: '—', dateLabel: '—', dateKey: '' }];

  const end = new Date();
  return Array.from({ length: days }, (_, i) => {
    const dayFromStart = i + 1; // 1 to N (oldest to newest)
    const date = new Date(end);
    date.setDate(date.getDate() - (days - dayFromStart));
    const dateLabel = formatDateFull(date);
    const dateKey = toDateKey(date);
    const data = { period: formatDateShort(date), dateLabel, dateKey };

    managers.forEach((manager) => {
      const coachingBase = getInterpolatedValue(manager.id, dayFromStart, days, 'coaching_score');
      const quotaBase = getInterpolatedValue(manager.id, dayFromStart, days, 'quota_attainment');

      // Add small daily jitter for realism
      const vCo = dailyVariation(i, manager.id, 0);
      const vQu = dailyVariation(i, manager.id, 1);
      const vAct = dailyVariation(i, manager.id, 2);

      // Activities based on feedback rate for that period
      const tf30 = timeframes['30']?.managers[manager.id];
      const baseAct = Math.max(0, Math.round((tf30?.calls_with_feedback || 0) / 30) + vAct);

      data[`${manager.id}_coaching`] = clamp(coachingBase + vCo, 0, 120);
      data[`${manager.id}_quota`] = clamp(quotaBase + vQu, 0, 120);
      data[`${manager.id}_activities`] = baseAct;
    });

    return data;
  });
}

// Tooltip: stacked layout; only show when cursor within TOOLTIP_PROXIMITY_PX of the CLOSEST line
function CustomTooltip({ active, payload, label, metric, hoveredManagerId, managerColors, mouseY, coordinate, chartHeight }) {
  if (!active || !payload?.length || !label) return null;
  if (mouseY == null) return null;

  const dataRow = payload[0].payload;
  const suffix = metric === 'coaching' ? '_coaching' : '_quota';

  // Find the closest manager's line to the cursor by checking all lines
  let closestManagerId = null;
  let closestDist = Infinity;

  // Chart Y domain is 0-120, map mouseY to value space
  // payload contains all the lines at this X position
  for (const entry of payload) {
    const dataKey = entry.dataKey;
    if (!dataKey.endsWith(suffix)) continue;

    const managerId = dataKey.replace(suffix, '');
    const value = entry.value;
    if (value == null) continue;

    // Convert value to pixel Y position (approximate)
    // Recharts coordinate system: top of chart area is y=0, bottom is chartHeight
    // Value 120 is at top (y ~ margin), value 0 is at bottom
    const chartAreaTop = 20; // top margin
    const chartAreaHeight = chartHeight - 30; // minus top/bottom margins
    const pixelY = chartAreaTop + ((120 - value) / 120) * chartAreaHeight;

    const dist = Math.abs(mouseY - pixelY);
    if (dist < closestDist) {
      closestDist = dist;
      closestManagerId = managerId;
    }
  }

  // If nothing is close enough, don't show tooltip
  if (closestDist > TOOLTIP_PROXIMITY_PX || !closestManagerId) return null;

  // Use hoveredManagerId if explicitly set (from dot hover), otherwise use closest
  const managerId = hoveredManagerId || closestManagerId;
  const manager = managers.find((m) => m.id === managerId);
  const name = manager?.name || managerId;
  const color = managerColors[managerId] ?? '#666';
  const activities = dataRow[`${managerId}_activities`] ?? 0;
  const quotaVal = dataRow[`${managerId}_quota`];

  const dateDisplay = dataRow.dateLabel ?? label;

  return (
    <div className="bg-background-100 border border-border rounded-md shadow-sm px-2.5 py-1.5 text-sm flex flex-col gap-0.5">
      <div className="font-medium text-foreground">{name}</div>
      <div className="text-gray-600">{dateDisplay}</div>
      {metric === 'coaching' ? (
        <div style={{ color }}>{activities} coaching {activities === 1 ? 'activity' : 'activities'}</div>
      ) : (
        <div style={{ color }}>Quota: {quotaVal != null ? quotaVal : '—'}%</div>
      )}
    </div>
  );
}

// Legend: manager colors only (metric shown by filter)
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

const DAY_DETAIL_KEYFRAMES = `
  @keyframes day-detail-open {
    from { opacity: 0; transform: translate(-50%, -98%) scale(0.98); }
    to { opacity: 1; transform: translate(-50%, -100%) scale(1); }
  }
`;

function DayDetailModal({ detail, onClose, managerColors }) {
  const managerId = detail?.managerId;
  const label = detail?.label;
  const dateKey = detail?.dateKey;
  const clickX = detail?.clickX ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const clickY = detail?.clickY ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  useEffect(() => {
    if (!detail) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [detail, onClose]);

  if (!detail) return null;

  const manager = managers.find((m) => m.id === managerId);
  const name = manager?.name ?? managerId ?? '';
  const color = managerColors?.[managerId] ?? '#666';
  const activities = dateKey ? getActivitiesForDay(managerId, dateKey) : [];

  return createPortal(
    <>
      <style>{DAY_DETAIL_KEYFRAMES}</style>
      <div
        role="dialog"
        aria-label={`Activities for ${name} on ${label}`}
        className="fixed z-50 w-[min(20rem,calc(100vw-2rem))] max-h-[80vh] overflow-auto rounded-lg bg-white shadow-lg border border-gray-200 p-4 origin-bottom"
        style={{
          left: clickX,
          top: clickY,
          animation: 'day-detail-open 0.18s ease-out forwards',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="font-medium text-gray-900">{name}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-600 text-sm">{label}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Activities that day</div>
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500">No activities recorded for this day.</p>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {activities.map((a, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span className="text-gray-600">{a.type}</span>
                <span className="font-medium text-gray-900">{a.ae_name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>,
    document.body
  );
}

// Clickable dot: opens day-detail modal on click; forwards hover for tooltip
function ClickableDot({ cx, cy, payload, dataKey, stroke, fill, strokeWidth, r, onClick, onHover, onHoverEnd, ...rest }) {
  const [managerId] = (dataKey || '').split('_');
  const handleClick = (e) => {
    e.stopPropagation();
    if (payload && managerId) onClick({
      managerId,
      label: payload.dateLabel ?? payload.period,
      dateKey: payload.dateKey,
      dataRow: payload,
      clickX: e.clientX,
      clickY: e.clientY,
    });
  };
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r ?? 6}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth ?? 2}
      onClick={handleClick}
      onMouseEnter={() => onHover?.(managerId)}
      onMouseLeave={() => onHoverEnd?.()}
      className="cursor-pointer"
      style={{ pointerEvents: 'all' }}
    />
  );
}

export function ManagerPerformanceChart() {
  const [metric, setMetric] = useState('coaching'); // 'coaching' | 'quota'
  const [hoveredManagerId, setHoveredManagerId] = useState(null);
  const [mouseY, setMouseY] = useState(null);
  const [dayDetail, setDayDetail] = useState(null);
  const chartRef = useRef(null);
  const timeframe = useTimeframeStore((s) => s.timeframe);
  const data = prepareChartData(timeframe);

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

  const metricToggle = (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setMetric('coaching')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          metric === 'coaching'
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Coaching
      </button>
      <button
        type="button"
        onClick={() => setMetric('quota')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          metric === 'quota'
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Team Quota
      </button>
    </div>
  );

  return (
    <InsightSection title="Coaching and Quota Trends" headerIcon={metricToggle}>
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
            domain={[0, 120]}
            tick={{ fill: '#666666', fontSize: 12 }}
            axisLine={{ stroke: '#eaeaea' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={(props) => (
              <CustomTooltip
                {...props}
                metric={metric}
                hoveredManagerId={hoveredManagerId}
                managerColors={MANAGER_COLORS}
                mouseY={mouseY}
                chartHeight={350}
              />
            )}
            shared={true}
            animationDuration={0}
            cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
          />

          {metric === 'coaching' &&
            managers.map((manager) => (
              <Line
                key={`${manager.id}_coaching`}
                type="monotone"
                dataKey={`${manager.id}_coaching`}
                stroke={MANAGER_COLORS[manager.id]}
                strokeWidth={2.5}
                dot={false}
                activeDot={(p) => (
                  <ClickableDot
                    {...p}
                    fill={MANAGER_COLORS[manager.id]}
                    stroke={MANAGER_COLORS[manager.id]}
                    strokeWidth={2}
                    r={6}
                    onClick={setDayDetail}
                    onHover={() => setHoveredManagerId(manager.id)}
                    onHoverEnd={() => setHoveredManagerId(null)}
                  />
                )}
                isAnimationActive={false}
                name={`${manager.name} Coaching`}
                onMouseEnter={() => setHoveredManagerId(manager.id)}
                onMouseLeave={() => setHoveredManagerId(null)}
              />
            ))}

          {metric === 'quota' &&
            managers.map((manager) => (
              <Line
                key={`${manager.id}_quota`}
                type="monotone"
                dataKey={`${manager.id}_quota`}
                stroke={MANAGER_COLORS[manager.id]}
                strokeWidth={2.5}
                dot={false}
                activeDot={(p) => (
                  <ClickableDot
                    {...p}
                    fill={MANAGER_COLORS[manager.id]}
                    stroke={MANAGER_COLORS[manager.id]}
                    strokeWidth={2}
                    r={6}
                    onClick={setDayDetail}
                    onHover={() => setHoveredManagerId(manager.id)}
                    onHoverEnd={() => setHoveredManagerId(null)}
                  />
                )}
                isAnimationActive={false}
                name={`${manager.name} Quota`}
                onMouseEnter={() => setHoveredManagerId(manager.id)}
                onMouseLeave={() => setHoveredManagerId(null)}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
        <CustomLegend />
      </div>

      <DayDetailModal
        detail={dayDetail}
        onClose={() => setDayDetail(null)}
        managerColors={MANAGER_COLORS}
      />
    </InsightSection>
  );
}
