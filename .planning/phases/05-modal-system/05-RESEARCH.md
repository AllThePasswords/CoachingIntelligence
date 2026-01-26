# Phase 5: Modal System - Research

**Researched:** 2026-01-26
**Domain:** React modals, dialogs, toast notifications, portal rendering
**Confidence:** HIGH

## Summary

This phase implements two distinct modal types: a **Citation Modal** for viewing call details when clicking citation links, and a **Confirmation Modal** for action workflows (Add to 1:1, etc.). Additionally, it requires a **Toast notification** system for success feedback after action confirmation.

The research confirms that the native HTML `<dialog>` element combined with React's `createPortal` is the modern, accessible approach for modals in 2026. The `<dialog>` element provides built-in accessibility features (ARIA roles, focus trapping, backdrop) that previously required complex JavaScript or third-party libraries. For toast notifications, **Sonner** is the recommended lightweight library due to its minimal bundle size, simple API (no hooks/context required), and excellent developer experience.

The existing codebase already has `getCitationDetails()` which returns all data needed for the Citation Modal, and the ActionMenu component already triggers actions that will open the Confirmation Modal. This phase extends existing patterns rather than creating new architectural foundations.

**Primary recommendation:** Build modals using native `<dialog>` element with `createPortal` for DOM positioning, manage modal state with Zustand store (consistent with existing timeframe store pattern), and use Sonner for toast notifications.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | ^19.2.3 | Component framework with createPortal | Already installed, createPortal is built-in |
| react-dom | ^19.2.3 | DOM rendering, portal target | Provides createPortal API |
| zustand | ^5.0.10 | Modal state management | Existing pattern for global state |

### New Dependencies
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| sonner | ^2.0.x | Toast notifications | <5KB, no hooks/context required, simple API, 8M+ weekly downloads |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native `<dialog>` | react-modal | Extra dependency, `<dialog>` now has full browser support since March 2022 |
| Native `<dialog>` | @headlessui/react | Heavier bundle, adds complexity for simple modals |
| Sonner | react-hot-toast | Similar size, Sonner has better defaults and cleaner API |
| Sonner | react-toastify | Larger bundle (~16KB vs ~5KB), more features than needed |
| Zustand modal store | Local useState | Modal needs to be opened from multiple places (Citations, ActionMenu), global state is cleaner |

**Installation:**
```bash
npm install sonner
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   └── modals/
│       ├── Modal/                    # Base modal wrapper using <dialog>
│       │   ├── Modal.jsx
│       │   └── index.js
│       ├── CitationModal/            # Citation details display
│       │   ├── CitationModal.jsx
│       │   └── index.js
│       ├── ConfirmationModal/        # Action confirmation with form
│       │   ├── ConfirmationModal.jsx
│       │   └── index.js
│       └── index.js                  # Barrel export
├── stores/
│   ├── modalStore.js                 # NEW: Modal state (which is open, data)
│   ├── timeframeStore.js             # Existing
│   └── index.js                      # Add modalStore export
└── layouts/
    └── AppLayout.jsx                 # Add Toaster component here
```

### Pattern 1: Native `<dialog>` with React State Sync
**What:** Use the HTML `<dialog>` element's showModal()/close() methods, synced with React state
**When to use:** All modal implementations in this project
**Example:**
```jsx
// Source: React 19 + native dialog patterns
import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function Modal({ isOpen, onClose, children, ariaLabel }) {
  const dialogRef = useRef(null);

  // Sync React state with dialog's open property
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal(); // Opens as modal with backdrop
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Handle ESC key and backdrop click
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e) => {
      e.preventDefault(); // Prevent default close
      onClose();
    };

    const handleClick = (e) => {
      // Close on backdrop click (click on dialog element itself)
      if (e.target === dialog) {
        onClose();
      }
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleClick);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleClick);
    };
  }, [onClose]);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 bg-white rounded-lg shadow-xl p-0 max-w-lg w-full"
      aria-label={ariaLabel}
    >
      {children}
    </dialog>,
    document.body
  );
}
```

