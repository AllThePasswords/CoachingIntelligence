// Coaching Intelligence - AE Data
// 16 AEs (4 per manager)

export const aes = [
  // Sarah Chen's team (MGR001) - All exceeding quota
  {
    id: "AE001",
    name: "Alex Rivera",
    manager_id: "MGR001",
    quota: 125,
    calls_coached: 18,
    comments: 12,
    scorecards: 5,
    live_attended: 2,
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
    calls_coached: 16,
    comments: 10,
    scorecards: 4,
    live_attended: 2,
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
    calls_coached: 14,
    comments: 8,
    scorecards: 3,
    live_attended: 1,
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
    calls_coached: 12,
    comments: 8,
    scorecards: 2,
    live_attended: 1,
    last_feedback_date: "2026-01-22",
    last_feedback_call: "CALL-1156",
    last_feedback_preview: "Excellent job handling the competitive objection. When they mentioned Clari, you didn't bash the competitor...",
    quality: "specific",
    flag: null
  },

  // Marcus Thompson's team (MGR002) - Mixed, with Lauren undercoached
  {
    id: "AE005",
    name: "James Wilson",
    manager_id: "MGR002",
    quota: 102,
    calls_coached: 5,
    comments: 4,
    scorecards: 2,
    live_attended: 1,
    last_feedback_date: "2026-01-18",
    last_feedback_call: "CALL-2089",
    last_feedback_preview: "Solid demo. Good energy. Maybe trim the intro section next time.",
    quality: "moderate",
    flag: null
  },
  {
    id: "AE006",
    name: "Priya Sharma",
    manager_id: "MGR002",
    quota: 94,
    calls_coached: 4,
    comments: 3,
    scorecards: 1,
    live_attended: 0,
    last_feedback_date: "2026-01-14",
    last_feedback_call: "CALL-2067",
    last_feedback_preview: "Demo ran a bit long. Try to keep it under 45 mins. Otherwise, good energy.",
    quality: "vague",
    flag: null
  },
  {
    id: "AE007",
    name: "Michael Brown",
    manager_id: "MGR002",
    quota: 98,
    calls_coached: 3,
    comments: 2,
    scorecards: 1,
    live_attended: 0,
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
    calls_coached: 2,
    comments: 1,
    scorecards: 0,
    live_attended: 0,
    last_feedback_date: "2025-12-02",
    last_feedback_call: "CALL-2023",
    last_feedback_preview: "Good start. Keep building rapport.",
    quality: "vague",
    flag: "undercoached"
  },

  // Jennifer Walsh's team (MGR003) - Underperforming with generic feedback
  {
    id: "AE009",
    name: "Chris Taylor",
    manager_id: "MGR003",
    quota: 95,
    calls_coached: 5,
    comments: 3,
    scorecards: 1,
    live_attended: 1,
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
    calls_coached: 2,
    comments: 1,
    scorecards: 0,
    live_attended: 0,
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
    calls_coached: 4,
    comments: 2,
    scorecards: 1,
    live_attended: 0,
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
    calls_coached: 2,
    comments: 1,
    scorecards: 0,
    live_attended: 0,
    last_feedback_date: "2025-12-12",
    last_feedback_call: "CALL-3028",
    last_feedback_preview: "Fine.",
    quality: "generic",
    flag: "undercoached"
  },

  // David Park's team (MGR004) - Critical, minimal to no coaching
  {
    id: "AE013",
    name: "Brandon Lee",
    manager_id: "MGR004",
    quota: 72,
    calls_coached: 1,
    comments: 1,
    scorecards: 0,
    live_attended: 0,
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
    calls_coached: 1,
    comments: 0,
    scorecards: 0,
    live_attended: 0,
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
    calls_coached: 0,
    comments: 0,
    scorecards: 0,
    live_attended: 0,
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
    calls_coached: 0,
    comments: 0,
    scorecards: 0,
    live_attended: 0,
    last_feedback_date: null,
    last_feedback_call: null,
    last_feedback_preview: "No feedback recorded",
    quality: "none",
    flag: "critical"
  }
];

export const getAEsByManager = (managerId) => aes.filter(ae => ae.manager_id === managerId);

export const getAEById = (id) => aes.find(ae => ae.id === id);

export const getUndercoached = () => aes.filter(ae => ae.flag === "undercoached" || ae.flag === "critical");
