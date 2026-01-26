# Coaching Intelligence MVP - Claude Code Handoff

## Overview

Build an interactive React prototype for "Coaching Intelligence" - an AI-powered system that helps VPs of Sales monitor and improve their sales managers' coaching effectiveness.

**Primary User:** Ann Martinez (VP of Sales)
**Goal:** Answer 5 key questions about her managers' coaching without manual data mining

---

## The 5 Questions the System Must Answer

1. **How much effort does each manager invest in coaching?**
2. **Does a manager improve or decline in coaching efforts over time?**
3. **How are they coaching?** (Listening, commenting, scorecards, attending)
4. **Do they distribute coaching appropriately across AEs?**
5. **What type of feedback are they providing for each AE?**

---

## Screens to Build

### Screen 1: Dashboard (Manager Overview)

**Purpose:** At-a-glance view of all 4 managers' coaching performance

**Components:**
- Header with title "Coaching Intelligence" and timeframe toggle (30/60/90 days)
- 4 Manager Cards (see design spec below)
- "Ask anything about your team's coaching..." input at bottom
- Clicking a card → navigates to Screen 2

**Manager Card Contents:**
- Role label: "SALES MANAGER" (uppercase, small)
- Manager name (large, bold)
- Two metrics side-by-side with divider:
  - Attainment: XX% + trend arrow
  - Coaching Score: XX% + trend arrow
- AI Summary (10-15 words)
- Suggested Action preview
- Action icons: Bell (notify), Arrow (drill down)

---

### Screen 2: Manager Detail View

**Purpose:** Deep dive into one manager's coaching behavior with AI-generated insights

**Header:**
- Back button
- Manager name + region
- Timeframe toggle (30/60/90 days)

**Hero Section:**
- Role + Name
- Attainment + Coaching Score (large, with trends)
- AI Summary sentence

**Insight Sections:**
1. **Coaching Investment** - High/Medium/Low + activity count
2. **Trend Over Time** - Declining/Stable/Improving + timeframe
3. **Coaching Distribution** - Sporadic/Even/Focused + visual
4. **Team Performance** - Underperforming/On Track/Exceeding
5. **Feedback Quality** - With example quotes and citations

**AE Distribution Table:**
| AE Name | Quota % | Calls Coached | Comments | Scorecards | Last Feedback | Flag |

**Actions Bar:**
- "Suggested Next Best Action" button
- Sources count badge
- "Ask" button
- Bell icon
- Arrow icon

**Conversation Thread:**
- Input: "Ask about [Manager]'s coaching..."
- Messages appear below with:
  - User question
  - AI response with citations [→ CALL-1042]
  - Suggested follow-up questions
  - Contextual action buttons

**Intelligence Sources Footer:**
- Call Listening: XX
- Call Attendance: XX
- Call Comments: XX
- Scorecards: XX
- Feedback Events: XX

---

### Citation Modal

**Triggered by:** Clicking any citation link [→ CALL-1042]

**Contents:**
- Call ID, Date, AE Name, Manager Name
- Pipeline Stage, Duration
- Coaching Activity checklist (Listened, Attended, Feedback, Comments, Scorecard)
- Feedback text (if any)
- "View Full Call" link (mocked)

---

### Action Confirmation Modal

**Triggered by:** Clicking a suggested action

**Example: "Add to 1:1 with David Park"**
- Shows next 1:1 date/time
- Editable topic text with pre-filled insight
- Sources listed
- "Edit" and "Add to 1:1 ✓" buttons

---

## Design Specifications

### Colors

```css
:root {
  /* Backgrounds */
  --bg-page: #F5F5F5;
  --bg-card: #FFFFFF;
  --bg-card-gradient: linear-gradient(135deg, #FFFFFF 0%, #FDF2F8 100%);
  
  /* Text */
  --text-primary: #171717;
  --text-secondary: #525252;
  --text-tertiary: #737373;
  --text-muted: #A3A3A3;
  
  /* Status */
  --status-success: #22C55E;
  --status-warning: #F59E0B;
  --status-error: #EF4444;
  --status-info: #3B82F6;
  
  /* Accents */
  --accent-pink: #EC4899;
  --accent-purple: #A855F7;
  
  /* Borders */
  --border-light: #E5E5E5;
  --border-default: #D4D4D4;
}
```

