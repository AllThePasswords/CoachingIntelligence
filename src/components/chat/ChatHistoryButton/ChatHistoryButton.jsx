// ChatHistoryButton - Shows list of past chat sessions for a manager
import { useState } from 'react';
import { useChatStore } from '@/stores';

// Format relative time (e.g., "2h ago", "Yesterday")
const formatRelativeTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
};

// Stable empty array to prevent re-renders
const EMPTY_ARRAY = [];

/**
 * Button that shows list of chat sessions for a specific manager
 * @param {Object} props
 * @param {string} props.managerId - The manager ID to show chat history for
 * @param {Function} props.onSessionSelect - Callback when a session is selected
 */
export function ChatHistoryButton({ managerId, onSessionSelect }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const chatKey = managerId || 'team';

  // Get sessions from store
  const chatHistory = useChatStore((s) => s.chatHistories[chatKey]);
  const sessions = chatHistory?.sessions ?? EMPTY_ARRAY;
  const activeSessionId = chatHistory?.activeSessionId;
  const setActiveSession = useChatStore((s) => s.setActiveSession);
  const startNewSession = useChatStore((s) => s.startNewSession);
  const deleteSession = useChatStore((s) => s.deleteSession);

  const sessionCount = sessions.length;

  if (sessionCount === 0) {
    return null;
  }

  const handleSelectSession = (sessionId) => {
    setActiveSession(managerId, sessionId);
    onSessionSelect?.(sessionId);
    setIsExpanded(false);
  };

  const handleNewChat = (e) => {
    e.stopPropagation();
    startNewSession(managerId);
    setIsExpanded(false);
  };

  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    if (window.confirm('Delete this conversation?')) {
      deleteSession(managerId, sessionId);
    }
  };

  return (
    <div className="mb-4">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
      >
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <svg
          className="w-4 h-4 text-gray-400 group-hover:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
          />
        </svg>
        <span>
          Chat History
          <span className="ml-1.5 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
            {sessionCount}
          </span>
        </span>
      </button>

      {/* Session List */}
      {isExpanded && (
        <div className="mt-3 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New conversation
          </button>

          {/* Session List */}
          <div className="max-h-64 overflow-y-auto">
            {sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const messageCount = session.messages.length;

              return (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors group ${
                    isActive
                      ? 'bg-violet/5 border-l-2 border-violet'
                      : 'hover:bg-gray-100 border-l-2 border-transparent'
                  }`}
                >
                  {/* Session Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${isActive ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                      {session.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {messageCount} message{messageCount !== 1 ? 's' : ''} · {formatRelativeTime(session.updatedAt)}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                    title="Delete conversation"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
