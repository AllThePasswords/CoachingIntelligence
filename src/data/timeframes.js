// Coaching Intelligence - Timeframe Data
// Metrics for 30, 60, and 90 day views

export const timeframes = {
  "30": {
    label: "30 days",
    benchmark: 45,
    working_days: 22,
    managers: {
      MGR001: {
        calls_reviewed: 56,
        coaching_score: 95,
        quota_attainment: 112,
        active_days: 19,
        calls_attended: 6,
        calls_with_feedback: 39,
        calls_with_comments: 42,
        calls_with_scorecards: 14,
        feedback_rate: 70,
        trend_vs_prior: "stable"
      },
      MGR002: {
        calls_reviewed: 23,
        coaching_score: 56,
        quota_attainment: 89,
        active_days: 8,
        calls_attended: 2,
        calls_with_feedback: 8,
        calls_with_comments: 15,
        calls_with_scorecards: 4,
        feedback_rate: 35,
        trend_vs_prior: "declining"
      },
      MGR003: {
        calls_reviewed: 11,
        coaching_score: 26,
        quota_attainment: 85,
        active_days: 9,
        calls_attended: 1,
        calls_with_feedback: 2,
        calls_with_comments: 7,
        calls_with_scorecards: 2,
        feedback_rate: 18,
        trend_vs_prior: "stable"
      },
      MGR004: {
        calls_reviewed: 3,
        coaching_score: 5,
        quota_attainment: 58,
        active_days: 2,
        calls_attended: 0,
        calls_with_feedback: 0,
        calls_with_comments: 1,
        calls_with_scorecards: 0,
        feedback_rate: 0,
        trend_vs_prior: "declining"
      }
    }
  },
  "60": {
    label: "60 days",
    benchmark: 90,
    working_days: 44,
    managers: {
      MGR001: {
        calls_reviewed: 118,
        coaching_score: 97,
        quota_attainment: 115,
        active_days: 38,
        calls_attended: 12,
        calls_with_feedback: 78,
        calls_with_comments: 102,
        calls_with_scorecards: 28,
        feedback_rate: 66,
        trend_vs_prior: "stable"
      },
      MGR002: {
        calls_reviewed: 46,
        coaching_score: 62,
        quota_attainment: 92,
        active_days: 18,
        calls_attended: 5,
        calls_with_feedback: 18,
        calls_with_comments: 32,
        calls_with_scorecards: 8,
        feedback_rate: 39,
        trend_vs_prior: "declining"
      },
      MGR003: {
        calls_reviewed: 26,
        coaching_score: 25,
        quota_attainment: 86,
        active_days: 16,
        calls_attended: 2,
        calls_with_feedback: 5,
        calls_with_comments: 16,
        calls_with_scorecards: 4,
        feedback_rate: 19,
        trend_vs_prior: "stable"
      },
      MGR004: {
        calls_reviewed: 7,
        coaching_score: 6,
        quota_attainment: 60,
        active_days: 5,
        calls_attended: 0,
        calls_with_feedback: 1,
        calls_with_comments: 3,
        calls_with_scorecards: 0,
        feedback_rate: 14,
        trend_vs_prior: "declining"
      }
    }
  },
  "90": {
    label: "90 days",
    benchmark: 135,
    working_days: 66,
    managers: {
      MGR001: {
        calls_reviewed: 171,
        coaching_score: 96,
        quota_attainment: 118,
        active_days: 57,
        calls_attended: 18,
        calls_with_feedback: 112,
        calls_with_comments: 156,
        calls_with_scorecards: 42,
        feedback_rate: 65,
        trend_vs_prior: "stable"
      },
      MGR002: {
        calls_reviewed: 89,
        coaching_score: 75,
        quota_attainment: 96,
        active_days: 35,
        calls_attended: 8,
        calls_with_feedback: 34,
        calls_with_comments: 62,
        calls_with_scorecards: 16,
        feedback_rate: 38,
        trend_vs_prior: "declining"
      },
      MGR003: {
        calls_reviewed: 44,
        coaching_score: 35,
        quota_attainment: 88,
        active_days: 26,
        calls_attended: 3,
        calls_with_feedback: 8,
        calls_with_comments: 28,
        calls_with_scorecards: 6,
        feedback_rate: 18,
        trend_vs_prior: "stable"
      },
      MGR004: {
        calls_reviewed: 22,
        coaching_score: 17,
        quota_attainment: 62,
        active_days: 12,
        calls_attended: 1,
        calls_with_feedback: 1,
        calls_with_comments: 8,
        calls_with_scorecards: 0,
        feedback_rate: 5,
        trend_vs_prior: "declining"
      }
    }
  }
};

export const getTimeframeData = (timeframe) => timeframes[timeframe];

export const getManagerTimeframeData = (managerId, timeframe) => 
  timeframes[timeframe]?.managers[managerId];

export const getBenchmark = (timeframe) => timeframes[timeframe]?.benchmark;

// Calculate score change between timeframes
export const getScoreTrend = (managerId) => {
  const score30 = timeframes["30"].managers[managerId].coaching_score;
  const score90 = timeframes["90"].managers[managerId].coaching_score;
  
  if (score30 > score90 + 10) return "improving";
  if (score30 < score90 - 10) return "declining";
  return "stable";
};