### Pattern 2: Zustand Modal Store
**What:** Centralized store for modal state, allowing any component to open modals with data
**When to use:** When modals need to be triggered from multiple components
**Example:**
```jsx
// Source: Existing Zustand patterns + modal management article
import { create } from 'zustand';

export const useModalStore = create((set) => ({
  // Citation Modal state
  citationModal: {
    isOpen: false,
    callId: null,
  },
  openCitationModal: (callId) => set({
    citationModal: { isOpen: true, callId }
  }),
  closeCitationModal: () => set({
    citationModal: { isOpen: false, callId: null }
  }),

  // Confirmation Modal state
  confirmationModal: {
    isOpen: false,
    action: null,      // 'add_1on1' | 'send_summary' | 'recognize' | 'flag_hr'
    managerName: null,
    sources: [],       // Citation IDs used as sources
  },
  openConfirmationModal: (action, managerName, sources = []) => set({
    confirmationModal: { isOpen: true, action, managerName, sources }
  }),
  closeConfirmationModal: () => set({
    confirmationModal: { isOpen: false, action: null, managerName: null, sources: [] }
  }),
}));
```

### Pattern 3: Citation Component with Modal Trigger
**What:** Update existing Citation component to open modal via Zustand store
**When to use:** When clicking any citation link
**Example:**
```jsx
// Source: Existing Citation.jsx + Zustand integration
import { useModalStore } from '@/stores';

export function Citation({ id }) {
  const openCitationModal = useModalStore(state => state.openCitationModal);

  const handleClick = () => {
    openCitationModal(id);
  };

  return (
    <button
      onClick={handleClick}
      className="font-mono text-sm px-2 py-0.5 bg-gray-100 rounded border border-border text-foreground hover:bg-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
      aria-label={`View details for ${id}`}
    >
      {id}
    </button>
  );
}
```

### Pattern 4: Sonner Toast Integration
**What:** Add Toaster to app root, call toast() after successful action
**When to use:** Success feedback after confirming actions
**Example:**
```jsx
// In AppLayout.jsx - add Toaster once at app level
import { Toaster } from 'sonner';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ... existing layout */}
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

// In ConfirmationModal.jsx - call toast on confirm
import { toast } from 'sonner';

const handleConfirm = () => {
  // Mock action - would integrate with calendar/email in future
  console.log(`Action confirmed: ${action} for ${managerName}`);

  toast.success(`${actionLabels[action]} added successfully`);
  closeConfirmationModal();
};
```

### Pattern 5: Confirmation Modal with Editable Fields
**What:** Modal with form inputs for action customization
**When to use:** Confirmation flows requiring user input
**Example:**
```jsx
// Source: Requirements ACT-04, ACT-05
function ConfirmationModal() {
  const { isOpen, action, managerName, sources } = useModalStore(
    state => state.confirmationModal
  );
  const closeConfirmationModal = useModalStore(state => state.closeConfirmationModal);

  const [topic, setTopic] = useState('');
  const [nextDate] = useState('Tuesday, Jan 28'); // Mocked for v1

  // Reset topic when modal opens with new action
  useEffect(() => {
    if (isOpen) {
      setTopic(defaultTopics[action] || '');
    }
  }, [isOpen, action]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeConfirmationModal} ariaLabel="Confirm action">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">{actionLabels[action]}</h2>

        {/* Next 1:1 date (read-only for v1) */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">Next 1:1</label>
          <div className="text-gray-900">{nextDate}</div>
        </div>

        {/* Editable topic */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Sources */}
        {sources.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">Sources</label>
            <div className="flex flex-wrap gap-2">
              {sources.map(callId => (
                <span key={callId} className="font-mono text-xs px-2 py-1 bg-gray-100 rounded">
                  {callId}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={closeConfirmationModal}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm bg-foreground text-white rounded-lg hover:bg-gray-800"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}
```

### Anti-Patterns to Avoid
- **Setting dialog open attribute directly:** Use showModal()/close() methods instead for proper modal behavior (backdrop, focus trap)
- **Managing modal state in each component:** Centralize in Zustand store for consistency
- **Using div + custom overlay:** Native `<dialog>` provides backdrop, focus management, ESC handling
- **Adding multiple Toaster components:** Add once in AppLayout, call toast() from anywhere
- **Creating portal container in component:** Use document.body directly as portal target
- **Forgetting to sync ESC key with React state:** Handle 'cancel' event to keep state in sync

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal backdrop | Custom div + z-index | `<dialog>` ::backdrop pseudo-element | Built-in, handles clicks correctly |
| Focus trapping | Custom focus management | `<dialog>` showModal() | Native focus trapping in modal mode |
| Toast notifications | Custom toast component | Sonner library | Animation, stacking, auto-dismiss handled |
| Citation data lookup | Parsing feedback array | `getCitationDetails(callId)` | Already exists in data/citations.js |
| Modal open state | Local useState per modal | Zustand modalStore | Matches existing patterns, triggered from multiple places |
| Escape key handling | Custom keydown listener | `<dialog>` cancel event | Native behavior, just need to sync state |

