// Coaching Intelligence - AE Data
// 16 AEs (4 per manager)
//
// ===== COACHING ACTIVITY DEFINITIONS =====
//
// 1. calls_listened: Total calls listened to by manager (includes "listen live")
// 2. calls_attended: Calls where manager was a participant (active presence)
// 3. scorecards: Calls with structured coaching scorecards filled (e.g., Sandler methodology)
// 4. calls_with_comments: Calls with written comments (regardless of feedback status)
// 5. marked_as_feedback_given: Calls manually marked "Feedback given" (verbal feedback in 1:1, team meetings)
// 6. calls_with_feedback: DERIVED - unique calls with ANY feedback (comment OR scorecard OR marked)
//
// Note: calls_with_feedback ≤ sum of (scorecards + comments + marked) because a call can have multiple feedback types
//
// ===== REALISTIC BENCHMARKS (30-day period, per AE) =====
// - Best practice: 4-6 calls reviewed/month, 70-80% feedback rate
// - Good: 3-4 calls reviewed/month, 50-60% feedback rate
// - Average: 1-2 calls reviewed/month, 20-40% feedback rate
// - Poor: 0-1 calls reviewed/month, 0-15% feedback rate
//
// Sources:
// - https://www.koncert.com/blog/7-rules-sales-coaching
// - https://www.hyperbound.ai/blog/sales-coaching-benchmarks-2026