### Typography (Geist)

```css
/* Import Geist */
@import url('https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css');
@import url('https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-mono/style.css');

:root {
  --font-sans: 'Geist Sans', -apple-system, sans-serif;
  --font-mono: 'Geist Mono', monospace;
}

/* Type Scale */
.text-role {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-tertiary);
}

.text-name {
  font-family: var(--font-sans);
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.text-metric-label {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.text-metric-value {
  font-family: var(--font-sans);
  font-size: 42px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1;
}

.text-summary {
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 400;
  color: var(--text-secondary);
  line-height: 1.5;
}

.text-section-label {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.text-section-value {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 400;
  color: var(--text-secondary);
}

.text-citation {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--status-info);
}

.text-data {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
}
```

### Component Styles

```css
/* Card */
.card {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04);
}

.card-with-gradient {
  background: var(--bg-card-gradient);
}

/* Button - Primary Action */
.btn-action {
  background: var(--text-primary);
  color: white;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  padding: 12px 20px;
  border-radius: 100px;
  border: none;
  cursor: pointer;
}

/* Button - Secondary */
.btn-secondary {
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-default);
}

/* Badge */
.badge {
  background: var(--bg-page);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
}

/* Input */
.input-ask {
  width: 100%;
  padding: 16px 20px;
  font-family: var(--font-sans);
  font-size: 15px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  background: var(--bg-card);
}

/* Trend Arrow */
.trend-down {
  color: var(--status-error);
}

.trend-up {
  color: var(--status-success);
}

.trend-stable {
  color: var(--text-tertiary);
}

/* Citation Link */
.citation {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--status-info);
  cursor: pointer;
  text-decoration: none;
}

.citation:hover {
  text-decoration: underline;
}

/* Divider */
.divider-vertical {
  width: 1px;
  background: var(--border-light);
  margin: 0 24px;
}
```

### Spacing

```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
}
```

### Icons

Use Lucide React icons:
- `ArrowDown` / `ArrowUp` - Trend indicators (inside circle)
- `Bell` - Notifications
- `ArrowRight` - Drill down / navigate
- `MessageSquare` - Ask / chat
- `ChevronLeft` - Back
- `X` - Close modal
- `Check` - Confirm action
- `AlertTriangle` - Warning flag
- `Star` - Recognition

---

## Data Model

### Managers (4)

```javascript
const managers = [
  {
    id: "MGR001",
    name: "Sarah Chen",
    region: "West",
    performance: "excellent",
    quota_attainment: 118,
    coaching_score: 97,
    team_win_rate: 42,
    trend: "stable", // stable | improving | declining
    summary: "Consistently high engagement, specific feedback, all AEs above quota.",
    coaching_investment: { level: "High", activities: 171 },
    improvement: { trend: "Stable", days: 90 },
    distribution: "Even",
    team_performance: "Exceeding"
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
    team_performance: "On Track"
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
    team_performance: "Underperforming"
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
    team_performance: "Underperforming"
  }
];
```

### AEs (16 total, 4 per manager)

