# Technology Stack - Coaching Intelligence

## Stack Summary

A React-based SPA with AI-powered analytics capabilities for sales coaching insights.

| Layer | Technology | Version | Confidence |
|-------|------------|---------|------------|
| Runtime | Node.js | ^20.x LTS | High |
| Framework | React | ^19.0.0 | High |
| Build Tool | Vite | ^6.0.x | High |
| Styling | Tailwind CSS | ^4.0.x | High |
| Design System | Geist (Vercel) | ^1.4.x | High |
| Icons | Lucide React | ^0.468.x | High |
| AI SDK | @anthropic-ai/sdk | ^0.36.x | High |
| Routing | React Router | ^7.1.x | High |
| State | Zustand | ^5.0.x | Medium |

---

## Core Stack (Constrained)

These choices are **fixed per project requirements**.

### React ^19.0.0

**Why React 19:**
- Stable release (December 2024) with production readiness
- New `use` hook for suspense-based data fetching (useful for AI responses)
- Improved server components support (future-proofing for SSR if needed)
- Better error boundaries and concurrent rendering
- Actions API for form handling (useful for Ask Anything input)

**Why NOT React 18:**
- React 19 is stable and provides tangible developer experience improvements
- The `use` hook simplifies async data loading patterns
- Better TypeScript support out of the box

```bash
npm install react@^19.0.0 react-dom@^19.0.0
```

### Vite ^6.0.x

**Why Vite 6:**
- Native ESM-based dev server with near-instant HMR
- Built on Rollup 4 for optimized production builds
- First-class React support via `@vitejs/plugin-react`
- Environment API improvements for cleaner dev/prod separation
- Superior DX compared to Create React App or webpack

**Why NOT webpack/CRA:**
- CRA is deprecated and no longer maintained
- Vite is 10-100x faster in development
- Simpler configuration for modern React apps

**Why NOT Next.js:**
- This is a client-side SPA, not requiring SSR
- Next.js adds complexity without benefit for this use case
- Static data, no SEO requirements

```bash
npm install vite@^6.0.0 @vitejs/plugin-react@^4.3.0
```

### Tailwind CSS ^4.0.x

**Why Tailwind 4:**
- New Oxide engine with 10x faster builds
- Zero-config content detection (no `content` array needed)
- CSS-first configuration via `@theme` directive
- Native CSS cascade layers for better specificity management
- Improved container queries and `@starting-style` support

**Why NOT Tailwind 3:**
- Tailwind 4 is stable (January 2025)
- Significantly faster build times
- Simpler configuration with CSS-first approach
- Better for new projects starting fresh

**Migration Note:**
- Some class names changed (e.g., `shadow-sm` semantics)
- `@tailwind` directives replaced with `@import "tailwindcss"`

```bash
npm install tailwindcss@^4.0.0
```

### Vercel Geist Design System ^1.4.x

**Why Geist:**
- Official Vercel design system matching design spec
- Provides both Sans and Mono fonts
- Clean, minimal aesthetic aligning with dashboard requirements
- Easy integration via npm or CDN

**Integration Approach:**
- Install `geist` npm package for font files
- Import fonts in main CSS
- No component library dependency - use Tailwind for components

```bash
npm install geist@^1.4.0
```

**CSS Setup:**
```css
@import "geist/font/sans";
@import "geist/font/mono";

:root {
  --font-sans: 'Geist Sans', -apple-system, sans-serif;
  --font-mono: 'Geist Mono', monospace;
}
```

### Lucide React ^0.468.x

**Why Lucide:**
- Continuation of Feather Icons with active maintenance
- Tree-shakeable (only bundle icons you use)
- Consistent 24x24 grid design
- All icons needed per spec: ArrowDown, ArrowUp, Bell, ArrowRight, MessageSquare, ChevronLeft, X, Check, AlertTriangle, Star

**Why NOT Heroicons:**
- Lucide has better coverage for the specific icons needed
- Slightly smaller bundle per icon
- Project spec explicitly requires Lucide

**Why NOT FontAwesome:**
- Heavier bundle size
- Licensing considerations for commercial use
- Overkill for this project's icon needs

```bash
npm install lucide-react@^0.468.0
```

### Anthropic SDK ^0.36.x

**Why @anthropic-ai/sdk:**
- Official TypeScript SDK for Claude API
- First-class streaming support (important for chat UX)
- Type-safe request/response handling
- Built-in retry logic and error handling
- Required for Ask Anything feature

**API Integration Pattern:**
- Use streaming for real-time response rendering
- Include all manager/AE data in system prompt
- Parse citations from response `[CALL-XXXX]` format
- Handle rate limits gracefully

```bash
npm install @anthropic-ai/sdk@^0.36.0
```

**Note:** Requires `ANTHROPIC_API_KEY` environment variable.

---

## Routing

### React Router ^7.1.x

**Why React Router 7:**
- Major rewrite with improved data loading (loaders/actions)
- Better TypeScript support with type-safe routes
- Simpler API compared to v6 data APIs
- Framework-agnostic (works with Vite, unlike Remix dependency)