export const aes = [
  // ============================================
  // Sarah Chen's team (MGR001) - EXCELLENT PERFORMER
  // Best practice: ~5 calls/AE reviewed, 75% feedback rate
  // Total: 20 listened, 5 attended, 6 scorecards, 12 comments, 15 marked, 15 with feedback
  // ============================================
  {
    id: "AE001",
    name: "Alex Rivera",
    manager_id: "MGR001",
    quota: 125,
    total_calls: 28, // High performer, lots of activity
    // Coaching activities (directly tracked)
    calls_listened: 6,
    calls_attended: 2,
    scorecards: 2,
    calls_with_comments: 4,
    marked_as_feedback_given: 5,
    // Derived: unique calls with any feedback type
    // 5 calls had feedback (some had both comment + scorecard)
    calls_with_feedback: 5,
    // Feedback details
    last_feedback_date: "2026-01-22",
    last_feedback_call: "CALL-1042",
    last_feedback_preview: "Strong pricing defense. When they pushed back on the 15% increase, you anchored to value delivered last year ($2.3M in efficiency gains)...",
    quality: "specific",
    flag: null
  },
  {
    id: "AE002",
    name: "Emma Liu",
    manager_id: "MGR001",
    quota: 115,
    total_calls: 24,
    calls_listened: 5,
    calls_attended: 1,
    scorecards: 2,
    calls_with_comments: 3,
    marked_as_feedback_given: 4,
    calls_with_feedback: 4,
    last_feedback_date: "2026-01-18",
    last_feedback_call: "CALL-1089",
    last_feedback_preview: "Good discovery recap at the start of the demo. You connected their pain points directly to the dashboard walkthrough...",
    quality: "specific",
    flag: null
  },
  {
    id: "AE003",
    name: "Ryan Patel",
    manager_id: "MGR001",
    quota: 108,
    total_calls: 22,
    calls_listened: 5,
    calls_attended: 1,
    scorecards: 1,
    calls_with_comments: 3,
    marked_as_feedback_given: 3,
    calls_with_feedback: 3,
    last_feedback_date: "2026-01-20",
    last_feedback_call: "CALL-1103",
    last_feedback_preview: "I noticed you didn't ask about their decision timeline until minute 38. Let's work on your BANT qualification...",
    quality: "specific",
    flag: null
  },
  {
    id: "AE004",
    name: "Sofia Andersson",
    manager_id: "MGR001",
    quota: 122,
    total_calls: 26,
    calls_listened: 4,
    calls_attended: 1,
    scorecards: 1,
    calls_with_comments: 2,
    marked_as_feedback_given: 3,
    calls_with_feedback: 3,
    last_feedback_date: "2026-01-22",
    last_feedback_call: "CALL-1156",
    last_feedback_preview: "Excellent job handling the competitive objection. When they mentioned Clari, you didn't bash the competitor...",
    quality: "specific",
    flag: null
  },

  // ============================================
  // Marcus Jones's team (MGR002) - GOOD BUT DECLINING
  // Moderate: ~2.5 calls/AE reviewed, 50% feedback rate, uneven distribution
  // Total: 10 listened, 2 attended, 2 scorecards, 4 comments, 2 marked, 6 with feedback
  // Lauren is notably undercoached
  // Quality improving: James & Priya now receiving specific feedback
  // ============================================
  {
    id: "AE005",
    name: "James Wilson",
    manager_id: "MGR002",
    quota: 102,
    total_calls: 22,
    calls_listened: 4,
    calls_attended: 1,
    scorecards: 1,
    calls_with_comments: 2,
    marked_as_feedback_given: 1,  // Only 1 explicitly marked
    calls_with_feedback: 3,       // 3 unique calls have feedback (comment OR scorecard OR marked)
    last_feedback_date: "2026-01-22",
    last_feedback_call: "CALL-2112",
    last_feedback_preview: "Strong use of the anchoring technique we discussed. Value first, then numbers.",
    quality: "specific",
    flag: null
  },
  {
    id: "AE006",
    name: "Priya Sharma",
    manager_id: "MGR002",
    quota: 94,
    total_calls: 20,
    calls_listened: 3,
    calls_attended: 1,
    scorecards: 1,
    calls_with_comments: 1,
    marked_as_feedback_given: 1,  // Only 1 explicitly marked
    calls_with_feedback: 2,       // 2 unique calls have feedback
    last_feedback_date: "2026-01-14",
    last_feedback_call: "CALL-2067",
    last_feedback_preview: "Demo ran 52 mins—try to keep under 45. Save deep-dive for technical eval.",
    quality: "specific",
    flag: null
  },
  {
    id: "AE007",
    name: "Michael Brown",
    manager_id: "MGR002",
    quota: 98,
    total_calls: 21,
    calls_listened: 2,
    calls_attended: 0,
    scorecards: 0,
    calls_with_comments: 1,
    marked_as_feedback_given: 0,  // None explicitly marked
    calls_with_feedback: 1,       // 1 call has a comment
    last_feedback_date: "2025-12-15",
    last_feedback_call: "CALL-2045",
    last_feedback_preview: "Solid qualification call.",
    quality: "vague",
    flag: null
  },
  {
    id: "AE008",
    name: "Lauren Kim",
    manager_id: "MGR002",
    quota: 89,
    total_calls: 18, // Still has calls, just not being coached
    calls_listened: 1,
    calls_attended: 0,
    scorecards: 0,
    calls_with_comments: 0,
    marked_as_feedback_given: 0,
    calls_with_feedback: 0,
    last_feedback_date: "2025-12-02",
    last_feedback_call: "CALL-2023",
    last_feedback_preview: "Good start. Keep building rapport.",
    quality: "vague",
    flag: "undercoached"
  },

  // ============================================
  // Jennifer Walsh's team (MGR003) - BELOW AVERAGE
  // Low engagement: ~2 calls/AE reviewed, 25% feedback rate, generic feedback
  // Total: 8 listened, 1 attended, 1 scorecard, 2 comments, 2 marked, 2 with feedback
  // Listening without coaching - monitoring but not developing
  // ============================================
  {
    id: "AE009",
    name: "Chris Taylor",
    manager_id: "MGR003",
    quota: 95,
    total_calls: 20,
    calls_listened: 3,
    calls_attended: 1,
    scorecards: 1,
    calls_with_comments: 1,
    marked_as_feedback_given: 1,
    calls_with_feedback: 1,
    last_feedback_date: "2026-01-18",
    last_feedback_call: "CALL-3045",
    last_feedback_preview: "Good call.",
    quality: "generic",
    flag: null
  },
  {
    id: "AE010",
    name: "Amanda Foster",
    manager_id: "MGR003",
    quota: 82,
    total_calls: 16,
    calls_listened: 2,
    calls_attended: 0,
    scorecards: 0,
    calls_with_comments: 0,
    marked_as_feedback_given: 0,
    calls_with_feedback: 0,
    last_feedback_date: "2026-01-05",
    last_feedback_call: "CALL-3033",
    last_feedback_preview: "OK.",
    quality: "generic",
    flag: "undercoached"
  },
  {
    id: "AE011",
    name: "Kevin O'Brien",
    manager_id: "MGR003",
    quota: 91,
    total_calls: 19,
    calls_listened: 2,
    calls_attended: 0,
    scorecards: 0,
    calls_with_comments: 1,
    marked_as_feedback_given: 1,
    calls_with_feedback: 1,
    last_feedback_date: "2026-01-20",
    last_feedback_call: "CALL-3055",
    last_feedback_preview: "Good call. Keep it up.",
    quality: "generic",
    flag: null
  },
  {
    id: "AE012",
    name: "Natalie Cruz",
    manager_id: "MGR003",
    quota: 84,
    total_calls: 17,
    calls_listened: 1,
    calls_attended: 0,
    scorecards: 0,
    calls_with_comments: 0,
    marked_as_feedback_given: 0,
    calls_with_feedback: 0,
    last_feedback_date: "2025-12-12",
    last_feedback_call: "CALL-3028",
    last_feedback_preview: "Fine.",
    quality: "generic",
    flag: "undercoached"
  },

  // ============================================
  // David Park's team (MGR004) - CRITICAL / NEEDS INTERVENTION
  // Minimal activity: ~0.5 calls/AE reviewed, 0% feedback rate
  // Total: 2 listened, 0 attended, 0 scorecards, 0 comments, 0 marked, 0 with feedback
  // Zero coaching in past 14 days - team in crisis
  // ============================================
  {
    id: "AE013",
    name: "Brandon Lee",
    manager_id: "MGR004",
    quota: 72,
    total_calls: 15,
    calls_listened: 1,
    calls_attended: 0,
    scorecards: 0,
    calls_with_comments: 0,
    marked_as_feedback_given: 0,
    calls_with_feedback: 0,
    last_feedback_date: "2026-01-06",
    last_feedback_call: "CALL-4008",
    last_feedback_preview: "Listened to this one. Seemed fine.",
    quality: "generic",
    flag: "undercoached"
  },
  {
    id: "AE014",
    name: "Rachel Green",
    manager_id: "MGR004",
    quota: 58,
    total_calls: 12,
    calls_listened: 1,
    calls_attended: 0,
    scorecards: 0,
    calls_with_comments: 0,
    marked_as_feedback_given: 0,
    calls_with_feedback: 0,
    last_feedback_date: null,
    last_feedback_call: null,
    last_feedback_preview: "No feedback recorded",
    quality: "none",
    flag: "critical"
  },
  {
    id: "AE015",
    name: "Tyler Morgan",
    manager_id: "MGR004",
    quota: 65,
    total_calls: 14,
    calls_listened: 0,
    calls_attended: 0,
    scorecards: 0,
    calls_with_comments: 0,
    marked_as_feedback_given: 0,
    calls_with_feedback: 0,
    last_feedback_date: null,
    last_feedback_call: null,
    last_feedback_preview: "No feedback recorded",
    quality: "none",
    flag: "critical"
  },
  {
    id: "AE016",
    name: "Jessica Huang",
    manager_id: "MGR004",
    quota: 54,
    total_calls: 11,
    calls_listened: 0,
    calls_attended: 0,
    scorecards: 0,
    calls_with_comments: 0,
    marked_as_feedback_given: 0,
    calls_with_feedback: 0,
    last_feedback_date: null,
    last_feedback_call: null,
    last_feedback_preview: "No feedback recorded",
    quality: "none",
    flag: "critical"
  }
];