```javascript
const aes = [
  // Sarah Chen's team
  { id: "AE001", name: "Alex Rivera", manager_id: "MGR001", quota: 125, calls_coached: 18, comments: 12, scorecards: 5, last_feedback: "Jan 22", last_feedback_preview: "Strong pricing defense. When they pushed back on the 15% increase...", quality: "specific" },
  { id: "AE002", name: "Emma Liu", manager_id: "MGR001", quota: 115, calls_coached: 16, comments: 10, scorecards: 4, last_feedback: "Jan 18", last_feedback_preview: "Good discovery recap at the start of the demo...", quality: "specific" },
  { id: "AE003", name: "Ryan Patel", manager_id: "MGR001", quota: 108, calls_coached: 14, comments: 8, scorecards: 3, last_feedback: "Jan 20", last_feedback_preview: "I noticed you didn't ask about their decision timeline...", quality: "specific" },
  { id: "AE004", name: "Sofia Andersson", manager_id: "MGR001", quota: 122, calls_coached: 12, comments: 8, scorecards: 2, last_feedback: "Jan 22", last_feedback_preview: "Excellent job handling the competitive objection...", quality: "specific" },
  
  // Marcus Thompson's team
  { id: "AE005", name: "James Wilson", manager_id: "MGR002", quota: 102, calls_coached: 5, comments: 4, scorecards: 2, last_feedback: "Jan 18", last_feedback_preview: "Solid demo. Good energy. Maybe trim the intro section.", quality: "moderate" },
  { id: "AE006", name: "Priya Sharma", manager_id: "MGR002", quota: 94, calls_coached: 4, comments: 3, scorecards: 1, last_feedback: "Jan 14", last_feedback_preview: "Demo ran a bit long. Try to keep it under 45 mins.", quality: "vague" },
  { id: "AE007", name: "Michael Brown", manager_id: "MGR002", quota: 98, calls_coached: 3, comments: 2, scorecards: 1, last_feedback: "Dec 15", last_feedback_preview: "Solid qualification call.", quality: "vague" },
  { id: "AE008", name: "Lauren Kim", manager_id: "MGR002", quota: 89, calls_coached: 2, comments: 1, scorecards: 0, last_feedback: "Dec 2", last_feedback_preview: "Good start. Keep building rapport.", quality: "vague", flag: "undercoached" },
  
  // Jennifer Walsh's team
  { id: "AE009", name: "Chris Taylor", manager_id: "MGR003", quota: 95, calls_coached: 5, comments: 3, scorecards: 1, last_feedback: "Jan 18", last_feedback_preview: "Good call.", quality: "generic" },
  { id: "AE010", name: "Amanda Foster", manager_id: "MGR003", quota: 82, calls_coached: 2, comments: 1, scorecards: 0, last_feedback: "Jan 5", last_feedback_preview: "OK.", quality: "generic", flag: "undercoached" },
  { id: "AE011", name: "Kevin O'Brien", manager_id: "MGR003", quota: 91, calls_coached: 4, comments: 2, scorecards: 1, last_feedback: "Jan 20", last_feedback_preview: "Good call. Keep it up.", quality: "generic" },
  { id: "AE012", name: "Natalie Cruz", manager_id: "MGR003", quota: 84, calls_coached: 2, comments: 1, scorecards: 0, last_feedback: "Dec 12", last_feedback_preview: "Fine.", quality: "generic", flag: "undercoached" },
  
  // David Park's team
  { id: "AE013", name: "Brandon Lee", manager_id: "MGR004", quota: 72, calls_coached: 1, comments: 1, scorecards: 0, last_feedback: "Jan 6", last_feedback_preview: "Listened to this one. Seemed fine.", quality: "generic", flag: "undercoached" },
  { id: "AE014", name: "Rachel Green", manager_id: "MGR004", quota: 58, calls_coached: 1, comments: 0, scorecards: 0, last_feedback: "None", last_feedback_preview: "No feedback recorded", quality: "none", flag: "critical" },
  { id: "AE015", name: "Tyler Morgan", manager_id: "MGR004", quota: 65, calls_coached: 0, comments: 0, scorecards: 0, last_feedback: "None", last_feedback_preview: "No feedback recorded", quality: "none", flag: "critical" },
  { id: "AE016", name: "Jessica Huang", manager_id: "MGR004", quota: 54, calls_coached: 0, comments: 0, scorecards: 0, last_feedback: "None", last_feedback_preview: "No feedback recorded", quality: "none", flag: "critical" }
];
```

### Sample Feedback (for citations)

```javascript
const feedbackLog = [
  {
    id: "FB001",
    call_id: "CALL-1042",
    date: "2026-01-22",
    manager_id: "MGR001",
    manager_name: "Sarah Chen",
    ae_id: "AE001",
    ae_name: "Alex Rivera",
    pipeline_stage: "Negotiation",
    duration: 45,
    type: "comment",
    feedback: "Strong pricing defense. When they pushed back on the 15% increase, you anchored to value delivered last year ($2.3M in efficiency gains) before discussing numbers. This is exactly the framework we practiced. Next time, try pausing longer after stating the anchor—let them respond first.",
    quality: "specific",
    listened: true,
    attended: false,
    has_feedback: true,
    has_comments: true,
    has_scorecard: false
  },
  // ... more feedback entries
];
```

