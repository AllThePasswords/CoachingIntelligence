/**
 * ManagerDetail - Detail page for individual manager
 *
 * Hero section displays:
 * - Manager card style header with name, metrics, and summary
 * - AI-generated headline summary
 * - Back navigation to dashboard
 * - Ask Anything chat section
 */
import { useParams, Link } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { getManagerById, getSummaryByManager } from '@/data';
import { InsightSection, CoachingInsight } from '@/components/sections';
import { Citation } from '@/components/display';
import { AETable } from '@/components/tables';
import { ChatThread, ApiKeyInput, ChatHistoryButton } from '@/components/chat';
import { ChatErrorFallback } from '@/components/feedback';
import { Tooltip, InfoIcon } from '@/components/ui';
import { useSettingsStore, useChatStore, useModalStore } from '@/stores';
import { useChat } from '@/hooks/useChat';

// Trend indicator icon using Heroicons (circled arrows)
function TrendIcon({ direction }) {
  if (direction === 'up') {
    return (
      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    );
  }
  if (direction === 'down') {
    return (
      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

// Determine trend direction based on metric value
function getQuotaTrend(quota) {
  if (quota >= 100) return 'up';
  if (quota < 80) return 'down';
  return 'stable';
}

function getCoachingTrend(score) {
  if (score >= 75) return 'up';
  if (score < 50) return 'down';
  return 'stable';
}

// Stable empty array to prevent re-renders
const EMPTY_ARRAY = [];

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

  // Chat functionality - use per-manager messages from active session
  const apiKey = useSettingsStore((s) => s.apiKey);
  const chatKey = managerId || 'team';
  // Get active session's messages
  const chatHistory = useChatStore((s) => s.chatHistories[chatKey]);
  const activeSessionId = chatHistory?.activeSessionId;
  const activeSession = chatHistory?.sessions?.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages ?? EMPTY_ARRAY;
  const { sendMessage } = useChat(managerId);

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  // CTA actions
  const openConfirmationModal = useModalStore(state => state.openConfirmationModal);
  const handleCTA = (actionId) => {
    if (manager) {
      openConfirmationModal(actionId, manager.name, [], managerId);
    }
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
          {/* Manager Card Header - Full Width */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 relative mb-6">
            {/* Top right: CTA buttons and info tooltip */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => handleCTA('add_1on1')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Add to 1:1
              </button>
              <button
                onClick={() => handleCTA('send_summary')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Summary
              </button>
              <Tooltip content="Coaching score is calculated from call reviews, feedback frequency, and team development activities.">
                <span className="text-gray-400 hover:text-gray-600 cursor-help">
                  <InfoIcon />
                </span>
              </Tooltip>
            </div>

            {/* Header */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">Sales Manager</p>
              <h1 className="text-3xl font-semibold text-gray-900">{manager.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{manager.region} Region</p>
            </div>

            {/* Metrics Row */}
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">Team Quota</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{manager.quota_attainment}%</span>
                  <TrendIcon direction={getQuotaTrend(manager.quota_attainment)} />
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">Coaching Score</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{manager.coaching_score}%</span>
                  <TrendIcon direction={getCoachingTrend(manager.coaching_score)} />
                </div>
              </div>
            </div>
          </div>

          {/* Coaching Intelligence Insight */}
          {summary && (
            <CoachingInsight>
              {summary.headline}
            </CoachingInsight>
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
