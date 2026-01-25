/**
 * Citation - Clickable call reference in CALL-XXXX format
 *
 * Renders as monospace inline button for consistent citation appearance
 * Validates citation format before rendering
 */
import { isValidCitationId } from '@/data';

export function Citation({ id, onClick }) {
  const isValid = isValidCitationId(id);

  if (!isValid) {
    // Invalid citation - render as plain text with warning style
    return (
      <span className="font-mono text-sm px-2 py-0.5 bg-gray-100 rounded border border-error text-error">
        {id}
      </span>
    );
  }

  return (
    <button
      onClick={() => onClick?.(id)}
      className="font-mono text-sm px-2 py-0.5 bg-gray-100 rounded border border-border text-foreground hover:bg-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
      aria-label={`View details for ${id}`}
    >
      {id}
    </button>
  );
}
