// AppLayout - Gong-style layout with sidebar, header, and main content area
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Toaster } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';
import { Sidebar } from '@/components/navigation';
import { AskInput } from '@/components/input';
import { CitationModal, ConfirmationModal } from '@/components/modals';
import { ErrorFallback } from '@/components/feedback';
import { useAlertsStore, useSettingsStore, useChatStore } from '@/stores';
import { createClaudeClient, SYSTEM_PROMPT } from '@/lib/claude';
import { managers, feedbackLog, getSummaryByManager, getManagerById } from '@/data';

// Build context string for Claude API
const buildContext = (managerId = null) => {
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

  if (managerId) {
    const summary = getSummaryByManager(managerId);
    if (summary) {
      context += `## Detailed Summary for ${summary.manager_name}\n`;
      context += JSON.stringify(summary.sections, null, 2);
      context += '\n\n';
    }
  }

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

// Extract follow-up suggestions from response
const extractSuggestions = (content) => {
  const match = content.match(/follow-up questions?:?\s*\n([\s\S]*?)(?:\n\n|$)/i);
  if (!match) return [];
  return match[1]
    .split('\n')
    .map((s) => s.replace(/^[-•*\d.)\s]+/, '').trim())
    .filter((s) => s.length > 10 && s.endsWith('?'))
    .slice(0, 3);
};

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const alertsEnabled = useAlertsStore(state => state.alertsEnabled);
  const toggleAlerts = useAlertsStore(state => state.toggleAlerts);

  // Chat state - use selectors for proper reactivity
  const apiKey = useSettingsStore((s) => s.apiKey);
  const addUserMessage = useChatStore((s) => s.addUserMessage);
  const startStreaming = useChatStore((s) => s.startStreaming);
  const appendStreamingContent = useChatStore((s) => s.appendStreamingContent);
  const completeStreaming = useChatStore((s) => s.completeStreaming);
  const setError = useChatStore((s) => s.setError);

  // Get current manager for placeholder text
  const isManagerPage = location.pathname.startsWith('/manager/');
  const currentManagerId = isManagerPage ? location.pathname.split('/').pop() : null;
  const currentManager = currentManagerId ? getManagerById(currentManagerId) : null;
  const askPlaceholder = currentManager
    ? `Ask anything about ${currentManager.name}'s coaching...`
    : 'Ask anything about your team...';

  // Helper function to send question to Claude API
  const sendQuestionToApi = async (question, managerId) => {
    try {
      const currentApiKey = useSettingsStore.getState().apiKey;
      const client = createClaudeClient(currentApiKey);
      const context = buildContext(managerId);

      // Build conversation history from active session
      const chatKey = managerId || 'team';
      const chatHistory = useChatStore.getState().chatHistories[chatKey];
      const activeSessionId = chatHistory?.activeSessionId;
      const activeSession = chatHistory?.sessions?.find((s) => s.id === activeSessionId);
      const currentMessages = activeSession?.messages || [];
      const conversationMessages = currentMessages.slice(0, -1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      conversationMessages.push({
        role: 'user',
        content: `${context}\n\n## User Question\n${question}`,
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

      const finalContent = useChatStore.getState().streamingContent;
      const suggestions = extractSuggestions(finalContent);
      completeStreaming(suggestions, managerId);
    } catch (err) {
      setError(err);
    }
  };

  const handleAskSubmit = async (question) => {
    // Check if on manager detail page
    const isManagerPage = location.pathname.startsWith('/manager/');
    const managerId = isManagerPage ? location.pathname.split('/').pop() : null;

    // Check for API key
    if (!apiKey) {
      if (isManagerPage) {
        alert('Please enter your Anthropic API key in the "Ask Anything" section below.');
      } else {
        alert('Please go to a manager page and enter your Anthropic API key first.');
        navigate('/manager/MGR001');
      }
      return;
    }

    // If on dashboard, navigate to first manager with the question
    if (!isManagerPage) {
      const targetManagerId = 'MGR001';
      navigate(`/manager/${targetManagerId}`);
      // Add user message and send after navigation completes
      setTimeout(() => {
        addUserMessage(question, targetManagerId);
        sendQuestionToApi(question, targetManagerId);
      }, 100);
      return;
    }

    // Send message via Claude API - pass managerId for per-manager history
    addUserMessage(question, managerId);
    sendQuestionToApi(question, managerId);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Gong-style Sidebar */}
      <Sidebar />

      {/* Main Content Area - offset for sidebar */}
      <div className="flex-1 ml-20">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 bg-gong-sidebar border-b border-gong-purple-dark shadow-sm">
          <div className="px-6 h-14 flex items-center justify-between">
            {/* Left: Nav */}
            <div className="flex items-center gap-8">
              <nav className="flex items-center gap-6 text-sm font-medium text-white/80">
                <a href="#" className="hover:text-white">Home</a>
                <a href="#" className="hover:text-white flex items-center gap-1">
                  Assists
                  <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded">BETA</span>
                </a>
                <a href="#" className="hover:text-white">Conversations</a>
                <a href="#" className="hover:text-white">Deals</a>
                <a href="#" className="text-white font-semibold border-b-2 border-white pb-4 -mb-[17px]">
                  Coaching
                  <span className="ml-1 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded">NEW</span>
                </a>
                <a href="#" className="hover:text-white">Insights</a>
                <a href="#" className="hover:text-white">Activity</a>
              </nav>
            </div>

            {/* Right: Search and User */}
            <div className="flex items-center gap-4">
              {/* Alerts Toggle */}
              <button
                onClick={toggleAlerts}
                className="relative flex items-center justify-center w-8 h-8 text-white/80 hover:text-white transition-colors"
                title={alertsEnabled ? 'Disable alerts' : 'Enable alerts'}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {!alertsEnabled && (
                  <svg className="w-5 h-5 absolute inset-0 m-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
              <div className="flex items-center bg-white/10 rounded-lg px-3 py-1.5 border border-white/20">
                <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent text-white placeholder-white/70 text-sm ml-2 w-32 focus:outline-none"
                />
              </div>
              <span className="text-sm text-white/80">Ann Martinez</span>
              <button className="text-white/60 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button className="bg-white/10 text-white text-sm px-3 py-1.5 rounded-lg flex items-center gap-1 border border-white/20 hover:bg-white/20">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 pb-32">
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error, info) => {
              console.error('Page Error:', error);
              console.error('Component Stack:', info?.componentStack);
            }}
            onReset={() => window.location.reload()}
          >
            <Outlet />
          </ErrorBoundary>
        </main>

        {/* Floating AskInput footer */}
        <div className="fixed bottom-6 left-[calc(5rem+1.5rem)] right-6 z-40">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden">
              <AskInput
                onSubmit={handleAskSubmit}
                placeholder={askPlaceholder}
              />
            </div>
          </div>
        </div>
      </div>
      <CitationModal />
      <ConfirmationModal />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
