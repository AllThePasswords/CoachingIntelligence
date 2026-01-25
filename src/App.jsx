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
    <div className="min-h-screen bg-bg-page p-8">
      <h1 className="text-4xl font-bold text-text-primary mb-2">
        Coaching Intelligence
      </h1>
      <p className="text-text-secondary mb-8">
        Phase 1 Foundation Verification Page
      </p>

      {/* Typography Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4 border-b border-border-subtle pb-2">
          Typography (NAV-04)
        </h2>
        <div className="bg-bg-card rounded-lg p-6 border border-border-default">
          <p className="text-text-primary mb-4">
            This body text uses <strong>Geist Sans</strong> - a clean, modern sans-serif font.
            Notice the balanced letter spacing and excellent readability at various sizes.
          </p>
          <p className="text-lg text-text-secondary mb-4">
            Secondary text at a larger size demonstrates the font scales well.
          </p>
          <div className="flex gap-4 items-center">
            <code className="font-mono text-text-primary bg-bg-page px-3 py-2 rounded border border-border-subtle">
              CALL-1042
            </code>
            <span className="text-text-tertiary">
              Monospace text uses <strong>Geist Mono</strong> - distinct character widths for call IDs
            </span>
          </div>
        </div>
      </section>

      {/* Color System Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4 border-b border-border-subtle pb-2">
          Color System (NAV-05)
        </h2>

        {/* Text Colors */}
        <div className="bg-bg-card rounded-lg p-6 border border-border-default mb-4">
          <h3 className="text-lg font-medium text-text-primary mb-4">Text Colors</h3>
          <div className="space-y-2">
            <p className="text-text-primary">Primary Text - text-text-primary (gray-950)</p>
            <p className="text-text-secondary">Secondary Text - text-text-secondary (gray-600)</p>
            <p className="text-text-tertiary">Tertiary Text - text-text-tertiary (gray-400)</p>
          </div>
        </div>

        {/* Status Colors */}
        <div className="bg-bg-card rounded-lg p-6 border border-border-default mb-4">
          <h3 className="text-lg font-medium text-text-primary mb-4">Status Colors</h3>
          <div className="flex flex-wrap gap-4">
            <span className="px-3 py-1 rounded-full bg-status-success/10 text-status-success font-medium">
              Success - Excellent
            </span>
            <span className="px-3 py-1 rounded-full bg-status-warning/10 text-status-warning font-medium">
              Warning - Needs Attention
            </span>
            <span className="px-3 py-1 rounded-full bg-status-error/10 text-status-error font-medium">
              Error - Critical
            </span>
            <span className="px-3 py-1 rounded-full bg-status-info/10 text-status-info font-medium">
              Info - Neutral
            </span>
          </div>
        </div>

        {/* Pink Gradient */}
        <div className="bg-bg-card rounded-lg p-6 border border-border-default">
          <h3 className="text-lg font-medium text-text-primary mb-4">Pink Gradient Accent</h3>
          <div className="flex gap-6 items-center">
            <div className="h-16 w-48 bg-card-gradient rounded-lg shadow-sm"></div>
            <div>
              <p className="text-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Gradient Text Example
              </p>
              <p className="text-text-tertiary text-sm mt-1">
                Pink to purple gradient for emphasis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Layer Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4 border-b border-border-subtle pb-2">
          Data Layer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Managers */}
          <div className="bg-bg-card rounded-lg p-6 border border-border-default">
            <h3 className="text-lg font-medium text-text-primary mb-3">
              Managers ({managers.length})
            </h3>
            <ul className="space-y-2">
              {managers.map(m => (
                <li key={m.id} className="flex justify-between text-sm">
                  <span className="text-text-secondary">{m.name}</span>
                  <span className={`font-mono ${
                    m.coaching_score >= 90 ? 'text-status-success' :
                    m.coaching_score >= 50 ? 'text-status-warning' :
                    'text-status-error'
                  }`}>
                    {m.coaching_score}%
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Timeframe Benchmark */}
          <div className="bg-bg-card rounded-lg p-6 border border-border-default">
            <h3 className="text-lg font-medium text-text-primary mb-3">
              30-Day Benchmark
            </h3>
            <p className="text-3xl font-bold text-text-primary mb-2">
              {timeframe30.benchmark} <span className="text-lg font-normal text-text-tertiary">calls</span>
            </p>
            <p className="text-text-secondary text-sm">
              Working days: {timeframe30.working_days}
            </p>
          </div>

          {/* Sarah's 30-day score */}
          <div className="bg-bg-card rounded-lg p-6 border border-border-default">
            <h3 className="text-lg font-medium text-text-primary mb-3">
              Sarah's 30-Day Score
            </h3>
            <p className="text-3xl font-bold text-status-success mb-2">
              {sarahData.coaching_score}%
            </p>
            <p className="text-text-secondary text-sm">
              Calls reviewed: {sarahData.calls_reviewed}
            </p>
          </div>
        </div>
      </section>

      {/* Citation System Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4 border-b border-border-subtle pb-2">
          Citation System
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Validation Tests */}
          <div className="bg-bg-card rounded-lg p-6 border border-border-default">
            <h3 className="text-lg font-medium text-text-primary mb-3">Validation Tests</h3>
            <ul className="space-y-2 font-mono text-sm">
              <li className="flex justify-between">
                <span className="text-text-secondary">CALL-1042:</span>
                <span className={validCitation ? 'text-status-success' : 'text-status-error'}>
                  {validCitation ? 'valid' : 'invalid'}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-text-secondary">CALL-42:</span>
                <span className={!invalidShort ? 'text-status-success' : 'text-status-error'}>
                  {invalidShort ? 'valid' : 'invalid'}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-text-secondary">call-1042:</span>
                <span className={!invalidCase ? 'text-status-success' : 'text-status-error'}>
                  {invalidCase ? 'valid' : 'invalid'}
                </span>
              </li>
            </ul>
          </div>

          {/* Lookup Test */}
          <div className="bg-bg-card rounded-lg p-6 border border-border-default">
            <h3 className="text-lg font-medium text-text-primary mb-3">
              Lookup: <code className="font-mono bg-bg-page px-2 py-1 rounded">CALL-1042</code>
            </h3>
            {citationLookup && (
              <ul className="space-y-1 text-sm">
                <li className="flex gap-2">
                  <span className="text-text-tertiary">Date:</span>
                  <span className="text-text-secondary">{citationLookup.date.replace('2026-', 'Jan ')}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-tertiary">AE:</span>
                  <span className="text-text-secondary">{citationLookup.ae_name}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-text-tertiary">Stage:</span>
                  <span className="text-text-secondary">{citationLookup.pipeline_stage}</span>
                </li>
              </ul>
            )}
          </div>

          {/* Extraction Test */}
          <div className="bg-bg-card rounded-lg p-6 border border-border-default md:col-span-2">
            <h3 className="text-lg font-medium text-text-primary mb-3">Extraction Test</h3>
            <p className="text-text-secondary text-sm mb-3 italic">
              "{testText}"
            </p>
            <div className="flex gap-2">
              <span className="text-text-tertiary text-sm">Found:</span>
              {extractedCitations.map(c => (
                <code key={c} className="font-mono text-sm bg-bg-page px-2 py-1 rounded text-text-primary">
                  {c}
                </code>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* David's Team Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4 border-b border-border-subtle pb-2">
          David Park's Team (MGR004)
        </h2>
        <div className="bg-bg-card rounded-lg border border-border-default overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-page">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-text-tertiary">AE Name</th>
                <th className="text-right py-3 px-4 font-medium text-text-tertiary">Quota %</th>
                <th className="text-right py-3 px-4 font-medium text-text-tertiary">Calls Coached</th>
                <th className="text-left py-3 px-4 font-medium text-text-tertiary">Flag</th>
              </tr>
            </thead>
            <tbody>
              {davidTeam.map(ae => (
                <tr key={ae.id} className="border-t border-border-subtle">
                  <td className="py-3 px-4 text-text-primary">{ae.name}</td>
                  <td className="py-3 px-4 text-right font-mono text-text-secondary">{ae.quota}%</td>
                  <td className="py-3 px-4 text-right font-mono text-text-secondary">{ae.calls_coached}</td>
                  <td className="py-3 px-4">
                    {ae.flag && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        ae.flag === 'critical'
                          ? 'bg-status-error/10 text-status-error'
                          : 'bg-status-warning/10 text-status-warning'
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
      <footer className="text-center text-text-tertiary text-sm pt-8 border-t border-border-subtle">
        Phase 1 Foundation Complete - Ready for Human Verification
      </footer>
    </div>
  );
}

export default App;
