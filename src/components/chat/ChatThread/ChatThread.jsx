// ChatThread - Conversation thread container with auto-scroll
// Renders messages, streaming indicator, suggestions, and errors
import { useRef, useEffect, useMemo } from 'react';
import { ChatMessage } from '../ChatMessage';
import { FollowUpSuggestions } from '../FollowUpSuggestions';
import { ChatMessageSkeleton } from '@/components/feedback';
import { useChatStore } from '@/stores';

// Stable empty array to prevent re-renders
const EMPTY_ARRAY = [];

/**
 * Render conversation thread with messages and suggestions
 * @param {Object} props
 * @param {string} [props.managerId] - Manager ID to show messages for (null for team)
 * @param {Function} props.onSuggestionClick - Callback when suggestion clicked
 */
export function ChatThread({ managerId, onSuggestionClick }) {
  const chatKey = managerId || 'team';
  // Use stable empty array fallback to prevent infinite re-renders
  const chatHistory = useChatStore((state) => state.chatHistories[chatKey]);
  const messages = chatHistory?.messages ?? EMPTY_ARRAY;
  const suggestions = chatHistory?.suggestions ?? EMPTY_ARRAY;
  const activeChat = useChatStore((state) => state.activeChat);
  const streamingContent = useChatStore((state) => state.streamingContent);
  const status = useChatStore((state) => state.status);
  const error = useChatStore((state) => state.error);
  const bottomRef = useRef(null);
  const prevMessageCount = useRef(0);

  // Only show streaming for the active chat context
  const isActiveChat = activeChat === chatKey;

  // Auto-scroll to bottom only when new messages are added (not on initial load)
  useEffect(() => {
    if (messages.length > prevMessageCount.current || (isActiveChat && streamingContent)) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessageCount.current = messages.length;
  }, [messages, streamingContent, isActiveChat]);

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Existing messages */}
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {/* Streaming message (assistant typing) - only show for active chat */}
      {isActiveChat && status === 'streaming' && streamingContent && (
        <ChatMessage
          message={{
            id: 'streaming',
            role: 'assistant',
            content: streamingContent,
          }}
          isStreaming
        />
      )}

      {/* Loading skeleton - shown while waiting for streaming to begin */}
      {isActiveChat && status === 'loading' && <ChatMessageSkeleton />}

      {/* Follow-up suggestions */}
      {status === 'idle' && suggestions.length > 0 && (
        <FollowUpSuggestions
          suggestions={suggestions}
          onClick={onSuggestionClick}
        />
      )}

      {/* Error display - only show for active chat */}
      {isActiveChat && status === 'error' && error && (
        <div className="text-error text-sm bg-red-50 p-3 rounded-lg border border-red-200">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
