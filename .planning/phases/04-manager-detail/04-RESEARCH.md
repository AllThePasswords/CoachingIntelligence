# Phase 4: Manager Detail - Research

**Researched:** 2026-01-25
**Domain:** React detail page composition, data display, deep linking
**Confidence:** HIGH

## Summary

This phase builds a comprehensive manager detail view showing coaching effectiveness across five dimensions: Investment, Trend, Methods, Distribution, and Feedback Quality. The research confirms that all necessary patterns and components already exist in the codebase - this is primarily a composition task, not a discovery task.

The existing data layer (`managers.js`, `aes.js`, `feedback.js`, `summaries.js`) provides complete, pre-structured data for all five insight sections. The existing components (`InsightSection`, `Badge`, `Citation`, `AskInput`, `TimeframeToggle`) can be directly reused. React Router v7's `useParams` hook already powers the placeholder page for deep linking.

**Primary recommendation:** Compose the detail page from existing components and data, following the established ManagerCard patterns for styling and the page layout pattern from Dashboard. The only new components needed are the AE table and action menu dropdown.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-router | ^7.13.0 | Routing with useParams for deep linking | Already configured with `/manager/:managerId` route |
| zustand | ^5.0.10 | Timeframe state management | Existing store pattern, selective subscriptions |
| tailwindcss | ^4.1.18 | Styling with Geist theme | Existing theme tokens in index.css |

### Supporting (Already Installed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @fontsource-variable/geist | ^5.2.8 | Typography | Already configured in main.jsx |

### Components to Build
| Component | Purpose | Pattern Source |
|-----------|---------|----------------|
| AETable | Display AE coaching data in rows | Simple `<table>` with Tailwind, no library needed |
| ActionMenu | Dropdown for actions (Add to 1:1, Send summary, etc.) | Build with pure React + Tailwind (avoid Headless UI for simplicity) |
| SourcesFooter | Display source counts at page bottom | Static layout component |

**Installation:**
```bash
# No new packages needed - all dependencies already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── pages/
│   └── ManagerDetail/
│       ├── ManagerDetail.jsx     # Main page component (exists, needs expansion)
│       └── index.js              # Re-export (exists)
├── components/
│   ├── sections/
│   │   └── InsightSection/       # Already exists, reuse for 5 dimensions
│   ├── tables/
│   │   └── AETable/              # NEW: AE coaching data table
│   │       ├── AETable.jsx
│   │       └── index.js
│   └── menus/
│       └── ActionMenu/           # NEW: Actions dropdown
│           ├── ActionMenu.jsx
│           └── index.js
```

### Pattern 1: Page Composition from Existing Components
**What:** Build the detail page by composing existing components rather than creating new ones
**When to use:** When building views from established primitives
**Example:**
```jsx
// Source: Existing codebase patterns
import { InsightSection } from '@/components/sections';
import { Badge, TrendArrow } from '@/components/ui';
import { Citation } from '@/components/display';
import { TimeframeToggle } from '@/components/input';
import { getSummaryByManager, getAEsByManager } from '@/data';

export function ManagerDetail() {
  const { managerId } = useParams();
  const summary = getSummaryByManager(managerId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <HeroSection manager={manager} summary={summary} />

      {/* Five Insight Sections */}
      <InsightSection title="Coaching Investment" rating={getTrend(...)}>
        {/* Content from summary.sections.effort */}
      </InsightSection>

      {/* ... more sections */}

      {/* AE Table */}
      <AETable managerId={managerId} />

      {/* Sources Footer */}
      <SourcesFooter sources={manager.sources} />
    </div>
  );
}
```

### Pattern 2: Data Lookup by Manager ID
**What:** Use existing data utility functions that filter by managerId
**When to use:** Loading manager-specific data in components
**Example:**
```jsx
// Source: Existing src/data/index.js exports
import {
  getManagerById,
  getAEsByManager,
  getSummaryByManager,
  getFeedbackByManager
} from '@/data';

// In component:
const manager = getManagerById(managerId);     // Manager record
const aes = getAEsByManager(managerId);        // Array of AE records
const summary = getSummaryByManager(managerId); // Pre-generated insights
const feedback = getFeedbackByManager(managerId); // Feedback log entries
```

