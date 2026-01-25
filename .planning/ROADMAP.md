# Roadmap: Coaching Intelligence

## Overview

This roadmap delivers a sales coaching analytics dashboard with AI-powered insights. The build follows a foundation-first approach: establishing design tokens and data contracts before components, then assembling pages from tested components, adding modal interactions, and finally integrating Claude API for the "Ask Anything" feature. Each phase delivers verifiable user-facing capability.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation** - Project scaffolding, data layer, design tokens
- [x] **Phase 2: Component Library** - Atomic/composite components with timeframe state
- [x] **Phase 3: Dashboard** - Manager cards grid with navigation and timeframe toggle
- [ ] **Phase 4: Manager Detail** - Five insight dimensions, AE table, sources footer
- [ ] **Phase 5: Modal System** - Citation verification and action confirmation modals
- [ ] **Phase 6: Claude Integration** - Ask Anything with streaming, citations, conversation thread
- [ ] **Phase 7: Polish** - Loading states, error handling, transitions, accessibility

## Phase Details

### Phase 1: Foundation
**Goal**: Establish project structure, data layer, and design system that all components depend on
**Depends on**: Nothing (first phase)
**Requirements**: NAV-04, NAV-05
**Success Criteria** (what must be TRUE):
  1. App loads in browser with Geist Sans and Geist Mono fonts applied
  2. Pink gradient accent and neutral gray color palette available via CSS variables
  3. Static manager, AE, and feedback data can be imported and filtered by timeframe
  4. Citation ID format (CALL-XXXX) is standardized with lookup function
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md - Scaffold Vite + React 19 + Tailwind CSS 4 with Geist fonts and design tokens
- [x] 01-02-PLAN.md - Create static data layer with citation utilities
- [x] 01-03-PLAN.md - Foundation verification and human approval

### Phase 2: Component Library
**Goal**: Build reusable UI components with centralized timeframe state management
**Depends on**: Phase 1
**Requirements**: (enables all other phases - no direct requirements)
**Success Criteria** (what must be TRUE):
  1. TrendArrow, Badge, MetricDisplay, Citation components render correctly in isolation
  2. TimeframeToggle changes global state and all dependent components update
  3. ManagerCard displays name, metrics, trend, AI summary, and action buttons
  4. AskInput accepts text entry and emits submit events
  5. InsightSection displays title, rating badge, and content
**Plans**: 6 plans

Plans:
- [x] 02-01-PLAN.md - Zustand store and atomic icon components (TrendArrow, InfoIcon)
- [x] 02-02-PLAN.md - Badge, Tooltip, and UI barrel export
- [x] 02-03-PLAN.md - MetricDisplay and Citation display components
- [x] 02-04-PLAN.md - TimeframeToggle and AskInput input components
- [x] 02-05-PLAN.md - ManagerCard and InsightSection composite components
- [x] 02-06-PLAN.md - Component library demo and visual verification

### Phase 3: Dashboard
**Goal**: Users can view all managers at a glance and navigate to details
**Depends on**: Phase 2
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06, DASH-07, NAV-01, ACT-01
**Success Criteria** (what must be TRUE):
  1. User sees 4 manager cards with name, attainment %, coaching score %, and trend arrows
  2. User sees AI-generated summary (10-15 words) on each card
  3. User can toggle timeframe (30/60/90 days) and all metrics update immediately
  4. User can click any manager card to navigate to that manager's detail page
  5. User sees "Ask anything" input pinned to bottom of dashboard (submitting opens new chat)
**Plans**: 4 plans

Plans:
- [x] 03-01-PLAN.md - Install React Router and create AppLayout with header and pinned AskInput
- [x] 03-02-PLAN.md - Create Dashboard and ManagerDetail page components
- [x] 03-03-PLAN.md - Wire routing and add gradient accent to cards
- [x] 03-04-PLAN.md - Human verification of dashboard functionality

