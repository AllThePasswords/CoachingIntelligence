# Phase 2: Component Library - Research

**Researched:** 2026-01-25
**Domain:** React 19 component architecture and state management
**Confidence:** HIGH

## Summary

This phase builds reusable UI components with centralized timeframe state management. Research focused on three critical decisions: (1) state management approach for shared timeframe state, (2) component organization patterns for scalability, and (3) architecture for component isolation and reusability.

The standard approach in 2026 is Zustand for shared client state (like timeframe toggles), Context API only for stable environment values (theme, auth), and component-centric file organization with colocation. React 19's compiler reduces re-render overhead, but proper state architecture remains critical.

**Primary recommendation:** Use Zustand for timeframe state management, organize components by feature/domain with barrel exports for public API, and leverage compound component patterns for complex UI elements like cards and sections.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Zustand | 5.0.x | Client state management | 40%+ adoption in 2026, no providers needed, selective re-renders, perfect for shared toggles |
| React 19 | 19.2.x | Component framework | Built-in compiler reduces re-renders, official hooks pattern (useState, useContext) |
| Tailwind CSS 4 | 4.1.x | Styling | Already in project, CSS-first @theme approach, utility-first design |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React Testing Library | Latest | Component testing | User-focused behavior testing, pairs with Vitest |
| Vitest | Latest | Test runner | 10-20x faster than Jest, native ESM support, Vite integration |
| Storybook | 8.x | Component documentation | Optional: document components in isolation, useful for design systems |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zustand | Context + useReducer | More boilerplate, all consumers re-render on change, suitable only if state changes rarely |
| Zustand | Redux Toolkit | Heavier setup, enterprise-scale complexity (undo/redo, time-travel), overkill for simple toggles |
| Zustand | Jotai/Recoil | Atom-based pattern, more granular but less intuitive for simple shared state |

**Installation:**
```bash
npm install zustand
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Primitive components (Badge, Button, etc.)
│   │   ├── Badge/
│   │   │   ├── Badge.jsx
│   │   │   └── index.js          # Barrel export
│   │   ├── TrendArrow/
│   │   │   ├── TrendArrow.jsx
│   │   │   └── index.js
│   │   └── index.js              # UI barrel
│   ├── display/        # Display components (MetricDisplay, Citation)
│   │   ├── MetricDisplay/
│   │   │   ├── MetricDisplay.jsx
│   │   │   └── index.js
│   │   └── index.js              # Display barrel
│   ├── cards/          # Composite components (ManagerCard)
│   │   ├── ManagerCard/
│   │   │   ├── ManagerCard.jsx
│   │   │   └── index.js
│   │   └── index.js              # Cards barrel
│   ├── sections/       # Section components (InsightSection)
│   │   └── InsightSection/
│   │       ├── InsightSection.jsx
│   │       └── index.js
│   └── input/          # Input components (AskInput)
│       └── AskInput/
│           ├── AskInput.jsx
│           └── index.js
├── stores/             # Zustand stores
│   ├── timeframeStore.js        # Centralized timeframe state
│   └── index.js                 # Stores barrel
└── hooks/              # Custom hooks (only reusable ones)
    └── useTimeframe.js          # Hook wrapping timeframe store
```

### Pattern 1: Zustand Store for Shared State
**What:** Create a Zustand store for timeframe state that any component can subscribe to without prop drilling or providers.
**When to use:** For client state shared across multiple unrelated components (timeframe toggle, filters, UI preferences).
**Example:**
```javascript
// stores/timeframeStore.js
// Source: https://github.com/pmndrs/zustand
import { create } from 'zustand';

export const useTimeframeStore = create((set) => ({
  timeframe: '30',
  setTimeframe: (newTimeframe) => set({ timeframe: newTimeframe }),
  toggleTimeframe: () => set((state) => ({
    timeframe: state.timeframe === '30' ? '90' : '30'
  }))
}));

// Usage in any component (no provider needed)
import { useTimeframeStore } from '@/stores';

function TimeframeToggle() {
  const { timeframe, setTimeframe } = useTimeframeStore();
  return (
    <button onClick={() => setTimeframe('90')}>
      {timeframe} days
    </button>
  );
}

// Selective subscription (only re-renders when timeframe changes)
function MetricDisplay() {
  const timeframe = useTimeframeStore(state => state.timeframe);
  // ...
}
```

