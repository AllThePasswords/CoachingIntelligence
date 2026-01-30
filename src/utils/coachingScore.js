// Coaching Intelligence - Score Calculation
//
// The Coaching Score (0-100) measures a manager's coaching engagement and effectiveness.
//
// ===== SIX COACHING ACTIVITY TYPES =====
//
// DIRECTLY TRACKED:
// 1. Calls Listened - Total calls listened to by manager (includes "listen live")
// 2. Calls Attended - Calls where manager was a participant (active presence)
// 3. Scorecards - Calls with structured coaching scorecards (e.g., Sandler methodology)
// 4. Calls With Comments - Calls with written comments (regardless of feedback status)
// 5. Marked As Feedback Given - Calls manually marked "Feedback given" (verbal feedback in 1:1, team meetings)
//
// DERIVED:
// 6. Calls With Feedback - Unique calls with ANY feedback (comment OR scorecard OR marked)
//    Note: A call can have multiple feedback types but only counts once
//
// ===== SCORE CALCULATION =====
// The score is calculated from FOUR components:
//
// 1. CONSISTENCY (30%): How regularly does the manager engage in coaching?
//    - Active coaching days / Working days in period
//
// 2. FEEDBACK COVERAGE (30%): What % of reviewed calls receive feedback?
//    - Calls with feedback / Calls listened
//
// 3. ENGAGEMENT DEPTH (20%): Quality/depth of coaching activities
//    - Weighted scoring based on activity types:
//      * Scorecards: 4 points (highest - formal evaluation)
//      * Calls Attended: 3 points (live presence)
//      * Comments: 2 points (written feedback)
//      * Marked as Feedback Given: 1 point (delivery confirmed)
//      * Listening: 1 point (base activity)
//    - Divided by maximum possible score
//
// 4. DISTRIBUTION (20%): How evenly is coaching spread across all AEs?
//    - Penalizes managers who neglect some reps while over-coaching others
//    - Uses coefficient of variation (lower variance = higher score)
//    - Any AE with zero coaching significantly reduces this score

/**
 * Calculate distribution score - how evenly coaching coverage is spread across AEs
 * Uses coverage % per AE (calls_listened / total_calls) to compare fairly
 *
 * @param {Array} aeCoachingData - Array of {listened, total} per AE
 * @returns {number} Distribution score from 0-100
 */