// Helper functions
export const getAEsByManager = (managerId) => aes.filter(ae => ae.manager_id === managerId);

export const getAEById = (id) => aes.find(ae => ae.id === id);

export const getUndercoached = () => aes.filter(ae => ae.flag === "undercoached" || ae.flag === "critical");

// Aggregate manager coaching stats from AE data
export const getManagerCoachingStats = (managerId) => {
  const teamAEs = getAEsByManager(managerId);
  const totals = {
    total_calls_listened: teamAEs.reduce((sum, ae) => sum + ae.calls_listened, 0),
    total_calls_attended: teamAEs.reduce((sum, ae) => sum + ae.calls_attended, 0),
    total_scorecards: teamAEs.reduce((sum, ae) => sum + ae.scorecards, 0),
    total_calls_with_comments: teamAEs.reduce((sum, ae) => sum + ae.calls_with_comments, 0),
    total_marked_feedback: teamAEs.reduce((sum, ae) => sum + ae.marked_as_feedback_given, 0),
    total_calls_with_feedback: teamAEs.reduce((sum, ae) => sum + ae.calls_with_feedback, 0),
    total_ae_calls: teamAEs.reduce((sum, ae) => sum + (ae.total_calls || 0), 0),
    ae_count: teamAEs.length
  };

  // Calculate feedback rate: calls with feedback / calls listened
  totals.feedback_rate = totals.total_calls_listened > 0
    ? Math.round((totals.total_calls_with_feedback / totals.total_calls_listened) * 100)
    : 0;

  // Calculate team quota attainment (average of AE quotas)
  totals.team_quota_attainment = teamAEs.length > 0
    ? Math.round(teamAEs.reduce((sum, ae) => sum + (ae.quota || 0), 0) / teamAEs.length)
    : 0;

  // Count undercoached AEs
  totals.undercoached_count = teamAEs.filter(ae => ae.flag === "undercoached" || ae.flag === "critical").length;

  return totals;
};

// Estimate active coaching days from activity volume
// Heuristic: ~2-3 coaching activities per active day
export const estimateActiveDays = (managerId, workingDays = 22) => {
  const stats = getManagerCoachingStats(managerId);
  const totalActivities = stats.total_calls_listened +
    stats.total_calls_with_comments +
    stats.total_scorecards +
    stats.total_calls_attended;

  // More activities = more active days, but cap at working days
  // Assume ~2.5 activities per active day on average
  const estimated = Math.ceil(totalActivities / 2.5);
  return Math.min(estimated, workingDays);
};
