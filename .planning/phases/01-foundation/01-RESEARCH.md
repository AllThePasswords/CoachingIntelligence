# Phase 1: Foundation - Research

**Researched:** 2026-01-25
**Domain:** Vite + React 19 + Tailwind CSS 4 + Geist Fonts + Static Data Layer
**Confidence:** HIGH

## Summary

Phase 1 establishes the project foundation: Vite 6 with React 19, Tailwind CSS 4 with CSS-first configuration, Geist fonts via Fontsource, and a static data layer architecture. The research confirms all technologies are stable and well-documented for 2026.

Key findings:
- **Vite 6** uses a first-party Tailwind CSS plugin (`@tailwindcss/vite`) eliminating PostCSS configuration
- **Tailwind CSS 4** uses the `@theme` directive for CSS-first configuration - no JavaScript config file needed
- **Geist fonts** should use `@fontsource-variable/geist` and `@fontsource-variable/geist-mono` packages (official `geist` npm package requires Next.js)
- **Static data** can use ES module exports with utility functions for filtering by timeframe and manager

**Primary recommendation:** Use CSS-first Tailwind v4 configuration with `@theme` directive for all design tokens, and Fontsource packages for Geist fonts to avoid Next.js dependency.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vite | ^6.0.0 | Build tool and dev server | Native ESM, fastest HMR, first-party Tailwind plugin |
| react | ^19.0.0 | UI framework | Stable release, project requirement |
| react-dom | ^19.0.0 | React DOM renderer | Required for React 19 |
| tailwindcss | ^4.0.0 | Utility CSS framework | CSS-first config, 5x faster builds, project requirement |
| @tailwindcss/vite | ^4.0.0 | Vite integration plugin | Zero-config, better than PostCSS approach |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @fontsource-variable/geist | latest | Geist Sans variable font | All text content |
| @fontsource-variable/geist-mono | latest | Geist Mono variable font | Citations, code, data |
| @vitejs/plugin-react | ^4.3.0 | React Fast Refresh | Required for Vite + React |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @fontsource-variable/geist | Official `geist` package | Official package requires Next.js, doesn't work with Vite |
| @fontsource-variable/geist | Manual @font-face | More setup, harder to maintain |
| @tailwindcss/vite | PostCSS plugin | PostCSS requires more configuration |

**Installation:**
```bash
npm create vite@latest coaching-intelligence -- --template react
cd coaching-intelligence
npm install react@^19.0.0 react-dom@^19.0.0
npm install tailwindcss@^4.0.0 @tailwindcss/vite
npm install @fontsource-variable/geist @fontsource-variable/geist-mono
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── assets/              # Static assets (if needed beyond fonts)
├── data/                # Static data modules
│   ├── managers.js      # Manager records
│   ├── aes.js           # AE records
│   ├── feedback.js      # Feedback log with citations
│   ├── timeframes.js    # Timeframe-specific metrics
│   ├── summaries.js     # AI summaries
│   └── index.js         # Re-export all data + utility functions
├── styles/
│   └── index.css        # Tailwind imports + @theme tokens
├── App.jsx              # Root component
└── main.jsx             # Entry point with font imports
```

### Pattern 1: CSS-First Tailwind Configuration
**What:** Define all design tokens in CSS using `@theme` directive instead of JavaScript config
**When to use:** All Tailwind v4 projects
**Example:**
```css
/* src/styles/index.css */
@import "tailwindcss";

@theme {
  /* Typography */
  --font-sans: 'Geist Variable', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Geist Mono Variable', ui-monospace, monospace;

  /* Colors - Backgrounds */
  --color-bg-page: #F5F5F5;
  --color-bg-card: #FFFFFF;

  /* Colors - Text */
  --color-text-primary: #171717;
  --color-text-secondary: #525252;
  --color-text-tertiary: #737373;
  --color-text-muted: #A3A3A3;

  /* Colors - Status */
  --color-status-success: #22C55E;
  --color-status-warning: #F59E0B;
  --color-status-error: #EF4444;
  --color-status-info: #3B82F6;

  /* Colors - Accent */
  --color-accent-pink: #EC4899;
  --color-accent-purple: #A855F7;

  /* Colors - Borders */
  --color-border-light: #E5E5E5;
  --color-border-default: #D4D4D4;

  /* Spacing (extend defaults) */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
}
```

### Pattern 2: Static Data Module with Utility Functions
**What:** Export data arrays alongside lookup/filter functions from same module
**When to use:** Static data that needs filtering by various criteria
**Example:**
```javascript
// src/data/feedback.js
export const feedbackLog = [
  {
    id: "FB001",
    call_id: "CALL-1042",
    manager_id: "MGR001",
    // ... rest of record
  },
  // ...
];

export const getFeedbackByCallId = (callId) =>
  feedbackLog.find(f => f.call_id === callId);

export const getFeedbackByManager = (managerId) =>
  feedbackLog.filter(f => f.manager_id === managerId);

export const getRecentFeedback = (managerId, days = 30) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return feedbackLog.filter(f =>
    f.manager_id === managerId && new Date(f.date) >= cutoff
  );
};
```