function calculateDistributionScore(aeCoachingData) {
  if (!aeCoachingData || aeCoachingData.length === 0) {
    return 100; // No AEs = perfect distribution (nothing to distribute)
  }

  if (aeCoachingData.length === 1) {
    return 100; // Single AE = perfect distribution
  }

  // Calculate coverage % for each AE
  const coverageRates = aeCoachingData.map(ae => {
    const total = ae.total || 1; // Avoid divide by zero
    const listened = ae.listened || 0;
    return Math.min(listened / total, 1); // Cap at 100%
  });

  const totalListened = aeCoachingData.reduce((sum, ae) => sum + (ae.listened || 0), 0);

  // If no coaching at all, distribution is 0
  if (totalListened === 0) {
    return 0;
  }

  // Count AEs with zero coaching - this is a major penalty
  const zeroCount = coverageRates.filter(rate => rate === 0).length;
  const zeroPenalty = zeroCount / coverageRates.length; // 0 to 1

  // Calculate coefficient of variation (CV) based on coverage rates
  const mean = coverageRates.reduce((sum, rate) => sum + rate, 0) / coverageRates.length;
  const squaredDiffs = coverageRates.map(rate => Math.pow(rate - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / coverageRates.length;
  const stdDev = Math.sqrt(variance);
  const cv = mean > 0 ? stdDev / mean : 0; // Coefficient of variation

  // CV of 0 = perfect distribution (100 score)
  // CV of 1 = high variance (50 score)
  // CV > 1 = very uneven (below 50)
  const cvScore = Math.max(0, 100 - (cv * 50));

  // Combine: heavily penalize having neglected AEs
  // If 25% of AEs have zero coaching, lose 50 points from distribution
  const distributionScore = cvScore * (1 - (zeroPenalty * 2));

  return Math.max(0, Math.round(distributionScore));
}

/**
 * Calculate the coaching score for a manager based on their metrics
 *
 * @param {Object} metrics - The manager's coaching metrics
 * @param {number} metrics.activeDays - Days with coaching activity
 * @param {number} metrics.workingDays - Total working days in period
 * @param {number} metrics.callsReviewed - Number of calls listened to/reviewed
 * @param {number} metrics.callsWithFeedback - Calls that received any feedback
 * @param {number} metrics.comments - Number of written comments given
 * @param {number} metrics.scorecards - Number of scorecards completed
 * @param {number} metrics.liveAttended - Number of calls attended live
 * @param {number} metrics.markedFeedbackGiven - Calls marked as feedback delivered (optional)
 * @param {Array} metrics.aeCoachingData - Array of {listened, total} per AE (for distribution calc)
 *
 * @returns {number} Coaching score from 0-100
 */
export function calculateCoachingScore(metrics) {
  const {
    activeDays = 0,
    workingDays = 22,
    callsReviewed = 0,
    callsWithFeedback = 0,
    comments = 0,
    scorecards = 0,
    liveAttended = 0,
    markedFeedbackGiven = 0,
    aeCoachingData = null
  } = metrics;

  // If no activity at all, score is 0
  if (callsReviewed === 0 && comments === 0 && scorecards === 0 && liveAttended === 0) {
    return 0;
  }

  // 1. CONSISTENCY (30%): How regularly does the manager coach?
  const consistencyRate = workingDays > 0 ? (activeDays / workingDays) : 0;
  // Apply slight curve to reward high consistency
  const consistencyScore = Math.pow(consistencyRate, 0.9) * 100;

  // 2. FEEDBACK COVERAGE (30%): What % of calls get feedback?
  const coverageRate = callsReviewed > 0 ? (callsWithFeedback / callsReviewed) : 0;
  const coverageScore = coverageRate * 100;

  // 3. ENGAGEMENT DEPTH (20%): Quality of coaching activities
  // Weight the different activity types by value
  const weightedActivities =
    (scorecards * 4) +           // Formal evaluation - highest value
    (liveAttended * 3) +         // Live attendance - high engagement
    (comments * 2) +             // Written feedback
    (markedFeedbackGiven * 1) +  // Delivery confirmed
    (callsReviewed * 1);         // Base listening activity

  // Maximum possible: if every call got all activity types
  // Per call max: 4 (scorecard) + 3 (attended) + 2 (comment) + 1 (marked) + 1 (listened) = 11
  const maxPossible = callsReviewed * 11;
  const depthRate = maxPossible > 0 ? (weightedActivities / maxPossible) : 0;
  const depthScore = Math.min(depthRate * 100, 100);

  // 4. DISTRIBUTION (20%): How evenly is coaching coverage spread across AEs?
  const distributionScore = aeCoachingData
    ? calculateDistributionScore(aeCoachingData)
    : 100; // If no AE data provided, assume perfect distribution

  // Combine all components
  const rawScore = (consistencyScore * 0.30) +
                   (coverageScore * 0.30) +
                   (depthScore * 0.20) +
                   (distributionScore * 0.20);

  // Round and cap at 100
  return Math.round(Math.min(rawScore, 100));
}

/**
 * Calculate coaching score from AE-level data
 * Aggregates individual AE metrics to manager level
 *
 * @param {Array} aes - Array of AE objects belonging to a manager
 * @param {Object} options - Calculation options
 * @param {number} options.workingDays - Working days in period (default: 22)
 * @param {number} options.activeDays - Override for active days (if known)
 *
 * @returns {number} Coaching score from 0-100
 */
export function calculateCoachingScoreFromAEs(aes, options = {}) {
  const {
    workingDays = 22,
    activeDays = null
  } = options;

  // Aggregate metrics from AE data
  const callsReviewed = aes.reduce((sum, ae) => sum + (ae.calls_listened || ae.calls_coached || 0), 0);
  const callsWithFeedback = aes.reduce((sum, ae) => sum + (ae.calls_with_feedback || 0), 0);
  const comments = aes.reduce((sum, ae) => sum + (ae.calls_with_comments || ae.comments || 0), 0);
  const scorecards = aes.reduce((sum, ae) => sum + (ae.scorecards || 0), 0);
  const liveAttended = aes.reduce((sum, ae) => sum + (ae.calls_attended || ae.live_attended || 0), 0);
  const markedFeedbackGiven = aes.reduce((sum, ae) => sum + (ae.marked_as_feedback_given || 0), 0);

  // Get per-AE coaching data for distribution calculation (listened vs total)
  const aeCoachingData = aes.map(ae => ({
    listened: ae.calls_listened || ae.calls_coached || 0,
    total: ae.total_calls || 20 // Default to 20 if not specified
  }));

  // Estimate active days if not provided
  // Rough heuristic: assume ~3 coaching activities per active day
  const totalActivities = callsReviewed + comments + scorecards + liveAttended;
  const estimatedActiveDays = activeDays !== null
    ? activeDays
    : Math.min(Math.ceil(totalActivities / 3), workingDays);

  return calculateCoachingScore({
    activeDays: estimatedActiveDays,
    workingDays,
    callsReviewed,
    callsWithFeedback,
    comments,
    scorecards,
    liveAttended,
    markedFeedbackGiven,
    aeCoachingData
  });
}

/**
 * Get a breakdown of the score components for display/debugging
 *
 * @param {Object} metrics - Same as calculateCoachingScore
 * @returns {Object} Breakdown of each component score
 */
export function getScoreBreakdown(metrics) {
  const {
    activeDays = 0,
    workingDays = 22,
    callsReviewed = 0,
    callsWithFeedback = 0,
    comments = 0,
    scorecards = 0,
    liveAttended = 0,
    markedFeedbackGiven = 0,
    aeCoachingData = null
  } = metrics;

  // Consistency calculation
  const consistencyRate = workingDays > 0 ? (activeDays / workingDays) : 0;
  const consistencyScore = Math.pow(consistencyRate, 0.9) * 100;

  // Coverage calculation
  const coverageRate = callsReviewed > 0 ? (callsWithFeedback / callsReviewed) : 0;
  const coverageScore = coverageRate * 100;

  // Depth calculation
  const weightedActivities =
    (scorecards * 4) +
    (liveAttended * 3) +
    (comments * 2) +
    (markedFeedbackGiven * 1) +
    (callsReviewed * 1);
  const maxPossible = callsReviewed * 11;
  const depthRate = maxPossible > 0 ? (weightedActivities / maxPossible) : 0;
  const depthScore = Math.min(depthRate * 100, 100);

  // Distribution calculation (based on coverage % per AE)
  let distributionScore = 100;
  let distributionDetail = 'No AE data available';
  if (aeCoachingData && aeCoachingData.length > 0) {
    // Calculate coverage rates per AE
    const coverageRates = aeCoachingData.map(ae => {
      const total = ae.total || 1;
      const listened = ae.listened || 0;
      return Math.min(listened / total, 1);
    });

    const zeroCount = coverageRates.filter(rate => rate === 0).length;
    const mean = coverageRates.reduce((sum, rate) => sum + rate, 0) / coverageRates.length;
    const squaredDiffs = coverageRates.map(rate => Math.pow(rate - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / coverageRates.length;
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? stdDev / mean : 0;
    const zeroPenalty = zeroCount / coverageRates.length;
    const cvScore = Math.max(0, 100 - (cv * 50));
    distributionScore = Math.max(0, Math.round(cvScore * (1 - (zeroPenalty * 2))));

    // Calculate average coverage for detail
    const avgCoverage = Math.round(mean * 100);
    distributionDetail = zeroCount > 0
      ? `${zeroCount}/${aeCoachingData.length} AEs with zero coverage`
      : `${aeCoachingData.length} AEs, avg ${avgCoverage}% coverage each`;
  }

  return {
    consistency: {
      score: Math.round(consistencyScore),
      weight: '30%',
      label: 'Consistency',
      detail: `${activeDays}/${workingDays} active coaching days (${Math.round(consistencyRate * 100)}%)`
    },
    coverage: {
      score: Math.round(coverageScore),
      weight: '30%',
      label: 'Feedback Coverage',
      detail: `${callsWithFeedback}/${callsReviewed} calls received feedback (${Math.round(coverageRate * 100)}%)`
    },
    depth: {
      score: Math.round(depthScore),
      weight: '20%',
      label: 'Engagement Depth',
      detail: `${scorecards} scorecards, ${liveAttended} attended, ${comments} comments, ${callsReviewed} listened`
    },
    distribution: {
      score: distributionScore,
      weight: '20%',
      label: 'Distribution',
      detail: distributionDetail
    },
    total: calculateCoachingScore(metrics)
  };
}
