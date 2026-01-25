// AppLayout - Gong-style layout with sidebar, header, and main content area
import { Outlet } from 'react-router';
import { Sidebar } from '@/components/navigation';
import { AskInput } from '@/components/input';

export function AppLayout() {
  const handleAskSubmit = (question) => {
    console.log('Question submitted:', question);
    alert(`You asked: "${question}"\n\nChat feature coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Gong-style Sidebar */}
      <Sidebar />

      {/* Main Content Area - offset for sidebar */}
      <div className="flex-1 ml-20">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 h-14 flex items-center justify-between">
            {/* Left: Logo and Nav */}
            <div className="flex items-center gap-8">
              <span className="text-xl font-bold text-gong-purple">Coaching Intelligence</span>
              <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
                <a href="#" className="hover:text-gray-900">Home</a>
                <a href="#" className="hover:text-gray-900 flex items-center gap-1">
                  Assists
                  <span className="text-[10px] bg-gong-purple text-white px-1.5 py-0.5 rounded">BETA</span>
                </a>
                <a href="#" className="hover:text-gray-900">Conversations</a>
                <a href="#" className="hover:text-gray-900">Deals</a>
                <a href="#" className="text-gong-purple font-semibold border-b-2 border-gong-purple pb-4 -mb-[17px]">
                  Coaching
                  <span className="ml-1 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded">NEW</span>
                </a>
                <a href="#" className="hover:text-gray-900">Insights</a>
                <a href="#" className="hover:text-gray-900">Activity</a>
              </nav>
            </div>

            {/* Right: Search and User */}
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gong-purple rounded-lg px-3 py-1.5">
                <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent text-white placeholder-white/70 text-sm ml-2 w-32 focus:outline-none"
                />
              </div>
              <span className="text-sm text-gray-600">Phil Colbey</span>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button className="bg-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-lg flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 pb-24">
          <Outlet />
        </main>

        {/* Pinned AskInput footer */}
        <div className="fixed bottom-0 left-20 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
          <div className="px-6 py-3">
            <AskInput
              onSubmit={handleAskSubmit}
              placeholder="Ask anything about your team..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
