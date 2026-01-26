/**
 * ManagerDetail - Detail page for individual manager
 *
 * Hero section displays:
 * - Manager name and region
 * - Key metrics (attainment, coaching score)
 * - AI-generated headline summary
 * - Timeframe toggle for metrics
 * - Back navigation to dashboard
 * - Ask Anything chat section
 */
import { useParams, Link } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { getManagerById, getSummaryByManager } from '@/data';
import { InsightSection, CoachingInsight } from '@/components/sections';
import { FilterRow } from '@/components/filters';
import { Citation } from '@/components/display';
import { AETable } from '@/components/tables';
import { ActionMenu } from '@/components/menus';
import { ChatThread, ApiKeyInput, ChatHistoryButton } from '@/components/chat';
import { ChatErrorFallback } from '@/components/feedback';
import { useSettingsStore, useChatStore } from '@/stores';
import { useChat } from '@/hooks/useChat';

// Map summary level values to InsightSection rating values
const levelToRating = {
  'High': 'improving',
  'Medium': 'steady',
  'Low': 'declining',
  'Minimal': 'declining',
  'Stable': 'steady',
  'Declining': 'declining',
  'Improving': 'improving',
  'Even': 'improving',
  'Uneven': 'declining',
  'Sporadic': 'declining',
  'Absent': 'declining',
  'Specific & Actionable': 'improving',
  'Moderate to Vague': 'steady',
  'Generic': 'declining',
  'None': 'declining'
};

export function ManagerDetail() {
  const { managerId } = useParams();
  const manager = getManagerById(managerId);

  // Get AI summary for headline
  const summary = getSummaryByManager(managerId);

  // Chat functionality - use per-manager messages
  const apiKey = useSettingsStore((s) => s.apiKey);
  const messages = useChatStore((s) => s.getMessages(managerId));
  const { sendMessage } = useChat(managerId);

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

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
        // Manager found - show hero section
        <div className="mt-4">
          {/* Filter Row */}
          <FilterRow managerName={manager.name} />

          {/* Row 1: Manager name + ActionMenu */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {manager.name}
              </h1>
              <p className="text-gray-500">
                {manager.region} Region
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ActionMenu managerName={manager.name} />
            </div>
          </div>

          {/* Row 3: Metrics row */}
          <div className="flex gap-8 mt-6">
            {/* Attainment */}
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                Attainment
              </div>
              <div className="text-2xl font-bold">
                {manager.quota_attainment}%
              </div>
            </div>

            {/* Coaching Score */}
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                Coaching Score
              </div>
              <div className="text-2xl font-bold">
                {manager.coaching_score}%
              </div>
            </div>
          </div>

          {/* Coaching Intelligence Insight */}
          {summary && (
            <div className="mt-6">
              <CoachingInsight>
                {summary.headline}
              </CoachingInsight>
            </div>
          )}

          {/* Insight Sections */}
          {summary && (
            <div className="mt-8 space-y-6">
              {/* Section 1: Coaching Investment */}
              <InsightSection
                title={summary.sections.effort.title}
                rating={levelToRating[summary.sections.effort.level]}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold">{summary.sections.effort.level}</span>
                  <span className="text-gray-500">{summary.sections.effort.value}</span>
                </div>
                <p className="text-gray-600 leading-relaxed">{summary.sections.effort.detail}</p>
              </InsightSection>

              {/* Section 2: Trend Over Time */}
              <InsightSection
                title={summary.sections.trend.title}
                rating={levelToRating[summary.sections.trend.level]}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold">{summary.sections.trend.level}</span>
                  <span className="text-gray-500">{summary.sections.trend.value}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <p className="text-gray-600 leading-relaxed">{summary.sections.trend.detail}</p>
              </InsightSection>

              {/* Section 3: Coaching Methods */}
              <InsightSection title={summary.sections.methods.title}>
                <p className="text-gray-600 leading-relaxed mb-4">{summary.sections.methods.detail}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Calls Listened</p>
                    <p className="text-xl font-semibold mt-1">{summary.sections.methods.breakdown.calls_listened}</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Calls Attended</p>
                    <p className="text-xl font-semibold mt-1">{summary.sections.methods.breakdown.calls_attended}</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">With Feedback</p>
                    <p className="text-xl font-semibold mt-1">{summary.sections.methods.breakdown.calls_with_feedback}</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">With Comments</p>
                    <p className="text-xl font-semibold mt-1">{summary.sections.methods.breakdown.calls_with_comments}</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">With Scorecards</p>
                    <p className="text-xl font-semibold mt-1">{summary.sections.methods.breakdown.calls_with_scorecards}</p>
                  </div>
                </div>
              </InsightSection>

              {/* Section 4: Coaching Distribution */}
              <InsightSection
                title={summary.sections.distribution.title}
                rating={levelToRating[summary.sections.distribution.level]}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold">{summary.sections.distribution.level}</span>
                </div>
                <p className="text-gray-600 leading-relaxed">{summary.sections.distribution.detail}</p>
              </InsightSection>

              {/* Section 5: Feedback Quality */}
              <InsightSection
                title={summary.sections.feedback_quality.title}
                rating={levelToRating[summary.sections.feedback_quality.level]}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold">{summary.sections.feedback_quality.level}</span>
                </div>
                <p className="text-gray-600 leading-relaxed">{summary.sections.feedback_quality.detail}</p>
                <div className="space-y-4 mt-4">
                  {summary.sections.feedback_quality.examples.map((example) => (
                    <div key={example.call_id} className="bg-white border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Citation id={example.call_id} />
                        <span className="text-sm text-gray-500">{example.ae} - {example.stage}</span>
                      </div>
                      <blockquote className="text-gray-700 italic">
                        "{example.quote}"
                      </blockquote>
                    </div>
                  ))}
                </div>
              </InsightSection>
            </div>
          )}

          {/* AE Coaching Table */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Team Coaching Details</h2>
            <div className="bg-background-100 border border-border rounded-lg overflow-hidden">
              <AETable managerId={managerId} />
            </div>
          </div>

          {/* Sources Footer */}
          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Sources</h4>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
              <span>{manager.sources.call_listening} calls listened</span>
              <span>{manager.sources.call_attendance} calls attended</span>
              <span>{manager.sources.call_comments} comments</span>
              <span>{manager.sources.scorecards} scorecards</span>
              <span>{manager.sources.feedback_events} feedback events</span>
            </div>
          </div>

          {/* Ask Anything Chat Section */}
          <section className="mt-8 pt-6 border-t border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Ask Anything About {manager.name}
            </h2>

            {!apiKey ? (
              <div className="bg-gray-50 rounded-lg p-6 border border-border">
                <p className="text-sm text-muted-foreground mb-4">
                  Enter your Anthropic API key to enable AI-powered chat about {manager.name}'s coaching data.
                </p>
                <ApiKeyInput />
              </div>
            ) : (
              <div>
                {/* Chat History Button - only shows if there are previous messages */}
                <ChatHistoryButton
                  managerId={managerId}
                  onSuggestionClick={handleSuggestionClick}
                />

                {messages.length === 0 && (
                  <p className="text-muted-foreground text-sm mb-4">
                    Ask a question using the input below to get AI-powered insights about {manager.name}'s coaching.
                  </p>
                )}
                <ErrorBoundary
                  FallbackComponent={ChatErrorFallback}
                  onReset={() => window.location.reload()}
                  resetKeys={[managerId]}
                >
                  <ChatThread
                    managerId={managerId}
                    onSuggestionClick={handleSuggestionClick}
                  />
                </ErrorBoundary>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