### Pattern 3: Citation ID Format Utility
**What:** Standardized utility for validating and parsing citation IDs
**When to use:** Anywhere citations are handled (links, modals, lookups)
**Example:**
```javascript
// src/data/citations.js
const CITATION_PATTERN = /^CALL-\d{4}$/;

export const isValidCitationId = (id) => CITATION_PATTERN.test(id);

export const formatCitationId = (numericId) =>
  `CALL-${String(numericId).padStart(4, '0')}`;

export const parseCitationId = (id) => {
  if (!isValidCitationId(id)) return null;
  return parseInt(id.replace('CALL-', ''), 10);
};

// Extract citation IDs from text (for AI responses)
export const extractCitations = (text) => {
  const pattern = /\[(?:->|->)\s*(CALL-\d{4})\]/g;
  const matches = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return matches;
};
```

### Anti-Patterns to Avoid
- **JavaScript Tailwind config in v4:** Do NOT create `tailwind.config.js` - use `@theme` in CSS instead
- **Using official `geist` package:** Requires Next.js, will fail with Vite
- **PostCSS configuration:** Not needed with `@tailwindcss/vite` plugin
- **Inline styles for design tokens:** Use CSS variables from `@theme` for consistency
- **Multiple font imports:** Use variable fonts (single file, all weights)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading | Custom @font-face declarations | @fontsource-variable packages | Handles all weights, formats, subsets |
| CSS bundling | Manual PostCSS setup | @tailwindcss/vite plugin | Zero config, better performance |
| Design tokens | JavaScript config + CSS import | @theme directive in CSS | Single source of truth, native CSS variables |
| Date filtering | Custom date math | Native Date API | Sufficient for simple timeframe filtering |

**Key insight:** Tailwind CSS 4's CSS-first approach eliminates the JavaScript/CSS configuration split that caused complexity in v3. All design tokens live in CSS where they belong.

## Common Pitfalls

### Pitfall 1: Using `geist` npm package with Vite
**What goes wrong:** Import fails with "Cannot resolve module 'next/font/local'"
**Why it happens:** Official `geist` package uses Next.js-specific APIs internally
**How to avoid:** Use `@fontsource-variable/geist` and `@fontsource-variable/geist-mono` instead
**Warning signs:** Error mentioning `next/font` during build or dev server startup

### Pitfall 2: Creating tailwind.config.js in v4
**What goes wrong:** Configuration ignored or errors about duplicate config
**Why it happens:** Tailwind v4 uses CSS-first configuration, not JavaScript
**How to avoid:** Define all theme customizations in `@theme {}` block in your CSS
**Warning signs:** Theme values not applying, utilities missing

### Pitfall 3: Missing Vite plugin configuration
**What goes wrong:** Tailwind classes not processed, styles missing
**Why it happens:** @tailwindcss/vite plugin not added to vite.config.js
**How to avoid:** Always add `tailwindcss()` to plugins array in vite.config.js
**Warning signs:** Classes like `bg-white` render as literal text in dev tools

### Pitfall 4: Font not loading in production
**What goes wrong:** Fonts work in dev but fallback to system fonts in production
**Why it happens:** Font files not bundled or paths incorrect
**How to avoid:** Import Fontsource packages in main.jsx, not CSS
**Warning signs:** Network tab shows 404 for font files in production

### Pitfall 5: CSS variable naming conflicts
**What goes wrong:** Custom variables overwrite Tailwind defaults unexpectedly
**Why it happens:** Tailwind v4 uses CSS variables for everything
**How to avoid:** Prefix custom variables distinctly (e.g., `--color-bg-page` not `--bg-page`)
**Warning signs:** Built-in utilities behave unexpectedly

## Code Examples

Verified patterns from official sources:

### Vite Configuration with Tailwind CSS 4
```javascript
// vite.config.js
// Source: https://tailwindcss.com/blog/tailwindcss-v4
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
});
```

### Main Entry Point with Font Imports
```jsx
// src/main.jsx
// Source: https://fontsource.org/fonts/geist/install
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './styles/index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Complete CSS with Design Tokens
```css
/* src/styles/index.css */
/* Source: https://tailwindcss.com/docs/adding-custom-styles */
@import "tailwindcss";

@theme {
  /* Typography - Fonts */
  --font-sans: 'Geist Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Geist Mono Variable', ui-monospace, 'SF Mono', monospace;

  /* Colors - Backgrounds */
  --color-bg-page: #F5F5F5;
  --color-bg-card: #FFFFFF;

  /* Colors - Text (Neutral Gray Scale) */
  --color-text-primary: #171717;
  --color-text-secondary: #525252;
  --color-text-tertiary: #737373;
  --color-text-muted: #A3A3A3;

  /* Colors - Status */
  --color-status-success: #22C55E;
  --color-status-warning: #F59E0B;
  --color-status-error: #EF4444;
  --color-status-info: #3B82F6;

  /* Colors - Accent (Pink Gradient) */
  --color-accent-pink: #EC4899;
  --color-accent-purple: #A855F7;
  --color-accent-pink-light: #FDF2F8;

  /* Colors - Borders */
  --color-border-light: #E5E5E5;
  --color-border-default: #D4D4D4;
}