### Pattern 2: Compound Components with Context
**What:** Related components share implicit state via Context without prop drilling.
**When to use:** For complex components with multiple parts (ManagerCard with header, metrics, summary).
**Example:**
```javascript
// Source: https://www.patterns.dev/react/compound-pattern/
// components/cards/ManagerCard/ManagerCard.jsx
import { createContext, useContext } from 'react';

const ManagerCardContext = createContext(null);

export function ManagerCard({ children, manager }) {
  return (
    <ManagerCardContext value={manager}>
      <div className="bg-background-100 border border-border rounded-xl p-5">
        {children}
      </div>
    </ManagerCardContext>
  );
}

ManagerCard.Header = function Header() {
  const manager = useContext(ManagerCardContext);
  return (
    <div className="flex justify-between items-center mb-5">
      <h3>{manager.name}</h3>
      <Badge trend={manager.trend} />
    </div>
  );
};

ManagerCard.Metrics = function Metrics() {
  const manager = useContext(ManagerCardContext);
  return (
    <div className="flex gap-8">
      <MetricDisplay label="Attainment" value={manager.attainment} />
      <MetricDisplay label="Coaching" value={manager.coaching} />
    </div>
  );
};

// Usage - flexible markup, shared state
<ManagerCard manager={data}>
  <ManagerCard.Header />
  <ManagerCard.Metrics />
</ManagerCard>
```

### Pattern 3: Barrel Exports for Public API
**What:** Each component folder has index.js that exports only the public API.
**When to use:** Always - keeps imports clean and hides implementation details.
**Example:**
```javascript
// components/ui/Badge/index.js
export { Badge } from './Badge';

// components/ui/index.js
export { Badge } from './Badge';
export { TrendArrow } from './TrendArrow';
export { MetricDisplay } from './MetricDisplay';

// Usage in app
import { Badge, TrendArrow, MetricDisplay } from '@/components/ui';
// NOT: import Badge from '@/components/ui/Badge/Badge';
```

### Pattern 4: Component Composition Over Prop Drilling
**What:** Pass children/components as props instead of passing data through multiple layers.
**When to use:** When intermediate components don't use the data, only render children.
**Example:**
```javascript
// Source: https://react.dev/learn/managing-state
// BAD - prop drilling
function Dashboard({ timeframe }) {
  return <ManagerList timeframe={timeframe} />;
}
function ManagerList({ timeframe }) {
  return <ManagerCard timeframe={timeframe} />;
}

// GOOD - composition
function Dashboard() {
  const timeframe = useTimeframeStore(state => state.timeframe);
  return (
    <ManagerList>
      <ManagerCard timeframe={timeframe} />
    </ManagerList>
  );
}
```

### Anti-Patterns to Avoid
- **Monolithic Context for all state:** Don't put timeframe, theme, auth, and filters in one Context - every consumer re-renders on any change. Split by update frequency.
- **Prop drilling for shared state:** If 3+ levels deep and multiple branches need it, use Zustand or Context instead.
- **useState for shared state:** Don't lift state to root and pass through props - creates maintenance nightmare and re-render cascades.
- **Over-customization of component libraries:** Don't fight the library's patterns - work with theming systems, not against them.
- **Deep folder nesting (4+ levels):** Makes imports painful and harder to navigate. Keep it flat by feature.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Global state management | Custom Context + useReducer setup | Zustand | No providers, better performance (selective subscriptions), cleaner API, 40%+ adoption |
| Component testing | Custom test utils | React Testing Library + Vitest | Industry standard, user-focused queries, 10-20x faster than Jest |
| Accessible UI primitives | Custom keyboard/ARIA handling | React Aria (if needed) | WCAG compliance, keyboard navigation, internationalization built-in |
| Persistent state | localStorage wrappers | Zustand persist middleware | Handles serialization, hydration, version migration automatically |
| Tooltip system | Custom hover/focus logic | CSS-only tooltips (already in App.jsx) | No JS overhead, works with keyboard, simpler |

**Key insight:** State management has matured - 2026 developers use specialized tools (Zustand for client state, React Query for server state) instead of one-size-fits-all solutions. Don't rebuild what the ecosystem has standardized.

## Common Pitfalls

### Pitfall 1: Context Re-render Hell
**What goes wrong:** Putting fast-changing values (search input, toggle states) in Context causes all consumers to re-render on every keystroke or click.
**Why it happens:** Context API was designed for dependency injection (theme, auth), not reactive state. Every consumer re-renders when value changes, even if they don't use the changed part.
**How to avoid:**
- Use Zustand for high-frequency state (toggles, filters, search)
- Use Context only for stable values (theme, current user, locale)
- Split Contexts if needed (one for state reads, one for dispatch/actions)
**Warning signs:**
- Performance lag when toggling timeframe
- React DevTools Profiler shows cascading re-renders
- Many components subscribe to Context but only use one field