**Routes Needed:**
```
/                    -> Dashboard (manager cards)
/manager/:id         -> Manager Detail View
```

**Why NOT TanStack Router:**
- React Router is more established and has larger community
- TanStack Router requires more setup for simple routing
- Two routes don't justify the additional complexity

```bash
npm install react-router-dom@^7.1.0
```

---

## State Management

### Zustand ^5.0.x (Recommended)

**Confidence Level:** Medium - Could use React Context for simpler approach

**Why Zustand:**
- Minimal boilerplate (vs Redux Toolkit)
- No provider wrapping required
- Perfect for this app's state needs:
  - Selected timeframe (30/60/90 days)
  - Selected manager (for detail view)
  - Conversation history (for Ask Anything)
  - Modal state (citation/action modals)
- Excellent TypeScript support
- Persist middleware for conversation history (optional)

**Why NOT Redux/RTK:**
- Overkill for this application size
- More boilerplate for same functionality
- No complex async state requirements

**Why NOT React Context alone:**
- Potential performance issues with frequent updates
- Zustand provides better separation of concerns
- Built-in middleware for persistence

**Alternative (Simpler):**
If state remains simple, React's `useState` + Context is sufficient. Start with Context, migrate to Zustand if:
- Re-renders become noticeable
- State logic grows complex
- Need persistence across sessions

```bash
npm install zustand@^5.0.0
```

---

## Development Tools

### TypeScript ^5.7.x

**Why TypeScript:**
- Type safety for data models (Manager, AE, Feedback)
- Better IDE support and autocomplete
- Catch errors at compile time
- Required for Anthropic SDK types

```bash
npm install -D typescript@^5.7.0 @types/react@^19.0.0 @types/react-dom@^19.0.0
```

### ESLint ^9.x + Prettier

**Why ESLint 9:**
- Flat config system (simpler configuration)
- Better performance
- React-specific rules via `eslint-plugin-react-hooks`

```bash
npm install -D eslint@^9.0.0 @eslint/js prettier eslint-config-prettier
```

---

## What NOT to Use

| Technology | Reason to Avoid |
|------------|-----------------|
| Create React App | Deprecated, no longer maintained |
| Next.js | Adds SSR complexity without benefit for client-side SPA |
| Styled Components | Tailwind provides better utility-first approach per spec |
| Material UI | Doesn't match Geist design system aesthetic |
| Redux | Overkill for this state complexity |
| Axios | Fetch API is sufficient; Anthropic SDK handles its own HTTP |
| React Query/TanStack Query | No REST API calls; data is static; AI calls are one-off |
| Framer Motion | Not required per spec; CSS transitions sufficient |
| date-fns/moment | Simple date formatting can use native Intl API |
| Jest | Vitest integrates better with Vite |

---

## Environment Variables

```env
# .env.local
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

**Security Note:** The Anthropic API key should ideally be called from a backend proxy to avoid exposing it in the browser. For MVP, client-side is acceptable with understanding that:
1. Key is visible in browser dev tools
2. Rate limits apply to the key
3. For production, implement a simple API route or Vercel Edge Function

---

## Project Initialization Commands

```bash
# Create Vite React project
npm create vite@latest coaching-intelligence -- --template react-ts

# Install dependencies
cd coaching-intelligence
npm install react@^19.0.0 react-dom@^19.0.0 react-router-dom@^7.1.0
npm install tailwindcss@^4.0.0 lucide-react@^0.468.0 geist@^1.4.0
npm install @anthropic-ai/sdk@^0.36.0 zustand@^5.0.0

# Install dev dependencies
npm install -D @vitejs/plugin-react@^4.3.0
npm install -D typescript@^5.7.0 @types/react@^19.0.0 @types/react-dom@^19.0.0

# Initialize Tailwind (v4 style)
# Add to CSS: @import "tailwindcss";
```

---

## Version Verification Required

**Important:** Before implementation, verify these versions are current:

1. `npm view react version` - Confirm React 19 stable
2. `npm view tailwindcss version` - Confirm Tailwind 4 stable
3. `npm view @anthropic-ai/sdk version` - Confirm latest Anthropic SDK
4. `npm view react-router-dom version` - Confirm React Router 7

Versions in this document are based on January 2025 knowledge. Run verification before `npm install` to ensure latest stable releases.

---

## Confidence Summary

| Decision | Confidence | Rationale |
|----------|------------|-----------|
| React 19 | High | Stable release, required by constraints |
| Vite 6 | High | Best-in-class React build tool |
| Tailwind 4 | High | Required by constraints, latest stable |
| Geist | High | Required by constraints |
| Lucide React | High | Required by constraints |
| Anthropic SDK | High | Required for Ask Anything feature |
| React Router 7 | High | Standard routing solution |
| Zustand | Medium | Could start with Context if simpler preferred |
| TypeScript | High | Industry standard for React apps |

---

*Last updated: 2026-01-25*
*Stack research for Coaching Intelligence MVP*
