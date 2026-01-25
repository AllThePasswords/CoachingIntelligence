// AppLayout - Shared layout with header, Outlet, and pinned AskInput footer
// Wraps all pages via React Router's layout route pattern
import { Outlet } from 'react-router';
import { AskInput } from '@/components/input';

export function AppLayout() {
  const handleAskSubmit = (question) => {
    // Phase 3: Log question, chat functionality comes in later phase
    console.log('Question submitted:', question);
    alert(`You asked: "${question}"\n\nChat feature coming soon!`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* App header - shared across all pages */}
      <header className="sticky top-0 z-40 bg-background-100 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <h1 className="text-xl font-semibold tracking-tight">
            Coaching Intelligence
          </h1>
        </div>
      </header>

      {/* Page content renders here */}
      <main className="pb-24">
        <Outlet />
      </main>

      {/* Pinned AskInput footer */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-background-100 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <AskInput
            onSubmit={handleAskSubmit}
            placeholder="Ask anything about your team..."
          />
        </div>
      </div>
    </div>
  );
}
