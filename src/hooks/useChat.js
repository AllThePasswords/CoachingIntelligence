// Custom hook for Claude API chat with streaming
// Wraps Anthropic SDK and manages conversation state
import { useCallback } from 'react';
import { useChatStore, useSettingsStore } from '@/stores';
import { createClaudeClient, SYSTEM_PROMPT } from '@/lib/claude';
import { managers, feedbackLog, getSummaryByManager } from '@/data';

/**
 * Build context string from coaching data for Claude
 * @param {string|null} managerId - Optional manager ID for detailed context
 * @returns {string} Context string with manager and feedback data
 */
const buildContext = (managerId = null) => {
  // Manager overview
  const managerData = managers.map((m) => ({
    id: m.id,
    name: m.name,
    region: m.region,
    quota_attainment: m.quota_attainment,
    coaching_score: m.coaching_score,
    trend: m.trend,
    summary: m.summary,
  }));

  let context = `## Manager Overview\n${JSON.stringify(managerData, null, 2)}\n\n`;

  // Add detailed summary if specific manager requested
  if (managerId) {
    const summary = getSummaryByManager(managerId);
    if (summary) {
      context += `## Detailed Summary for ${summary.manager_name}\n`;
      context += JSON.stringify(summary.sections, null, 2);
      context += '\n\n';
    }
  }

  // Add recent feedback samples for citation context
  const recentFeedback = feedbackLog.slice(0, 10).map((f) => ({
    call_id: f.call_id,
    manager: f.manager_name,
    ae: f.ae_name,
    date: f.date,
    feedback: f.feedback?.substring(0, 100),
  }));
  context += `## Recent Feedback (cite using [-> CALL-XXXX])\n`;
  context += JSON.stringify(recentFeedback, null, 2);

  return context;
};

/**
 * Extract follow-up suggestions from Claude's response
 * @param {string} content - Full response text
 * @returns {string[]} Array of suggestion strings
 */
const extractSuggestions = (content) => {
  const suggestionMatch = content.match(
    /follow-up questions?:?\s*\n([\s\S]*?)(?:\n\n|$)/i
  );

  if (!suggestionMatch) return [];

  return suggestionMatch[1]
    .split('\n')
    .map((s) => s.replace(/^[-•*\d.)\s]+/, '').trim())
    .filter((s) => s.length > 10 && s.endsWith('?'))
    .slice(0, 3);
};

/**
 * Custom hook for Claude chat functionality
 * @param {string|null} managerId - Optional manager ID for context
 * @returns {Object} Chat state and actions
 */
// Stable empty array to prevent re-renders
const EMPTY_ARRAY = [];

export const useChat = (managerId = null) => {
  const apiKey = useSettingsStore((s) => s.apiKey);
  // Use stable selectors with stable empty array fallback
  const chatKey = managerId || 'team';
  const chatHistory = useChatStore((s) => s.chatHistories[chatKey]);
  const activeSessionId = chatHistory?.activeSessionId;
  const activeSession = chatHistory?.sessions?.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages ?? EMPTY_ARRAY;
  const suggestions = activeSession?.suggestions ?? EMPTY_ARRAY;
  const streamingContent = useChatStore((s) => s.streamingContent);
  const status = useChatStore((s) => s.status);
  const error = useChatStore((s) => s.error);
  const addUserMessage = useChatStore((s) => s.addUserMessage);
  const startStreaming = useChatStore((s) => s.startStreaming);
  const appendStreamingContent = useChatStore((s) => s.appendStreamingContent);
  const completeStreaming = useChatStore((s) => s.completeStreaming);
  const setError = useChatStore((s) => s.setError);
  const clearConversation = useChatStore((s) => s.clearConversation);
  const startNewSession = useChatStore((s) => s.startNewSession);

  const sendMessage = useCallback(
    async (userContent) => {
      if (!apiKey) {
        setError(new Error('Please enter your Anthropic API key'));
        return;
      }

      // Pass managerId for per-manager history
      addUserMessage(userContent, managerId);

      try {
        const client = createClaudeClient(apiKey);
        const context = buildContext(managerId);

        // Build conversation history for multi-turn from per-manager messages
        const currentMessages = useChatStore.getState().getMessages(managerId);
        const conversationMessages = currentMessages.slice(0, -1).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        // Add current user message with context prepended
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

        // Extract suggestions from completed response
        const finalContent = useChatStore.getState().streamingContent;
        const extractedSuggestions = extractSuggestions(finalContent);

        // Pass managerId for per-manager history
        completeStreaming(extractedSuggestions, managerId);
      } catch (err) {
        setError(err);
      }
    },
    [
      apiKey,
      managerId,
      addUserMessage,
      startStreaming,
      appendStreamingContent,
      completeStreaming,
      setError,
    ]
  );

  // Wrap clearConversation to pass managerId
  const clearManagerConversation = useCallback(() => {
    clearConversation(managerId);
  }, [clearConversation, managerId]);

  // Start new session for this manager
  const newSession = useCallback(() => {
    startNewSession(managerId);
  }, [startNewSession, managerId]);

  return {
    messages,
    streamingContent,
    status,
    error,
    suggestions,
    sendMessage,
    clearConversation: clearManagerConversation,
    startNewSession: newSession,
    isReady: !!apiKey,
  };
};
