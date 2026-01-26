# Phase 6: Claude Integration - Research

**Researched:** 2026-01-26
**Domain:** Claude API integration, streaming chat UI, conversation management, citation parsing
**Confidence:** HIGH

## Summary

This phase implements the "Ask Anything" feature: users type questions, Claude API responds with streaming text, and responses include clickable citations in `[-> CALL-XXXX]` format that open the CitationModal (built in Phase 5). The conversation persists in session, with follow-up suggestions and contextual action buttons.

The research reveals two viable architecture approaches: (1) **Frontend-only with CORS** using Anthropic's `dangerouslyAllowBrowser` flag and user-provided API keys, or (2) **Vercel AI SDK with backend route** using `@ai-sdk/anthropic` provider and the `useChat` hook. Given the project constraints (no backend currently, MVP focus), the recommended approach is **frontend-only with a "Bring Your Own API Key" (BYOAK) pattern**. This allows shipping without backend infrastructure while keeping the option to add a proxy later.

For streaming, the Anthropic SDK's `.stream()` method provides excellent developer experience with event handlers (`.on('text', callback)`). The conversation UI should use a Zustand store for chat state (messages, status, streaming text), with a custom hook that wraps the Anthropic SDK streaming calls.

**Primary recommendation:** Use `@anthropic-ai/sdk` with `dangerouslyAllowBrowser: true` and user-provided API key stored in localStorage. Build conversation state in Zustand chatStore. Parse citations with existing `extractCitations()` utility and render with existing Citation component.

## Standard Stack

The established libraries/tools for this domain:

### Core (New Dependency)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @anthropic-ai/sdk | ^0.33.x | Claude API client with streaming | Official Anthropic SDK, excellent TS types, .stream() convenience methods |

### Already Installed
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| zustand | ^5.0.10 | Conversation state management | Existing pattern in project, persist middleware for conversation history |
| react | ^19.2.3 | UI components | Already installed |

### Supporting (Optional Enhancement)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zustand/middleware persist | built-in | Persist conversation to localStorage | If conversation history should survive page refresh |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @anthropic-ai/sdk direct | @ai-sdk/anthropic + useChat | Requires backend API route, more setup, better for production |
| @anthropic-ai/sdk direct | @microsoft/fetch-event-source | Manual SSE parsing, more control, more code |
| localStorage API key | Backend proxy | More secure, requires server infrastructure, adds complexity |
| Custom streaming UI | stream-chat-react | Heavy dependency for one feature, overkill for MVP |

**Installation:**
```bash
npm install @anthropic-ai/sdk
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   └── chat/
│       ├── ChatThread/           # Conversation thread container
│       │   ├── ChatThread.jsx
│       │   └── index.js
│       ├── ChatMessage/          # Individual message (user or assistant)
│       │   ├── ChatMessage.jsx
│       │   └── index.js
│       ├── MessageContent/       # Renders text with inline Citation components
│       │   ├── MessageContent.jsx
│       │   └── index.js
│       ├── FollowUpSuggestions/  # Clickable follow-up chips
│       │   ├── FollowUpSuggestions.jsx
│       │   └── index.js
│       ├── ApiKeyInput/          # BYOAK input for API key
│       │   ├── ApiKeyInput.jsx
│       │   └── index.js
│       └── index.js              # Barrel export
├── stores/
│   ├── chatStore.js              # NEW: Conversation state, messages, streaming
│   ├── settingsStore.js          # NEW: API key storage (persisted)
│   ├── modalStore.js             # From Phase 5
│   ├── timeframeStore.js         # Existing
│   └── index.js
├── hooks/
│   └── useChat.js                # NEW: Custom hook wrapping Anthropic SDK
└── lib/
    └── claude.js                 # NEW: Anthropic client factory + system prompt
```

