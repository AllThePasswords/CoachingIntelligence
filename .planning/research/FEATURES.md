# Features Research: Sales Coaching Analytics Dashboards

## Executive Summary

This research analyzes features from established sales coaching analytics products (Gong, Chorus/ZoomInfo, Clari, SalesLoft, Outreach, ExecVision) to inform Coaching Intelligence's feature roadmap. Features are categorized by competitive necessity and differentiation potential for a VP-of-Sales-focused coaching dashboard.

---

## Table Stakes Features

**Definition:** Features users expect as baseline. Missing these causes immediate churn or blocks adoption.

### 1. Activity Metrics Dashboard
**What it is:** Aggregated view of coaching activities (calls reviewed, comments left, scorecards completed, 1:1s attended)

| Aspect | Detail |
|--------|--------|
| Complexity | Low |
| Dependencies | Data model, timeframe selector |
| Why table stakes | Every competitor shows activity counts. VPs need quantified coaching effort. |
| Coaching Intelligence fit | Core to answering "How much effort does each manager invest?" |

### 2. Time-Based Filtering
**What it is:** Toggle to view metrics across different time periods (7/30/60/90 days, custom ranges)

| Aspect | Detail |
|--------|--------|
| Complexity | Low |
| Dependencies | All metric components must respond to filter |
| Why table stakes | Without time context, metrics are meaningless. Universal in analytics products. |
| Coaching Intelligence fit | Already in scope (30/60/90 toggle) |

### 3. Manager-Level Rollup View
**What it is:** Dashboard showing each manager's aggregate coaching metrics with drill-down capability

| Aspect | Detail |
|--------|--------|
| Complexity | Medium |
| Dependencies | Data aggregation logic, navigation to detail |
| Why table stakes | VPs manage managers, not individual reps directly. Hierarchy matters. |
| Coaching Intelligence fit | Core dashboard requirement |

### 4. Rep-Level Detail View
**What it is:** View of individual AE coaching received, filterable by manager

| Aspect | Detail |
|--------|--------|
| Complexity | Medium |
| Dependencies | Manager-AE relationship, coaching event data |
| Why table stakes | Must answer "Is coaching distributed fairly?" across team |
| Coaching Intelligence fit | AE coaching distribution table (in scope) |

### 5. Coaching Activity Types Breakdown
**What it is:** Categorization of coaching by method (call listening, live shadowing, scorecard, async comment, 1:1)

| Aspect | Detail |
|--------|--------|
| Complexity | Medium |
| Dependencies | Activity type taxonomy, data classification |
| Why table stakes | Different coaching types have different value. Gong/Chorus all show this. |
| Coaching Intelligence fit | Answers "How are they coaching?" |

### 6. Call/Recording Access
**What it is:** Direct links to source recordings or transcripts from coaching activities

| Aspect | Detail |
|--------|--------|
| Complexity | Low (if linking), High (if hosting) |
| Dependencies | Integration with recording platform or citation modal |
| Why table stakes | VPs must verify coaching quality, not just quantity |
| Coaching Intelligence fit | Citation modal with deep links (in scope) |

### 7. Export/Share Capabilities
**What it is:** Export data to CSV/PDF, share views with stakeholders

| Aspect | Detail |
|--------|--------|
| Complexity | Low-Medium |
| Dependencies | Data formatting, authentication for shares |
| Why table stakes | VPs present to leadership, need data portability |
| Coaching Intelligence fit | Partially in scope (share/export mentioned) |

---

## Differentiating Features

**Definition:** Features that create competitive advantage. Not expected but highly valued when present.

### 8. AI-Generated Coaching Insights
**What it is:** Natural language summaries of coaching patterns, issues, and recommendations

| Aspect | Detail |
|--------|--------|
| Complexity | High |
| Dependencies | LLM integration, prompt engineering, data context |
| Why differentiating | Most tools show data; few explain it. Transforms data into action. |
| Coaching Intelligence fit | CORE DIFFERENTIATOR - AI summaries per manager |
| Competitive landscape | Gong has "Deal Intelligence," Clari has forecasting AI, but coaching-specific AI insights are rare |

### 9. Natural Language Q&A ("Ask Anything")
**What it is:** Chat interface to query coaching data with AI-powered responses

| Aspect | Detail |
|--------|--------|
| Complexity | High |
| Dependencies | LLM API, context retrieval, citation system |
| Why differentiating | Eliminates need to learn dashboard navigation. Radical simplicity. |
| Coaching Intelligence fit | CORE DIFFERENTIATOR - Ask Anything feature |
| Competitive landscape | Emerging in BI tools (ThoughtSpot, Tableau), rare in sales coaching |

