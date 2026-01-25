# Project Research Summary

**Project:** Coaching Intelligence Dashboard
**Domain:** Sales coaching analytics with AI-powered insights
**Researched:** 2026-01-25
**Confidence:** HIGH

## Executive Summary

Coaching Intelligence is a React-based single-page application that transforms sales coaching analytics from passive data reporting to actionable AI-powered insights. The product targets VPs of Sales who need to understand manager coaching effectiveness across four critical dimensions: investment level, temporal trends, distribution equity, and feedback quality. Unlike established players (Gong, Chorus, Clari) that focus on call intelligence or deal forecasting, this product differentiates through manager-centric coaching analytics with natural language queries and cited AI responses.

The recommended technical approach uses React 19 with Vite 6 for the build system, Tailwind CSS 4 for styling with Vercel's Geist design system, and the Anthropic Claude SDK for AI integration. The architecture follows a component-based structure with static data for v1, progressive disclosure for information hierarchy, and a citation system that grounds AI insights in verifiable source data. The critical path starts with foundational data models and timeframe filtering, builds up to manager dashboards with AI insights, and culminates in natural language Q&A with clickable citations.

Key risks include citation ID mismatches breaking trust in AI responses, timeframe state management causing data inconsistencies, context window exhaustion in extended conversations, and router state divergence breaking deep linking from email alerts (the critical user entry point). These are mitigated through strict citation ID contracts, centralized timeframe state management, conversation summarization strategies, and URL-as-source-of-truth routing patterns.

## Key Findings

### Recommended Stack

The stack is constrained by project requirements but well-validated for this use case. React 19 provides the stable foundation with improved async handling via the `use` hook, perfect for streaming AI responses. Vite 6 offers 10-100x faster development cycles than CRA/webpack. Tailwind CSS 4's new Oxide engine brings 10x faster builds with zero-config content detection. The Anthropic SDK provides first-class streaming support essential for responsive AI interactions.

**Core technologies:**
- **React 19** (^19.0.0): Stable release with Actions API for forms and `use` hook for suspense-based data fetching
- **Vite 6** (^6.0.x): Native ESM dev server with instant HMR, Rollup 4-based production builds
- **Tailwind CSS 4** (^4.0.x): Oxide engine with CSS-first configuration, required for design spec compliance
- **Vercel Geist** (^1.4.x): Official design system matching pink gradient aesthetic, provides Sans and Mono fonts
- **Lucide React** (^0.468.x): Tree-shakeable icon system with all required icons from spec
- **Anthropic SDK** (^0.36.x): TypeScript SDK with streaming support and built-in retry logic for Ask Anything feature
- **React Router 7** (^7.1.x): Type-safe routing with improved data loading for two-route app
- **Zustand** (^5.0.x): Minimal state management for timeframe, modals, and conversation history (alternative: React Context for simpler start)

**What NOT to use:** Create React App (deprecated), Next.js (adds SSR complexity for client-side app), Redux (overkill), React Query (no REST API), Framer Motion (not required by spec).

### Expected Features

Research analyzed Gong, Chorus, Clari, SalesLoft, Outreach, and ExecVision to categorize features by competitive necessity. Table stakes features establish baseline credibility; differentiators create product moat; anti-features prevent scope creep.

**Must have (table stakes):**
- Time-based filtering (30/60/90 day toggles) — universal in analytics products, metrics meaningless without temporal context
- Manager rollup dashboard — VPs manage managers not reps directly, hierarchy matters
- Activity metrics breakdown by type — different coaching methods have different value
- Rep-level detail with coaching distribution — answers "is coaching distributed fairly?"
- Call/recording access via deep links — VPs must verify quality not just quantity

**Should have (competitive differentiators):**
- AI-generated coaching insights per manager — transforms data into action, rare in sales coaching space
- Natural language Q&A ("Ask Anything") — eliminates dashboard navigation complexity, emerging in BI tools but rare here
- Clickable citations with verification modal — builds trust in AI by showing sources, most AI features are "trust me" black boxes
- Trend analysis with trajectory indicators — answers "is this improving or declining?" for intervention timing
- Feedback quality scoring via NLP — quantity is table stakes, quality measurement is rare

