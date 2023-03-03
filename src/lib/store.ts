import { create } from 'zustand';

interface StoreState {
  mapApiKey: string;
  setMapApiKey: (str: string) => void;
}

const useGlobalStore = create<StoreState>()((set) => ({
  mapApiKey: '',
  setMapApiKey: (str) => set((state) => ({ ...state, mapApiKey: str })),
}));

export default useGlobalStore;
