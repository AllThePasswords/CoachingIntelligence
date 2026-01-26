# Phase 7: Polish - Research

**Researched:** 2026-01-26
**Domain:** UX Polish (Loading States, Error Handling, Animations, Accessibility)
**Confidence:** HIGH

## Summary

Phase 7 focuses on production-quality UX polish across four key areas: skeleton loading states, error boundaries, CSS transitions/animations, and keyboard accessibility. The research identifies established patterns and libraries that integrate well with the existing stack (React 19, Tailwind CSS 4, Zustand, native dialog elements).

The application already has solid foundations from previous phases. The native `<dialog>` element used for modals provides built-in focus management and ESC key handling. Tailwind CSS 4 includes animation utilities and transition properties. The chat system already has a loading indicator. This phase adds the final polish layer.

**Primary recommendation:** Use react-loading-skeleton for skeleton loaders, react-error-boundary for graceful degradation, CSS `@starting-style` for modal animations (no additional library needed), and leverage the native dialog's built-in focus management rather than adding focus-trap-react.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-loading-skeleton | 3.5.0 | Skeleton loading placeholders | Auto-adapts to component styles, shimmer animation included, minimal config |
| react-error-boundary | 6.1.0 | Error catching and fallback UI | Standard solution, hooks API, reset capability, works with React 19 |
| CSS @starting-style | Native | Dialog open/close animations | Browser-native since Aug 2024, no JS needed, graceful interruption handling |
| Tailwind CSS | 4.x | Transitions and animations | Already in project, includes animate-pulse, motion-safe/reduce variants |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| focus-trap-react | 11.0.6 | Focus trap for custom modals | Only if native dialog focus behavior insufficient |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-loading-skeleton | Tailwind animate-pulse | Less adaptive to component styles, more manual sizing |
| react-error-boundary | Class component boundary | More boilerplate, no hooks, harder to test |
| @starting-style | JS animation library | Heavier bundle, more complexity, less performant |
| Native dialog focus | focus-trap-react | Additional dependency for behavior that's mostly built-in |

**Installation:**
```bash
npm install react-loading-skeleton react-error-boundary
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── feedback/           # NEW: Loading and error UI
│   │   ├── Skeleton/       # Skeleton loader variants
│   │   ├── ErrorFallback/  # Error boundary fallback UI
│   │   └── index.js
│   └── chat/
│       └── MessageActions/ # NEW: Contextual action buttons (ASK-07)
├── providers/
│   └── ErrorBoundary.jsx   # App-level error boundary wrapper
└── styles/
    └── index.css           # Add @starting-style animations
```

### Pattern 1: Skeleton Component Wrapping

**What:** Wrap data-dependent components with skeleton fallbacks
**When to use:** Any component that displays async data (manager cards, AI responses)
**Example:**
```jsx
// Source: react-loading-skeleton docs
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function ManagerCard({ manager }) {
  return (
    <div className="p-4">
      <h3>{manager?.name || <Skeleton width={150} />}</h3>
      <p>{manager?.summary || <Skeleton count={2} />}</p>
    </div>
  );
}
```

### Pattern 2: Error Boundary Placement

**What:** Strategic placement of error boundaries at feature boundaries
**When to use:** Wrap risky components (API-dependent, third-party, complex logic)
**Example:**
```jsx
// Source: react-error-boundary docs
import { ErrorBoundary } from 'react-error-boundary';

function ChatSection({ managerId }) {
  return (
    <ErrorBoundary
      FallbackComponent={ChatErrorFallback}
      onReset={() => window.location.reload()}
      resetKeys={[managerId]}
    >
      <ChatThread managerId={managerId} />
    </ErrorBoundary>
  );
}

function ChatErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-4 bg-red-50 rounded-lg">
      <p className="text-red-700">Unable to load chat</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
```

### Pattern 3: Modal Animation with @starting-style