/* Base layer for global styles */
@layer base {
  body {
    font-family: var(--font-sans);
    background-color: var(--color-bg-page);
    color: var(--color-text-primary);
  }
}

/* Custom utilities for card gradient */
@layer utilities {
  .bg-card-gradient {
    background: linear-gradient(135deg, #FFFFFF 0%, #FDF2F8 100%);
  }
}
```

### Data Layer Index with Re-exports
```javascript
// src/data/index.js
// Central export point for all data and utilities

export { managers, getManagerById, getManagersByPerformance } from './managers';
export { aes, getAEsByManager, getAEById, getUndercoached } from './aes';
export { feedbackLog, getFeedbackByManager, getFeedbackByAE, getFeedbackByCallId, getRecentFeedback } from './feedback';
export { timeframes, getTimeframeData, getManagerTimeframeData, getBenchmark, getScoreTrend } from './timeframes';
export { summaries, getSummaryByManager } from './summaries';
export { sampleQA } from './sampleQA';

// Citation utilities
export const CITATION_PATTERN = /^CALL-\d{4}$/;

export const isValidCitationId = (id) => CITATION_PATTERN.test(id);

export const formatCitationId = (numericId) =>
  `CALL-${String(numericId).padStart(4, '0')}`;

export const parseCitationId = (id) => {
  if (!isValidCitationId(id)) return null;
  return parseInt(id.replace('CALL-', ''), 10);
};

export const extractCitations = (text) => {
  const pattern = /\[(?:->|->|ARROW)\s*(CALL-\d{4})\]/gi;
  const matches = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return [...new Set(matches)]; // Remove duplicates
};

export const lookupCitation = (callId) => {
  const { feedbackLog } = require('./feedback');
  return feedbackLog.find(f => f.call_id === callId);
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js | @theme in CSS | Tailwind v4 (Jan 2025) | All configuration in CSS, no JS needed |
| @tailwind directives | @import "tailwindcss" | Tailwind v4 (Jan 2025) | Single import instead of 3 directives |
| PostCSS plugin | @tailwindcss/vite | Tailwind v4 (Jan 2025) | Better Vite integration, zero config |
| Content array config | Automatic detection | Tailwind v4 (Jan 2025) | No manual file paths needed |
| React 18 | React 19 | Dec 2024 | use() hook, better concurrent features |
| Vite 5 | Vite 6 | 2025 | Better performance, Environment API |

**Deprecated/outdated:**
- **tailwind.config.js** for v4: Still supported but CSS-first is recommended
- **Create React App**: Officially deprecated Feb 2025, use Vite
- **@tailwind directives**: Replaced with `@import "tailwindcss"`
- **content array**: No longer needed, Tailwind auto-detects

## Open Questions

Things that couldn't be fully resolved:

1. **Geist font variable font axis configuration**
   - What we know: Fontsource packages provide variable fonts with wght axis
   - What's unclear: Whether additional axes (like italic) are supported
   - Recommendation: Use standard font-weight utilities, test italic variant

2. **Tailwind v4 color-mix() support**
   - What we know: v4 supports oklch() and color-mix() natively
   - What's unclear: Best practices for opacity variants of custom colors
   - Recommendation: Define explicit opacity variants if needed (e.g., `--color-accent-pink-50`)

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4.0 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4) - Setup, @theme directive, Vite plugin
- [Tailwind CSS Adding Custom Styles](https://tailwindcss.com/docs/adding-custom-styles) - @theme syntax, customization
- [Vite Getting Started](https://vite.dev/guide/) - Project creation, React templates
- [Fontsource Geist Install](https://fontsource.org/fonts/geist/install) - Font package installation

### Secondary (MEDIUM confidence)
- [Install Tailwind CSS with Vite Guide](https://tailkits.com/blog/install-tailwind-css-with-vite/) - Step-by-step v4 setup
- [GitHub vercel/geist-font Issue #94](https://github.com/vercel/geist-font/issues/94) - Vite compatibility workaround
- [Medium: Stop Waiting for React App to Load (2026)](https://medium.com/@shubhspatil77/stop-waiting-for-your-react-app-to-load-the-2026-guide-to-vite-7e071923ab9f) - Vite + React 19 patterns

### Tertiary (LOW confidence)
- Design PNGs in coaching-intelligence-data/ - Visual reference for colors and typography

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All technologies verified through official documentation
- Architecture: HIGH - Patterns from official Tailwind v4 and Vite docs
- Pitfalls: HIGH - Documented in GitHub issues and official migration guides

**Research date:** 2026-01-25
**Valid until:** 2026-02-25 (30 days - stable technologies)
