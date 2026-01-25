# Coaching Intelligence

## What This Is

An AI-powered sales coaching analytics dashboard that helps VPs of Sales monitor and improve their managers' coaching effectiveness. Users are drawn into the app via email alerts when AI detects coaching issues, landing directly on the problem manager's detail page where they can interrogate the data through natural language questions.

## Core Value

Ann can ask any question about her managers' coaching and get an intelligent, cited answer — turning hours of manual data mining into instant insight.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Dashboard showing all managers with coaching scores and AI summaries
- [ ] Manager detail view with AI-generated insights across 5 dimensions
- [ ] Ask Anything chat with Claude API integration and clickable citations
- [ ] Citation modal showing source data with deep link to original asset
- [ ] Timeframe toggle (30/60/90 days) that updates all metrics
- [ ] Suggested actions with confirmation modals (mocked for v1)
- [ ] AE coaching distribution table per manager
- [ ] Conversation thread with follow-up suggestions

### Out of Scope

- Real calendar/email integrations — mock confirmations only for v1, integrations deferred
- Email alert system — v1 focuses on the dashboard destination, not the notification trigger
- OAuth/SSO authentication — app is accessed directly for MVP
- Mobile-responsive design — desktop-first for v1
- Real Gong/Chorus integration — use provided sample data

## Context

**Primary User:** Ann Martinez, VP of Sales
- Manages 4 sales managers, each with 4 AEs (16 total)
- Needs to answer 5 key questions about coaching without manual data mining:
  1. How much effort does each manager invest in coaching?
  2. Does a manager improve or decline over time?
  3. How are they coaching? (listening, commenting, scorecards, attending)
  4. Do they distribute coaching appropriately across AEs?
  5. What type of feedback are they providing?

**User Journey:**
1. AI detects issue (e.g., "David hasn't coached in 14 days")
2. Ann receives email alert
3. Clicks through → lands on David's detail page (deep link)
4. Reads AI insights, asks follow-up questions
5. Takes action (add to 1:1, send summary) or exports/shares

**Data Model:**
- 4 managers with performance metrics, coaching scores, AI summaries
- 16 AEs (4 per manager) with quota, calls coached, feedback quality
- Feedback log with citations (CALL-1042 format)
- Timeframe-based metrics (30/60/90 days)

**Design Reference:**
- Figma designs converted to PNGs in coaching-intelligence-data/
- Vercel Geist Design System for components
- Pink gradient accent on cards
- Specific typography scale (Geist Sans/Mono)

## Constraints

- **Tech Stack**: React + Vite, Tailwind CSS, Vercel Geist Design System, Lucide React icons
- **AI Backend**: Claude API via Anthropic SDK for Ask Anything feature
- **Data**: Static sample data from coaching-intelligence-data/ directory
- **Design**: Must match visual style in provided design PNGs

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Alert-driven entry, not dashboard-first | Users respond to problems, not browse dashboards | — Pending |
| Mock actions for v1 | Real calendar/email integrations add significant scope | — Pending |
| Real Claude API for Ask Anything | Core value is intelligent Q&A, not canned responses | — Pending |
| Deep link citations to modal then asset | Quick context first, option to go deeper | — Pending |

---
*Last updated: 2026-01-25 after initialization*