**What:** CSS-only open/close transitions for dialog elements
**When to use:** All modal dialogs using native `<dialog>` element
**Example:**
```css
/* Source: MDN @starting-style docs */
dialog {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
  transition:
    opacity 0.2s ease-out,
    transform 0.2s ease-out,
    overlay 0.2s allow-discrete,
    display 0.2s allow-discrete;
}

dialog[open] {
  opacity: 1;
  transform: scale(1) translateY(0);
}

@starting-style {
  dialog[open] {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
}

/* Backdrop animation */
dialog::backdrop {
  background-color: transparent;
  transition: background-color 0.2s ease-out;
}

dialog[open]::backdrop {
  background-color: rgb(0 0 0 / 50%);
}

@starting-style {
  dialog[open]::backdrop {
    background-color: transparent;
  }
}
```

### Pattern 4: Contextual AI Response Actions (ASK-07)

**What:** Action buttons that appear based on AI response content
**When to use:** After each assistant message in chat thread
**Example:**
```jsx
function MessageActions({ content, onAction }) {
  // Detect actionable content
  const hasManagerMention = /Sarah|Marcus|Jennifer|David/.test(content);
  const hasCitation = /\[-> CALL-\d+\]/.test(content);

  return (
    <div className="flex gap-2 mt-2">
      <button onClick={() => onAction('copy')} aria-label="Copy response">
        <CopyIcon />
      </button>
      {hasManagerMention && (
        <button onClick={() => onAction('add_1on1')} aria-label="Add to 1:1">
          <CalendarIcon />
        </button>
      )}
      {hasCitation && (
        <button onClick={() => onAction('view_sources')} aria-label="View sources">
          <LinkIcon />
        </button>
      )}
    </div>
  );
}
```

### Anti-Patterns to Avoid

- **Skeleton everywhere:** Don't add skeletons for static content or fast-loading data
- **Single app-wide error boundary:** Granular boundaries prevent whole-app crashes
- **JS-based modal animations:** @starting-style is more performant and handles interrupts
- **Removing native dialog behavior:** Don't override ESC key or focus management
- **Disabled buttons without explanation:** Always provide tooltip explaining why

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Skeleton animation | Custom CSS pulse | react-loading-skeleton | Handles sizing, theming, shimmer automatically |
| Error catching | Try-catch in components | react-error-boundary | Catches render errors, provides reset, hooks |
| Focus trap | Manual tabindex management | Native dialog showModal() | Browser handles it, battle-tested |
| Modal animations | JS state transitions | CSS @starting-style | Handles interrupts, no JS, better performance |
| Copy to clipboard | Custom clipboard code | navigator.clipboard.writeText | Native API, one line |

**Key insight:** The polish phase leverages browser-native features and small libraries rather than building custom solutions. The native dialog element and CSS @starting-style handle most accessibility and animation concerns.

## Common Pitfalls

### Pitfall 1: @starting-style Order Matters

**What goes wrong:** Animation doesn't work because @starting-style is overridden
**Why it happens:** @starting-style has same specificity as the main rule
**How to avoid:** Place @starting-style AFTER the dialog[open] rule in CSS
**Warning signs:** Modal appears instantly without animation

### Pitfall 2: Missing allow-discrete for Display

**What goes wrong:** Exit animation doesn't show, modal just disappears
**Why it happens:** display: none takes effect immediately without allow-discrete
**How to avoid:** Include `display 0.2s allow-discrete` in transition list
**Warning signs:** Entry animation works but exit doesn't

### Pitfall 3: Error Boundary Doesn't Catch Async Errors

**What goes wrong:** API failures crash the app instead of showing fallback
**Why it happens:** Error boundaries only catch rendering errors, not async code
**How to avoid:** Use try-catch in async handlers, call setError from catch block
**Warning signs:** Error boundary works for render errors but not API calls

### Pitfall 4: Skeleton Flash on Fast Loads

**What goes wrong:** Skeleton flashes briefly then immediately shows content
**Why it happens:** Data loads faster than skeleton transition
**How to avoid:** Add minimum display time or skip skeleton for cached data
**Warning signs:** Jarring flicker on page load

### Pitfall 5: Focus Lost After Error Reset

**What goes wrong:** After clicking "Try again", focus goes to document body
**Why it happens:** resetErrorBoundary unmounts/remounts without focus management
**How to avoid:** Set focus explicitly in onReset callback
**Warning signs:** Keyboard users lose their place after error recovery

## Code Examples

Verified patterns from official sources:

### Skeleton Theme Provider

