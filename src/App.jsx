import { Badge, TrendArrow, Tooltip, InfoIcon } from '@/components/ui';
import { MetricDisplay, Citation } from '@/components/display';
import { TimeframeToggle, AskInput } from '@/components/input';
import { ManagerCard } from '@/components/cards';
import { InsightSection } from '@/components/sections';
import { useTimeframeStore } from '@/stores';

function App() {
  const timeframe = useTimeframeStore(state => state.timeframe);

  const handleAskSubmit = (question) => {
    console.log('Question submitted:', question);
    alert(`You asked: "${question}"`);
  };

  const handleCardClick = (managerId) => {
    console.log('Card clicked:', managerId);
    alert(`Navigate to manager: ${managerId}`);
  };

  const handleCitationClick = (id) => {
    console.log('Citation clicked:', id);
    alert(`Open citation modal for: ${id}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-16">
      {/* Header */}
      <header className="mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-3">
          Component Library Demo
        </h1>
        <p className="text-gray-500 text-lg">
          Phase 2 Verification — All components working together
        </p>
      </header>

      {/* Timeframe Control */}
      <section className="mb-16">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
          Timeframe Control (Zustand)
        </h2>
        <div className="bg-background-100 border border-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <TimeframeToggle />
            <span className="text-gray-500">
              Current: <strong className="text-foreground">{timeframe} days</strong>
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Changing timeframe updates all ManagerCards below automatically
          </p>
        </div>
      </section>

      {/* Atomic Components */}
      <section className="mb-16">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
          Atomic Components
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Badges */}
          <div className="bg-background-100 border border-border rounded-lg p-6">
            <h3 className="text-foreground font-medium mb-4">Badge</h3>
            <div className="flex flex-wrap gap-3">
              <Badge trend="improving" />
              <Badge trend="declining" />
              <Badge trend="steady" />
            </div>
          </div>

          {/* Trend Arrows */}
          <div className="bg-background-100 border border-border rounded-lg p-6">
            <h3 className="text-foreground font-medium mb-4">TrendArrow</h3>
            <div className="flex gap-4">
              <span className="text-success"><TrendArrow direction="up" /></span>
              <span className="text-error"><TrendArrow direction="down" /></span>
              <span className="text-foreground"><TrendArrow direction="steady" /></span>
            </div>
          </div>

          {/* Tooltip */}
          <div className="bg-background-100 border border-border rounded-lg p-6">
            <h3 className="text-foreground font-medium mb-4">Tooltip</h3>
            <Tooltip content="This is a tooltip message">
              <span className="text-gray-500 cursor-help flex items-center gap-1">
                Hover me <InfoIcon />
              </span>
            </Tooltip>
          </div>
        </div>
      </section>

      {/* Display Components */}
      <section className="mb-16">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
          Display Components
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* MetricDisplay */}
          <div className="bg-background-100 border border-border rounded-lg p-6">
            <h3 className="text-foreground font-medium mb-4">MetricDisplay</h3>
            <div className="flex gap-8">
              <MetricDisplay label="Attainment" value={112} tooltip="Team quota attainment" />
              <MetricDisplay label="Coaching" value={97} tooltip="Coaching score" />
              <MetricDisplay label="Count" value={45} unit="" />
            </div>
          </div>

          {/* Citation */}
          <div className="bg-background-100 border border-border rounded-lg p-6">
            <h3 className="text-foreground font-medium mb-4">Citation</h3>
            <div className="flex gap-3">
              <Citation id="CALL-1042" onClick={handleCitationClick} />
              <Citation id="CALL-1089" onClick={handleCitationClick} />
            </div>
          </div>
        </div>
      </section>

      {/* Input Components */}
      <section className="mb-16">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
          Input Components
        </h2>
        <div className="bg-background-100 border border-border rounded-lg p-6">
          <h3 className="text-foreground font-medium mb-4">AskInput</h3>
          <AskInput onSubmit={handleAskSubmit} />
        </div>
      </section>

      {/* Manager Cards */}
      <section className="mb-16">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
          Manager Cards (Timeframe: {timeframe} days)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ManagerCard managerId="MGR001" onClick={handleCardClick} />
          <ManagerCard managerId="MGR002" onClick={handleCardClick} variant="shadow" />
          <ManagerCard managerId="MGR003" onClick={handleCardClick} />
          <ManagerCard managerId="MGR004" onClick={handleCardClick} variant="shadow" />
        </div>
      </section>

      {/* Insight Section */}
      <section className="mb-16">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
          Insight Sections
        </h2>
        <div className="space-y-4">
          <InsightSection title="Coaching Investment" rating="improving">
            <p className="text-gray-600">
              Manager has increased coaching sessions by 23% compared to previous period.
              Focus areas include discovery calls and negotiation skills.
            </p>
          </InsightSection>
          <InsightSection title="Rep Distribution" rating="declining">
            <p className="text-gray-600">
              Coaching is concentrated on top performers. Junior reps receiving 40% less
              attention than recommended baseline.
            </p>
          </InsightSection>
          <InsightSection title="Feedback Quality">
            <p className="text-gray-600">
              Feedback quality remains consistent. No rating badge when rating prop not provided.
            </p>
          </InsightSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm pt-8 border-t border-border">
        Phase 2 Component Library — Ready for Dashboard (Phase 3)
      </footer>
    </div>
  );
}

export default App;
