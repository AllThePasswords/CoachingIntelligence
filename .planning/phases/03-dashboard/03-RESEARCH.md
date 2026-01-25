# Phase 3: Dashboard - Research

**Researched:** 2026-01-25
**Domain:** React dashboard pages, routing, and layout composition
**Confidence:** HIGH

## Summary

This phase assembles the Phase 2 components into a functional dashboard view with routing to a manager detail page. Research focused on three areas: (1) routing between dashboard and detail pages, (2) dashboard layout patterns (header, card grid, pinned input), and (3) implementation of the pink gradient accent per design spec.

The standard approach is React Router v7 in declarative mode for simple SPA routing, CSS Grid for the 2-column responsive card layout, and fixed positioning for the pinned "Ask anything" input bar. All Phase 2 components are ready for composition - ManagerCard, TimeframeToggle, AskInput, and the Zustand timeframe store.

**Primary recommendation:** Install react-router (single package in v7), create Dashboard and ManagerDetail page components, use a simple 2-column responsive grid for manager cards, and pin the AskInput to the bottom of the viewport with fixed positioning.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-router | ^7.x | Client-side routing | Official React Router v7 unifies all routing in single package, declarative mode is simplest for SPA |
| React 19 | 19.2.x | Component framework | Already in project |
| Zustand | 5.0.x | Timeframe state | Already in project, shared across all cards |
| Tailwind CSS 4 | 4.1.x | Styling and layout | Already in project, CSS Grid utilities built-in |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None required | - | - | Phase 2 components are sufficient |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-router declarative mode | react-router data mode | More features (loaders, actions) but more complex setup - overkill for 2-page SPA |
| Fixed position AskInput | Sticky position | Sticky requires scroll container context, fixed is simpler for viewport-pinned element |
| CSS Grid layout | Flexbox | Grid is cleaner for 2D card layouts, Flexbox works but requires more wrapper divs |

**Installation:**
```bash
npm install react-router
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/          # From Phase 2 (unchanged)
│   ├── ui/             # Badge, TrendArrow, Tooltip, InfoIcon
│   ├── display/        # MetricDisplay, Citation
│   ├── input/          # TimeframeToggle, AskInput
│   ├── cards/          # ManagerCard
│   └── sections/       # InsightSection
├── pages/              # NEW: Page components
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   └── index.js
│   ├── ManagerDetail/
│   │   ├── ManagerDetail.jsx
│   │   └── index.js
│   └── index.js        # Page barrel export
├── layouts/            # NEW: Shared layout components
│   ├── AppLayout.jsx   # Header + main content wrapper
│   └── index.js
├── stores/             # From Phase 2 (unchanged)
├── data/               # From Phase 2 (unchanged)
├── styles/             # From Phase 2 (unchanged)
├── App.jsx             # Router configuration
└── main.jsx
```

### Pattern 1: React Router v7 Declarative Mode Setup
**What:** Configure BrowserRouter with Routes for dashboard and detail pages.
**When to use:** For simple SPAs with client-side navigation between pages.
**Example:**
```javascript
// App.jsx
// Source: https://reactrouter.com/start/modes
import { BrowserRouter, Routes, Route } from 'react-router';
import { AppLayout } from '@/layouts';
import { Dashboard, ManagerDetail } from '@/pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/manager/:managerId" element={<ManagerDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### Pattern 2: Layout Route with Outlet
**What:** Wrap pages in a shared layout (header, footer) using React Router's Outlet.
**When to use:** When multiple routes share the same header/navigation structure.
**Example:**
```javascript
// layouts/AppLayout.jsx
// Source: https://reactrouter.com/tutorials/quickstart
import { Outlet } from 'react-router';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* App header - shared across all pages */}
      <header className="sticky top-0 z-40 bg-background-100 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <h1 className="text-xl font-semibold tracking-tight">
            Coaching Intelligence
          </h1>
        </div>
      </header>

      {/* Page content renders here */}
      <main className="pb-24"> {/* Padding for fixed footer */}
        <Outlet />
      </main>
    </div>
  );
}
```

### Pattern 3: Responsive Card Grid
**What:** Use CSS Grid with responsive breakpoints for the 4-card layout.
**When to use:** For dashboard card layouts that should stack on mobile, 2 columns on tablet+.
**Example:**
```javascript
// pages/Dashboard/Dashboard.jsx
// Source: https://tailwindcss.com/docs/grid-template-columns
import { ManagerCard } from '@/components/cards';

