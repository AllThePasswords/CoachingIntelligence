# Architecture: Coaching Intelligence Dashboard

## Overview

This document defines the component architecture, data flow, and build order for a React-based sales coaching analytics dashboard. The system serves one primary user (VP of Sales) who monitors four managers' coaching effectiveness through AI-powered insights and natural language queries.

---

## Component Architecture

### Layer 1: Application Shell

```
App.jsx
├── Router (React Router)
│   ├── /dashboard → Dashboard
│   └── /manager/:id → ManagerDetail
├── Global State Provider (Context or Zustand)
└── Modal Root (for portal-based modals)
```

**Boundaries:**
- App.jsx owns routing and global state hydration
- No business logic in shell - delegates to pages
- Modal root provides portal mount point for all modals

---

### Layer 2: Page Components

#### Dashboard Page
```
Dashboard.jsx
├── Header
│   ├── Title ("Coaching Intelligence")
│   └── TimeframeToggle [30|60|90 days]
├── ManagerCardGrid (2x2 layout)
│   └── ManagerCard (x4)
└── AskInput (global question input)
```

**Boundaries:**
- Owns the timeframe state at page level
- Passes timeframe down to cards
- Navigation to ManagerDetail on card click

#### ManagerDetail Page
```
ManagerDetail.jsx
├── Header
│   ├── BackButton
│   ├── ManagerInfo (name, region)
│   └── TimeframeToggle
├── HeroSection
│   ├── MetricDisplay (Attainment)
│   ├── MetricDisplay (Coaching Score)
│   └── AISummary (headline)
├── InsightSections (5 dimensions)
│   ├── CoachingInvestment
│   ├── TrendOverTime
│   ├── CoachingDistribution
│   ├── TeamPerformance
│   └── FeedbackQuality
├── AETable
├── ActionsBar
│   ├── SuggestedAction (primary)
│   ├── SourcesBadge
│   └── IconButtons (ask, bell, arrow)
├── ConversationThread
│   ├── AskInput
│   └── MessageList
│       └── Message (user or AI)
│           ├── MessageContent
│           ├── Citations
│           ├── FollowUpSuggestions
│           └── ContextualActions
└── SourcesFooter
```

**Boundaries:**
- Owns selected manager state (from URL param)
- Owns conversation history for this session
- Delegates modal opening to global modal manager
- Does not contain modal UI itself

---

### Layer 3: Shared Components

#### Display Components (Stateless)
```
MetricDisplay       - Value + label + trend arrow
TrendArrow          - Up/down/stable indicator with color
AISummary           - Styled paragraph for AI-generated text
Badge               - Pill-style label (sources count, status)
Citation            - Clickable [→ CALL-1042] link
InsightSection      - Titled card with level indicator + detail
```

#### Interactive Components (Stateful or Event-Driven)
```
TimeframeToggle     - 30/60/90 segmented control, emits onChange
ManagerCard         - Clickable card, emits onClick(managerId)
AskInput            - Text input with send button, emits onSubmit(question)
AETable             - Sortable table with flag indicators
SuggestedAction     - Button that opens ActionModal
```

#### Modal Components (Rendered via Portal)
```
CitationModal       - Shows call details, triggered by Citation click
ActionModal         - Confirmation flow for suggested actions
```

---

### Layer 4: Data & Services

#### Data Layer (Static for v1)
```
/data
├── managers.js     - Manager records with base metrics
├── aes.js          - AE records linked to managers
├── feedback.js     - Feedback log with full citation data
├── summaries.js    - Pre-generated AI summaries per manager
├── timeframes.js   - Timeframe-specific metrics
└── sampleQA.js     - Pre-built Q&A for fallback/demo
```

**Data Relationships:**
```
Manager (1) ──┬── (N) AEs
              └── (N) Feedback entries

Timeframe data slices all above by 30/60/90 days
```

#### Service Layer
```
/services
├── coachingDataService.js  - Aggregates data by manager/timeframe
├── citationService.js      - Resolves CALL-XXXX to full records
└── claudeService.js        - Claude API integration for Ask Anything
```

---

## Data Flow

### 1. Dashboard Load
```
User navigates to /dashboard
      │
      ▼
Dashboard mounts
      │
      ├─► Reads managers[] from data
      ├─► Reads timeframes[selectedTimeframe]
      │
      ▼
Renders 4 ManagerCards with merged data
```

