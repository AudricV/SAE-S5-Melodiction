import { create } from 'zustand';
import Melody from '../data/melody';

type MelodyState = {
  selectedMelody: Melody | null;
  setSelectedMelody: (Melody: Melody | null) => void;
}; 

// Create a store using Zustand
export const useMelodyStore = create<MelodyState>((set) => ({
  selectedMelody: null,
  setSelectedMelody: (Melody) => set(() => ({ selectedMelody: Melody })),
}));