**Defer (v2+ or never):**
- Rep performance dashboards — this is Coaching Intelligence not Sales Intelligence, Gong/Clari own this space
- Call recording/transcription — commodity feature with massive infrastructure costs, integrate don't replicate
- Deal/pipeline management — different problem space, Clari/Salesforce domain
- Gamification/leaderboards — incentivizes gaming metrics over quality coaching
- Complex filtering/pivot tables — "Ask Anything" is the alternative to complexity

### Architecture Approach

The architecture follows a four-layer component structure optimized for progressive disclosure and clear data flow boundaries. Static data in v1 enables rapid UI/UX validation without backend complexity, with the Claude API as the only external dependency. The system uses URL-as-source-of-truth for all navigation state to support deep linking from email alerts.

**Major components:**
1. **Application Shell (App.jsx)** — Owns routing (/, /manager/:id), global state provider (Context/Zustand), and modal root portal
2. **Page Components (Dashboard, ManagerDetail)** — Dashboard manages timeframe state and 2x2 manager card grid; ManagerDetail owns conversation history and five insight dimensions
3. **Shared Components** — Display components (MetricDisplay, TrendArrow, Badge, Citation, InsightSection) are stateless; interactive components (TimeframeToggle, AskInput, AETable) emit events; modals (CitationModal, ActionModal) render via portal
4. **Data & Services Layer** — Static data files (managers, AEs, feedback, summaries, timeframes); service layer aggregates data by manager/timeframe and handles Claude API integration with streaming

**Key architectural decisions:**
- Static data over API for v1 (focus on UX validation)
- Context over Zustand initially (simpler, upgrade if needed)
- Modals via portal (avoids z-index conflicts)
- Conversation per-session (no persistence in v1)
- Citation ID contract established in foundation phase

**Build order:** Foundation (setup, data layer, tokens) → Atomic components (TrendArrow, Badge, MetricDisplay, Citation) → Composite components (TimeframeToggle, ManagerCard, AskInput) → Dashboard page → Manager detail components → Manager detail page → Modal system → Claude integration → Polish

### Critical Pitfalls

Research identified 23 pitfalls across seven categories. Top five most likely failures require preventative architecture patterns from day one.

1. **Citation ID Mismatch** — Citation references like `[CALL-1042]` fail to resolve because IDs treated inconsistently (case, prefix, format). **Prevention:** Define canonical citation format in shared constants, unified lookup function, data validation cross-referencing all citation IDs against source data, unit tests verifying every sample Q&A citation resolves.

2. **Hallucinated Citations** — Claude generates plausible `[CALL-9999]` that doesn't exist in data. **Prevention:** Include exhaustive list of valid citation IDs in system prompt, post-process responses to validate all citations exist before rendering, strip invalid citations rather than showing broken links, use constrained generation patterns.

3. **Router State Divergence** — Manager ID in component state breaks direct links and browser navigation. **Prevention:** Manager ID, timeframe, and navigation state must be in URL; use React Router params/search params; components read from URL not internal state; test deep linking early since user journey STARTS with email deep link.

4. **Stale Data After Timeframe Toggle** — Some components show 30-day data while others show 90-day after toggle. **Prevention:** Single source of truth for timeframe in context; all data hooks accept timeframe as dependency not closure; create `useTimeframeData(managerId)` hook; add visual indicator during transitions.

5. **Context Window Exhaustion** — After 10+ exchanges, conversation history plus system prompt plus data context exceeds Claude's limits. **Prevention:** Implement conversation summarization for older exchanges, limit history to last N messages with sliding window, move static context outside conversation history, track token usage.

## Implications for Roadmap

Based on architecture dependencies and pitfall prevention requirements, suggested phase structure follows a foundation-first, risk-reduction approach that delivers value incrementally while establishing critical patterns early.

### Phase 1: Foundation & Static Data
**Rationale:** Establishes citation ID contract, data models, and design system before any feature work. Prevents citation mismatch (Pitfall 1.1) and ensures consistent theming.
**Delivers:** Project setup (Vite, React, Tailwind, Geist fonts), complete static data layer imported from coaching-intelligence-data/, design tokens in CSS variables, citation ID format standardized.
**Addresses:** Data model requirements from ARCHITECTURE.md Layer 4, design system setup from STACK.md.
**Avoids:** Citation ID mismatch (1.1), Geist customization breaking updates (6.2).
**Research needed:** None — well-documented setup patterns.

