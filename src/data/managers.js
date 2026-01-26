// Coaching Intelligence - Manager Data
// 4 managers with varying performance levels

export const managers = [
  {
    id: "MGR001",
    name: "Sarah Chen",
    region: "West",
    performance: "excellent",
    quota_attainment: 118,
    coaching_score: 97,
    team_win_rate: 42,
    trend: "stable",
    summary: "Consistently high engagement with specific, actionable feedback. All AEs above quota with strong pipeline coverage.",
    coaching_investment: { level: "High", activities: 171 },
    improvement: { trend: "Stable", days: 90 },
    distribution: "Even",
    team_performance: "Exceeding",
    sources: {
      call_listening: 60,
      call_attendance: 18,
      call_comments: 38,
      scorecards: 14,
      feedback_events: 112,
      forecast_updates: 24
    }
  },
  {
    id: "MGR002",
    name: "Marcus Jones",
    region: "East",
    performance: "good",
    quota_attainment: 96,
    coaching_score: 56,
    team_win_rate: 34,
    trend: "declining",
    summary: "Solid coaching foundation but engagement declining over past 30 days. Lauren Kim under-coached compared to rest of team.",
    coaching_investment: { level: "Medium", activities: 89 },
    improvement: { trend: "Declining", days: 90 },
    distribution: "Uneven",
    team_performance: "On Track",
    sources: {
      call_listening: 14,
      call_attendance: 8,
      call_comments: 10,
      scorecards: 4,
      feedback_events: 34,
      forecast_updates: 18
    }
  },
  {
    id: "MGR003",
    name: "Jennifer Walsh",
    region: "Central",
    performance: "average",
    quota_attainment: 88,
    coaching_score: 26,
    team_win_rate: 31,
    trend: "stable",
    summary: "High call listening but minimal coaching delivered. Feedback lacks substance and actionable guidance for the team.",
    coaching_investment: { level: "Low", activities: 44 },
    improvement: { trend: "Stable", days: 90 },
    distribution: "Sporadic",
    team_performance: "Underperforming",
    sources: {
      call_listening: 13,
      call_attendance: 3,
      call_comments: 7,
      scorecards: 2,
      feedback_events: 8,
      forecast_updates: 12
    }
  },
  {
    id: "MGR004",
    name: "David Park",
    region: "South",
    performance: "needs_intervention",
    quota_attainment: 62,
    coaching_score: 5,
    team_win_rate: 19,
    trend: "declining",
    summary: "Critical intervention needed. Zero coaching activities in past 14 days. Team performance declining with multiple reps at risk.",
    coaching_investment: { level: "Minimal", activities: 22 },
    improvement: { trend: "Declining", days: 90 },
    distribution: "Absent",
    team_performance: "Underperforming",
    sources: {
      call_listening: 2,
      call_attendance: 1,
      call_comments: 1,
      scorecards: 0,
      feedback_events: 1,
      forecast_updates: 4
    }
  }
];

export const getManagerById = (id) => managers.find(m => m.id === id);

export const getManagersByPerformance = (performance) => 
  managers.filter(m => m.performance === performance);
