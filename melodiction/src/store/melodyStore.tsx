import { create } from 'zustand';
import Melody from '../data/melody';

type MelodyState = {
  selectedMelody: Melody | null;
  setSelectedMelody: (Melody: Melody | null) => void;
};

/**
 * Hook to store the current melody.
 */
export const useMelodyStore = create<MelodyState>((set) => ({
  selectedMelody: null,
  setSelectedMelody: (Melody) => set(() => ({ selectedMelody: Melody })),
}));