**Key insight:** The native `<dialog>` element in 2026 provides most modal functionality for free. Focus on composition, not reimplementation.

## Common Pitfalls

### Pitfall 1: Dialog Open State Desync
**What goes wrong:** React state says modal is open but dialog is closed (or vice versa) after ESC key
**Why it happens:** `<dialog>` manages its own open state independently of React
**How to avoid:** Listen for 'cancel' event (fired on ESC) and call onClose to sync React state:
```jsx
dialog.addEventListener('cancel', (e) => {
  e.preventDefault(); // Prevent default close
  onClose(); // Sync React state
});
```
**Warning signs:** Modal won't reopen after pressing ESC, modal appears open but content is hidden

### Pitfall 2: Backdrop Click Detection
**What goes wrong:** Clicks inside modal content close the modal
**Why it happens:** Click handler on dialog catches all clicks
**How to avoid:** Check if click target is the dialog element itself (the backdrop), not its children:
```jsx
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) { // Only backdrop, not content
    onClose();
  }
});
```
**Warning signs:** Clicking form inputs or buttons closes modal unexpectedly

### Pitfall 3: Multiple Toaster Instances
**What goes wrong:** Duplicate toasts appear, or toasts appear in wrong position
**Why it happens:** Adding Toaster in multiple components
**How to avoid:** Add `<Toaster />` exactly once in AppLayout.jsx. Call `toast()` from anywhere.
**Warning signs:** Toasts appearing twice, inconsistent positioning

### Pitfall 4: Missing Portal for Dialog
**What goes wrong:** Dialog appears but is clipped by parent overflow:hidden or has wrong z-index
**Why it happens:** Dialog rendered inside component's DOM position
**How to avoid:** Always use createPortal to render dialog to document.body
**Warning signs:** Modal cut off, appearing behind other elements, z-index wars

### Pitfall 5: Forgetting to Import toast Function
**What goes wrong:** "toast is not defined" error when confirming action
**Why it happens:** Only importing Toaster, not the toast function
**How to avoid:** Import both: `import { toast } from 'sonner'` in any component that needs to trigger toasts
**Warning signs:** Runtime error on action confirmation

### Pitfall 6: Form State Persisting Between Opens
**What goes wrong:** Old topic text appears when reopening modal for different action
**Why it happens:** useState initializer only runs once
**How to avoid:** Use useEffect to reset form state when modal opens:
```jsx
useEffect(() => {
  if (isOpen) {
    setTopic(defaultTopics[action] || '');
  }
}, [isOpen, action]);
```
**Warning signs:** "Review coaching methods" topic showing for "Add to 1:1" action

## Code Examples

Verified patterns from official sources and existing codebase:

### Citation Modal Content
```jsx
// Source: Requirements CITE-01 through CITE-06 + getCitationDetails()
import { getCitationDetails } from '@/data';
import { useModalStore } from '@/stores';

export function CitationModal() {
  const { isOpen, callId } = useModalStore(state => state.citationModal);
  const closeCitationModal = useModalStore(state => state.closeCitationModal);

  const details = callId ? getCitationDetails(callId) : null;

  if (!isOpen || !details) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeCitationModal} ariaLabel={`Call details for ${callId}`}>
      <div className="p-6">
        {/* Header with call ID */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold font-mono">{details.callId}</h2>
          <button onClick={closeCitationModal} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Call metadata grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <span className="text-gray-500">Date</span>
            <p className="font-medium">{details.date}</p>
          </div>
          <div>
            <span className="text-gray-500">Duration</span>
            <p className="font-medium">{details.duration} min</p>
          </div>
          <div>
            <span className="text-gray-500">AE</span>
            <p className="font-medium">{details.aeName}</p>
          </div>
          <div>
            <span className="text-gray-500">Manager</span>
            <p className="font-medium">{details.managerName}</p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Pipeline Stage</span>
            <p className="font-medium">{details.pipelineStage}</p>
          </div>
        </div>

        {/* Coaching Activity Checklist */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Coaching Activity</h3>
          <div className="space-y-2">
            {[
              { key: 'listened', label: 'Listened to call' },
              { key: 'attended', label: 'Attended live' },
              { key: 'hasFeedback', label: 'Provided feedback' },
              { key: 'hasComments', label: 'Left comments' },
              { key: 'hasScorecard', label: 'Completed scorecard' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                {details.coachingActivity[key] ? (
                  <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className={details.coachingActivity[key] ? 'text-gray-900' : 'text-gray-400'}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback text */}
        {details.feedback && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Feedback</h3>
            <blockquote className="text-gray-700 bg-gray-50 p-4 rounded-lg border-l-4 border-accent">
              {details.feedback}
            </blockquote>
          </div>
        )}

        {/* View Full Call link (mocked for v1) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert('View Full Call - Integration coming in future phase');
          }}
          className="text-sm text-accent hover:underline"
        >
          View Full Call in Gong
        </a>
      </div>
    </Modal>
  );
}
```

