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
    summary: "Consistently high engagement, specific feedback, all AEs above quota.",
    coaching_investment: { level: "High", activities: 171 },
    improvement: { trend: "Stable", days: 90 },
    distribution: "Even",
    team_performance: "Exceeding",
    sources: {
      call_listening: 171,
      call_attendance: 18,
      call_comments: 156,
      scorecards: 42,
      feedback_events: 112,
      forecast_updates: 24
    }
  },
  {
    id: "MGR002",
    name: "Marcus Thompson",
    region: "East",
    performance: "good",
    quota_attainment: 96,
    coaching_score: 56,
    team_win_rate: 34,
    trend: "declining",
    summary: "Solid foundation but declining engagement. Lauren Kim under-coached.",
    coaching_investment: { level: "Medium", activities: 89 },
    improvement: { trend: "Declining", days: 90 },
    distribution: "Uneven",
    team_performance: "On Track",
    sources: {
      call_listening: 89,
      call_attendance: 8,
      call_comments: 62,
      scorecards: 16,
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
    summary: "Listening but not coaching. Feedback lacks substance.",
    coaching_investment: { level: "Low", activities: 44 },
    improvement: { trend: "Stable", days: 90 },
    distribution: "Sporadic",
    team_performance: "Underperforming",
    sources: {
      call_listening: 44,
      call_attendance: 3,
      call_comments: 28,
      scorecards: 6,
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
    summary: "Critical: Zero coaching in 14 days. Team in crisis.",
    coaching_investment: { level: "Minimal", activities: 22 },
    improvement: { trend: "Declining", days: 90 },
    distribution: "Absent",
    team_performance: "Underperforming",
    sources: {
      call_listening: 22,
      call_attendance: 1,
      call_comments: 8,
      scorecards: 0,
      feedback_events: 1,
      forecast_updates: 4
    }
  }
];

export const getManagerById = (id) => managers.find(m => m.id === id);

export const getManagersByPerformance = (performance) => 
  managers.filter(m => m.performance === performance);
