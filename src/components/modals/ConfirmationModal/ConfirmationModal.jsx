/**
 * ConfirmationModal - Modal for confirming manager actions
 *
 * Shows action title, next 1:1 date, editable topic field, and sources.
 * For send_summary action, displays the full summary text.
 * Triggers success toast on confirmation.
 */
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useModalStore } from '@/stores';
import { getSummaryByManager } from '@/data';
import { Modal } from '../Modal';

// Action type to display label mapping
const actionLabels = {
  add_1on1: 'Add to 1:1 Agenda',
  send_summary: 'Send Coaching Summary',
  recognize: 'Send Recognition',
  flag_hr: 'Flag for HR Review'
};

// Default topic suggestions per action type
const defaultTopics = {
  add_1on1: 'Review coaching metrics',
  send_summary: 'Weekly coaching summary',
  recognize: 'Great coaching this week!',
  flag_hr: 'Coaching concern - review needed'
};

export function ConfirmationModal() {
  // Subscribe to confirmation modal state
  const isOpen = useModalStore(state => state.confirmationModal.isOpen);
  const action = useModalStore(state => state.confirmationModal.action);
  const managerName = useModalStore(state => state.confirmationModal.managerName);
  const managerId = useModalStore(state => state.confirmationModal.managerId);
  const sources = useModalStore(state => state.confirmationModal.sources);
  const closeConfirmationModal = useModalStore(state => state.closeConfirmationModal);

  // Get summary if send_summary or add_1on1 action
  const summary = managerId && (action === 'send_summary' || action === 'add_1on1') ? getSummaryByManager(managerId) : null;

  // Local state
  const [topic, setTopic] = useState('');
  const nextDate = 'Tuesday, Jan 28'; // Static for MVP

  // Reset topic when modal opens with new action
  useEffect(() => {
    if (isOpen && action) {
      setTopic(defaultTopics[action] || '');
    }
  }, [isOpen, action]);

  const handleConfirm = () => {
    console.log('Action confirmed:', { action, managerName, topic, sources });
    const label = actionLabels[action] || action;
    toast.success(`${label} completed for ${managerName}`);
    closeConfirmationModal();
  };

  const handleCancel = () => {
    closeConfirmationModal();
  };

  if (!isOpen) return null;

  const title = `${actionLabels[action] || action} for ${managerName}`;

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} ariaLabel={title}>
      <div className="p-6">
        {/* Header */}
        <h2 className="text-lg font-semibold text-foreground mb-6">{title}</h2>

        {/* Next 1:1 Date - read-only */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Next 1:1
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm text-foreground">
            {nextDate}
          </div>
        </div>

        {/* Topic - editable */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Enter topic..."
          />
        </div>

        {/* Summary Text - for send_summary and add_1on1 actions */}
        {(action === 'send_summary' || action === 'add_1on1') && summary && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Coaching Summary
            </label>
            <div className="px-3 py-3 bg-gray-50 border border-border rounded-lg text-sm text-foreground max-h-64 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">{summary.headline}</p>
                </div>
                {summary.sections && (
                  <>
                    <div>
                      <p className="font-medium mb-1">{summary.sections.effort?.title}</p>
                      <p className="text-gray-600">{summary.sections.effort?.detail}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">{summary.sections.trend?.title}</p>
                      <p className="text-gray-600">{summary.sections.trend?.detail}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">{summary.sections.distribution?.title}</p>
                      <p className="text-gray-600">{summary.sections.distribution?.detail}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">{summary.sections.feedback_quality?.title}</p>
                      <p className="text-gray-600">{summary.sections.feedback_quality?.detail}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sources - conditional */}
        {sources && sources.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Sources
            </label>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, index) => (
                <span
                  key={index}
                  className="font-mono text-xs px-2 py-1 bg-gray-100 text-muted-foreground rounded"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium bg-foreground text-white rounded-lg hover:bg-foreground/90 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}
