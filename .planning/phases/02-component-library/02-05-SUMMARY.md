---
phase: "02-component-library"
plan: "05"
subsystem: "components"
tags: ["react", "composite-components", "zustand", "geist"]
depends_on:
  requires: ["02-02", "02-03", "02-04"]
  provides: ["ManagerCard", "InsightSection", "cards-barrel", "sections-barrel"]
  affects: ["03-dashboard", "03-detail-view"]
tech_stack:
  added: []
  patterns: ["composite-component-pattern", "zustand-selective-subscription"]
file_tracking:
  created:
    - "src/components/cards/ManagerCard/ManagerCard.jsx"
    - "src/components/cards/ManagerCard/index.js"
    - "src/components/cards/index.js"
    - "src/components/sections/InsightSection/InsightSection.jsx"
    - "src/components/sections/InsightSection/index.js"
    - "src/components/sections/index.js"
  modified: []
metrics:
  duration: "1 min"
  completed: "2026-01-25"
---

# Phase 2 Plan 5: Composite Components (ManagerCard, InsightSection) Summary

**ManagerCard composite with Zustand timeframe integration; InsightSection with Badge-based rating display**

## What Was Built

### ManagerCard Component

The main dashboard card showing manager information:
- **Header**: Manager name, region, trend Badge
- **Metrics row**: Attainment % and Coaching % using MetricDisplay
- **AI Summary**: Brief text summary of manager performance
- **Action button**: "View Details" with onClick handler

Key integration points:
- Uses `useTimeframeStore` with selective subscription for automatic re-render when global timeframe changes
- Combines `getManagerById` (static data) with `getTimeframeData` (timeframe-specific metrics)
- Supports `variant` prop for border (default) or shadow styling
- Graceful handling when manager data is not found

### InsightSection Component

Container for Manager Detail page coaching dimensions:
- **Header bar**: Title with optional rating Badge
- **Content area**: Renders children for flexible content
- Maps rating values (improving/declining/steady) to Badge trends

## Component Architecture

```
ManagerCard
├── imports Badge from @/components/ui
├── imports MetricDisplay from @/components/display
├── imports useTimeframeStore from @/stores
└── imports getTimeframeData, getManagerById from @/data

InsightSection
└── imports Badge from @/components/ui
```

## File Structure

```
src/components/
├── cards/
│   ├── ManagerCard/
│   │   ├── ManagerCard.jsx    # Composite component
│   │   └── index.js           # Named export
│   └── index.js               # Barrel: ManagerCard
└── sections/
    ├── InsightSection/
    │   ├── InsightSection.jsx # Section container
    │   └── index.js           # Named export
    └── index.js               # Barrel: InsightSection
```

## Usage Examples

### ManagerCard

```jsx
import { ManagerCard } from '@/components/cards';

// Basic usage
<ManagerCard managerId="MGR001" onClick={(id) => navigate(`/manager/${id}`)} />

// Shadow variant
<ManagerCard managerId="MGR002" variant="shadow" />
```

### InsightSection

```jsx
import { InsightSection } from '@/components/sections';

// With rating badge
<InsightSection title="Coaching Investment" rating="improving">
  <p>Content here...</p>
</InsightSection>

// Without rating
<InsightSection title="Team Performance">
  <ul>...</ul>
</InsightSection>
```

## Verification Results

| Check | Result |
|-------|--------|
| Build passes | Yes |
| ManagerCard uses Badge | Yes |
| ManagerCard uses MetricDisplay | Yes |
| ManagerCard uses useTimeframeStore | Yes |
| InsightSection uses Badge | Yes |
| Cards barrel exports ManagerCard | Yes |
| Sections barrel exports InsightSection | Yes |

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `6beee8a` | feat(02-05): create ManagerCard composite component |
| 2 | `9a50238` | feat(02-05): create InsightSection component |

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

Wave 3 components complete. Phase 2 nearing completion with:
- All UI primitives (Badge, Tooltip, TrendArrow, InfoIcon)
- All display components (MetricDisplay, Citation)
- All input components (TimeframeToggle, AskInput)
- All composite components (ManagerCard, InsightSection)
- Zustand store for timeframe state

Remaining: Plan 06 (AnswerCard component for AI responses)

## Imports Reference

After this plan, components can import:

```jsx
// Cards
import { ManagerCard } from '@/components/cards';

// Sections
import { InsightSection } from '@/components/sections';

// Previously available
import { Badge, Tooltip, TrendArrow, InfoIcon } from '@/components/ui';
import { MetricDisplay, Citation } from '@/components/display';
import { TimeframeToggle, AskInput } from '@/components/input';
import { useTimeframeStore } from '@/stores';
```