### Timeframe Data

```javascript
const timeframeData = {
  "30": {
    benchmark: 45,
    summaries: {
      "MGR001": { calls: 56, score: 95, active_days: 19, working_days: 22 },
      "MGR002": { calls: 23, score: 56, active_days: 8, working_days: 22 },
      "MGR003": { calls: 11, score: 26, active_days: 9, working_days: 22 },
      "MGR004": { calls: 3, score: 5, active_days: 2, working_days: 22 }
    }
  },
  "60": {
    benchmark: 90,
    summaries: {
      "MGR001": { calls: 118, score: 97, active_days: 38, working_days: 44 },
      "MGR002": { calls: 46, score: 62, active_days: 18, working_days: 44 },
      "MGR003": { calls: 26, score: 25, active_days: 16, working_days: 44 },
      "MGR004": { calls: 7, score: 6, active_days: 5, working_days: 44 }
    }
  },
  "90": {
    benchmark: 135,
    summaries: {
      "MGR001": { calls: 171, score: 96, active_days: 57, working_days: 66 },
      "MGR002": { calls: 89, score: 75, active_days: 35, working_days: 66 },
      "MGR003": { calls: 44, score: 35, active_days: 26, working_days: 66 },
      "MGR004": { calls: 22, score: 17, active_days: 12, working_days: 66 }
    }
  }
};
```

---

## AI Summaries (Pre-generated for each manager)

### Sarah Chen (MGR001)

```javascript
const sarahSummary = {
  headline: "Consistently high coaching engagement with measurable team impact",
  
  effort: "Sarah invested significant coaching effort this month, reviewing 56 calls across 19 active days. This is 2.5x the team average and represents consistent daily engagement.",
  
  trend: "Coaching volume has been stable across all 13 weeks. No decline despite quarter-end pressure.",
  
  methods: {
    calls_listened: 56,
    calls_attended: 6,
    calls_with_feedback: 39,
    calls_with_comments: 42,
    calls_with_scorecards: 14
  },
  
  distribution: "Coaching is distributed across all AEs, with appropriate weighting toward development needs. Alex receives focused attention for senior role development.",
  
  feedback_quality: "Sarah's feedback is specific, actionable, and tied to observable behaviors. She consistently cites specific moments, connects to frameworks, and provides clear action items.",
  
  flags: [
    { type: "positive", text: "Top coaching performer. Consider documenting her feedback approach as a best practice template." },
    { type: "positive", text: "All 4 AEs above quota. Team win rate (42%) is 11 points above org average." }
  ],
  
  suggested_actions: [
    { label: "Recognize Sarah in team channel", icon: "star" },
    { label: "Create coaching template from her approach", icon: "file" },
    { label: "Pair Sarah with David for peer coaching", icon: "users" }
  ]
};
```

### David Park (MGR004)

```javascript
const davidSummary = {
  headline: "Critical coaching gap with team in crisis",
  
  effort: "David reviewed only 3 calls this month across 2 active days. This represents a 93% gap versus the 45-call benchmark and is the lowest engagement across all managers.",
  
  trend: "Coaching activity has effectively ceased. Zero activity in the past 14 days. Month 1 showed some engagement (15 calls), but Month 3 is near-zero.",
  
  methods: {
    calls_listened: 3,
    calls_attended: 0,
    calls_with_feedback: 0,
    calls_with_comments: 1,
    calls_with_scorecards: 0
  },
  
  distribution: "Two AEs received minimal attention. Two received nothing. Tyler Morgan and Jessica Huang have had zero coaching despite being significantly below quota.",
  
  feedback_quality: "Only one feedback comment recorded: 'Listened to this one. Seemed fine.' This is not coaching—it's a log entry.",
  
  flags: [
    { type: "critical", text: "Zero coaching activity in past 14 days. Immediate intervention required." },
    { type: "critical", text: "Jessica Huang (54%) and Rachel Green (58%) are in critical territory with no coaching support." },
    { type: "critical", text: "Team quota at 62%—lowest across all regions. Direct correlation with coaching absence." }
  ],
  
  suggested_actions: [
    { label: "Add to 1:1 with David", icon: "calendar" },
    { label: "Send coaching summary to David", icon: "mail" },
    { label: "Flag for HR review", icon: "alert" }
  ]
};
```