### Phase 4: Manager Detail
**Goal**: Users can explore a manager's coaching effectiveness across all five dimensions
**Depends on**: Phase 3
**Requirements**: DETAIL-01, DETAIL-02, DETAIL-03, DETAIL-04, DETAIL-05, DETAIL-06, DETAIL-07, DETAIL-08, DETAIL-09, DETAIL-10, DETAIL-11, DETAIL-12, NAV-02, NAV-03, ACT-02
**Success Criteria** (what must be TRUE):
  1. User sees hero section with manager name, region, attainment, coaching score, and AI headline
  2. User sees five insight sections: Investment, Trend, Methods, Distribution, Feedback Quality
  3. User sees AE table with quota, calls coached, comments, scorecards, last feedback, and flags
  4. User sees "Ask anything" input pinned to bottom (conversation appears below data in chat section)
  5. User can navigate back to dashboard via back button
  6. Direct URL to manager detail page works (deep linking)
**Plans**: 5 plans

Plans:
- [ ] 04-01-PLAN.md - Hero section with manager info, metrics, timeframe toggle, and back navigation
- [ ] 04-02-PLAN.md - Five insight sections using InsightSection component and summaries data
- [ ] 04-03-PLAN.md - AE coaching table with undercoached/critical flags
- [ ] 04-04-PLAN.md - Sources footer and ActionMenu dropdown
- [ ] 04-05-PLAN.md - Human verification of complete detail page

### Phase 5: Modal System
**Goal**: Users can verify citations and confirm actions through modal interactions
**Depends on**: Phase 4
**Requirements**: CITE-01, CITE-02, CITE-03, CITE-04, CITE-05, CITE-06, ACT-03, ACT-04, ACT-05, ACT-06
**Success Criteria** (what must be TRUE):
  1. Clicking citation link opens modal showing call details (ID, date, AE, manager, stage, duration)
  2. Citation modal shows coaching activity checklist and feedback text
  3. Citation modal shows "View Full Call" link (mocked for v1)
  4. Clicking action button opens confirmation modal with next 1:1 date, editable topic, sources
  5. User can confirm action and sees success toast
**Plans**: TBD

Plans:
- [ ] 05-01: TBD

### Phase 6: Claude Integration
**Goal**: Users can ask any question and get an intelligent, cited answer
**Depends on**: Phase 5
**Requirements**: ASK-01, ASK-02, ASK-03, ASK-04, ASK-05, ASK-06, ASK-07
**Success Criteria** (what must be TRUE):
  1. User can type question in pinned input and submit to Claude API
  2. AI response streams into conversation thread (below data on detail page) in real-time
  3. AI response includes clickable citations in format [-> CALL-XXXX] that open citation modal
  4. Follow-up suggestions appear after each AI response
  5. User can ask multiple questions in same session (conversation history preserved)
  6. Dashboard ask input opens new chat (navigates to detail or dedicated chat view)
**Plans**: TBD

Plans:
- [ ] 06-01: TBD

### Phase 7: Polish
**Goal**: Production-quality UX with loading states, error handling, and accessibility
**Depends on**: Phase 6
**Requirements**: (quality improvements, not feature requirements)
**Success Criteria** (what must be TRUE):
  1. Skeleton loaders appear during data loading and AI responses
  2. Error boundaries show graceful degradation when API fails
  3. Modal and card transitions use smooth animations
  4. All interactive elements are keyboard navigable with visible focus states
**Plans**: TBD

Plans:
- [ ] 07-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2026-01-25 |
| 2. Component Library | 6/6 | Complete | 2026-01-25 |
| 3. Dashboard | 4/4 | Complete | 2026-01-25 |
| 4. Manager Detail | 0/5 | Not started | - |
| 5. Modal System | 0/? | Not started | - |
| 6. Claude Integration | 0/? | Not started | - |
| 7. Polish | 0/? | Not started | - |

---
*Roadmap created: 2026-01-25*
*Last updated: 2026-01-25 - Phase 4 planned*
