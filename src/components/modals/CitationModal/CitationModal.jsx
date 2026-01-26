// CitationModal - Displays call details when clicking a citation
// Shows call ID, date, AE, manager, pipeline stage, duration, coaching activity, and feedback
import { useModalStore } from '@/stores';
import { getCitationDetails } from '@/data';
import { Modal } from '../Modal';

export function CitationModal() {
  const { isOpen, callId } = useModalStore(state => state.citationModal);
  const closeCitationModal = useModalStore(state => state.closeCitationModal);

  const details = callId ? getCitationDetails(callId) : null;

  if (!isOpen || !details) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeCitationModal} ariaLabel={`Call details for ${callId}`}>
      <div className="p-6">
        {/* Header with call ID and close button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold font-mono">{details.callId}</h2>
          <button
            onClick={closeCitationModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Call metadata grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <span className="text-gray-500">Date</span>
            <p className="font-medium">{details.date}</p>
          </div>
          <div>
            <span className="text-gray-500">Duration</span>
            <p className="font-medium">{details.duration} min</p>
          </div>
          <div>
            <span className="text-gray-500">AE</span>
            <p className="font-medium">{details.aeName}</p>
          </div>
          <div>
            <span className="text-gray-500">Manager</span>
            <p className="font-medium">{details.managerName}</p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Pipeline Stage</span>
            <p className="font-medium">{details.pipelineStage}</p>
          </div>
        </div>

        {/* Coaching Activity Checklist */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Coaching Activity</h3>
          <div className="space-y-2">
            {[
              { key: 'listened', label: 'Listened to call' },
              { key: 'attended', label: 'Attended live' },
              { key: 'hasFeedback', label: 'Provided feedback' },
              { key: 'hasComments', label: 'Left comments' },
              { key: 'hasScorecard', label: 'Completed scorecard' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                {details.coachingActivity[key] ? (
                  <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className={details.coachingActivity[key] ? 'text-gray-900' : 'text-gray-400'}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback text (conditional) */}
        {details.feedback && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Feedback</h3>
            <blockquote className="text-gray-700 bg-gray-50 p-4 rounded-lg border-l-4 border-accent">
              {details.feedback}
            </blockquote>
          </div>
        )}

        {/* View Full Call link (mocked for v1) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert('View Full Call - Integration coming in future phase');
          }}
          className="text-sm text-accent hover:underline"
        >
          View Full Call in Gong
        </a>
      </div>
    </Modal>
  );
}
