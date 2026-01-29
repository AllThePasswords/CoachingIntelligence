/**
 * ManagerDetail - Detail page for individual manager
 *
 * Hero section displays:
 * - Manager card style header with name, metrics, and summary
 * - AI-generated headline summary
 * - Back navigation to dashboard
 */
import { useParams, Link } from 'react-router';
import { getManagerById, getSummaryByManager } from '@/data';
import { InsightSection, CoachingInsight } from '@/components/sections';
import { Citation } from '@/components/display';
import { AETable } from '@/components/tables';
import { Tooltip, InfoIcon } from '@/components/ui';
import { useModalStore } from '@/stores';

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

// Rating icon for insight sections (larger, based on rating)
function RatingIcon({ rating }) {
  if (rating === 'improving') {
    return (
      <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    );
  }
  if (rating === 'declining') {
    return (
      <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    );
  }
  return (
    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
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

  // CTA actions
  const openConfirmationModal = useModalStore(state => state.openConfirmationModal);
  const handleCTA = (actionId) => {
    if (manager) {
      openConfirmationModal(actionId, manager.name, [], managerId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top row: Back link left, action buttons right */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/"
          className="text-sm text-gray-500 hover:text-foreground"
        >
          &larr; Back to Dashboard
        </Link>
        {manager && (
          <div className="flex gap-2">
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
          </div>
        )}
      </div>

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
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            {/* Left: Name and region */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1 flex items-center gap-2">
                <span>Sales Manager</span>
                <span className="text-gray-400">·</span>
                <span>{manager.region} Region</span>
              </p>
              <h1 className="text-4xl font-bold text-gray-900">{manager.name}</h1>
            </div>

            {/* Right: Team Quota and Coaching Score as larger components */}
            <div className="flex gap-10 sm:gap-12 shrink-0">
              <div className="text-center sm:text-right min-w-[100px]">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">Team Quota</p>
                <div className="flex items-center justify-center sm:justify-end gap-2">
                  <span className="text-4xl font-bold text-gray-900">{manager.quota_attainment}%</span>
                  <TrendIcon direction={getQuotaTrend(manager.quota_attainment)} />
                </div>
              </div>
              <div className="text-center sm:text-right min-w-[100px]">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1 flex items-center justify-center sm:justify-end gap-1">
                  Coaching Score
                  <Tooltip content="Coaching score is calculated from call reviews, feedback frequency, and team development activities.">
                    <span className="text-gray-400 hover:text-gray-600 cursor-help">
                      <InfoIcon />
                    </span>
                  </Tooltip>
                </p>
                <div className="flex items-center justify-center sm:justify-end gap-2">
                  <span className="text-4xl font-bold text-gray-900">{manager.coaching_score}%</span>
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
              {/* Row of 3 cards: Coaching Investment, Trend Over Time, Coaching Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Section 1: Coaching Investment */}
                <InsightSection
                  title={summary.sections.effort.title}
                  headerIcon={<RatingIcon rating={levelToRating[summary.sections.effort.level]} />}
                  className="h-full"
                >
                  <p className="text-gray-600 leading-relaxed">{summary.sections.effort.detail}</p>
                </InsightSection>

                {/* Section 2: Trend Over Time */}
                <InsightSection
                  title={summary.sections.trend.title}
                  headerIcon={<RatingIcon rating={levelToRating[summary.sections.trend.level]} />}
                  className="h-full"
                >
                  <p className="text-gray-600 leading-relaxed">{summary.sections.trend.detail}</p>
                </InsightSection>

                {/* Section 3: Coaching Distribution */}
                <InsightSection
                  title={summary.sections.distribution.title}
                  headerIcon={<RatingIcon rating={levelToRating[summary.sections.distribution.level]} />}
                  className="h-full"
                >
                  <p className="text-gray-600 leading-relaxed">{summary.sections.distribution.detail}</p>
                </InsightSection>
              </div>

              {/* Section 4: Feedback Analysis */}
              <InsightSection title={summary.sections.feedback_quality.title}>
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
            <h2 className="text-xl font-semibold text-foreground mb-4">Coaching Activity</h2>
            <div className="bg-background-100 border border-border rounded-lg overflow-hidden">
              <AETable managerId={managerId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