### Pattern 1: Bring Your Own API Key (BYOAK)
**What:** User provides their Anthropic API key, stored in localStorage, used for direct browser-to-API calls
**When to use:** MVP without backend, trusted users, internal tools
**Example:**
```jsx
// src/stores/settingsStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useSettingsStore = create()(
  persist(
    (set) => ({
      apiKey: null,
      setApiKey: (key) => set({ apiKey: key }),
      clearApiKey: () => set({ apiKey: null }),
    }),
    {
      name: 'coaching-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### Pattern 2: Anthropic Client with Browser Access
**What:** Create Anthropic client with dangerouslyAllowBrowser flag for frontend-only usage
**When to use:** BYOAK pattern where API key comes from user
**Example:**
```jsx
// src/lib/claude.js
import Anthropic from '@anthropic-ai/sdk';

export const createClaudeClient = (apiKey) => {
  if (!apiKey) {
    throw new Error('API key required');
  }

  return new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true, // Required for browser usage
  });
};

export const SYSTEM_PROMPT = `You are an AI coaching analyst assistant for a sales VP named Ann.
You have access to coaching data for 4 managers and their AEs.

When answering questions:
1. Be specific and cite evidence using the format [-> CALL-XXXX] for call references
2. Provide actionable insights, not just data summaries
3. After your answer, suggest 2-3 follow-up questions the user might want to ask
4. If you recommend an action, mention it can be added to a 1:1 or sent as a summary

Current context will be provided with each question.`;
```

### Pattern 3: Zustand Chat Store with Streaming State
**What:** Centralized store managing conversation messages, streaming state, and loading
**When to use:** All chat functionality in this phase
**Example:**
```jsx
// src/stores/chatStore.js
import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  // Conversation state
  messages: [], // Array of { id, role: 'user'|'assistant', content, timestamp }
  streamingContent: '', // Current streaming text (assistant typing)
  status: 'idle', // 'idle' | 'loading' | 'streaming' | 'error'
  error: null,

  // Follow-up suggestions from last response
  suggestions: [],

  // Actions
  addUserMessage: (content) => {
    const message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    set((state) => ({
      messages: [...state.messages, message],
      status: 'loading',
      error: null,
    }));
    return message;
  },

  startStreaming: () => set({
    status: 'streaming',
    streamingContent: ''
  }),

  appendStreamingContent: (text) => set((state) => ({
    streamingContent: state.streamingContent + text
  })),

  completeStreaming: (suggestions = []) => {
    const content = get().streamingContent;
    const message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      timestamp: Date.now(),
    };
    set((state) => ({
      messages: [...state.messages, message],
      streamingContent: '',
      status: 'idle',
      suggestions,
    }));
  },

  setError: (error) => set({
    status: 'error',
    error: error.message,
    streamingContent: '',
  }),

  clearConversation: () => set({
    messages: [],
    streamingContent: '',
    status: 'idle',
    error: null,
    suggestions: [],
  }),
}));
```

### Pattern 4: Custom useChat Hook with Anthropic Streaming
**What:** Hook that orchestrates API calls, streaming, and store updates
**When to use:** When user submits a question from AskInput
**Example:**
```jsx
// src/hooks/useChat.js
import { useCallback } from 'react';
import { useChatStore } from '@/stores';
import { useSettingsStore } from '@/stores';
import { createClaudeClient, SYSTEM_PROMPT } from '@/lib/claude';
import { managers, feedbackLog, aes, getSummaryByManager } from '@/data';

// Build context string from coaching data
const buildContext = (managerId = null) => {
  const managerData = managers.map(m => ({
    name: m.name,
    region: m.region,
    quota_attainment: m.quota_attainment,
    coaching_score: m.coaching_score,
    trend: m.trend,
    summary: m.summary,
  }));

  let context = `## Manager Overview\n${JSON.stringify(managerData, null, 2)}\n\n`;

  if (managerId) {
    const summary = getSummaryByManager(managerId);
    if (summary) {
      context += `## Detailed Summary for ${summary.manager_name}\n`;
      context += JSON.stringify(summary.sections, null, 2);
    }
  }

  // Add recent feedback samples for citation context
  const recentFeedback = feedbackLog.slice(0, 10).map(f => ({
    call_id: f.call_id,
    manager: f.manager_name,
    ae: f.ae_name,
    date: f.date,
    feedback: f.feedback?.substring(0, 100),
  }));
  context += `\n\n## Recent Feedback (cite using [-> CALL-XXXX])\n`;
  context += JSON.stringify(recentFeedback, null, 2);

  return context;
};

