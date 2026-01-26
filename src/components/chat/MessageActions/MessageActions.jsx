// MessageActions - Contextual action buttons based on AI response content (ASK-07)
import { useState } from 'react';
import { toast } from 'sonner';
import { useModalStore } from '@/stores';

// Manager names to detect for "Add to 1:1" action
const MANAGER_NAMES = ['Sarah Chen', 'Marcus Jones', 'Jennifer Walsh', 'David Park'];
const MANAGER_PATTERN = new RegExp(MANAGER_NAMES.map(n => n.replace(' ', '\\s+')).join('|'), 'i');

/**
 * Action buttons that appear based on message content
 * @param {Object} props
 * @param {string} props.content - Message content to analyze
 * @param {string} props.messageId - Unique message ID
 */
export function MessageActions({ content, messageId }) {
  const [copied, setCopied] = useState(false);
  const openConfirmationModal = useModalStore((s) => s.openConfirmationModal);

  // Guard against empty/undefined content
  if (!content) {
    return null;
  }

  // Detect actionable content
  const managerMatch = content.match(MANAGER_PATTERN);
  const hasManagerMention = !!managerMatch;
  const mentionedManager = managerMatch ? managerMatch[0] : null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleAddTo1on1 = () => {
    // Open confirmation modal with the mentioned manager as context
    // API: openConfirmationModal(action, managerName, sources)
    openConfirmationModal('add_1on1', mentionedManager, []);
  };

  return (
    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
      {/* Copy button - always visible */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors focus-ring"
        aria-label="Copy response"
      >
        {copied ? (
          <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>

      {/* Add to 1:1 - only when manager mentioned */}
      {hasManagerMention && (
        <button
          onClick={handleAddTo1on1}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors focus-ring"
          aria-label={`Add to 1:1 with ${mentionedManager}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Add to 1:1</span>
        </button>
      )}
    </div>
  );
}
