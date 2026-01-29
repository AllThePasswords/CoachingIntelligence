/**
 * ManagerPerformanceChart - 90-day line chart showing coaching score and quota attainment
 * Displays pooled trends for all 4 managers with distinct colors
 */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { timeframes } from '@/data/timeframes';
import { managers } from '@/data/managers';

// Manager colors - using distinct, accessible colors
const MANAGER_COLORS = {
  MGR001: '#0070f3', // Blue - Sarah Chen
  MGR002: '#7928ca', // Violet - Marcus Jones
  MGR003: '#f5a623', // Warning/Orange - Jennifer Walsh
  MGR004: '#ee0000', // Error/Red - David Park
};

// Prepare chart data from timeframes
function prepareChartData() {
  const periods = ['30', '60', '90'];

  return periods.map((period) => {
    const data = { period: `${period} days` };

    managers.forEach((manager) => {
      const tfData = timeframes[period].managers[manager.id];
      // Create pooled score (average of coaching score and quota attainment)
      data[`${manager.id}_coaching`] = tfData.coaching_score;
      data[`${manager.id}_quota`] = tfData.quota_attainment;
      data[`${manager.id}_pooled`] = Math.round(
        (tfData.coaching_score + tfData.quota_attainment) / 2
      );
    });

    return data;
  });
}

// Custom tooltip component
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload) return null;

  // Group by manager
  const managerData = {};
  payload.forEach((entry) => {
    const [managerId, metric] = entry.dataKey.split('_');
    if (!managerData[managerId]) {
      const manager = managers.find((m) => m.id === managerId);
      managerData[managerId] = {
        name: manager?.name || managerId,
        color: MANAGER_COLORS[managerId],
        coaching: null,
        quota: null,
      };
    }
    if (metric === 'coaching') managerData[managerId].coaching = entry.value;
    if (metric === 'quota') managerData[managerId].quota = entry.value;
  });

  return (
    <div className="bg-background-100 border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {Object.entries(managerData).map(([id, data]) => (
        <div key={id} className="mb-2 last:mb-0">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <span className="font-medium text-sm">{data.name}</span>
          </div>
          <div className="ml-5 text-xs text-gray-500">
            <div>Coaching: {data.coaching}%</div>
            <div>Quota: {data.quota}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Custom legend component
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
      <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
        <span className="w-4 h-0.5 bg-gray-400" />
        <span className="text-xs text-gray-500">Solid = Coaching</span>
        <span className="w-4 h-0.5 bg-gray-400 border-dashed border-t-2 border-gray-400" style={{ borderStyle: 'dashed' }} />
        <span className="text-xs text-gray-500">Dashed = Quota</span>
      </div>
    </div>
  );
}

export function ManagerPerformanceChart() {
  const data = prepareChartData();

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
          <XAxis
            dataKey="period"
            tick={{ fill: '#666666', fontSize: 12 }}
            axisLine={{ stroke: '#eaeaea' }}
          />
          <YAxis
            domain={[0, 120]}
            tick={{ fill: '#666666', fontSize: 12 }}
            axisLine={{ stroke: '#eaeaea' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Coaching score lines (solid) */}
          {managers.map((manager) => (
            <Line
              key={`${manager.id}_coaching`}
              type="monotone"
              dataKey={`${manager.id}_coaching`}
              stroke={MANAGER_COLORS[manager.id]}
              strokeWidth={2}
              dot={{ fill: MANAGER_COLORS[manager.id], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name={`${manager.name} Coaching`}
            />
          ))}

          {/* Quota attainment lines (dashed) */}
          {managers.map((manager) => (
            <Line
              key={`${manager.id}_quota`}
              type="monotone"
              dataKey={`${manager.id}_quota`}
              stroke={MANAGER_COLORS[manager.id]}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: MANAGER_COLORS[manager.id], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name={`${manager.name} Quota`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <CustomLegend />
    </div>
  );
}