export const useChat = (managerId = null) => {
  const apiKey = useSettingsStore((s) => s.apiKey);
  const {
    messages,
    streamingContent,
    status,
    error,
    suggestions,
    addUserMessage,
    startStreaming,
    appendStreamingContent,
    completeStreaming,
    setError,
    clearConversation,
  } = useChatStore();

  const sendMessage = useCallback(async (userContent) => {
    if (!apiKey) {
      setError(new Error('Please enter your Anthropic API key'));
      return;
    }

    addUserMessage(userContent);

    try {
      const client = createClaudeClient(apiKey);
      const context = buildContext(managerId);

      // Build conversation history for multi-turn
      const conversationMessages = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      // Add current user message
      conversationMessages.push({
        role: 'user',
        content: `${context}\n\n## User Question\n${userContent}`,
      });

      startStreaming();

      const stream = client.messages.stream({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: conversationMessages,
      });

      stream.on('text', (text) => {
        appendStreamingContent(text);
      });

      await stream.finalMessage();

      // Extract suggestions from response (simple pattern match)
      const content = useChatStore.getState().streamingContent;
      const suggestionMatch = content.match(/follow-up questions?:?\n([\s\S]*?)(?:\n\n|$)/i);
      let extractedSuggestions = [];
      if (suggestionMatch) {
        extractedSuggestions = suggestionMatch[1]
          .split('\n')
          .map(s => s.replace(/^[-•*\d.)\s]+/, '').trim())
          .filter(s => s.length > 10)
          .slice(0, 3);
      }

      completeStreaming(extractedSuggestions);
    } catch (err) {
      setError(err);
    }
  }, [apiKey, messages, managerId, addUserMessage, startStreaming, appendStreamingContent, completeStreaming, setError]);

  return {
    messages,
    streamingContent,
    status,
    error,
    suggestions,
    sendMessage,
    clearConversation,
    isReady: !!apiKey,
  };
};
```

### Pattern 5: MessageContent with Inline Citations
**What:** Parse response text and render Citation components inline
**When to use:** Rendering assistant messages with clickable citations
**Example:**
```jsx
// src/components/chat/MessageContent/MessageContent.jsx
import { Fragment } from 'react';
import { Citation } from '@/components/display';
import { useModalStore } from '@/stores';
import { extractCitations } from '@/data';

export function MessageContent({ content }) {
  const openCitationModal = useModalStore((s) => s.openCitationModal);

  // Pattern: [-> CALL-XXXX] or just CALL-XXXX
  const citationPattern = /(\[(?:->|→)?\s*CALL-\d{4}\]|CALL-\d{4})/g;

  const parts = content.split(citationPattern);

  return (
    <div className="prose prose-sm max-w-none">
      {parts.map((part, index) => {
        // Check if this part is a citation
        const citationMatch = part.match(/CALL-\d{4}/);
        if (citationMatch) {
          const callId = citationMatch[0];
          return (
            <Citation
              key={index}
              id={callId}
              onClick={() => openCitationModal(callId)}
            />
          );
        }
        // Regular text - preserve whitespace and newlines
        return (
          <Fragment key={index}>
            {part.split('\n').map((line, i, arr) => (
              <Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </Fragment>
            ))}
          </Fragment>
        );
      })}
    </div>
  );
}
```

### Pattern 6: Chat Thread with Streaming Display
**What:** Render conversation messages with streaming indicator for current response
**When to use:** Main chat UI on Manager Detail page
**Example:**
```jsx
// src/components/chat/ChatThread/ChatThread.jsx
import { useRef, useEffect } from 'react';
import { ChatMessage } from '../ChatMessage';
import { FollowUpSuggestions } from '../FollowUpSuggestions';
import { useChatStore } from '@/stores';

