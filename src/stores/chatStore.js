// Zustand store for chat state management
// Manages per-manager conversation histories with multiple sessions
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper to generate session title from first user message
const generateSessionTitle = (content) => {
  const maxLength = 40;
  const cleaned = content.replace(/\n/g, ' ').trim();
  return cleaned.length > maxLength
    ? cleaned.substring(0, maxLength) + '...'
    : cleaned;
};

export const useChatStore = create(
  persist(
    (set, get) => ({
      // Per-manager chat sessions: { [managerId]: { sessions: [...], activeSessionId: string } }
      // Each session: { id, title, messages: [], suggestions: [], createdAt, updatedAt }
      // 'team' key is used for dashboard-level chat
      chatHistories: {},

      // Current active chat context (managerId or 'team')
      activeChat: null,

      // Streaming state (shared across all chats)
      streamingContent: '',
      status: 'idle', // 'idle' | 'loading' | 'streaming' | 'error'
      error: null,

      // Get active session for a manager
      getActiveSession: (managerId) => {
        const key = managerId || 'team';
        const history = get().chatHistories[key];
        if (!history?.sessions?.length) return null;
        const activeId = history.activeSessionId;
        return history.sessions.find((s) => s.id === activeId) || history.sessions[0];
      },

      // Get all sessions for a manager
      getSessions: (managerId) => {
        const key = managerId || 'team';
        return get().chatHistories[key]?.sessions || [];
      },

      // Get messages for active session
      getMessages: (managerId) => {
        const session = get().getActiveSession(managerId);
        return session?.messages || [];
      },

      // Get suggestions for active session
      getSuggestions: (managerId) => {
        const session = get().getActiveSession(managerId);
        return session?.suggestions || [];
      },

      // Set active chat context
      setActiveChat: (managerId) => set({ activeChat: managerId }),

      // Set active session for a manager
      setActiveSession: (managerId, sessionId) => {
        const key = managerId || 'team';
        set((state) => ({
          chatHistories: {
            ...state.chatHistories,
            [key]: {
              ...state.chatHistories[key],
              activeSessionId: sessionId,
            },
          },
        }));
      },

      // Start a new session for a manager
      startNewSession: (managerId) => {
        const key = managerId || 'team';
        const newSession = {
          id: crypto.randomUUID(),
          title: 'New conversation',
          messages: [],
          suggestions: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          activeChat: key,
          chatHistories: {
            ...state.chatHistories,
            [key]: {
              sessions: [newSession, ...(state.chatHistories[key]?.sessions || [])],
              activeSessionId: newSession.id,
            },
          },
          streamingContent: '',
          status: 'idle',
          error: null,
        }));
        return newSession.id;
      },

      // Add user message to active session
      addUserMessage: (content, managerId) => {
        const key = managerId || 'team';
        const state = get();
        let history = state.chatHistories[key];
        let activeSessionId = history?.activeSessionId;

        // Create new session if none exists
        if (!history?.sessions?.length || !activeSessionId) {
          const newSessionId = get().startNewSession(managerId);
          activeSessionId = newSessionId;
          history = get().chatHistories[key];
        }

        const message = {
          id: crypto.randomUUID(),
          role: 'user',
          content,
          timestamp: Date.now(),
        };

        set((state) => {
          const currentHistory = state.chatHistories[key];
          const sessions = currentHistory.sessions.map((session) => {
            if (session.id !== activeSessionId) return session;
            // Update title from first user message
            const isFirstMessage = session.messages.length === 0;
            return {
              ...session,
              title: isFirstMessage ? generateSessionTitle(content) : session.title,
              messages: [...session.messages, message],
              suggestions: [],
              updatedAt: Date.now(),
            };
          });
          return {
            activeChat: key,
            chatHistories: {
              ...state.chatHistories,
              [key]: { ...currentHistory, sessions },
            },
            status: 'loading',
            error: null,
          };
        });
        return message;
      },

      startStreaming: () => set({
        status: 'streaming',
        streamingContent: '',
      }),

      appendStreamingContent: (text) => set((state) => ({
        streamingContent: state.streamingContent + text,
      })),

      completeStreaming: (suggestions = [], managerId) => {
        const key = managerId || get().activeChat || 'team';
        const content = get().streamingContent;
        const history = get().chatHistories[key];
        const activeSessionId = history?.activeSessionId;

        const message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content,
          timestamp: Date.now(),
        };

        set((state) => {
          const currentHistory = state.chatHistories[key];
          if (!currentHistory?.sessions) return { streamingContent: '', status: 'idle' };

          const sessions = currentHistory.sessions.map((session) => {
            if (session.id !== activeSessionId) return session;
            return {
              ...session,
              messages: [...session.messages, message],
              suggestions,
              updatedAt: Date.now(),
            };
          });
          return {
            chatHistories: {
              ...state.chatHistories,
              [key]: { ...currentHistory, sessions },
            },
            streamingContent: '',
            status: 'idle',
          };
        });
      },

      setError: (error) => set({
        status: 'error',
        error: error.message || String(error),
        streamingContent: '',
      }),

      // Delete a specific session
      deleteSession: (managerId, sessionId) => {
        const key = managerId || 'team';
        set((state) => {
          const currentHistory = state.chatHistories[key];
          if (!currentHistory?.sessions) return state;

          const sessions = currentHistory.sessions.filter((s) => s.id !== sessionId);
          const wasActive = currentHistory.activeSessionId === sessionId;
          const newActiveId = wasActive ? sessions[0]?.id : currentHistory.activeSessionId;

          return {
            chatHistories: {
              ...state.chatHistories,
              [key]: { sessions, activeSessionId: newActiveId },
            },
            streamingContent: '',
            status: 'idle',
            error: null,
          };
        });
      },

      // Clear conversation for a specific manager (backwards compat - clears active session)
      clearConversation: (managerId) => {
        const key = managerId || 'team';
        const history = get().chatHistories[key];
        const activeSessionId = history?.activeSessionId;
        if (activeSessionId) {
          get().deleteSession(managerId, activeSessionId);
        }
      },

      // Clear all conversations
      clearAllConversations: () => set({
        chatHistories: {},
        streamingContent: '',
        status: 'idle',
        error: null,
      }),
    }),
    {
      name: 'coaching-chat-storage',
      partialize: (state) => ({ chatHistories: state.chatHistories }),
    }
  )
);