### Phase 2: Component Library & Timeframe State
**Rationale:** Builds atomic and composite components with centralized timeframe management before page assembly. Prevents stale data issues (Pitfall 2.1).
**Delivers:** Atomic components (TrendArrow, Badge, MetricDisplay, Citation), composite components (TimeframeToggle, ManagerCard, AskInput, InsightSection), global timeframe context.
**Addresses:** Table stakes features (time-based filtering, activity metrics display), display patterns from FEATURES.md.
**Avoids:** Stale data after timeframe toggle (2.1), metric discontinuity across timeframes (2.2), manager score without context (5.1).
**Research needed:** None — standard React patterns.

### Phase 3: Dashboard Page
**Rationale:** Delivers first end-to-end user value with manager rollup view and navigation. Tests timeframe state management with real components.
**Delivers:** Dashboard layout (Header, 2x2 ManagerCard grid, footer), timeframe toggle integration, navigation to manager detail, routing setup with URL-as-source-of-truth.
**Addresses:** Table stakes features (manager rollup dashboard, timeframe filtering), entry point from ARCHITECTURE.md.
**Avoids:** Router state divergence (6.3), component-level data fetching waterfalls (6.1).
**Research needed:** None — straightforward page composition.

### Phase 4: Manager Detail View (Static Insights)
**Rationale:** Delivers second major view with AI insights (pre-generated), AE distribution, and full coaching dimensions. Establishes information hierarchy before adding conversation complexity.
**Delivers:** ManagerDetail page with hero section (metrics, AI summary), five insight sections (investment, trends, distribution, performance, quality), AE table with flags, sources footer, actions bar (mocked).
**Addresses:** Differentiating features (AI insights, trend analysis, distribution equity, feedback quality), table stakes (rep-level detail), critical path from FEATURES.md.
**Avoids:** Information density overwhelming users (7.3), AE distribution misrepresentation (5.2), trend visualization without significance (5.3).
**Research needed:** None — using pre-generated summaries, no API integration yet.

### Phase 5: Modal System
**Rationale:** Establishes citation verification before adding Claude API. Users can explore pre-generated insights with sources.
**Delivers:** Modal infrastructure (portal, backdrop, close behavior), CitationModal with call details and deep links, ActionModal with confirmation flows.
**Addresses:** Table stakes feature (call/recording access), differentiating feature (cited AI responses).
**Avoids:** Nested modal confusion (4.1), modal state persisting after close (4.2), action confirmation without context (4.3).
**Research needed:** None — standard modal patterns.

### Phase 6: Claude API Integration (Ask Anything)
**Rationale:** Adds conversational AI with streaming and citation parsing after all foundational UX complete. Highest technical risk isolated to single phase.
**Delivers:** Claude service with system prompt builder and streaming, conversation thread with message list and follow-ups, AskInput integration, citation parsing and validation, conversation state management.
**Addresses:** Core differentiating features (natural language Q&A, cited AI responses), critical path from FEATURES.md.
**Avoids:** Prompt injection (3.1), hallucinated citations (3.2), latency destroying UX (3.3), context window exhaustion (3.4), chat context invalidation on timeframe change (2.3).
**Research needed:** YES — Phase-level research for Claude prompt engineering patterns, citation generation strategies, streaming implementation details, error handling approaches.

### Phase 7: Polish & Production Readiness
**Rationale:** Adds production quality after feature-complete validation. Includes loading states, error boundaries, animations, accessibility.
**Delivers:** Skeleton loaders for data and AI responses, error boundaries with graceful degradation, transition animations for modals/cards/messages, keyboard navigation and ARIA labels, performance optimization (lazy loading, code splitting).
**Addresses:** UX pitfalls (Ask Anything without guidance 7.1, action buttons without feedback loop 7.2).
**Avoids:** All latency-related UX issues, accessibility barriers.
**Research needed:** None — standard production patterns.

### Phase Ordering Rationale

