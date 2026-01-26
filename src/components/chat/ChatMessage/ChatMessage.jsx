// ChatMessage - Individual message bubble for user or assistant
// Renders different styles based on message role
import { MessageContent } from '../MessageContent';
import { MessageActions } from '../MessageActions';

/**
 * Render a single chat message
 * @param {Object} props
 * @param {Object} props.message - Message object with role, content
 * @param {boolean} props.isStreaming - Whether this message is currently streaming
 */
export function ChatMessage({ message, isStreaming = false }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] p-4 ${
          isUser
            ? 'bg-gray-100 text-foreground rounded-2xl rounded-br-md border border-gray-200'
            : 'bg-white border border-border shadow-sm rounded-lg'
        } ${isStreaming ? 'animate-pulse' : ''}`}
      >
        {isUser ? (
          <p className="text-sm">{message.content}</p>
        ) : (
          <MessageContent content={message.content} />
        )}
        {message.role === 'assistant' && !isStreaming && (
          <MessageActions content={message.content} messageId={message.id} />
        )}
      </div>
    </div>
  );
}
