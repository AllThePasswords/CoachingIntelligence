// Zustand store for modal state management
// Manages Citation Modal and Confirmation Modal states
import { create } from 'zustand';

export const useModalStore = create((set) => ({
  // Citation Modal state
  citationModal: {
    isOpen: false,
    callId: null,
  },
  openCitationModal: (callId) => set({
    citationModal: { isOpen: true, callId }
  }),
  closeCitationModal: () => set({
    citationModal: { isOpen: false, callId: null }
  }),

  // Confirmation Modal state
  confirmationModal: {
    isOpen: false,
    action: null,      // 'add_1on1' | 'send_summary' | 'recognize' | 'flag_hr'
    managerName: null,
    managerId: null,   // Manager ID for fetching summary
    sources: [],       // Citation IDs used as sources
  },
  openConfirmationModal: (action, managerName, sources = [], managerId = null) => set({
    confirmationModal: { isOpen: true, action, managerName, managerId, sources }
  }),
  closeConfirmationModal: () => set({
    confirmationModal: { isOpen: false, action: null, managerName: null, managerId: null, sources: [] }
  }),
}));
