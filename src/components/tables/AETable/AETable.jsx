/**
 * AETable - Display AE coaching data for a manager
 *
 * Columns:
 * - AE data: Name, Quota, Total calls (separated visually)
 * - Coaching types: Calls listened, Calls attended, Calls with scorecards,
 *   Calls with comments, Marked as feedback given, Calls with feedback
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

  // Calculate totals for the footer row
  const totals = aes.reduce(
    (acc, ae) => ({
      total_calls: acc.total_calls + (ae.total_calls || 0),
      calls_listened: acc.calls_listened + (ae.calls_listened || 0),
      calls_attended: acc.calls_attended + (ae.calls_attended || 0),
      scorecards: acc.scorecards + (ae.scorecards || 0),
      calls_with_comments: acc.calls_with_comments + (ae.calls_with_comments || 0),
      marked_as_feedback_given: acc.marked_as_feedback_given + (ae.marked_as_feedback_given || 0),
      calls_with_feedback: acc.calls_with_feedback + (ae.calls_with_feedback || 0),
    }),
    {
      total_calls: 0,
      calls_listened: 0,
      calls_attended: 0,
      scorecards: 0,
      calls_with_comments: 0,
      marked_as_feedback_given: 0,
      calls_with_feedback: 0,
    }
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">Name</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-[70px] text-right">Quota</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px] text-right pr-6">Total calls</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-[90px] text-right border-l border-gray-200">Call listened</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-[90px] text-right">Call attended</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-[110px] text-right">Calls with scorecards</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-[110px] text-right">Calls with comments</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-[130px] text-right">Marked as feedback given</th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-[110px] text-right">Calls with feedback</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {aes.map((ae) => (
            <tr key={ae.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 font-medium text-gray-900">{ae.name}</td>
              <td className="py-3 px-4 text-gray-700 text-right">{ae.quota}%</td>
              <td className="py-3 px-4 text-gray-700 text-right pr-6">{ae.total_calls}</td>
              <td className="py-3 px-4 text-gray-700 text-right border-l border-gray-200">{ae.calls_listened}</td>
              <td className="py-3 px-4 text-gray-700 text-right">{ae.calls_attended}</td>
              <td className="py-3 px-4 text-gray-700 text-right">{ae.scorecards}</td>
              <td className="py-3 px-4 text-gray-700 text-right">{ae.calls_with_comments}</td>
              <td className="py-3 px-4 text-gray-700 text-right">{ae.marked_as_feedback_given}</td>
              <td className="py-3 px-4 text-gray-700 text-right">{ae.calls_with_feedback}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-200 bg-gray-50">
            <td className="py-3 px-4 font-bold text-gray-900">Total</td>
            <td className="py-3 px-4 text-right"></td>
            <td className="py-3 px-4 font-bold text-gray-900 text-right pr-6">{totals.total_calls}</td>
            <td className="py-3 px-4 font-bold text-gray-900 text-right border-l border-gray-200">{totals.calls_listened}</td>
            <td className="py-3 px-4 font-bold text-gray-900 text-right">{totals.calls_attended}</td>
            <td className="py-3 px-4 font-bold text-gray-900 text-right">{totals.scorecards}</td>
            <td className="py-3 px-4 font-bold text-gray-900 text-right">{totals.calls_with_comments}</td>
            <td className="py-3 px-4 font-bold text-gray-900 text-right">{totals.marked_as_feedback_given}</td>
            <td className="py-3 px-4 font-bold text-gray-900 text-right">{totals.calls_with_feedback}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
