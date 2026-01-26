/**
 * ActionMenu - Dropdown menu for manager actions
 *
 * Pure React implementation with outside click handling
 * Opens ConfirmationModal via modal store on action click
 */
import { useState, useRef, useEffect } from 'react';
import { useModalStore } from '@/stores';

const defaultActions = [
  { id: 'add_1on1', label: 'Add to 1:1', icon: 'calendar' },
  { id: 'send_summary', label: 'Send summary', icon: 'mail' },
  { id: 'recognize', label: 'Recognize', icon: 'star' },
  { id: 'flag_hr', label: 'Flag for HR', icon: 'alert-triangle' }
];

export function ActionMenu({ managerName, onAction, sources = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const openConfirmationModal = useModalStore(state => state.openConfirmationModal);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action) => {
    console.log(`Action: ${action.id} for ${managerName}`);
    openConfirmationModal(action.id, managerName, sources);

    if (onAction) {
      onAction(action);
    }
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        Actions
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-1 z-50">
          {defaultActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
