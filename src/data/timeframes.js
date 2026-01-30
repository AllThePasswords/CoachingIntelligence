// Coaching Intelligence - Timeframe Data
// Metrics for 30, 60, and 90 day views
// coaching_score is calculated dynamically from the underlying metrics
//
// ===== FIELD DEFINITIONS =====
// calls_listened: Total calls listened to by manager (includes "listen live")
// calls_attended: Calls where manager was a participant (active presence)
// scorecards: Calls with structured coaching scorecards
// calls_with_comments: Calls with written comments
// marked_as_feedback_given: Calls manually marked "Feedback given"
// calls_with_feedback: DERIVED - unique calls with ANY feedback (comment OR scorecard OR marked)

import { calculateCoachingScore } from '../utils/coachingScore.js';
import { getAEsByManager, estimateActiveDays } from './aes.js';

// Raw metrics data for each timeframe
// Data is scaled realistically based on:
// - Best practice: 4-6 calls/AE/month reviewed, 70-80% feedback rate
// - 30 days = base period (from aes.js)
// - 60 days = ~2x of 30-day
// - 90 days = ~3x of 30-day
const timeframeMetrics = {
  "30": {
    label: "30 days",
    working_days: 22,
    managers: {
      // Sarah Chen - EXCELLENT (75% feedback rate)
      MGR001: {
        calls_listened: 20,
        calls_attended: 5,
        scorecards: 6,
        calls_with_comments: 12,
        marked_as_feedback_given: 15,
        calls_with_feedback: 15,
        quota_attainment: 118,
        active_days: 19,
        feedback_rate: 75,
        trend_vs_prior: "stable"
      },
      // Marcus Jones - GOOD BUT DECLINING (50% feedback rate)
      MGR002: {
        calls_listened: 10,
        calls_attended: 2,
        scorecards: 2,
        calls_with_comments: 4,
        marked_as_feedback_given: 5,
        calls_with_feedback: 5,
        quota_attainment: 96,
        active_days: 8,
        feedback_rate: 50,
        trend_vs_prior: "declining"
      },
      // Jennifer Walsh - BELOW AVERAGE (25% feedback rate)
      MGR003: {
        calls_listened: 8,
        calls_attended: 1,
        scorecards: 1,
        calls_with_comments: 2,
        marked_as_feedback_given: 2,
        calls_with_feedback: 2,
        quota_attainment: 88,
        active_days: 9,
        feedback_rate: 25,
        trend_vs_prior: "stable"
      },
      // David Park - CRITICAL (0% feedback rate)
      MGR004: {
        calls_listened: 2,
        calls_attended: 0,
        scorecards: 0,
        calls_with_comments: 0,
        marked_as_feedback_given: 0,
        calls_with_feedback: 0,
        quota_attainment: 62,
        active_days: 2,
        feedback_rate: 0,
        trend_vs_prior: "declining"
      }
    }
  },
  "60": {
    label: "60 days",
    working_days: 44,
    managers: {
      // Sarah Chen - consistently strong, slight dip mid-period then recovered
      MGR001: {
        calls_listened: 38,
        calls_attended: 9,
        scorecards: 11,
        calls_with_comments: 24,
        marked_as_feedback_given: 29,
        calls_with_feedback: 29,
        quota_attainment: 115,
        active_days: 35,
        feedback_rate: 76,
        trend_vs_prior: "stable"
      },
      // Marcus Jones - was stronger 30-60 days ago, recent decline
      MGR002: {
        calls_listened: 28,
        calls_attended: 6,
        scorecards: 7,
        calls_with_comments: 14,
        marked_as_feedback_given: 18,
        calls_with_feedback: 16,
        quota_attainment: 102,
        active_days: 24,
        feedback_rate: 57,
        trend_vs_prior: "declining"
      },
      // Jennifer Walsh - slightly better 30-60 days ago
      MGR003: {
        calls_listened: 19,
        calls_attended: 3,
        scorecards: 3,
        calls_with_comments: 6,
        marked_as_feedback_given: 6,
        calls_with_feedback: 6,
        quota_attainment: 91,
        active_days: 20,
        feedback_rate: 32,
        trend_vs_prior: "stable"
      },
      // David Park - had a brief engagement spike 45 days ago
      MGR004: {
        calls_listened: 9,
        calls_attended: 2,
        scorecards: 1,
        calls_with_comments: 3,
        marked_as_feedback_given: 3,
        calls_with_feedback: 3,
        quota_attainment: 68,
        active_days: 8,
        feedback_rate: 33,
        trend_vs_prior: "declining"
      }
    }
  },
  "90": {
    label: "90 days",
    working_days: 66,
    managers: {
      // Sarah Chen - strong throughout, peak performance around day 45-60
      MGR001: {
        calls_listened: 58,
        calls_attended: 14,
        scorecards: 16,
        calls_with_comments: 36,
        marked_as_feedback_given: 44,
        calls_with_feedback: 44,
        quota_attainment: 112,
        active_days: 52,
        feedback_rate: 76,
        trend_vs_prior: "stable"
      },
      // Marcus Jones - started strong 90 days ago, gradual decline
      MGR002: {
        calls_listened: 52,
        calls_attended: 12,
        scorecards: 14,
        calls_with_comments: 28,
        marked_as_feedback_given: 36,
        calls_with_feedback: 32,
        quota_attainment: 108,
        active_days: 42,
        feedback_rate: 62,
        trend_vs_prior: "declining"
      },
      // Jennifer Walsh - inconsistent, occasional bursts of activity
      MGR003: {
        calls_listened: 32,
        calls_attended: 5,
        scorecards: 5,
        calls_with_comments: 11,
        marked_as_feedback_given: 10,
        calls_with_feedback: 10,
        quota_attainment: 94,
        active_days: 30,
        feedback_rate: 31,
        trend_vs_prior: "stable"
      },
      // David Park - had decent engagement 60-90 days ago, then dropped off
      MGR004: {
        calls_listened: 18,
        calls_attended: 4,
        scorecards: 2,
        calls_with_comments: 7,
        marked_as_feedback_given: 8,
        calls_with_feedback: 7,
        quota_attainment: 78,
        active_days: 16,
        feedback_rate: 39,
        trend_vs_prior: "declining"
      }
    }
  }
};