### 2. Timeframe Change
```
User clicks "60 days"
      │
      ▼
TimeframeToggle emits onChange("60")
      │
      ▼
Dashboard updates state: timeframe = "60"
      │
      ▼
All child components re-render with new timeframe
      │
      ├─► ManagerCards show 60-day metrics
      └─► ManagerDetail (if open) shows 60-day data
```

### 3. Manager Detail Navigation
```
User clicks ManagerCard
      │
      ▼
Card emits onClick(managerId)
      │
      ▼
Router navigates to /manager/:managerId
      │
      ▼
ManagerDetail mounts
      │
      ├─► Reads manager by ID
      ├─► Reads AEs for this manager
      ├─► Reads summary for this manager
      ├─► Reads feedback for this manager
      │
      ▼
Renders full detail view
```

### 4. Ask Anything (Claude API)
```
User types question in AskInput
      │
      ▼
AskInput emits onSubmit(question)
      │
      ▼
ManagerDetail adds user message to conversation
      │
      ▼
claudeService.ask(question, context)
      │
      ├─► Builds system prompt with all data
      ├─► Sends to Claude API
      ├─► Receives response with citations
      │
      ▼
Parse response, extract [→ CALL-XXXX] citations
      │
      ▼
Add AI message to conversation
      │
      ▼
ConversationThread renders with clickable citations
```

### 5. Citation Modal
```
User clicks [→ CALL-1042]
      │
      ▼
Citation component emits onClick(callId)
      │
      ▼
citationService.getByCallId("CALL-1042")
      │
      ▼
Returns full feedback record
      │
      ▼
Modal manager opens CitationModal with data
```

### 6. Action Flow
```
User clicks "Add to 1:1 with David"
      │
      ▼
SuggestedAction emits onClick(actionType, context)
      │
      ▼
Modal manager opens ActionModal
      │
      ├─► Shows pre-filled topic
      ├─► Shows edit option
      │
      ▼
User clicks "Add to 1:1 ✓"
      │
      ▼
ActionModal emits onConfirm(actionData)
      │
      ▼
(v1: Show success toast - no real integration)
```

---

## State Management

### Global State (Context or Zustand)
```javascript
{
  // App-level
  selectedTimeframe: "30" | "60" | "90",

  // Modal state
  activeModal: null | { type: "citation" | "action", data: {...} },

  // Conversation (per-session, resets on page change)
  conversations: {
    [managerId]: Message[]
  }
}
```

### Local Component State
```
ManagerCard       - hover state only
TimeframeToggle   - none (controlled)
AskInput          - input value (controlled)
AETable           - sort column, sort direction
```

### Data Derivation (Not Stored)
```
Computed on render from static data + timeframe:
- Merged manager metrics (base + timeframe overlay)
- Filtered AEs by manager
- Filtered feedback by manager + timeframe
```

---

## Component Boundaries Summary

| Component | Owns | Receives | Emits |
|-----------|------|----------|-------|
| App | Router, Modal root | - | - |
| Dashboard | Timeframe state | - | - |
| ManagerDetail | Conversation, selected manager | URL params | - |
| TimeframeToggle | - | value | onChange(value) |
| ManagerCard | - | manager, timeframe | onClick(id) |
| AskInput | input value | placeholder | onSubmit(text) |
| Citation | - | callId, label | onClick(callId) |
| CitationModal | - | callData | onClose() |
| ActionModal | - | actionType, context | onConfirm(), onClose() |

---

## Build Order

### Phase 1: Foundation (No Dependencies)
1. **Project Setup** - Vite + React + Tailwind + Geist fonts
2. **Data Layer** - Copy static data files from coaching-intelligence-data/
3. **Design Tokens** - CSS variables for colors, typography, spacing

### Phase 2: Atomic Components (Depends on: Phase 1)
4. **TrendArrow** - Simple SVG + color logic
5. **Badge** - Styled span with variants
6. **MetricDisplay** - Combines value + label + TrendArrow
7. **Citation** - Clickable monospace link

### Phase 3: Composite Components (Depends on: Phase 2)
8. **TimeframeToggle** - Segmented control using buttons
9. **ManagerCard** - Full card with metrics, summary, actions
10. **AskInput** - Input + button composition
11. **InsightSection** - Reusable insight block template

