/**
 * ManagerDetail - Detail page for individual manager
 *
 * Placeholder implementation - full detail view coming in Phase 4
 *
 * Features:
 * - Extracts managerId from URL params
 * - Shows manager name and region
 * - Back link to dashboard
 */
import { useParams, Link } from 'react-router';
import { getManagerById } from '@/data';

export function ManagerDetail() {
  const { managerId } = useParams();
  const manager = getManagerById(managerId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        to="/"
        className="text-sm text-gray-500 hover:text-foreground mb-4 inline-block"
      >
        &larr; Back to Dashboard
      </Link>

      {!manager ? (
        // Manager not found state
        <div className="mt-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Manager not found
          </h1>
          <p className="text-gray-500">
            No manager found with ID: {managerId}
          </p>
        </div>
      ) : (
        // Manager found - show placeholder
        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {manager.name}
          </h1>
          <p className="text-gray-500 mb-4">
            {manager.region} Region
          </p>
          <p className="text-sm text-gray-400 mt-8 p-4 bg-background-100 border border-border rounded-lg">
            Detail view coming in Phase 4
          </p>
        </div>
      )}
    </div>
  );
}
