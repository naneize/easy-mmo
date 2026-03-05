import { create } from 'zustand'

export type GameTabId =
  | 'dashboard'
  | 'adventure'
  | 'skills'
  | 'classes'
  | 'achievements'
  | 'market'
  | 'inventory';

type NavigationState = {
  activeTab: GameTabId
  setActiveTab: (tab: GameTabId) => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