---

## Ask Anything - Sample Q&A Pairs

```javascript
const sampleQA = [
  {
    question: "Why is David's team struggling?",
    answer: "David's team has the lowest quota attainment (62%) and this correlates directly with coaching absence. In the last 30 days, David reviewed only 3 calls with zero feedback provided.\n\nHis two lowest performers have received no coaching:\n- Jessica Huang (54% quota) - 0 calls coached\n- Rachel Green (58% quota) - 1 call coached, no feedback\n\nMeanwhile, Sarah Chen's lowest performer (Ryan Patel, 108%) received 14 coached calls with 3 scorecards.",
    citations: [
      { label: "AE Distribution", type: "table" },
      { label: "CALL-4008", type: "call", id: "CALL-4008" },
      { label: "Daily Activity: David Park", type: "activity" }
    ],
    suggested_actions: [
      { label: "Add to 1:1 with David", icon: "calendar" },
      { label: "Generate performance report", icon: "file" }
    ],
    follow_ups: [
      "What was David doing at the start of the quarter?",
      "Which AEs need immediate attention?",
      "Compare David to Sarah's approach"
    ]
  },
  {
    question: "Why hasn't Lauren Kim been coached?",
    answer: "Lauren has the lowest quota on Marcus's team (89%) but received only 2 coached calls in 30 days—the least of any AE on his team. Her last feedback was 21 days ago on Dec 2.\n\nThis is an inverted pattern: struggling reps should typically receive more attention, not less. Marcus's coaching has declined 35% since Month 1, with Week 4 showing zero feedback given.",
    citations: [
      { label: "AE Distribution", type: "table" },
      { label: "CALL-2023", type: "call", id: "CALL-2023" },
      { label: "Weekly Trends: Marcus", type: "trend" }
    ],
    suggested_actions: [
      { label: "Add 'Lauren Kim coaching gap' to 1:1 with Marcus", icon: "calendar" }
    ],
    follow_ups: [
      "Show me Marcus's coaching in the last 2 weeks",
      "What feedback has Lauren received?",
      "Is this pattern across Marcus's team?"
    ]
  }
];
```

---

## Suggested Actions

```javascript
const actionTypes = [
  {
    id: "add_to_1on1",
    label: "Add to 1:1 with {manager}",
    icon: "calendar",
    modal: {
      title: "Add to 1:1 with {manager}",
      fields: [
        { label: "Next 1:1", value: "Thursday, Jan 30 at 2:00 PM", readonly: true },
        { label: "Topic", value: "{pre_filled_insight}", editable: true }
      ],
      confirm_label: "Add to 1:1 ✓"
    }
  },
  {
    id: "send_summary",
    label: "Send coaching summary to {manager}",
    icon: "mail",
    modal: {
      title: "Send Coaching Summary",
      preview: "{email_content}",
      confirm_label: "Send Email"
    }
  },
  {
    id: "recognize",
    label: "Recognize {manager} in team channel",
    icon: "star",
    modal: {
      title: "Share Recognition",
      preview: "{slack_message}",
      confirm_label: "Post to #sales-team"
    }
  },
  {
    id: "flag_hr",
    label: "Flag for HR review",
    icon: "alert-triangle",
    modal: {
      title: "Flag for Review",
      warning: "This will notify HR leadership.",
      confirm_label: "Submit Flag"
    }
  },
  {
    id: "create_template",
    label: "Create coaching template from approach",
    icon: "file-text"
  },
  {
    id: "pair_coaching",
    label: "Pair {manager1} with {manager2} for peer coaching",
    icon: "users"
  }
];
```