### Phase 4: Dashboard Page (Depends on: Phase 3)
12. **Dashboard Layout** - Header + grid + footer
13. **Dashboard Integration** - Wire up cards, timeframe toggle, navigation

### Phase 5: Manager Detail Components (Depends on: Phase 3)
14. **AETable** - Table with sorting, flags, feedback preview
15. **SourcesFooter** - Metric counts bar
16. **Message** - User/AI message with citation parsing
17. **ConversationThread** - Message list + suggested follow-ups

### Phase 6: Manager Detail Page (Depends on: Phase 5)
18. **ManagerDetail Layout** - All sections assembled
19. **ManagerDetail Integration** - Data fetching, conversation state

### Phase 7: Modal System (Depends on: Phase 6)
20. **Modal Infrastructure** - Portal, backdrop, close behavior
21. **CitationModal** - Full call detail view
22. **ActionModal** - Confirmation flow with editable fields

### Phase 8: Claude Integration (Depends on: Phase 7)
23. **Claude Service** - API client with system prompt builder
24. **Ask Anything Integration** - Wire service to ConversationThread

### Phase 9: Polish (Depends on: Phase 8)
25. **Loading States** - Skeleton loaders for data and AI responses
26. **Error Handling** - Error boundaries, API failure states
27. **Animations** - Transitions for modals, cards, messages

---

## Key Architectural Decisions

### Why Static Data (Not API)
- v1 focuses on UI/UX validation
- Sample data is comprehensive and realistic
- Avoids backend complexity; enables rapid iteration
- Claude API is the only external dependency

### Why Context Over Zustand
- State is simple (timeframe, modal, conversation)
- No complex async patterns needed
- Easier onboarding for future maintainers
- Can upgrade to Zustand if complexity grows

### Why Modals via Portal
- Avoids z-index conflicts with card layouts
- Clean separation of modal state from page content
- Single modal at a time simplifies implementation

### Why Conversation Per-Session
- No persistence needed for v1
- Simplifies state management
- Each manager detail page starts fresh
- Can add localStorage persistence later if validated

---

## File Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Badge.jsx
│   │   ├── TrendArrow.jsx
│   │   ├── MetricDisplay.jsx
│   │   ├── Citation.jsx
│   │   └── TimeframeToggle.jsx
│   ├── dashboard/
│   │   ├── Dashboard.jsx
│   │   └── ManagerCard.jsx
│   ├── manager/
│   │   ├── ManagerDetail.jsx
│   │   ├── HeroSection.jsx
│   │   ├── InsightSection.jsx
│   │   ├── AETable.jsx
│   │   ├── ActionsBar.jsx
│   │   ├── SourcesFooter.jsx
│   │   └── conversation/
│   │       ├── ConversationThread.jsx
│   │       ├── AskInput.jsx
│   │       └── Message.jsx
│   └── modals/
│       ├── ModalRoot.jsx
│       ├── CitationModal.jsx
│       └── ActionModal.jsx
├── context/
│   └── AppContext.jsx
├── data/
│   ├── managers.js
│   ├── aes.js
│   ├── feedback.js
│   ├── summaries.js
│   ├── timeframes.js
│   └── sampleQA.js
├── services/
│   ├── coachingDataService.js
│   ├── citationService.js
│   └── claudeService.js
├── hooks/
│   ├── useCoachingData.js
│   └── useModal.js
├── styles/
│   └── tokens.css
├── App.jsx
├── main.jsx
└── index.css
```

---

## Integration Points

### External Dependencies
| Dependency | Purpose | Phase |
|------------|---------|-------|
| React Router | Page navigation | Phase 1 |
| Tailwind CSS | Styling | Phase 1 |
| Lucide React | Icons | Phase 2 |
| @anthropic-ai/sdk | Claude API | Phase 8 |

### Internal Communication
| From | To | Method |
|------|----| -------|
| ManagerCard | Router | programmatic navigation |
| TimeframeToggle | Dashboard | callback prop |
| AskInput | ManagerDetail | callback prop |
| Citation | ModalRoot | context dispatch |
| SuggestedAction | ModalRoot | context dispatch |
| claudeService | ConversationThread | async return |

---

## Quality Gates Checklist

- [x] Components clearly defined with boundaries
- [x] Data flow direction explicit (unidirectional, top-down)
- [x] Build order implications noted (dependency chain clear)
- [x] State ownership documented per component
- [x] External integration points identified
- [x] File structure supports component isolation
