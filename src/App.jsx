import {
  managers,
  getManagerById,
  aes,
  getAEsByManager,
  feedbackLog,
  timeframes,
  getTimeframeData,
  isValidCitationId,
  lookupCitation,
  extractCitations
} from './data';

// Trend Icons (inline SVG for now, would be extracted to components)
const TrendUp = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12L7 8L9 10L13 4" />
    <path d="M10 4H13V7" />
  </svg>
);

const TrendDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4L7 8L9 6L13 12" />
    <path d="M10 12H13V9" />
  </svg>
);

const TrendSteady = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8H13" />
    <path d="M10 5L13 8L10 11" />
  </svg>
);

// Info icon for tooltips
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="7" />
    <path d="M8 11V8" />
    <path d="M8 5h.01" />
  </svg>
);

// Tooltip component
const Tooltip = ({ children, content }) => (
  <span className="relative group inline-flex items-center">
    {children}
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background-100 text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
      {content}
      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground"></span>
    </span>
  </span>
);

function App() {
  // Get data for display
  const timeframe30 = getTimeframeData("30");
  const davidTeam = getAEsByManager("MGR004");
  const sarahData = timeframe30.managers.MGR001;

  // Citation tests
  const validCitation = isValidCitationId("CALL-1042");
  const invalidShort = isValidCitationId("CALL-42");
  const invalidCase = isValidCitationId("call-1042");

  // Lookup test
  const citationLookup = lookupCitation("CALL-1042");

  // Extraction test
  const testText = "In CALL-1042 the AE showed strong negotiation skills, similar to what we saw in CALL-1089.";
  const extractedCitations = extractCitations(testText);

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-16">
      {/* Header */}
      <header className="mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-3">
          Coaching Intelligence
        </h1>
        <p className="text-gray-500 text-lg">
          Phase 1 Foundation Verification
        </p>
      </header>

      {/* Typography Section */}
      <section className="mb-16">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
          Typography
        </h2>
        <div className="bg-background-100 border border-border rounded-lg p-8">
          <p className="text-foreground text-lg mb-6 leading-relaxed">
            This body text uses <strong>Geist Sans</strong> — a clean, modern sans-serif font
            designed for readability and precision.
          </p>
          <p className="text-gray-500 mb-6">
            Secondary text in a muted tone for supporting information.
          </p>
          <div className="flex items-center gap-4">
            <code className="font-mono text-foreground px-4 py-2 bg-gray-100 rounded border border-border">
              CALL-1042
            </code>
            <span className="text-gray-500 text-sm">
              Geist Mono for citations and code
            </span>
          </div>
        </div>
      </section>

      {/* Color System Section */}
      <section className="mb-16">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
          Color System
        </h2>

        {/* Gray Scale */}
        <div className="bg-background-100 border border-border rounded-lg p-8 mb-4">
          <h3 className="text-foreground font-medium mb-6">Gray Scale</h3>
          <div className="flex gap-3">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded bg-gray-100"></div>
              <span className="text-xs text-gray-500">100</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded bg-gray-200"></div>
              <span className="text-xs text-gray-500">200</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded bg-gray-300"></div>
              <span className="text-xs text-gray-500">300</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded bg-gray-400"></div>
              <span className="text-xs text-gray-500">400</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded bg-gray-500"></div>
              <span className="text-xs text-gray-500">500</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded bg-gray-600"></div>
              <span className="text-xs text-gray-500">600</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded bg-gray-700"></div>
              <span className="text-xs text-gray-500">700</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded bg-gray-100"></div>
              <span className="text-xs text-gray-500">800</span>
            </div>
          </div>
        </div>

        {/* Status Colors */}
        <div className="bg-background-100 border border-border rounded-lg p-8">
          <h3 className="text-foreground font-medium mb-6">Status Colors</h3>
          <div className="flex flex-wrap gap-4">
            <span className="px-4 py-2 rounded-full bg-success/10 text-success font-medium text-sm">
              Improving (Green)
            </span>
            <span className="px-4 py-2 rounded-full bg-error/10 text-error font-medium text-sm">
              Declining (Red)
            </span>
            <span className="px-4 py-2 rounded-full bg-gray-100 text-foreground font-medium text-sm">
              Steady (Black)
            </span>
          </div>
        </div>
      </section>

      {/* Card Examples Section */}
      <section className="mb-16">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
          Card Components
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manager Card with Border - Increasing Trend */}
          <div className="bg-background-100 border border-border rounded-xl p-5">
            {/* Header row */}
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-base font-semibold text-foreground tracking-tight">Sarah Chen</h3>
                <p className="text-xs text-gray-400 mt-0.5">West Region</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-success/10 text-success">
                <TrendUp />
                Improving
              </span>
            </div>

            {/* Metrics row */}
            <div className="flex gap-8 mb-5">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">Attainment</p>
                  <Tooltip content="Team quota attainment vs. target">
                    <span className="text-gray-300 hover:text-gray-500 cursor-help transition-colors">
                      <InfoIcon />
                    </span>
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-semibold text-foreground tabular-nums">112</span>
                  <span className="text-sm text-gray-400">%</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">Coaching</p>
                  <Tooltip content="Calls reviewed, commented, or scored">
                    <span className="text-gray-300 hover:text-gray-500 cursor-help transition-colors">
                      <InfoIcon />
                    </span>
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-semibold text-foreground tabular-nums">97</span>
                  <span className="text-sm text-gray-400">%</span>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <p className="text-[13px] text-gray-500 leading-relaxed mb-5">
              Top performer with consistent coaching engagement across all reps.
            </p>

            {/* Primary Button - Geist style */}
            <button className="h-10 px-4 bg-foreground text-background-100 rounded-md text-sm font-medium transition-all hover:bg-gray-700 active:scale-[0.98]">
              View Details
            </button>
          </div>

          {/* Manager Card with Shadow - Declining Trend */}
          <div className="bg-background-100 rounded-xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            {/* Header row */}
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-base font-semibold text-foreground tracking-tight">David Park</h3>
                <p className="text-xs text-gray-400 mt-0.5">East Region</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-error/10 text-error">
                <TrendDown />
                Declining
              </span>
            </div>

            {/* Metrics row */}
            <div className="flex gap-8 mb-5">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">Attainment</p>
                  <Tooltip content="Team quota attainment vs. target">
                    <span className="text-gray-300 hover:text-gray-500 cursor-help transition-colors">
                      <InfoIcon />
                    </span>
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-semibold text-foreground tabular-nums">67</span>
                  <span className="text-sm text-gray-400">%</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">Coaching</p>
                  <Tooltip content="Calls reviewed, commented, or scored">
                    <span className="text-gray-300 hover:text-gray-500 cursor-help transition-colors">
                      <InfoIcon />
                    </span>
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-semibold text-foreground tabular-nums">34</span>
                  <span className="text-sm text-gray-400">%</span>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <p className="text-[13px] text-gray-500 leading-relaxed mb-5">
              Declining engagement with 2 reps at risk of missing quota.
            </p>

            {/* Secondary Button - Geist style */}
            <button className="h-10 px-4 border border-border text-foreground rounded-md text-sm font-medium transition-all hover:bg-gray-100 hover:border-gray-300 active:scale-[0.98]">
              View Details
            </button>
          </div>

          {/* Manager Card - Steady Trend */}
          <div className="bg-background-100 border border-border rounded-xl p-5">
            {/* Header row */}
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-base font-semibold text-foreground tracking-tight">Michael Rodriguez</h3>
                <p className="text-xs text-gray-400 mt-0.5">Central Region</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-foreground">
                <TrendSteady />
                Steady
              </span>
            </div>

            {/* Metrics row */}
            <div className="flex gap-8 mb-5">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">Attainment</p>
                  <Tooltip content="Team quota attainment vs. target">
                    <span className="text-gray-300 hover:text-gray-500 cursor-help transition-colors">
                      <InfoIcon />
                    </span>
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-semibold text-foreground tabular-nums">89</span>
                  <span className="text-sm text-gray-400">%</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">Coaching</p>
                  <Tooltip content="Calls reviewed, commented, or scored">
                    <span className="text-gray-300 hover:text-gray-500 cursor-help transition-colors">
                      <InfoIcon />
                    </span>
                  </Tooltip>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-semibold text-foreground tabular-nums">62</span>
                  <span className="text-sm text-gray-400">%</span>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <p className="text-[13px] text-gray-500 leading-relaxed mb-5">
              Maintaining baseline performance. Room for improvement in junior rep coaching.
            </p>

            {/* Tertiary Button - Geist style */}
            <button className="h-10 px-4 text-gray-600 rounded-md text-sm font-medium transition-all hover:bg-gray-100 active:scale-[0.98]">
              View Details
            </button>
          </div>

          {/* Trend Icons Reference */}
          <div className="bg-background-100 border border-border rounded-xl p-5">
            <h3 className="text-base font-semibold text-foreground tracking-tight mb-5">Trend Icons</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-success/10 text-success">
                  <TrendUp />
                </span>
                <span className="text-sm text-gray-600">Improving / Increasing</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-error/10 text-error">
                  <TrendDown />
                </span>
                <span className="text-sm text-gray-600">Declining / Decreasing</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 text-foreground">
                  <TrendSteady />
                </span>
                <span className="text-sm text-gray-600">Steady / No Change</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Layer Section */}
      <section className="mb-16">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
          Data Layer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Managers */}
          <div className="bg-background-100 border border-border rounded-lg p-6">
            <h3 className="text-foreground font-medium mb-4">
              Managers ({managers.length})
            </h3>
            <ul className="space-y-3">
              {managers.map(m => (
                <li key={m.id} className="flex justify-between items-center">
                  <span className="text-gray-500">{m.name}</span>
                  <span className="font-mono text-sm text-foreground">
                    {m.coaching_score}%
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Timeframe Benchmark */}
          <div className="bg-background-100 border border-border rounded-lg p-6">
            <h3 className="text-foreground font-medium mb-4">
              30-Day Benchmark
            </h3>
            <p className="text-4xl font-bold text-foreground mb-2">
              {timeframe30.benchmark}
            </p>
            <p className="text-gray-500 text-sm">
              calls / {timeframe30.working_days} working days
            </p>
          </div>

          {/* Sarah's Score */}
          <div className="bg-background-100 border border-border rounded-lg p-6">
            <h3 className="text-foreground font-medium mb-4">
              Sarah's 30-Day Score
            </h3>
            <p className="text-4xl font-bold text-foreground mb-2">
              {sarahData.coaching_score}%
            </p>
            <p className="text-gray-500 text-sm">
              {sarahData.calls_reviewed} calls reviewed
            </p>
          </div>
        </div>
      </section>

      {/* Citation System Section */}
      <section className="mb-16">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
          Citation System
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Validation Tests */}
          <div className="bg-background-100 border border-border rounded-lg p-6">
            <h3 className="text-foreground font-medium mb-4">Validation</h3>
            <ul className="space-y-3 font-mono text-sm">
              <li className="flex justify-between">
                <span className="text-gray-500">CALL-1042</span>
                <span className={validCitation ? 'text-success' : 'text-error'}>
                  {validCitation ? 'valid' : 'invalid'}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">CALL-42</span>
                <span className={!invalidShort ? 'text-success' : 'text-error'}>
                  {invalidShort ? 'valid' : 'invalid'}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">call-1042</span>
                <span className={!invalidCase ? 'text-success' : 'text-error'}>
                  {invalidCase ? 'valid' : 'invalid'}
                </span>
              </li>
            </ul>
          </div>

          {/* Lookup Test */}
          <div className="bg-background-100 border border-border rounded-lg p-6">
            <h3 className="text-foreground font-medium mb-4">
              Lookup: <code className="font-mono text-foreground">CALL-1042</code>
            </h3>
            {citationLookup && (
              <ul className="space-y-2 text-sm">
                <li className="flex gap-3">
                  <span className="text-gray-500 w-16">Date</span>
                  <span className="text-gray-700">{citationLookup.date}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-500 w-16">AE</span>
                  <span className="text-gray-700">{citationLookup.ae_name}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-500 w-16">Stage</span>
                  <span className="text-gray-700">{citationLookup.pipeline_stage}</span>
                </li>
              </ul>
            )}
          </div>

          {/* Extraction Test */}
          <div className="bg-background-100 border border-border rounded-lg p-6 md:col-span-2">
            <h3 className="text-foreground font-medium mb-4">Extraction</h3>
            <p className="text-gray-500 text-sm mb-4 italic border-l-2 border-gray-200 pl-4">
              "{testText}"
            </p>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm">Found:</span>
              {extractedCitations.map(c => (
                <code key={c} className="font-mono text-sm px-3 py-1 bg-gray-100 rounded text-foreground border border-border">
                  {c}
                </code>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* David's Team Table */}
      <section className="mb-16">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
          David Park's Team
        </h2>
        <div className="bg-background-100 border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-6 font-medium text-gray-500">AE Name</th>
                <th className="text-right py-4 px-6 font-medium text-gray-500">Quota %</th>
                <th className="text-right py-4 px-6 font-medium text-gray-500">Calls Coached</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">Flag</th>
              </tr>
            </thead>
            <tbody>
              {davidTeam.map(ae => (
                <tr key={ae.id} className="border-b border-border last:border-b-0 hover:bg-gray-100 transition-colors">
                  <td className="py-4 px-6 text-foreground">{ae.name}</td>
                  <td className="py-4 px-6 text-right font-mono text-gray-500">{ae.quota}%</td>
                  <td className="py-4 px-6 text-right font-mono text-gray-500">{ae.calls_coached}</td>
                  <td className="py-4 px-6">
                    {ae.flag && (
                      <span className={`px-3 py-1 rounded text-xs font-medium ${
                        ae.flag === 'critical'
                          ? 'bg-error/10 text-error'
                          : 'bg-gray-100 text-foreground'
                      }`}>
                        {ae.flag}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-sm pt-8 border-t border-border">
        Phase 1 Foundation Complete
      </footer>
    </div>
  );
}

export default App;
