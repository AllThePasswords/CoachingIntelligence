/**
 * TrendArrow - Directional trend indicator icon
 * Extracted from App.jsx TrendUp/TrendDown/TrendSteady components
 */
export function TrendArrow({ direction }) {
  if (direction === 'up') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12L7 8L9 10L13 4" />
        <path d="M10 4H13V7" />
      </svg>
    );
  }

  if (direction === 'down') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 4L7 8L9 6L13 12" />
        <path d="M10 12H13V9" />
      </svg>
    );
  }

  // steady (default)
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8H13" />
      <path d="M10 5L13 8L10 11" />
    </svg>
  );
}
