// FollowUpSuggestions - Clickable suggestion chips after AI response
// Displays 2-3 follow-up questions user can click to send

/**
 * Render follow-up suggestion chips
 * @param {Object} props
 * @param {string[]} props.suggestions - Array of suggestion strings
 * @param {Function} props.onClick - Callback when suggestion clicked
 */
export function FollowUpSuggestions({ suggestions, onClick }) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <span className="text-xs text-muted-foreground mr-2">Follow-up:</span>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onClick(suggestion)}
          className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-sm text-foreground transition-colors cursor-pointer border border-transparent hover:border-gray-300"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