export function Dashboard() {
  const managerIds = ['MGR001', 'MGR002', 'MGR003', 'MGR004'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Card Grid - 1 col mobile, 2 cols md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {managerIds.map(id => (
          <ManagerCard key={id} managerId={id} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}
```

### Pattern 4: Fixed Bottom Input Bar
**What:** Pin the AskInput to the bottom of the viewport, always visible.
**When to use:** For persistent action inputs that should remain accessible while scrolling.
**Example:**
```javascript
// Pinned footer inside Dashboard or AppLayout
// Source: https://tailwindcss.com/docs/position
<div className="fixed bottom-0 inset-x-0 z-50 bg-background-100 border-t border-border">
  <div className="max-w-7xl mx-auto px-4 py-4">
    <AskInput
      onSubmit={handleAskSubmit}
      placeholder="Ask anything about your team..."
    />
  </div>
</div>
```

### Pattern 5: Navigation with useNavigate
**What:** Programmatic navigation from card click to detail page.
**When to use:** When navigation is triggered by a callback (onClick) rather than a link.
**Example:**
```javascript
// pages/Dashboard/Dashboard.jsx
// Source: https://reactrouter.com/start/modes
import { useNavigate } from 'react-router';

export function Dashboard() {
  const navigate = useNavigate();

  const handleCardClick = (managerId) => {
    navigate(`/manager/${managerId}`);
  };

  return (
    <ManagerCard
      managerId="MGR001"
      onClick={handleCardClick}
    />
  );
}
```

### Pattern 6: URL Parameters with useParams
**What:** Extract route parameters (managerId) from the URL.
**When to use:** On detail pages that need to know which item to display.
**Example:**
```javascript
// pages/ManagerDetail/ManagerDetail.jsx
// Source: https://reactrouter.com/start/modes
import { useParams } from 'react-router';
import { getManagerById } from '@/data';

export function ManagerDetail() {
  const { managerId } = useParams();
  const manager = getManagerById(managerId);

  if (!manager) {
    return <div>Manager not found</div>;
  }

  return (
    <div>
      <h2>{manager.name}</h2>
      {/* Detail content */}
    </div>
  );
}
```

### Anti-Patterns to Avoid
- **Using data mode for simple routing:** Declarative mode is sufficient for 2-page SPA with static data. Data mode adds complexity without benefit.
- **Prop drilling managerId to nested components:** Use useParams() directly in components that need it, or Zustand for shared state.
- **Building custom navigation state:** React Router handles browser history, back button, URL params automatically.
- **Sticky position for pinned footer:** Sticky requires scroll container context and can be unreliable. Fixed is simpler and more predictable.
- **Putting AskInput in each page:** Put it in AppLayout once, available on all pages.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Client-side routing | Custom history management | react-router BrowserRouter | Browser history, URL params, back button handled automatically |
| URL parameter extraction | Manual URL parsing | useParams() hook | Type-safe, reactive, integrated with route definition |
| Navigation actions | window.location changes | useNavigate() hook | Maintains SPA state, no page reload, integrates with router |
| Shared layout | Copy-paste header to each page | Layout routes with Outlet | Single source of truth, DRY, cleaner component tree |
| Responsive grid | Custom media query handling | Tailwind grid-cols-1 md:grid-cols-2 | Built-in, tested, consistent breakpoints |

**Key insight:** React Router v7 provides everything needed for a simple dashboard SPA. The declarative mode is sufficient - no need for data mode loaders or framework mode complexity.

## Common Pitfalls

### Pitfall 1: Wrong Import Path for React Router v7
**What goes wrong:** Import from 'react-router-dom' instead of 'react-router'.
**Why it happens:** v6 and earlier used 'react-router-dom' for web. v7 consolidated to single 'react-router' package.
**How to avoid:**
```javascript
// WRONG (v6 pattern)
import { BrowserRouter } from 'react-router-dom';

// CORRECT (v7 pattern)
import { BrowserRouter } from 'react-router';
```
**Warning signs:** Module not found error, or importing deprecated package.

### Pitfall 2: Content Hidden Behind Fixed Footer
**What goes wrong:** Bottom content is obscured by the fixed AskInput bar.
**Why it happens:** Fixed elements are removed from document flow, content doesn't know to make space.
**How to avoid:** Add padding-bottom to the main content area equal to footer height (e.g., `pb-24` for a ~96px footer).
**Warning signs:** Can't scroll to see last card, content cut off at bottom.

### Pitfall 3: ManagerCard Not Updating on Timeframe Change
**What goes wrong:** Cards don't re-render when TimeframeToggle changes selection.
**Why it happens:** ManagerCard already uses Zustand correctly with selective subscription. But if someone adds a new component that doesn't subscribe properly, it won't update.
**How to avoid:** Always use selector pattern: `useTimeframeStore(state => state.timeframe)` not `useTimeframeStore()`.
**Warning signs:** Changing timeframe doesn't update metric values on cards.

### Pitfall 4: Gradient Border Doesn't Match Design
**What goes wrong:** Pink gradient appears blocky or inconsistent.
**Why it happens:** Tailwind doesn't support gradient borders directly. Must use background-based technique.
**How to avoid:** Use wrapper div with gradient background + padding, inner div with solid background:
```html
<div className="p-0.5 bg-gradient-to-r from-highlight to-purple rounded-xl">
  <div className="bg-background-100 rounded-[calc(0.75rem-2px)] p-5">
    {/* Card content */}
  </div>
</div>
```
**Warning signs:** Gradient appears as solid color or has sharp corners.

### Pitfall 5: Route Not Found on Refresh
**What goes wrong:** Direct URL to /manager/MGR001 shows 404.
**Why it happens:** Server doesn't know about client-side routes, tries to serve static file.
**How to avoid:** Vite dev server handles this automatically. For production, configure server to serve index.html for all routes (SPA fallback).
**Warning signs:** Routes work when clicking but fail on browser refresh or direct URL access.

## Code Examples

Verified patterns from official sources:

### React Router v7 Setup
```javascript
// main.jsx
// Source: https://reactrouter.com/start/modes
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import '@/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

```javascript
// App.jsx
import { Routes, Route } from 'react-router';
import { AppLayout } from '@/layouts';
import { Dashboard, ManagerDetail } from '@/pages';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/manager/:managerId" element={<ManagerDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
```

### Dashboard Page Component
```javascript
// pages/Dashboard/Dashboard.jsx
import { useNavigate } from 'react-router';
import { ManagerCard } from '@/components/cards';
import { TimeframeToggle } from '@/components/input';
import { managers } from '@/data';

export function Dashboard() {
  const navigate = useNavigate();

  const handleCardClick = (managerId) => {
    navigate(`/manager/${managerId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with timeframe control */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Team Overview</h2>
        <TimeframeToggle />
      </div>

      {/* Manager card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {managers.map(manager => (
          <ManagerCard
            key={manager.id}
            managerId={manager.id}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
}
```

### Gradient Accent Card Wrapper
```javascript
// Tailwind CSS gradient border technique
// Source: https://dev.to/tailus/how-to-create-gradient-borders-with-tailwindcss-4gk2

// Add gradient wrapper to ManagerCard or create variant
// Uses highlight (#ff0080) and purple (#f81ce5) from Geist theme
<div className="p-0.5 bg-gradient-to-r from-highlight to-purple rounded-xl">
  <div className="bg-background-100 rounded-[calc(0.75rem-2px)]">
    <ManagerCard managerId="MGR001" onClick={handleClick} />
  </div>
</div>

// Or add as ManagerCard variant prop
function ManagerCard({ managerId, onClick, variant = 'border', gradient = false }) {
  const content = (
    <div className={variantClasses}>
      {/* Card content */}
    </div>
  );

  if (gradient) {
    return (
      <div className="p-0.5 bg-gradient-to-r from-highlight to-purple rounded-xl">
        {content}
      </div>
    );
  }

  return content;
}
```

### Fixed Bottom AskInput Bar
```javascript
// layouts/AppLayout.jsx or pages/Dashboard/Dashboard.jsx
// Source: https://tailwindcss.com/docs/position
import { Outlet } from 'react-router';
import { AskInput } from '@/components/input';

export function AppLayout() {
  const handleAskSubmit = (question) => {
    // Phase 3: Just log, chat functionality comes later
    console.log('Question submitted:', question);
    alert(`You asked: "${question}"\n\nChat feature coming in Phase 4`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background-100 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <h1 className="text-xl font-semibold tracking-tight">
            Coaching Intelligence
          </h1>
        </div>
      </header>

      <main className="pb-24">
        <Outlet />
      </main>

      {/* Pinned AskInput footer */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-background-100 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <AskInput
            onSubmit={handleAskSubmit}
            placeholder="Ask anything about your team..."
          />
        </div>
      </div>
    </div>
  );
}
```

### Manager Detail Page (Placeholder)
```javascript
// pages/ManagerDetail/ManagerDetail.jsx
import { useParams, Link } from 'react-router';
import { getManagerById } from '@/data';
import { useTimeframeStore } from '@/stores';
import { Badge } from '@/components/ui';
import { MetricDisplay } from '@/components/display';
import { InsightSection } from '@/components/sections';

export function ManagerDetail() {
  const { managerId } = useParams();
  const timeframe = useTimeframeStore(state => state.timeframe);
  const manager = getManagerById(managerId);

  if (!manager) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-500">Manager not found: {managerId}</p>
        <Link to="/" className="text-foreground underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link to="/" className="text-sm text-gray-500 hover:text-foreground mb-4 inline-block">
        &larr; Back to Dashboard
      </Link>

      {/* Manager header */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">{manager.name}</h2>
        <Badge trend={manager.trend === 'stable' ? 'steady' : manager.trend} />
      </div>

      {/* Metrics row */}
      <div className="flex gap-8 mb-8">
        <MetricDisplay
          label="Attainment"
          value={manager.quota_attainment}
          tooltip="Team quota attainment vs. target"
        />
        <MetricDisplay
          label="Coaching"
          value={manager.coaching_score}
          tooltip="Calls reviewed, commented, or scored"
        />
      </div>

      {/* Placeholder for insights - detailed in Phase 4 */}
      <InsightSection title="Summary">
        <p className="text-gray-600">{manager.summary}</p>
      </InsightSection>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-router-dom package | react-router single package | v7 (2024-2025) | Simpler dependencies, unified API |
| createBrowserRouter for all | Declarative mode for simple SPAs | v7 (2024-2025) | Right tool for right complexity level |
| Custom layout components with children | Layout routes with Outlet | v6.4+ (2022) | Router-aware layouts, better nesting |
| CSS float/flexbox for grids | CSS Grid | 2020+ | Native 2D layouts, simpler responsive |
| position: sticky for footers | position: fixed for viewport-pinned | Always | Fixed is more predictable for persistent footers |

**Deprecated/outdated:**
- **react-router-dom:** v7 consolidates to `react-router` package
- **Switch component:** Replaced by Routes in v6+
- **useHistory hook:** Replaced by useNavigate in v6+
- **component prop on Route:** Use element prop with JSX instead
- **exact prop:** v6+ matching is exact by default

## Open Questions

Things that couldn't be fully resolved:

1. **Suggested Action Buttons (ACT-01)**
   - What we know: Requirement says "Suggested action buttons appear on manager cards and detail view"
   - What's unclear: No design spec for what actions or how they appear. Current ManagerCard has "View Details" button.
   - Recommendation: Implement "View Details" as primary action for Phase 3. Add additional suggested actions in Phase 4 or later when chat/AI features are available.

2. **Pink Gradient Accent Implementation**
   - What we know: DASH-07 requires "pink gradient accent per design spec"
   - What's unclear: Exactly which elements should have gradient (all cards? borders? backgrounds?)
   - Recommendation: Apply gradient border technique to ManagerCard wrapper. Use existing theme colors (--color-highlight: #ff0080, --color-purple: #f81ce5).

3. **AskInput Submit Behavior**
   - What we know: Requirement says "submitting opens new chat"
   - What's unclear: Chat feature is not part of Phase 3 scope
   - Recommendation: For Phase 3, show alert/toast indicating feature coming soon. Full chat implementation in later phase.

## Sources

### Primary (HIGH confidence)
- React Router official documentation - https://reactrouter.com/start/modes
- React Router v7 Quick Start - https://reactrouter.com/tutorials/quickstart
- Tailwind CSS Grid documentation - https://tailwindcss.com/docs/grid-template-columns
- Tailwind CSS Position documentation - https://tailwindcss.com/docs/position

### Secondary (MEDIUM confidence)
- [How to use React Router v7 in React apps - LogRocket](https://blog.logrocket.com/react-router-v7-guide/) - Verified import patterns
- [Choosing the right React Router v7 mode - LogRocket](https://blog.logrocket.com/react-router-v7-modes/) - Mode selection guidance
- [How to create gradient borders with Tailwind CSS](https://dev.to/tailus/how-to-create-gradient-borders-with-tailwindcss-4gk2) - Gradient border technique
- [Creating a Flexbox Sticky Footer with Tailwind](https://www.gomasuga.com/blog/creating-a-sticky-footer-with-tailwind) - Fixed footer patterns

### Tertiary (LOW confidence)
- None - all findings verified with official sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - React Router v7 docs verified, Tailwind CSS patterns verified
- Architecture: HIGH - Layout patterns from official React Router tutorials, grid from Tailwind docs
- Pitfalls: MEDIUM - Import path issue well-documented, others from common patterns

**Research date:** 2026-01-25
**Valid until:** 2026-02-24 (30 days - routing patterns are stable)