- **Foundation first:** Citation ID contract and timeframe state patterns prevent architectural debt before feature work begins
- **Components before pages:** Atomic/composite components tested in isolation before composition reduces debugging complexity
- **Static insights before dynamic:** Pre-generated AI summaries deliver 80% of value while deriving patterns for prompt engineering
- **Modals before Claude:** Users verify citation UX with static data before API introduces latency and complexity
- **Claude isolated:** Highest technical risk (streaming, parsing, context management) confined to Phase 6 after all supporting infrastructure proven
- **Polish last:** Production readiness separated from feature validation enables early user testing

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 6 (Claude Integration):** Complex prompt engineering for grounded citations, streaming implementation patterns, conversation context management strategies, error handling for API failures. Use `/gsd:research-phase` before implementation.

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Foundation):** Well-documented Vite + React + Tailwind setup
- **Phase 2 (Components):** Standard React component patterns
- **Phase 3 (Dashboard):** Straightforward page composition and routing
- **Phase 4 (Manager Detail):** Static data rendering with established patterns
- **Phase 5 (Modals):** Common modal implementation patterns
- **Phase 7 (Polish):** Standard production optimization techniques

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies are stable releases with proven track records. React 19, Vite 6, Tailwind 4 are production-ready. Anthropic SDK has first-class TypeScript support. No bleeding-edge dependencies. |
| Features | HIGH | Comprehensive competitive analysis across 6 established products. Clear categorization into table stakes, differentiators, and anti-features. Feature dependencies mapped. |
| Architecture | HIGH | Component boundaries clearly defined with explicit data flow. Build order follows natural dependencies. Static data approach proven for MVPs. Citation system well-specified. |
| Pitfalls | HIGH | 23 pitfalls identified across 7 categories with specific prevention strategies. Phase mapping shows when each risk emerges. Top 5 failures prioritized based on likelihood and impact. |

**Overall confidence:** HIGH

The research converges on a coherent technical approach with clear risk mitigation strategies. Stack choices are constrained but optimal for the use case. Feature differentiation is validated against competitive landscape. Architecture follows proven SPA patterns with adaptations for AI citation requirements. Pitfalls are specific and actionable rather than generic.

### Gaps to Address

While confidence is high, these areas need validation during implementation:

- **Claude citation generation reliability:** Pre-computing common Q&A responses may be necessary if real-time citation generation proves unreliable. Monitor hallucination rates in Phase 6; have fallback to curated responses ready.

- **Timeframe metric scaling correctness:** Sample data includes scaled benchmarks (45 for 30 days, 135 for 90 days), but some derived metrics may need additional normalization rules. Validate calculations with domain expert during Phase 2-3.

- **Modal stacking policy decision:** Architecture suggests either allowing stacking with hierarchy OR replacing previous modal. User testing in Phase 5 should inform which pattern feels more intuitive for citation exploration workflows.

- **Conversation history limits:** Context window exhaustion prevention suggests "last N messages," but optimal N depends on average message length and data context size. Instrument Phase 6 to determine threshold empirically.

- **Deep link entry point validation:** User journey assumes email alerts with deep links, but v1 has no alert system. Phase 3 should implement shareable URLs and test with simulated email entry to validate routing patterns work as intended.

## Sources

### Primary (HIGH confidence)
- **Anthropic Claude SDK Documentation** — Official TypeScript SDK patterns, streaming implementation, prompt engineering best practices
- **React 19 Release Notes** — New `use` hook, Actions API, concurrent rendering improvements
- **Vite 6 Documentation** — Environment API, Rollup 4 integration, React plugin configuration
- **Tailwind CSS 4 Documentation** — Oxide engine, CSS-first configuration, migration from v3
- **React Router 7 Migration Guide** — Type-safe routing patterns, loaders/actions API

### Secondary (MEDIUM confidence)
- **Gong, Chorus, Clari product documentation** — Feature analysis for competitive positioning (observed via public materials, not internal access)
- **SalesLoft, Outreach platform reviews** — Common sales coaching analytics patterns from user-generated content
- **Vercel Geist Design System** — Font integration patterns and component styling approaches

### Tertiary (LOW confidence)
- **General SPA architecture patterns** — Component boundary and state management strategies adapted from React ecosystem consensus (not domain-specific)
- **AI citation system examples** — Patterns inferred from adjacent domains (research tools, legal tech) as sales coaching citation systems are emerging pattern

---
*Research completed: 2026-01-25*
*Ready for roadmap: yes*
