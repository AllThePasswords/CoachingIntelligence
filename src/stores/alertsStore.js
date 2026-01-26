// Zustand store for alerts toggle state
import { create } from 'zustand';

export const useAlertsStore = create((set) => ({
  // State: alerts enabled (true) or disabled (false)
  alertsEnabled: true,

  // Action: toggle alerts on/off
  toggleAlerts: () => set((state) => ({ alertsEnabled: !state.alertsEnabled })),
  
  // Action: set alerts to specific value
  setAlertsEnabled: (value) => set({ alertsEnabled: value }),
}));
