# Requirements: Coaching Intelligence

**Defined:** 2026-01-25
**Core Value:** Ann can ask any question about her managers' coaching and get an intelligent, cited answer

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Dashboard

- [ ] **DASH-01**: User sees 4 manager cards with name, role label, attainment %, and coaching score %
- [ ] **DASH-02**: Each card displays trend arrow (up/down/stable) for metrics
- [ ] **DASH-03**: Each card shows AI-generated summary (10-15 words)
- [ ] **DASH-04**: User can toggle timeframe (30/60/90 days) and all metrics update
- [ ] **DASH-05**: User can click manager card to navigate to detail view
- [ ] **DASH-06**: User sees "Ask anything" input at bottom of dashboard
- [ ] **DASH-07**: Cards display with pink gradient accent per design spec

### Manager Detail

- [ ] **DETAIL-01**: User sees hero section with manager name, region, attainment, coaching score
- [ ] **DETAIL-02**: Hero section displays AI-generated headline summary
- [ ] **DETAIL-03**: User sees Coaching Investment section (High/Medium/Low + activity count)
- [ ] **DETAIL-04**: User sees Trend Over Time section (Declining/Stable/Improving)
- [ ] **DETAIL-05**: User sees Coaching Methods breakdown (listened, attended, feedback, comments, scorecards)
- [ ] **DETAIL-06**: User sees Coaching Distribution section (Even/Uneven/Sporadic/Absent)
- [ ] **DETAIL-07**: User sees Feedback Quality section with example quotes and citations
- [ ] **DETAIL-08**: User sees AE coaching table (AE name, quota %, calls coached, comments, scorecards, last feedback, flag)
- [ ] **DETAIL-09**: AE table shows undercoached/critical flags where applicable
- [ ] **DETAIL-10**: User sees Sources footer (call listening, attendance, comments, scorecards, feedback events counts)
- [ ] **DETAIL-11**: User can navigate back to dashboard
- [ ] **DETAIL-12**: Timeframe toggle on detail page updates all metrics

### Ask Anything

- [ ] **ASK-01**: User can type question in input field
- [ ] **ASK-02**: System sends question to Claude API with coaching data context
- [ ] **ASK-03**: AI response displays in conversation thread
- [ ] **ASK-04**: AI response includes clickable citations in format [→ CALL-XXXX]
- [ ] **ASK-05**: Follow-up question suggestions appear after each AI response
- [ ] **ASK-06**: User can ask multiple questions in same session (conversation thread)
- [ ] **ASK-07**: Contextual action buttons appear based on AI response content

### Citation System

- [ ] **CITE-01**: Clicking citation link opens citation modal
- [ ] **CITE-02**: Citation modal shows call ID, date, AE name, manager name
- [ ] **CITE-03**: Citation modal shows pipeline stage and duration
- [ ] **CITE-04**: Citation modal shows coaching activity checklist (listened, attended, feedback, comments, scorecard)
- [ ] **CITE-05**: Citation modal shows feedback text if available
- [ ] **CITE-06**: Citation modal shows "View Full Call" link (mocked for v1)

### Suggested Actions

- [ ] **ACT-01**: Suggested action buttons appear on manager cards and detail view
- [ ] **ACT-02**: Actions include: Add to 1:1, Send summary, Recognize, Flag for HR (context-dependent)
- [ ] **ACT-03**: Clicking action opens confirmation modal
- [ ] **ACT-04**: Confirmation modal shows next 1:1 date, editable topic, sources
- [ ] **ACT-05**: User can edit and confirm action
- [ ] **ACT-06**: Success toast appears after action completion (mocked for v1)

### Navigation & UI

- [ ] **NAV-01**: App header shows "Coaching Intelligence" title
- [ ] **NAV-02**: Detail page has back button to return to dashboard
- [ ] **NAV-03**: Direct URL to manager detail page works (deep linking)
- [ ] **NAV-04**: App uses Geist Sans and Geist Mono fonts
- [ ] **NAV-05**: App follows color system from design spec (pink gradient, neutral grays)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Notifications

- **NOTIF-01**: Email alerts when AI detects coaching issues
- **NOTIF-02**: Alert deep links to specific manager detail page
- **NOTIF-03**: Bell icon shows pending alerts

### Integrations

- **INT-01**: Real Google Calendar integration for "Add to 1:1"
- **INT-02**: Real email sending for "Send summary"
- **INT-03**: Gong/Chorus API integration for live data

### Analytics

- **ANLT-01**: Coaching effectiveness correlation with rep performance
- **ANLT-02**: Historical trend visualization with charts
- **ANLT-03**: Export data to CSV/PDF

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Rep performance dashboards | Different product (Gong/Clari territory) |
| Call recording/transcription | Commodity infrastructure, not core value |
| Deal/pipeline management | CRM territory, out of focus |
| Mobile-responsive design | Desktop-first for v1, VPs work at desks |
| OAuth/SSO authentication | Accessed directly for MVP |
| Gamification/leaderboards | Encourages metric gaming over real coaching |
| Complex filtering/report builder | "Ask Anything" replaces this need |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DASH-01 | TBD | Pending |
| DASH-02 | TBD | Pending |
| DASH-03 | TBD | Pending |
| DASH-04 | TBD | Pending |
| DASH-05 | TBD | Pending |
| DASH-06 | TBD | Pending |
| DASH-07 | TBD | Pending |
| DETAIL-01 | TBD | Pending |
| DETAIL-02 | TBD | Pending |
| DETAIL-03 | TBD | Pending |
| DETAIL-04 | TBD | Pending |
| DETAIL-05 | TBD | Pending |
| DETAIL-06 | TBD | Pending |
| DETAIL-07 | TBD | Pending |
| DETAIL-08 | TBD | Pending |
| DETAIL-09 | TBD | Pending |
| DETAIL-10 | TBD | Pending |
| DETAIL-11 | TBD | Pending |
| DETAIL-12 | TBD | Pending |
| ASK-01 | TBD | Pending |
| ASK-02 | TBD | Pending |
| ASK-03 | TBD | Pending |
| ASK-04 | TBD | Pending |
| ASK-05 | TBD | Pending |
| ASK-06 | TBD | Pending |
| ASK-07 | TBD | Pending |
| CITE-01 | TBD | Pending |
| CITE-02 | TBD | Pending |
| CITE-03 | TBD | Pending |
| CITE-04 | TBD | Pending |
| CITE-05 | TBD | Pending |
| CITE-06 | TBD | Pending |
| ACT-01 | TBD | Pending |
| ACT-02 | TBD | Pending |
| ACT-03 | TBD | Pending |
| ACT-04 | TBD | Pending |
| ACT-05 | TBD | Pending |
| ACT-06 | TBD | Pending |
| NAV-01 | TBD | Pending |
| NAV-02 | TBD | Pending |
| NAV-03 | TBD | Pending |
| NAV-04 | TBD | Pending |
| NAV-05 | TBD | Pending |

**Coverage:**
- v1 requirements: 40 total
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 40

---
*Requirements defined: 2026-01-25*
*Last updated: 2026-01-25 after initial definition*
