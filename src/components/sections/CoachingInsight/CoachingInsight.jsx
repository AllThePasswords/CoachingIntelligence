/**
 * CoachingInsight - Purple callout box for AI-generated coaching insights
 * Styled based on email-alert-coaching-concern.html template
 * Supports optional CTA button on the right
 */

export function CoachingInsight({ children, ctaLabel, ctaIcon, onCtaClick }) {
  return (
    <div className="bg-[#e3d7fc] border-l-4 border-gong-purple rounded-r-lg p-4 flex items-center gap-4">
      <div className="flex-1">
        <p className="text-xs font-semibold text-gong-purple uppercase tracking-wide mb-1">
          Coaching Intelligence Insight
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {children}
        </p>
      </div>
      {ctaLabel && (
        <button
          onClick={onCtaClick}
          className="flex-shrink-0 flex items-center gap-2 bg-gong-purple text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gong-purple-dark transition-colors"
        >
          {ctaIcon && <span>{ctaIcon}</span>}
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
