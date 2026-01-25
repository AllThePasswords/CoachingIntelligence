---
phase: 03-dashboard
plan: 01
subsystem: routing
tags: [react-router, layout, routing, navigation]

dependency_graph:
  requires:
    - 02-component-library (AskInput component)
  provides:
    - AppLayout shared layout component
    - react-router v7 routing capability
    - Outlet pattern for page composition
  affects:
    - 03-02 (Dashboard page will use layout)
    - 03-03 (ManagerDetail page will use layout)
    - 03-04 (App.jsx will configure router)

tech_stack:
  added:
    - react-router@7.13.0
  patterns:
    - Layout route with Outlet pattern
    - Fixed position footer for persistent input

key_files:
  created:
    - src/layouts/AppLayout.jsx
    - src/layouts/index.js
  modified:
    - package.json (added react-router dependency)

decisions:
  - key: react-router-v7-import
    choice: "Import from 'react-router' not 'react-router-dom'"
    reason: "v7 consolidates into single package, react-router-dom is deprecated"

metrics:
  duration: 1 min
  completed: 2026-01-25
---

# Phase 03 Plan 01: App Layout Summary

React Router v7 installed and AppLayout component created with sticky header, Outlet for page content, and pinned AskInput footer at viewport bottom.

## What Was Done

### Task 1: Install React Router v7
- Installed react-router package (v7.13.0)
- Single package replaces old react-router-dom pattern
- Commit: `3670d25`

### Task 2: Create AppLayout Component
- Created `src/layouts/` directory structure
- AppLayout.jsx with:
  - Sticky header showing "Coaching Intelligence" title
  - Main content area with `pb-24` padding for footer clearance
  - Fixed footer with AskInput pinned to viewport bottom
  - Temporary onSubmit handler (logs + alert until chat feature)
- Barrel export in index.js
- Commit: `26ba9a1`

## Deviations from Plan

None - plan executed exactly as written.

## Technical Decisions

### React Router v7 Import Path
**Decision:** Import from 'react-router' instead of 'react-router-dom'
**Rationale:** v7 consolidated the DOM bindings into the main package. The 'react-router-dom' pattern is deprecated for v7+.

### Fixed vs Sticky Footer
**Decision:** Used `position: fixed` for AskInput footer
**Rationale:** Fixed positioning ensures the input is always visible at viewport bottom regardless of scroll position. Sticky requires a scroll container context which adds complexity.

## Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `src/layouts/AppLayout.jsx` | Shared layout with header, Outlet, pinned footer | 40 |
| `src/layouts/index.js` | Barrel export for layouts | 2 |

## Verification Results

| Check | Status |
|-------|--------|
| react-router v7.x installed | npm ls shows 7.13.0 |
| layouts directory exists | AppLayout.jsx, index.js present |
| Outlet import correct | from 'react-router' (v7 pattern) |
| AskInput imported | from '@/components/input' |
| Header text present | "Coaching Intelligence" |

## Next Phase Readiness

**Ready for 03-02:** Dashboard page can now be created to render inside AppLayout via Outlet pattern. Router configuration (BrowserRouter, Routes) will be added in 03-04 to connect everything.

**Dependencies satisfied:**
- AppLayout provides the layout wrapper
- AskInput already functional from Phase 2
- react-router hooks (useNavigate, useParams) now available
