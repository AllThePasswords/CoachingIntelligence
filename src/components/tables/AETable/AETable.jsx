/**
 * AETable - Display AE coaching data for a manager
 *
 * Shows each AE with quota, coaching metrics, and marked-as-feedback-given
 * Simple semantic table - no library needed for 4-16 rows
 */
import { getAEsByManager } from '@/data';

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
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Calls with feedback</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Calls Attended</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Scorecards</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Calls with comments</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Marked as feedback given</th>
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
              <td className="py-3 px-4 text-gray-700">
                {ae.comments}
              </td>
              <td className="py-3 px-4 text-gray-700">
                {ae.comments}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
