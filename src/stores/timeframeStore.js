// Zustand store for timeframe state management
// Used across all components that display time-based data
import { create } from 'zustand';

export const useTimeframeStore = create((set) => ({
  // State: '30', '60', or '90' days
  timeframe: '30',

  // Action: set timeframe to specific value
  setTimeframe: (value) => set({ timeframe: value }),
}));