export function ChatThread({ onSuggestionClick }) {
  const { messages, streamingContent, status, suggestions } = useChatStore();
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new messages/streaming
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  return (
    <div className="flex flex-col gap-4 py-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {/* Streaming message */}
      {status === 'streaming' && streamingContent && (
        <ChatMessage
          message={{
            id: 'streaming',
            role: 'assistant',
            content: streamingContent,
          }}
          isStreaming
        />
      )}

      {/* Loading indicator */}
      {status === 'loading' && (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
          </div>
          <span>Analyzing your coaching data...</span>
        </div>
      )}

      {/* Follow-up suggestions */}
      {status === 'idle' && suggestions.length > 0 && (
        <FollowUpSuggestions
          suggestions={suggestions}
          onClick={onSuggestionClick}
        />
      )}

      {/* Error display */}
      {status === 'error' && (
        <div className="text-error text-sm bg-red-50 p-3 rounded-lg">
          Error: {useChatStore.getState().error}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
```

### Anti-Patterns to Avoid
- **Exposing API key in source code:** Always use user-provided key or backend proxy
- **Not handling streaming errors:** Network failures during streaming need graceful recovery
- **Blocking UI during API call:** Use streaming to show progress immediately
- **Storing full responses in URL:** Conversation history should be in store/localStorage, not URL params
- **Ignoring context limits:** Truncate conversation history if it exceeds token limits
- **Hardcoding model version:** Use config/constants for easy model updates
- **Not preserving conversation on navigation:** Store needs to persist across route changes

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SSE parsing | Custom EventSource handler | Anthropic SDK `.stream()` | SDK handles reconnection, event parsing, error recovery |
| Citation extraction | Custom regex in every component | `extractCitations()` from `@/data/citations.js` | Already exists, tested, handles edge cases |
| Citation rendering | Custom inline parsing per-use | Citation component + MessageContent wrapper | Consistent styling, modal integration |
| API key storage | Custom localStorage wrapper | Zustand persist middleware | Built-in, handles serialization, works with existing stores |
| Message IDs | Date.now() or incrementing | `crypto.randomUUID()` | Guaranteed unique, browser-native |
| Conversation scroll | Manual scroll position tracking | `scrollIntoView({ behavior: 'smooth' })` | Native, smooth, handles edge cases |

**Key insight:** The Anthropic SDK's `.stream()` method with event handlers (`.on('text', callback)`) eliminates most streaming complexity. Focus on state management and UI, not protocol handling.

## Common Pitfalls

### Pitfall 1: API Key Exposed in Network Tab
**What goes wrong:** User's API key visible in browser dev tools, could be stolen via XSS
**Why it happens:** BYOAK pattern inherently exposes keys in client
**How to avoid:**
- Document the security tradeoff clearly to users
- Use short-lived or restricted API keys when possible
- Plan migration to backend proxy for production
- Consider rate limiting user requests
**Warning signs:** Security-conscious users complaining, API key abuse

### Pitfall 2: Streaming State Desync
**What goes wrong:** UI shows "streaming" but no text appears, or old text persists
**Why it happens:** Race conditions between streaming events and React re-renders
**How to avoid:**
```jsx
// Use functional updates in store
appendStreamingContent: (text) => set((state) => ({
  streamingContent: state.streamingContent + text
})),
```
**Warning signs:** Flickering text, missing chunks, duplicate content

### Pitfall 3: Context Window Overflow
**What goes wrong:** API returns error after several exchanges
**Why it happens:** Conversation history + context exceeds model's token limit
**How to avoid:**
- Track approximate token count (rough: 4 chars = 1 token)
- Truncate oldest messages when approaching limit
- Summarize old conversation if needed
- Keep context data minimal (don't include all feedback)
**Warning signs:** "maximum context length" error, responses cut off

### Pitfall 4: Citation Pattern Not Matching
**What goes wrong:** Citations render as plain text `[-> CALL-1042]` instead of clickable
**Why it happens:** LLM output varies slightly from expected format
**How to avoid:**
- Use flexible regex: `/(\[(?:->|→)?\s*CALL-\d{4}\]|CALL-\d{4})/g`
- Test with multiple response formats
- Normalize in system prompt: "Always use format [-> CALL-XXXX]"
**Warning signs:** Plain text citations appearing, modal never opening

### Pitfall 5: Follow-up Extraction Fragile
**What goes wrong:** Suggestions array empty even when LLM provided follow-ups
**Why it happens:** LLM formats follow-ups differently than expected
**How to avoid:**
- Make system prompt explicit about format
- Use more flexible regex patterns
- Fallback to generic suggestions if extraction fails
**Warning signs:** Empty suggestions frequently, suggestions containing junk text

### Pitfall 6: Conversation Lost on Page Refresh
**What goes wrong:** User refreshes page, conversation disappears
**Why it happens:** Chat store not persisted
**How to avoid:** Use Zustand persist middleware:
```jsx
import { persist } from 'zustand/middleware';

export const useChatStore = create()(
  persist(
    (set, get) => ({ /* ... */ }),
    { name: 'coaching-chat' }
  )
);
```
**Warning signs:** User complaints about lost context, repeated questions

### Pitfall 7: AbortController Not Cleaned Up
**What goes wrong:** Streaming continues after user navigates away, memory leak
**Why it happens:** No cleanup when component unmounts
**How to avoid:**
```jsx
useEffect(() => {
  const controller = new AbortController();
  // Pass to streaming call
  return () => controller.abort();
}, []);
```
**Warning signs:** Network requests continuing after navigation, console errors

## Code Examples

Verified patterns from official sources:

### Anthropic SDK Streaming
```typescript
// Source: https://github.com/anthropics/anthropic-sdk-typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: userProvidedKey,
  dangerouslyAllowBrowser: true,
});

const stream = client.messages.stream({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1024,
  system: 'You are a helpful assistant.',
  messages: [{ role: 'user', content: 'Hello!' }],
});

stream.on('text', (text) => {
  console.log(text); // Each text chunk as it arrives
});

const finalMessage = await stream.finalMessage();
// finalMessage.content[0].text contains full response
```

### System Prompt for Citations
```javascript
// Source: Project requirements + Claude best practices
export const SYSTEM_PROMPT = `You are an AI coaching analyst for a sales VP.

## Response Guidelines
1. Be specific and cite evidence
2. Use citation format: [-> CALL-XXXX] where XXXX is the call ID
3. Keep responses focused and actionable
4. End with 2-3 follow-up questions formatted as:

Follow-up questions:
- Question one?
- Question two?
- Question three?

## Available Data
You have access to:
- Manager performance metrics and coaching scores
- AE quota attainment and coaching distribution
- Feedback log with call IDs for citations
- AI-generated summaries for each manager`;
```

### Wire AskInput to Chat
```jsx
// In ManagerDetail.jsx or Dashboard.jsx
import { useChat } from '@/hooks/useChat';
import { AskInput } from '@/components/input';
import { ChatThread } from '@/components/chat';

function ManagerDetail({ managerId }) {
  const { sendMessage, suggestions, isReady } = useChat(managerId);

  const handleAsk = (question) => {
    if (!isReady) {
      // Show API key modal
      return;
    }
    sendMessage(question);
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <div>
      {/* ... existing detail content ... */}

      {/* Chat section below data */}
      <section className="mt-8 border-t border-border pt-6">
        <h2 className="text-lg font-semibold mb-4">Ask Anything</h2>
        <ChatThread onSuggestionClick={handleSuggestionClick} />
      </section>

      {/* Pinned input at bottom (already in AppLayout) */}
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Backend proxy required | Browser CORS with `dangerouslyAllowBrowser` | Aug 2024 | Frontend-only apps possible |
| Manual SSE parsing | SDK `.stream()` with event handlers | 2024 | Much simpler streaming code |
| Polling for responses | Real-time streaming | 2023 | Immediate feedback, better UX |
| Full response then display | Token-by-token streaming | 2023 | Typewriter effect, perceived faster |
| Static chat libraries | AI SDK useChat hook | 2024-2025 | Built-in streaming, state management |
| Custom retry logic | SDK automatic retry with backoff | 2025 | More reliable API calls |

**Deprecated/outdated:**
- `Text Completions API`: Migrated to Messages API (streaming format changed)
- Manual EventSource: SDK handles SSE parsing now
- `forwardRef` for refs in React 19: Direct ref prop passing works

## Open Questions

Things that couldn't be fully resolved:

1. **Production API Key Security**
   - What we know: BYOAK works for MVP, exposes key in browser
   - What's unclear: Timeline for adding backend proxy
   - Recommendation: Document tradeoff, plan Phase 7 or future milestone for backend

2. **Conversation Persistence Scope**
   - What we know: Can persist with Zustand middleware
   - What's unclear: Should conversations persist per-manager or globally? Across sessions?
   - Recommendation: Start with session-only (no persist), add localStorage in v2 if users request

3. **Context Data Selection**
   - What we know: Can include manager data, feedback samples in context
   - What's unclear: Optimal context size vs token cost tradeoff
   - Recommendation: Start minimal (manager summary + 10 recent feedback), expand based on response quality

4. **Error Recovery Mid-Stream**
   - What we know: SDK supports AbortController, can retry
   - What's unclear: UX for partial response recovery
   - Recommendation: On error mid-stream, keep partial text with error indicator, allow retry

5. **Model Selection**
   - What we know: claude-sonnet-4-5 is fast and capable
   - What's unclear: Should user be able to choose model? Cost implications?
   - Recommendation: Default to Sonnet, defer model selection to future enhancement

6. **Rate Limiting**
   - What we know: Anthropic has rate limits per API key
   - What's unclear: How to handle rate limit errors gracefully
   - Recommendation: Catch 429 errors, show "please wait" message with retry timer

## Sources

### Primary (HIGH confidence)
- [Anthropic TypeScript SDK](https://github.com/anthropics/anthropic-sdk-typescript) - Official SDK, streaming patterns, browser support
- [Claude API Streaming Documentation](https://platform.claude.com/docs/en/api/messages-streaming) - Event types, response format
- [Zustand Persist Middleware](https://zustand.docs.pmnd.rs/middlewares/persist) - localStorage integration

### Secondary (MEDIUM confidence)
- [AI SDK Anthropic Provider](https://ai-sdk.dev/providers/ai-sdk-providers/anthropic) - Alternative approach with useChat hook
- [Anthropic CORS Support Announcement](https://simonwillison.net/2024/Aug/23/anthropic-dangerous-direct-browser-access/) - Browser access pattern
- [Building AI Apps with React and Node](https://www.nucamp.co/blog/building-ai-powered-apps-in-2026-integrating-openai-and-claude-apis-with-react-and-node) - Architecture best practices

### Tertiary (LOW confidence)
- WebSearch results for React chat patterns 2026 - General ecosystem confirmation
- WebSearch results for SSE streaming React - Implementation patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Anthropic SDK, well-documented APIs
- Architecture: HIGH - Follows existing Zustand patterns in codebase, proven streaming approach
- Pitfalls: MEDIUM - Based on SDK docs and common issues, some from training data
- Code examples: HIGH - Based on official SDK examples and existing codebase patterns

**Research date:** 2026-01-26
**Valid until:** 30 days (API versions update frequently, SDK may change)