```jsx
// Source: react-loading-skeleton GitHub
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// In App.jsx or layout
<SkeletonTheme
  baseColor="#f3f4f6"  // gray-100
  highlightColor="#e5e7eb"  // gray-200
>
  <App />
</SkeletonTheme>
```

### Card Skeleton Variant

```jsx
// Skeleton matching ManagerCard layout
function ManagerCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <Skeleton width={80} height={10} className="mb-1" />
      <Skeleton width={180} height={32} className="mb-4" />
      <div className="flex gap-8 mb-4">
        <div>
          <Skeleton width={60} height={10} className="mb-1" />
          <Skeleton width={80} height={28} />
        </div>
        <div>
          <Skeleton width={60} height={10} className="mb-1" />
          <Skeleton width={80} height={28} />
        </div>
      </div>
      <Skeleton count={2} />
    </div>
  );
}
```

### Error Boundary with useErrorBoundary Hook

```jsx
// Source: react-error-boundary docs
import { useErrorBoundary } from 'react-error-boundary';

function ChatThread({ managerId }) {
  const { showBoundary } = useErrorBoundary();

  const handleSend = async (message) => {
    try {
      await sendToClaude(message);
    } catch (error) {
      showBoundary(error); // Triggers error boundary
    }
  };

  return <ChatUI onSend={handleSend} />;
}
```

### Keyboard Focus Ring Styles

```css
/* Visible focus states for accessibility */
@layer utilities {
  .focus-ring {
    @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2;
  }
}
```

### Motion-Safe Animation

```jsx
// Respect user's reduced motion preference
<div className="motion-safe:animate-pulse motion-reduce:animate-none">
  <Skeleton />
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JS modal animations | CSS @starting-style | Aug 2024 | No JS needed, graceful interrupts |
| Manual focus trapping | Native dialog showModal() | 2022 (Safari 15.4) | Built-in, accessible by default |
| Class-based error boundaries | react-error-boundary hooks | v4.0 (2023) | Cleaner API, functional components |
| Custom skeleton CSS | react-loading-skeleton | Stable since v3 | Auto-sizing, theming, less code |

**Deprecated/outdated:**
- Manual tabindex manipulation for modals: Use native dialog instead
- CSS keyframes for modal open: @starting-style handles transitions better
- componentDidCatch only: react-error-boundary provides better DX

## Open Questions

Things that couldn't be fully resolved:

1. **Minimum skeleton display time**
   - What we know: Quick flashes are jarring, some apps use 200-300ms minimum
   - What's unclear: Best practice for this specific app's data load times
   - Recommendation: Start without minimum, add if users report flicker

2. **Chat action button placement**
   - What we know: Buttons should appear after message, be accessible
   - What's unclear: Exact placement (inline vs. separate row) for mobile
   - Recommendation: Use row below message, test with keyboard navigation

3. **Error retry strategy**
   - What we know: Users should be able to retry failed operations
   - What's unclear: How many retries before showing different message
   - Recommendation: Single retry button, show contact support after 3 fails

## Sources

### Primary (HIGH confidence)
- react-loading-skeleton GitHub v3.5.0 - Installation, usage, theming
- react-error-boundary GitHub v6.1.0 - ErrorBoundary, useErrorBoundary, FallbackComponent
- MDN @starting-style - Dialog animation pattern, browser support (Baseline 2024)
- Tailwind CSS v4 docs - Animation utilities, transition-property, motion variants
- WAI-ARIA Dialog Modal Pattern - Keyboard interaction, focus management requirements

### Secondary (MEDIUM confidence)
- Frontend Masters @starting-style blog - Entry/exit animation patterns
- LogRocket react-error-boundary guide - Async error handling patterns
- Smashing Magazine skeleton screens - Best practices, timing considerations

### Tertiary (LOW confidence)
- shadcn.io AI Actions - Contextual button patterns (community project)
- Dev.to articles - General UX patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified with official sources, current versions confirmed
- Architecture: HIGH - Patterns match existing codebase structure, native dialog already used
- Pitfalls: MEDIUM - Based on documentation warnings and community experiences

**Research date:** 2026-01-26
**Valid until:** 2026-02-26 (30 days - stable technologies)
