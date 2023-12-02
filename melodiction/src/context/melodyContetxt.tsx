import { createContext, useState, useContext, ReactNode } from 'react';
import Melody from '../data/melody';

interface MelodyContextType {
  selectedMelodyFromContext: Melody | null;
  setSelectedMelodyFromContext: (Melody: Melody | null) => void;
}

// Create a context with a default undefined value
const MelodyContext = createContext<MelodyContextType | undefined>(undefined);

// Define the provider component
interface MelodyProviderProps {
  children: ReactNode;
}

export const MelodyProvider = ({ children }: MelodyProviderProps) => {
  const [selectedMelodyFromContext, setSelectedMelodyFromContext] = useState<Melody | null>(null);

  return (
    <MelodyContext.Provider value={{ selectedMelodyFromContext, setSelectedMelodyFromContext }}>
      {children}
    </MelodyContext.Provider>
  );
};

// Custom hook for using this context
export const useMelodyContext = (): MelodyContextType => {
  const context = useContext(MelodyContext);
  if (!context) {
    throw new Error('useMelodyContext must be used within a MelodyProvider');
  }
  return context;
};