---

## Technical Requirements

### Stack
- React 18+
- Tailwind CSS
- Lucide React (icons)
- Geist Font (via CDN or npm)

### Key Features
1. **Timeframe Toggle** - 30/60/90 days, updates all metrics
2. **Manager Cards** - Click to drill down
3. **Citation System** - Click [→ CALL-1042] opens modal with source data
4. **Ask Anything** - Input sends question to Claude API, response rendered with citations
5. **Suggested Actions** - Context-aware, one-tap with confirmation modal
6. **Responsive** - Works on desktop (primary) and tablet

### State Management
- Simple React state or Zustand
- Selected manager, timeframe, conversation history

### API Integration (for Ask Anything)
- Claude API via Anthropic SDK
- System prompt includes all manager/AE data
- Response must include citations in format: [→ SOURCE_ID]
- Parse citations and render as clickable links

---

## File Structure

```
/coaching-intelligence
├── /src
│   ├── /components
│   │   ├── Dashboard.jsx
│   │   ├── ManagerCard.jsx
│   │   ├── ManagerDetail.jsx
│   │   ├── MetricDisplay.jsx
│   │   ├── TrendArrow.jsx
│   │   ├── AETable.jsx
│   │   ├── InsightSection.jsx
│   │   ├── AskInput.jsx
│   │   ├── ConversationThread.jsx
│   │   ├── CitationModal.jsx
│   │   ├── ActionModal.jsx
│   │   ├── SuggestedActions.jsx
│   │   └── SourcesFooter.jsx
│   ├── /data
│   │   ├── managers.js
│   │   ├── aes.js
│   │   ├── feedback.js
│   │   ├── summaries.js
│   │   └── timeframes.js
│   ├── /hooks
│   │   └── useCoachingData.js
│   ├── /utils
│   │   └── citations.js
│   ├── App.jsx
│   └── index.css
├── tailwind.config.js
└── package.json
```

---

## Sample Component: ManagerCard

```jsx
function ManagerCard({ manager, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[20px] p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF2F8 100%)' }}
    >
      <p className="text-[11px] font-medium tracking-wide uppercase text-neutral-500">
        Sales Manager
      </p>
      <h2 className="text-[28px] font-semibold text-neutral-900 mt-1">
        {manager.name}
      </h2>
      
      <div className="flex items-center mt-6 gap-6">
        <div>
          <p className="text-[13px] font-medium text-neutral-600">Attainment</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[42px] font-semibold">{manager.quota_attainment}%</span>
            <TrendArrow direction={manager.trend} />
          </div>
        </div>
        
        <div className="w-px h-16 bg-neutral-200" />
        
        <div>
          <p className="text-[13px] font-medium text-neutral-600">Coaching Score</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[42px] font-semibold">{manager.coaching_score}%</span>
            <TrendArrow direction={manager.trend} />
          </div>
        </div>
      </div>
      
      <p className="text-[15px] text-neutral-600 mt-6 leading-relaxed">
        {manager.summary}
      </p>
      
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100">
        <button className="bg-neutral-900 text-white text-sm font-medium px-5 py-2.5 rounded-full">
          Suggested Next Best Action
        </button>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-neutral-100">
            <Bell className="w-5 h-5 text-neutral-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-neutral-100">
            <ArrowRight className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Next Steps for Claude Code

1. Initialize React project with Vite
2. Install dependencies: `tailwindcss`, `lucide-react`, `@anthropic-ai/sdk`
3. Set up Geist font
4. Create data files from the models above
5. Build components in order: ManagerCard → Dashboard → ManagerDetail → Modals
6. Implement Ask Anything with Claude API
7. Test timeframe switching
8. Add citation modal functionality

---

## Reference Images

The Figma designs have been converted and are available at:
- `/home/claude/Screenshot_2026-01-25_at_17_42_41.png` - Card row view
- `/home/claude/Screenshot_2026-01-25_at_17_42_57.png` - Full detail annotated
- `/home/claude/Screenshot_2026-01-25_at_17_43_19.png` - Card close-up

These show the exact styling to match.
