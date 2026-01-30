// Coaching Intelligence - Manager Data
// All metrics are derived from AE data - nothing hardcoded

import { getAEsByManager, getManagerCoachingStats, estimateActiveDays } from './aes.js';
import { calculateCoachingScore } from '../utils/coachingScore.js';

// Working days in a 30-day period
const WORKING_DAYS = 22;

// Base manager identity data (only static info that can't be derived)
const managersBase = [
  { id: "MGR001", name: "Sarah Chen", region: "West" },
  { id: "MGR002", name: "Marcus Jones", region: "East" },
  { id: "MGR003", name: "Jennifer Walsh", region: "Central" },
  { id: "MGR004", name: "David Park", region: "South" }
];

// Compute sources from AE data
function computeSources(managerId) {
  const stats = getManagerCoachingStats(managerId);
  return {
    calls_listened: stats.total_calls_listened,
    calls_attended: stats.total_calls_attended,
    scorecards: stats.total_scorecards,
    calls_with_comments: stats.total_calls_with_comments,
    marked_as_feedback_given: stats.total_marked_feedback,
    calls_with_feedback: stats.total_calls_with_feedback,
    feedback_rate: stats.feedback_rate,
    total_ae_calls: stats.total_ae_calls
  };
}

// Compute coaching score from AE data
function computeCoachingScore(managerId) {
  const sources = computeSources(managerId);
  const teamAEs = getAEsByManager(managerId);
  const activeDays = estimateActiveDays(managerId, WORKING_DAYS);

  // Get per-AE coaching data for distribution calculation
  const aeCoachingData = teamAEs.map(ae => ({
    listened: ae.calls_listened || 0,
    total: ae.total_calls || 20
  }));

  return calculateCoachingScore({
    activeDays,
    workingDays: WORKING_DAYS,
    callsReviewed: sources.calls_listened,
    callsWithFeedback: sources.calls_with_feedback,
    comments: sources.calls_with_comments,
    scorecards: sources.scorecards,
    liveAttended: sources.calls_attended,
    markedFeedbackGiven: sources.marked_as_feedback_given,
    aeCoachingData
  });
}

// Derive performance level from coaching score
function derivePerformanceLevel(coachingScore) {
  if (coachingScore >= 70) return "excellent";
  if (coachingScore >= 50) return "good";
  if (coachingScore >= 30) return "average";
  return "needs_intervention";
}

// Derive coaching investment level from activity volume
function deriveCoachingInvestmentLevel(sources, aeCount) {
  const activitiesPerAE = aeCount > 0
    ? (sources.calls_listened + sources.calls_with_comments + sources.scorecards + sources.calls_attended) / aeCount
    : 0;

  if (activitiesPerAE >= 8) return "High";
  if (activitiesPerAE >= 4) return "Medium";
  if (activitiesPerAE >= 2) return "Low";
  return "Minimal";
}

// Derive distribution label from AE coaching data
function deriveDistributionLabel(managerId) {
  const teamAEs = getAEsByManager(managerId);
  if (teamAEs.length === 0) return "N/A";

  const coverageRates = teamAEs.map(ae => {
    const total = ae.total_calls || 1;
    return ae.calls_listened / total;
  });

  const zeroCount = coverageRates.filter(r => r === 0).length;
  const mean = coverageRates.reduce((sum, r) => sum + r, 0) / coverageRates.length;
  const variance = coverageRates.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / coverageRates.length;
  const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

  if (zeroCount > coverageRates.length / 2) return "Absent";
  if (zeroCount > 0) return "Uneven";
  if (cv > 0.5) return "Sporadic";
  return "Even";
}

// Derive team performance label from quota attainment
function deriveTeamPerformance(quotaAttainment) {
  if (quotaAttainment >= 100) return "Exceeding";
  if (quotaAttainment >= 90) return "On Track";
  return "Underperforming";
}

// Derive trend from score relative to team average (simplified - in real app, compare to prior period)
function deriveTrend(coachingScore, quotaAttainment) {
  // High score + high quota = stable
  // High score + low quota = needs review (external factors)
  // Low score + declining quota = declining
  // Improving scores would need historical data
  if (coachingScore >= 50 && quotaAttainment >= 90) return "stable";
  if (coachingScore < 30 || quotaAttainment < 70) return "declining";
  return "stable";
}

// Generate summary based on derived metrics
function generateSummary(managerId, coachingScore, sources, stats) {
  const feedbackRate = sources.feedback_rate;
  const undercoached = stats.undercoached_count;

  if (coachingScore >= 70) {
    return `Consistently high engagement with specific, actionable feedback. Strong coaching coverage across the team.`;
  }
  if (coachingScore >= 50) {
    if (undercoached > 0) {
      return `Solid coaching foundation but uneven distribution. ${undercoached} AE(s) need more attention.`;
    }
    return `Good coaching activity with room for improvement in feedback quality and consistency.`;
  }
  if (coachingScore >= 30) {
    if (feedbackRate < 30) {
      return `Listening to calls but feedback rate is low (${feedbackRate}%). Focus on providing actionable feedback after reviews.`;
    }
    return `Below average coaching engagement. Increase consistency and depth of coaching activities.`;
  }
  return `Critical intervention needed. Minimal coaching activity is impacting team performance.`;
}

// Build complete manager object with all derived values
function buildManager(base) {
  const sources = computeSources(base.id);
  const stats = getManagerCoachingStats(base.id);
  const coachingScore = computeCoachingScore(base.id);
  const quotaAttainment = stats.team_quota_attainment;
  const activeDays = estimateActiveDays(base.id, WORKING_DAYS);

  const performance = derivePerformanceLevel(coachingScore);
  const investmentLevel = deriveCoachingInvestmentLevel(sources, stats.ae_count);
  const distribution = deriveDistributionLabel(base.id);
  const teamPerformance = deriveTeamPerformance(quotaAttainment);
  const trend = deriveTrend(coachingScore, quotaAttainment);
  const summary = generateSummary(base.id, coachingScore, sources, stats);

  // Calculate team win rate from quota (simplified proxy)
  // In reality this would come from deal data
  const teamWinRate = Math.round(20 + (quotaAttainment - 50) * 0.4);

  return {
    ...base,
    coaching_score: coachingScore,
    quota_attainment: quotaAttainment,
    team_win_rate: Math.max(10, Math.min(50, teamWinRate)),
    performance,
    trend,
    summary,
    sources,
    coaching_investment: {
      level: investmentLevel,
      activities: sources.calls_listened + sources.calls_with_comments + sources.scorecards + sources.calls_attended
    },
    improvement: {
      trend: trend === "declining" ? "Declining" : "Stable",
      days: 90
    },
    distribution,
    team_performance: teamPerformance,
    active_days: activeDays,
    working_days: WORKING_DAYS
  };
}

// Export managers with all computed values
export const managers = managersBase.map(buildManager);

export const getManagerById = (id) => {
  const base = managersBase.find(m => m.id === id);
  if (!base) return null;
  return buildManager(base);
};

export const getManagersByPerformance = (performance) =>
  managers.filter(m => m.performance === performance);