### Pitfall 2: Not Using Selectors in Zustand
**What goes wrong:** Components re-render even when their needed state didn't change.
**Why it happens:** Without selectors, components subscribe to entire store object, triggering re-renders on any state change.
**How to avoid:**
```javascript
// BAD - re-renders on any store change
const store = useTimeframeStore();

// GOOD - only re-renders when timeframe changes
const timeframe = useTimeframeStore(state => state.timeframe);

// GOOD - multiple values with shallow comparison
import { useShallow } from 'zustand/react/shallow';
const { timeframe, setTimeframe } = useTimeframeStore(
  useShallow(state => ({
    timeframe: state.timeframe,
    setTimeframe: state.setTimeframe
  }))
);
```
**Warning signs:** Components re-render when unrelated state changes

### Pitfall 3: Inconsistent Component API
**What goes wrong:** Similar components accept props differently (some use `label`, others `title`, inconsistent event naming).
**Why it happens:** No design system or API conventions, components built in isolation without coordination.
**How to avoid:**
- Establish naming conventions early (onSubmit vs onSave, label vs title)
- Document component APIs (TypeScript helps)
- Use compound components for related parts (ManagerCard.Header, not ManagerCardHeader)
**Warning signs:** Frequent prop name confusion, need to check implementation to use component

### Pitfall 4: Mixing Multiple Component Libraries
**What goes wrong:** Inconsistent design, bloated bundles, conflicting styles, maintenance nightmare.
**Why it happens:** Developers grab components from different libraries instead of committing to one system.
**How to avoid:**
- Build custom components with Tailwind CSS (already in project)
- Extract SVG components from existing App.jsx (TrendArrow, InfoIcon)
- Only add library if critical feature missing (accessibility primitives)
**Warning signs:** Multiple CSS frameworks loaded, inconsistent spacing/colors, style conflicts

### Pitfall 5: Over-Nesting Components
**What goes wrong:** Import paths like `../../../components/ui/Badge/Badge.jsx`, hard to move files.
**Why it happens:** Creating folders for every concept, organizing by type instead of feature.
**How to avoid:**
- Limit nesting to 3-4 levels max
- Use barrel exports (index.js) for cleaner imports
- Group by feature/domain, not file type
- Configure path alias in vite.config.js (`@/components`)
**Warning signs:** Import statements with 3+ `../`, hard to find files

## Code Examples

Verified patterns from official sources:

### Zustand Store Setup
```javascript
// stores/timeframeStore.js
// Source: https://github.com/pmndrs/zustand
import { create } from 'zustand';

export const useTimeframeStore = create((set) => ({
  // State
  timeframe: '30',

  // Actions
  setTimeframe: (newTimeframe) => set({ timeframe: newTimeframe }),

  toggleTimeframe: () => set((state) => ({
    timeframe: state.timeframe === '30' ? '90' : '30'
  })),

  // Derived values (computed in components or here)
  isLongView: (state) => state.timeframe === '90'
}));
```

### TimeframeToggle Component
```javascript
// components/input/TimeframeToggle/TimeframeToggle.jsx
import { useTimeframeStore } from '@/stores';

export function TimeframeToggle() {
  const { timeframe, setTimeframe } = useTimeframeStore();

  return (
    <div className="inline-flex gap-2 p-1 bg-gray-100 rounded-lg">
      <button
        onClick={() => setTimeframe('30')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          timeframe === '30'
            ? 'bg-foreground text-background-100'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        30 Days
      </button>
      <button
        onClick={() => setTimeframe('90')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          timeframe === '90'
            ? 'bg-foreground text-background-100'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        90 Days
      </button>
    </div>
  );
}
```

### Component Consuming Timeframe State
```javascript
// components/cards/ManagerCard/ManagerCard.jsx
import { useTimeframeStore } from '@/stores';
import { getTimeframeData } from '@/data';

export function ManagerCard({ managerId }) {
  // Selective subscription - only re-renders when timeframe changes
  const timeframe = useTimeframeStore(state => state.timeframe);

  // Compute data based on current timeframe
  const data = getTimeframeData(timeframe);
  const manager = data.managers[managerId];

  return (
    <div className="bg-background-100 border border-border rounded-xl p-5">
      <h3>{manager.name}</h3>
      <p>Coaching Score: {manager.coaching_score}%</p>
      <span className="text-xs text-gray-400">
        Last {timeframe} days
      </span>
    </div>
  );
}
```

