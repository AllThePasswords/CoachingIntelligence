---
phase: 04-manager-detail
plan: 04
subsystem: ui
tags: [react, dropdown, menu, sources, data-provenance]

# Dependency graph
requires:
  - phase: 04-03
    provides: AE table component and layout structure
  - phase: 04-02
    provides: Insight sections with rating badges
provides:
  - ActionMenu dropdown component with outside click handling
  - Sources footer showing 5 data provenance counts
  - Complete manager detail page layout
affects: [05-coaching-activity, 06-ask-ai]

# Tech tracking
tech-stack:
  added: []
  patterns: [outside-click-handling, data-provenance-footer]

key-files:
  created:
    - src/components/menus/ActionMenu/ActionMenu.jsx
    - src/components/menus/ActionMenu/index.js
    - src/components/menus/index.js
  modified:
    - src/pages/ManagerDetail/ManagerDetail.jsx

key-decisions:
  - "Mocked action handlers for MVP (console.log + alert)"
  - "Consolidated hero layout: name/region left, toggle/actions right"

patterns-established:
  - "Outside click handling: useRef + mousedown listener for dropdowns"
  - "Sources footer pattern: horizontal flex-wrap with gap-x-6 for data provenance"

# Metrics
duration: 2min
completed: 2026-01-25
---

# Phase 04 Plan 04: Sources Footer Summary

**ActionMenu dropdown with 4 manager actions and Sources footer showing data provenance counts**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-25T21:54:00Z
- **Completed:** 2026-01-25T21:56:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- ActionMenu component with dropdown, 4 actions, and outside click handling
- Sources footer displaying all 5 data provenance counts per manager
- Complete manager detail page layout (no more placeholder divs)
- Consolidated hero section with name/region on left, toggle/actions on right

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ActionMenu Component** - `a6d8198` (feat)
2. **Task 2: Add Sources Footer and ActionMenu to ManagerDetail** - `58b79b4` (feat)

## Files Created/Modified
- `src/components/menus/ActionMenu/ActionMenu.jsx` - Dropdown menu with 4 actions, outside click handling
- `src/components/menus/ActionMenu/index.js` - Barrel export
- `src/components/menus/index.js` - Menus barrel export
- `src/pages/ManagerDetail/ManagerDetail.jsx` - Integrated ActionMenu + Sources footer

## Decisions Made
- **Mocked action handlers:** Actions use console.log + alert for MVP, with message indicating future integration
- **Consolidated hero layout:** Moved region under name, both on left; TimeframeToggle + ActionMenu grouped on right
- **Outside click pattern:** Used useRef with mousedown listener for dropdown close behavior

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Manager detail page is fully complete
- Ready for Plan 04-05 (navigation integration if any)
- ActionMenu actions ready for future backend integration
- Sources footer provides transparency for Ask AI feature in Phase 06

---
*Phase: 04-manager-detail*
*Completed: 2026-01-25*
