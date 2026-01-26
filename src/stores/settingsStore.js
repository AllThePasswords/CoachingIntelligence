// Zustand store for settings with localStorage persistence
// Stores API key for Claude integration
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useSettingsStore = create()(
  persist(
    (set) => ({
      // State
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || null,

      // Actions
      setApiKey: (key) => set({ apiKey: key }),
      clearApiKey: () => set({ apiKey: null }),
    }),
    {
      name: 'coaching-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