### 10. Cited AI Responses
**What it is:** AI answers include clickable references to source data (specific calls, timestamps, comments)

| Aspect | Detail |
|--------|--------|
| Complexity | High |
| Dependencies | Citation indexing, modal system, deep links |
| Why differentiating | Builds trust in AI. Users can verify. Most AI features are "trust me" black boxes. |
| Coaching Intelligence fit | CORE DIFFERENTIATOR - clickable citations |

### 11. Alert-Driven Entry Points
**What it is:** Email/Slack alerts when AI detects issues, deep-linking to problem context

| Aspect | Detail |
|--------|--------|
| Complexity | Medium-High |
| Dependencies | Alert logic, email delivery, deep link architecture |
| Why differentiating | Proactive vs reactive. Users don't need to remember to check dashboard. |
| Coaching Intelligence fit | OUT OF SCOPE FOR V1 (but key to strategy) |

### 12. Trend Analysis with Trajectory
**What it is:** Show whether metrics are improving/declining, not just current state

| Aspect | Detail |
|--------|--------|
| Complexity | Medium |
| Dependencies | Historical data, trend calculation, visualization |
| Why differentiating | Answers "Is this getting better or worse?" - crucial for intervention timing |
| Coaching Intelligence fit | Addresses "Does a manager improve or decline over time?" |

### 13. Feedback Quality Scoring
**What it is:** AI analysis of feedback substance (specific vs vague, actionable vs generic)

| Aspect | Detail |
|--------|--------|
| Complexity | High |
| Dependencies | NLP analysis of comment text, scoring rubric |
| Why differentiating | Quantity of feedback is table stakes; quality measurement is rare. |
| Coaching Intelligence fit | Addresses "What type of feedback are they providing?" |

### 14. Coaching Distribution Equity Analysis
**What it is:** Visualization of whether coaching is distributed fairly across AEs (vs favorites/squeaky wheels)

| Aspect | Detail |
|--------|--------|
| Complexity | Medium |
| Dependencies | AE-level aggregation, equity metrics |
| Why differentiating | Surfaces bias patterns most managers don't realize they have |
| Coaching Intelligence fit | Addresses "Do they distribute coaching appropriately?" |

### 15. Suggested Actions with One-Click Execution
**What it is:** AI recommends actions ("Schedule 1:1 with David") with buttons to execute

| Aspect | Detail |
|--------|--------|
| Complexity | Medium (mocked), Very High (real integrations) |
| Dependencies | Calendar/email APIs, confirmation flows |
| Why differentiating | Closes loop from insight to action. Most dashboards stop at insight. |
| Coaching Intelligence fit | In scope (mocked for v1) |

### 16. Coaching Effectiveness Correlation
**What it is:** Show relationship between coaching activities and rep performance outcomes

| Aspect | Detail |
|--------|--------|
| Complexity | High |
| Dependencies | Performance data, statistical analysis, time-lag handling |
| Why differentiating | Proves coaching ROI. Most tools assume coaching helps but don't prove it. |
| Coaching Intelligence fit | Could be future differentiator |

---

## Anti-Features

**Definition:** Features to deliberately NOT build. Either outside scope, detrimental to focus, or conflict with product values.

### A1. Rep Performance Dashboards
**What it is:** Detailed AE performance metrics (quota attainment, pipeline, win rates)

| Aspect | Detail |
|--------|--------|
| Why NOT build | This is Coaching Intelligence, not Sales Intelligence. Gong/Clari own this. Focus on coaching, not outcomes. |
| Risk if built | Scope creep, feature bloat, confusion about product purpose |
| Alternative | Link out to existing tools for performance data |

### A2. Call Recording/Transcription
**What it is:** Native recording and transcription of sales calls

| Aspect | Detail |
|--------|--------|
| Why NOT build | Commodity. Gong, Chorus, Zoom have this. Massive infrastructure cost. |
| Risk if built | Competing with established players on their core capability |
| Alternative | Integrate with existing recording platforms via API |

### A3. Deal/Pipeline Management
**What it is:** CRM-like deal tracking, pipeline visualization, forecasting

| Aspect | Detail |
|--------|--------|
| Why NOT build | Clari, Salesforce, HubSpot own this. Different problem space. |
| Risk if built | Becomes another CRM, loses coaching focus |
| Alternative | Accept data from CRM, don't replicate it |

### A4. Rep-Facing Coaching Tools
**What it is:** Self-coaching features for reps (review own calls, set goals)

