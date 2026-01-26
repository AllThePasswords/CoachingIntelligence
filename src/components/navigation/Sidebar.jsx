import { NavLink } from 'react-router';

// Icons as simple SVG components
function InboxIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );
}

function MetricsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function ScorecardsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

function CoachingIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );
}

const navItems = [
  { to: '/', icon: InboxIcon, label: 'Inbox', active: true },
  { to: '/metrics', icon: MetricsIcon, label: 'Metrics' },
  { to: '/scorecards', icon: ScorecardsIcon, label: 'Scorecards' },
  { to: '/', icon: CoachingIcon, label: 'Coaching', highlight: true },
];

export function Sidebar() {
  return (
    <aside className="w-20 bg-gong-sidebar min-h-screen flex flex-col items-center py-6 fixed left-0 top-0 z-50">
      {/* Gong Logo - top of sidebar */}
      <div className="mb-8">
        <img src="/Gong_logo.png" alt="Gong" className="h-8 w-auto object-contain" />
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col items-center gap-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${
                item.highlight
                  ? 'bg-gong-purple text-white'
                  : isActive
                  ? 'bg-gong-hover text-white'
                  : 'text-white/60 hover:bg-gong-hover hover:text-white'
              }`
            }
          >
            <item.icon />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