### Modal Styling with Tailwind
```jsx
// Source: Tailwind CSS + Geist design system tokens
<dialog
  ref={dialogRef}
  className="
    backdrop:bg-black/50
    backdrop:backdrop-blur-sm
    bg-white
    rounded-lg
    shadow-xl
    border border-border
    p-0
    max-w-lg
    w-full
    m-auto
    open:animate-in
    open:fade-in-0
    open:zoom-in-95
  "
  aria-label={ariaLabel}
>
```

### ActionMenu Integration with Confirmation Modal
```jsx
// Source: Existing ActionMenu.jsx + modalStore integration
import { useModalStore } from '@/stores';

export function ActionMenu({ managerName, sources = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const openConfirmationModal = useModalStore(state => state.openConfirmationModal);

  const handleAction = (action) => {
    // Open confirmation modal instead of alert
    openConfirmationModal(action.id, managerName, sources);
    setIsOpen(false);
  };

  // ... rest of component
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom modal with div + overlay | Native `<dialog>` element | Widely available since March 2022 | Built-in a11y, focus trap, backdrop |
| react-modal library | Native `<dialog>` + createPortal | 2022-2024 | No dependency, better browser support |
| forwardRef for dialog ref | Direct ref passing (React 19) | React 19 (2024) | Simpler component APIs |
| Multiple toast libraries | Sonner as de facto standard | 2023-2024 | 8M+ weekly downloads, shadcn/ui default |
| Local state per modal | Zustand modal store | 2023-2024 | Consistent with modern React patterns |

**Deprecated/outdated:**
- `React.forwardRef`: Not needed in React 19 - refs can be passed as regular props
- Custom focus trap implementations: Native `<dialog>` handles this
- aria-hidden on app root: Native dialog's modal mode handles this automatically

## Open Questions

Things that couldn't be fully resolved:

1. **View Full Call Integration**
   - What we know: CITE-06 requires "View Full Call" link, mocked for v1
   - What's unclear: Final destination URL format for Gong integration
   - Recommendation: Use href="#" with onClick alert for v1, placeholder for future integration

2. **Next 1:1 Date Source**
   - What we know: ACT-04 requires showing next 1:1 date in confirmation modal
   - What's unclear: Where this date comes from (static mock, or derived from data?)
   - Recommendation: Use static mock date for v1 ("Tuesday, Jan 28"), integrate with calendar data later

3. **Sources Array Population**
   - What we know: Confirmation modal should show "sources" - citations that informed the action
   - What's unclear: How sources are collected (from current page citations? explicitly passed?)
   - Recommendation: For v1, pass empty array or allow ActionMenu to receive sources prop; enhance in future phase

4. **Modal Animation Preferences**
   - What we know: Geist design system has subtle, professional animations
   - What's unclear: Specific animation timings/easings to match Geist
   - Recommendation: Use Tailwind's built-in animation utilities with conservative timing (150-200ms)

## Sources

### Primary (HIGH confidence)
- [React createPortal documentation](https://react.dev/reference/react-dom/createPortal) - Official React docs for portal API
- [Sonner documentation](https://sonner.emilkowal.ski/) - Official Sonner toast library docs
- Existing codebase - getCitationDetails(), ActionMenu, Zustand store patterns

### Secondary (MEDIUM confidence)
- [React Native Dialog in React](https://dev.to/link2twenty/react-using-native-dialogs-to-make-a-modal-popup-4b25) - Pattern for syncing React state with dialog
- [Top React notification libraries 2026](https://knock.app/blog/the-top-notification-libraries-for-react) - Library comparison and recommendations
- [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal) - Accessibility guidelines

### Tertiary (LOW confidence)
- WebSearch results for React modal patterns 2026 - General ecosystem confirmation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Native browser APIs + established libraries, verified from official docs
- Architecture: HIGH - Follows existing codebase patterns (Zustand, component structure)
- Pitfalls: HIGH - Well-documented issues with dialog/React state sync
- Code examples: HIGH - Based on official documentation and existing codebase patterns

**Research date:** 2026-01-26
**Valid until:** 60 days (stable browser APIs, established library versions)