/**
 * Calculate coaching score for a manager in a specific timeframe
 * Uses same calculation logic as managers.js for consistency
 */
function computeManagerScore(managerId, managerData, workingDays) {
  // Get AE data for distribution calculation (same source as managers.js)
  const teamAEs = getAEsByManager(managerId);
  const aeCoachingData = teamAEs.map(ae => ({
    listened: ae.calls_listened || 0,
    total: ae.total_calls || 20
  }));

  // Use same active days estimation as managers.js for consistency
  // (The stored active_days in timeframeMetrics may differ from the heuristic)
  const activeDays = estimateActiveDays(managerId, workingDays);

  return calculateCoachingScore({
    activeDays,
    workingDays: workingDays,
    callsReviewed: managerData.calls_listened,
    callsWithFeedback: managerData.calls_with_feedback,
    comments: managerData.calls_with_comments,
    scorecards: managerData.scorecards,
    liveAttended: managerData.calls_attended,
    markedFeedbackGiven: managerData.marked_as_feedback_given,
    aeCoachingData
  });
}

/**
 * Build timeframes object with computed coaching scores
 */
function buildTimeframes() {
  const result = {};

  for (const [period, data] of Object.entries(timeframeMetrics)) {
    result[period] = {
      label: data.label,
      working_days: data.working_days,
      managers: {}
    };

    for (const [managerId, managerData] of Object.entries(data.managers)) {
      result[period].managers[managerId] = {
        ...managerData,
        coaching_score: computeManagerScore(managerId, managerData, data.working_days)
      };
    }
  }

  return result;
}

// Export the computed timeframes
export const timeframes = buildTimeframes();

export const getTimeframeData = (timeframe) => timeframes[timeframe];

export const getManagerTimeframeData = (managerId, timeframe) =>
  timeframes[timeframe]?.managers[managerId];

// Calculate score change between timeframes
export const getScoreTrend = (managerId) => {
  const score30 = timeframes["30"].managers[managerId].coaching_score;
  const score90 = timeframes["90"].managers[managerId].coaching_score;

  if (score30 > score90 + 10) return "improving";
  if (score30 < score90 - 10) return "declining";
  return "stable";
};