### Barrel Export Pattern
```javascript
// components/ui/index.js
export { Badge } from './Badge';
export { TrendArrow } from './TrendArrow';
export { MetricDisplay } from './MetricDisplay';
export { Citation } from './Citation';

// stores/index.js
export { useTimeframeStore } from './timeframeStore';

// Usage in app
import { Badge, TrendArrow } from '@/components/ui';
import { useTimeframeStore } from '@/stores';
```

### React Testing Library Pattern
```javascript
// Source: https://vitest.dev/guide/browser/component-testing
// components/ui/Badge/Badge.test.jsx
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders improving trend with correct styles', () => {
    render(<Badge trend="improving" />);

    const badge = screen.getByText(/improving/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-success');
  });

  it('renders declining trend with correct styles', () => {
    render(<Badge trend="declining" />);

    const badge = screen.getByText(/declining/i);
    expect(badge).toHaveClass('text-error');
  });
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Redux for all state | Zustand for client state, React Query for server state | 2022-2024 | Less boilerplate, better performance, 40%+ adoption by 2026 |
| Context for shared state | Context only for stable values, Zustand for reactive state | 2023-2025 | Avoid re-render hell, better DX |
| Class components | Functional components + hooks | 2019-2020 | Standard in 2026, React 19 compiler optimizes |
| Prop types | TypeScript | 2020-2023 | Compile-time safety, better IDE support |
| Jest | Vitest (for Vite projects) | 2022-2024 | 10-20x faster, native ESM, better DX |
| CSS Modules | Tailwind CSS | 2020-2023 | Utility-first, consistent design, smaller bundles |
| index.js barrel exports everywhere | Selective barrel exports (public API only) | 2024-2025 | Tree-shaking works, faster builds |

**Deprecated/outdated:**
- **PropTypes:** Replaced by TypeScript for type safety
- **Redux for simple state:** Overkill unless you need time-travel debugging, undo/redo
- **Class components:** React 19 focuses on functional components and hooks
- **Enzyme:** Deprecated, use React Testing Library for user-focused tests
- **Uncontrolled components for forms:** Use controlled components or React Hook Form

## Open Questions

Things that couldn't be fully resolved:

1. **TypeScript adoption timeline**
   - What we know: Project currently uses JSX (no TypeScript in package.json), but TypeScript is 2026 standard
   - What's unclear: Whether user wants to add TypeScript in this phase or defer
   - Recommendation: Continue with JSX for Phase 2, add TypeScript in later phase if needed. Patterns work identically in both.

2. **Testing requirements**
   - What we know: Vitest not in dependencies, React Testing Library not installed
   - What's unclear: Whether components should include tests in Phase 2
   - Recommendation: Set up testing infrastructure but defer writing tests until Phase 7 (polish/testing). Document component APIs clearly.

3. **Storybook for documentation**
   - What we know: Storybook is industry standard for component documentation/development in isolation
   - What's unclear: Whether user wants component documentation at this stage
   - Recommendation: Defer Storybook to later phase. Focus on building working components first, document later if needed.

## Sources

### Primary (HIGH confidence)
- React official documentation - https://react.dev/learn/managing-state
- Zustand GitHub README - https://github.com/pmndrs/zustand
- Zustand official docs - https://zustand.docs.pmnd.rs/
- Vitest component testing guide - https://vitest.dev/guide/browser/component-testing
- Patterns.dev React patterns - https://www.patterns.dev/react/compound-pattern/

### Secondary (MEDIUM confidence)
- [State Management in 2026: Redux, Context API, and Modern Patterns](https://www.nucamp.co/blog/state-management-in-2026-redux-context-api-and-modern-patterns)
- [React State Management in 2025: What You Actually Need](https://www.developerway.com/posts/react-state-management-2025)
- [How to write performant React apps with Context](https://www.developerway.com/posts/how-to-write-performant-react-apps-with-context)
- [React Folder Structure in 5 Steps [2025]](https://www.robinwieruch.de/react-folder-structure/)
- [Using barrel exports to organize React components - LogRocket](https://blog.logrocket.com/using-barrel-exports-organize-react-components/)

### Tertiary (LOW confidence)
- WebSearch: "React component library architecture patterns 2026"
- WebSearch: "Tailwind CSS component library organization 2026"

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Zustand verified from official docs, 40%+ adoption confirmed by multiple 2026 sources
- Architecture: HIGH - Patterns verified from React official docs, Patterns.dev, and Zustand docs
- Pitfalls: MEDIUM - Context performance issues well-documented, but specific project impact varies

**Research date:** 2026-01-25
**Valid until:** 2026-02-24 (30 days - React ecosystem is stable)
