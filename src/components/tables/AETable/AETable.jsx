/**
 * AETable - Display AE coaching data for a manager
 *
 * Shows each AE with quota, coaching metrics, and flag status
 * Simple semantic table - no library needed for 4-16 rows
 */
import { getAEsByManager } from '@/data';

// Flag styling using Geist semantic tokens
const flagStyles = {
  undercoached: 'bg-warning/10 text-warning',
  critical: 'bg-error/10 text-error'
};

const flagLabels = {
  undercoached: 'Undercoached',
  critical: 'Critical'
};

export function AETable({ managerId }) {
  const aes = getAEsByManager(managerId);

  if (!aes || aes.length === 0) {
    return (
      <div className="text-gray-500 text-sm py-4">
        No AEs found for this manager.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">AE Name</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Quota %</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Calls Listened</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Calls with Comments</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Calls Attended</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Scorecards</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Feedback</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Flag</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {aes.map((ae) => (
            <tr key={ae.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 font-medium text-gray-900">{ae.name}</td>
              <td className="py-3 px-4 text-gray-700">{ae.quota}%</td>
              <td className="py-3 px-4 text-gray-700">{ae.calls_coached}</td>
              <td className="py-3 px-4 text-gray-700">{ae.comments}</td>
              <td className="py-3 px-4 text-gray-700">{ae.live_attended}</td>
              <td className="py-3 px-4 text-gray-700">{ae.scorecards}</td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {ae.last_feedback_date || 'Never'}
              </td>
              <td className="py-3 px-4">
                {ae.flag && (
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${flagStyles[ae.flag]}`}>
                    {flagLabels[ae.flag]}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