### Pattern 3: Timeframe-Aware Components
**What:** Components subscribe to Zustand timeframe store for dynamic data
**When to use:** Any component showing time-sensitive metrics
**Example:**
```jsx
// Source: Existing ManagerCard.jsx pattern
import { useTimeframeStore } from '@/stores';
import { getTimeframeData } from '@/data';

function MetricComponent({ managerId }) {
  const timeframe = useTimeframeStore(state => state.timeframe);
  const timeframeData = getTimeframeData(timeframe);
  const managerMetrics = timeframeData?.managers?.[managerId];

  // Use managerMetrics for time-specific values
  return <span>{managerMetrics?.coaching_score}%</span>;
}
```

### Pattern 4: Simple Table without Library
**What:** Use native HTML table elements styled with Tailwind
**When to use:** Fixed-column data display without sorting/filtering/virtualization
**Example:**
```jsx
// Approach: Simple semantic table with Tailwind styling
function AETable({ aes }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left text-xs text-gray-500 uppercase tracking-wider">
            <th className="py-3 px-4">AE Name</th>
            <th className="py-3 px-4">Quota %</th>
            <th className="py-3 px-4">Calls Coached</th>
            <th className="py-3 px-4">Comments</th>
            <th className="py-3 px-4">Scorecards</th>
            <th className="py-3 px-4">Last Feedback</th>
            <th className="py-3 px-4">Flag</th>
          </tr>
        </thead>
        <tbody>
          {aes.map(ae => (
            <tr key={ae.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium">{ae.name}</td>
              {/* ... other cells */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Pattern 5: Action Menu Dropdown (Pure React)
**What:** Build dropdown without external library using React state and Tailwind
**When to use:** Simple action menus with 3-5 items, no complex positioning needs
**Example:**
```jsx
// Approach: useState + outside click handler + absolute positioning
function ActionMenu({ actions }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="...">
        Actions
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-1 z-50">
          {actions.map(action => (
            <button
              key={action.id}
              onClick={() => { action.onClick(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Anti-Patterns to Avoid
- **Fetching data in useEffect:** Data already exists in static files - use direct imports
- **Creating new state stores:** Timeframe state already managed by Zustand store
- **Installing table libraries:** For 4-16 rows of static data, native tables are simpler
- **Over-abstracting InsightSection:** Current component is flexible enough via children prop
- **Duplicating AskInput:** It's already in AppLayout footer, don't add second instance

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Manager data lookup | Custom filtering | `getManagerById(id)` from data/index.js | Already validated, handles missing IDs |
| AE data per manager | Manual array filter | `getAEsByManager(managerId)` | Consistent with codebase patterns |
| Insight section structure | Custom section layout | `<InsightSection>` component | Already has header/badge/content slots |
| Trend/status badges | Inline styled spans | `<Badge trend="...">` component | Matches Geist design system |
| Citation rendering | Plain text | `<Citation id="CALL-XXXX">` | Validates format, handles clicks |
| Timeframe reactivity | Local state or prop drilling | `useTimeframeStore` hook | Global store already exists |
| Route parameters | Manual URL parsing | `useParams()` from react-router | Already set up in App.jsx |

**Key insight:** The codebase has a complete component library and data layer. This phase is about composition, not creation. Resist the urge to rebuild what exists.

## Common Pitfalls

### Pitfall 1: Ignoring the Pre-Generated Summaries
**What goes wrong:** Building insight sections by computing from raw data instead of using `summaries.js`
**Why it happens:** Developers see the raw data and want to compute summaries dynamically
**How to avoid:** `getSummaryByManager(managerId)` returns a complete object with all 5 section structures, pre-written narrative text, example quotes, and flags. Use it directly.
**Warning signs:** Writing reduce/map/filter chains on feedback data instead of reading `summary.sections`

### Pitfall 2: Building a Second AskInput
**What goes wrong:** Adding AskInput to the detail page when it's already in AppLayout
**Why it happens:** Requirements say "Ask anything input pinned to bottom"
**How to avoid:** AppLayout already has a pinned AskInput footer that appears on ALL pages including ManagerDetail. The detail page only needs to add a chat response section below the data.
**Warning signs:** Importing AskInput into ManagerDetail.jsx

### Pitfall 3: Table Library Overkill
**What goes wrong:** Installing TanStack Table or AG Grid for a simple 4-row display
**Why it happens:** Developers default to "best practices" without assessing actual needs
**How to avoid:** The AE table has:
- 4-16 rows (one per AE on the manager's team)
- 7 fixed columns
- No sorting, filtering, pagination, or virtualization required
- Static data (no real-time updates)

A semantic `<table>` with Tailwind styling is the correct choice.
**Warning signs:** Adding dependencies, configuring column definitions, setting up cell renderers

### Pitfall 4: Flag Styling Inconsistency
**What goes wrong:** Using different colors/styles for undercoached/critical flags than the established palette
**Why it happens:** Making up new warning styles instead of using existing tokens
**How to avoid:** Use established palette:
- `critical` flag: `bg-error/10 text-error` (red)
- `undercoached` flag: `bg-warning/10 text-warning` (orange/amber)
- These match the Geist color tokens in index.css
**Warning signs:** Using arbitrary Tailwind colors like `bg-red-100` instead of semantic tokens

### Pitfall 5: Deep Linking Regression
**What goes wrong:** Breaking the existing `/manager/:managerId` route that already works
**Why it happens:** Refactoring page structure without testing direct URL access
**How to avoid:** The route and useParams already work in the placeholder. Preserve:
```jsx
const { managerId } = useParams();
const manager = getManagerById(managerId);
if (!manager) return <NotFound />;
```
**Warning signs:** Removing the null check, restructuring without testing direct URL visits

### Pitfall 6: Missing Back Navigation State
**What goes wrong:** Back button always goes to "/" instead of preserving scroll position or filters
**Why it happens:** Using `Link to="/"` without considering browser history
**How to avoid:** Use `navigate(-1)` or preserve the Link pattern with proper history. Current placeholder uses `Link to="/"` which is fine for MVP.
**Warning signs:** Users losing dashboard scroll position when returning

## Code Examples

Verified patterns from existing codebase:

### Hero Section Layout
```jsx
// Source: ManagerCard.jsx patterns + Dashboard.jsx header patterns
function HeroSection({ manager, summary }) {
  return (
    <div className="mb-8">
      {/* Back link */}
      <Link
        to="/"
        className="text-sm text-gray-500 hover:text-foreground mb-4 inline-flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      {/* Title + Region */}
      <h1 className="text-3xl font-bold tracking-tight mt-4">{manager.name}</h1>
      <p className="text-gray-500">{manager.region} Region</p>

      {/* Key Metrics Row */}
      <div className="flex gap-8 mt-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Attainment</p>
          <span className="text-2xl font-bold">{manager.quota_attainment}%</span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Coaching Score</p>
          <span className="text-2xl font-bold">{manager.coaching_score}%</span>
        </div>
      </div>

      {/* AI Headline */}
      <p className="mt-6 text-lg text-gray-700 leading-relaxed">
        {summary.headline}
      </p>
    </div>
  );
}
```

### InsightSection with Content from Summaries
```jsx
// Source: InsightSection.jsx + summaries.js data structure
import { InsightSection } from '@/components/sections';
import { getSummaryByManager } from '@/data';

function InvestmentSection({ managerId }) {
  const summary = getSummaryByManager(managerId);
  const { effort } = summary.sections;

  // Map level to trend for Badge
  const levelToTrend = {
    'High': 'improving',
    'Medium': 'steady',
    'Low': 'declining',
    'Minimal': 'declining'
  };

  return (
    <InsightSection
      title={effort.title}
      rating={levelToTrend[effort.level]}
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="text-2xl font-bold">{effort.level}</span>
        <span className="text-gray-500">{effort.value}</span>
      </div>
      <p className="text-gray-600 leading-relaxed">{effort.detail}</p>
    </InsightSection>
  );
}
```

### Feedback Quality Section with Citations
```jsx
// Source: Citation.jsx + summaries.js feedback_quality structure
import { Citation } from '@/components/display';

function FeedbackQualitySection({ managerId }) {
  const summary = getSummaryByManager(managerId);
  const { feedback_quality } = summary.sections;

  return (
    <InsightSection title={feedback_quality.title} rating={...}>
      <p className="mb-4">{feedback_quality.detail}</p>

      <div className="space-y-4">
        {feedback_quality.examples.map(example => (
          <div key={example.call_id} className="bg-white border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Citation id={example.call_id} onClick={handleCitationClick} />
              <span className="text-sm text-gray-500">{example.ae} - {example.stage}</span>
            </div>
            <blockquote className="text-gray-700 italic">
              "{example.quote}"
            </blockquote>
          </div>
        ))}
      </div>
    </InsightSection>
  );
}
```

### AE Table Row with Flag Badge
```jsx
// Source: aes.js data structure + Badge patterns
function AETableRow({ ae }) {
  const flagStyles = {
    undercoached: 'bg-warning/10 text-warning',
    critical: 'bg-error/10 text-error'
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4 font-medium text-gray-900">{ae.name}</td>
      <td className="py-3 px-4">{ae.quota}%</td>
      <td className="py-3 px-4">{ae.calls_coached}</td>
      <td className="py-3 px-4">{ae.comments}</td>
      <td className="py-3 px-4">{ae.scorecards}</td>
      <td className="py-3 px-4 text-sm text-gray-500">
        {ae.last_feedback_date || 'Never'}
      </td>
      <td className="py-3 px-4">
        {ae.flag && (
          <span className={`text-xs px-2 py-1 rounded-md font-medium ${flagStyles[ae.flag]}`}>
            {ae.flag === 'critical' ? 'Critical' : 'Undercoached'}
          </span>
        )}
      </td>
    </tr>
  );
}
```

### Sources Footer
```jsx
// Source: managers.js sources object
function SourcesFooter({ sources }) {
  return (
    <div className="mt-8 pt-6 border-t border-border">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Sources</h4>
      <div className="flex gap-6 text-sm text-gray-500">
        <span>{sources.call_listening} calls listened</span>
        <span>{sources.call_attendance} calls attended</span>
        <span>{sources.call_comments} comments</span>
        <span>{sources.scorecards} scorecards</span>
        <span>{sources.feedback_events} feedback events</span>
      </div>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Class components | Functional components with hooks | React 16.8+ (2019) | Already using hooks throughout |
| Redux for all state | Zustand for simple state | 2022-2023 | Already using Zustand |
| React Router v5/v6 | React Router v7 | 2024-2025 | Already on v7.13.0 |
| useEffect for data | Data functions called directly | N/A (static data) | No fetching needed |
| CSS Modules | Tailwind CSS | Project setup | Already using Tailwind |

**Deprecated/outdated:**
- None relevant - codebase is already on current stack

## Open Questions

Things that couldn't be fully resolved:

1. **Chat Section Implementation**
   - What we know: Requirements mention "conversation appears below data in chat section"
   - What's unclear: Should the detail page have its own chat area, or does the AppLayout AskInput footer handle this?
   - Recommendation: For MVP, rely on the existing AppLayout AskInput. Chat responses could appear in a modal or dedicated section. Clarify with user if chat history needs to persist per-manager.

2. **Action Menu Behavior**
   - What we know: ACT-02 requires Add to 1:1, Send summary, Recognize, Flag for HR
   - What's unclear: What happens when these actions are clicked? Are they mocked, or do they need to integrate with something?
   - Recommendation: For MVP, actions should console.log or show toast/alert. Actual integrations would be future work.

3. **Timeframe Toggle Placement**
   - What we know: DETAIL-12 requires timeframe toggle that updates all metrics
   - What's unclear: Should toggle be in hero section, or in header area like Dashboard?
   - Recommendation: Place in hero section area for consistency with the detail page context. User can adjust per-page.

## Sources

### Primary (HIGH confidence)
- Existing codebase files - direct inspection of components, data, and patterns
- React Router v7 official docs (https://reactrouter.com/api/hooks/useParams) - useParams usage

### Secondary (MEDIUM confidence)
- TanStack Table docs - confirmed native tables are appropriate for small static datasets
- Headless UI Menu docs - confirmed pure React alternative is viable for simple menus

### Tertiary (LOW confidence)
- WebSearch results for React 2026 patterns - general confirmation of existing patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - verified from package.json and existing code
- Architecture: HIGH - patterns directly from existing codebase
- Pitfalls: HIGH - based on codebase analysis and requirements
- Code examples: HIGH - adapted from existing component implementations

**Research date:** 2026-01-25
**Valid until:** 60 days (stable codebase, no external dependencies to change)
