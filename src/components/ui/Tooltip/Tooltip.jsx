/**
 * Tooltip - CSS-only hover tooltip
 * Extracted from App.jsx Tooltip component
 *
 * Uses group-hover pattern for pure CSS animation
 */
export function Tooltip({ children, content }) {
  return (
    <span className="relative group inline-flex items-center">
      {children}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background-100 text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
        {content}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground"></span>
      </span>
    </span>
  );
}