| Aspect | Detail |
|--------|--------|
| Why NOT build | Different user, different UX needs. VP focus is deliberate. |
| Risk if built | Split focus between manager insights and rep self-service |
| Alternative | Could be separate product for different persona |

### A5. Real-Time Call Assistance
**What it is:** Live prompts during calls (battle cards, objection handling)

| Aspect | Detail |
|--------|--------|
| Why NOT build | Different use case (live vs retrospective). Gong, Outreach own this. |
| Risk if built | Technical complexity (real-time), different user context |
| Alternative | Stay focused on coaching analytics, not call execution |

### A6. Gamification/Leaderboards
**What it is:** Rankings, badges, competitions for coaching metrics

| Aspect | Detail |
|--------|--------|
| Why NOT build | Can incentivize quantity over quality. Gaming metrics vs improving coaching. |
| Risk if built | Managers optimize for dashboard, not for actual coaching effectiveness |
| Alternative | Focus on quality insights, not competitive mechanics |

### A7. Exhaustive Filtering/Slicing
**What it is:** Dozens of filter dimensions, pivot tables, custom report builder

| Aspect | Detail |
|--------|--------|
| Why NOT build | "Ask Anything" is the alternative to complex filtering. AI should figure out the slice. |
| Risk if built | Complexity that "Ask Anything" is meant to eliminate |
| Alternative | Let AI handle query complexity; keep UI simple |

### A8. Mobile-First Design
**What it is:** Native mobile apps, mobile-optimized responsive design

| Aspect | Detail |
|--------|--------|
| Why NOT build (for v1) | VPs do analytical work at desks. Alert emails work on mobile. |
| Risk if built | Distracts from core desktop experience in MVP |
| Alternative | Revisit post-validation if usage patterns indicate mobile need |

---

## Feature Dependencies Map

```
                    [Time Filter]
                         |
                         v
    [Activity Metrics] --> [Manager Rollup] --> [Manager Detail]
                               |                      |
                               v                      v
                    [Rep Distribution] <----> [AI Insights]
                                                  |
                                                  v
                                          [Ask Anything]
                                                  |
                                                  v
                                      [Cited Responses]
                                                  |
                                                  v
                                       [Citation Modal]
                                                  |
                                                  v
                                        [Deep Link to Source]
```

### Critical Path for V1:
1. Data model and time filtering (foundation)
2. Manager rollup dashboard (entry point)
3. Manager detail with AI insights (core value)
4. Ask Anything with citations (differentiation)
5. Suggested actions (close the loop)

---

## Complexity Summary

| Complexity | Features |
|------------|----------|
| **Low** | Activity metrics, time filtering, call access links, basic export |
| **Medium** | Manager rollup, rep detail, activity type breakdown, trend analysis, distribution equity, mocked actions |
| **High** | AI insights, Ask Anything, cited responses, feedback quality scoring, real integrations |

---

## Competitive Positioning

| Capability | Gong | Chorus | Clari | Coaching Intelligence |
|------------|------|--------|-------|----------------------|
| Activity metrics | Yes | Yes | Limited | Yes (table stakes) |
| Call recording | Yes | Yes | No | No (integrate) |
| AI call insights | Yes | Yes | No | No (different focus) |
| Coaching-specific AI | Limited | Limited | No | **YES (differentiator)** |
| Natural language Q&A | Emerging | No | No | **YES (differentiator)** |
| Cited AI responses | No | No | No | **YES (differentiator)** |
| Deal intelligence | Yes | Limited | Yes | No (anti-feature) |
| Forecasting | Limited | No | Yes | No (anti-feature) |
| Manager-centric view | Partial | Partial | No | **YES (core focus)** |

---

## Recommendations for V1

### Must Include (Table Stakes)
1. Time-based filtering (30/60/90 days)
2. Manager rollup dashboard with scores
3. Activity type breakdown per manager
4. AE coaching distribution per manager
5. Deep links to source data

### Include as Differentiators
1. AI-generated coaching insights per manager
2. Ask Anything natural language Q&A
3. Clickable citations with verification modal
4. Trend indicators (improving/declining)
5. Feedback quality assessment

### Deliberately Exclude (Anti-Features)
1. Rep performance dashboards
2. Call recording/transcription
3. Deal/pipeline management
4. Complex filtering/report builder
5. Gamification

---

## Quality Gate Checklist

- [x] Categories are clear (table stakes vs differentiators vs anti-features)
- [x] Complexity noted for each feature
- [x] Dependencies between features identified

---

*Research completed: 2026-01-25*
*Based on analysis of: Gong, Chorus (ZoomInfo), Clari, SalesLoft, Outreach, ExecVision, and general sales intelligence market*
