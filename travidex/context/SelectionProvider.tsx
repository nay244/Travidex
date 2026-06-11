import { createContext, useContext, useState, ReactNode } from 'react';
import type { SightWithFind } from '../lib/types';

type SelectionState = {
  selected: SightWithFind | null;
  setSelected: (sight: SightWithFind | null) => void;
  logRequested: boolean;
  requestLog: () => void;
  clearLogRequest: () => void;
};

const SelectionContext = createContext<SelectionState>({
  selected: null,
  setSelected: () => {},
  logRequested: false,
  requestLog: () => {},
  clearLogRequest: () => {},
});

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SightWithFind | null>(null);
  const [logRequested, setLogRequested] = useState(false);

  const requestLog = () => setLogRequested(true);
  const clearLogRequest = () => setLogRequested(false);

  return (
    <SelectionContext.Provider value={{ selected, setSelected, logRequested, requestLog, clearLogRequest }}>
      {children}
    </SelectionContext.Provider>
  );
}

export const useSelection = () => useContext(SelectionContext);
