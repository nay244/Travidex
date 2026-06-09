import { createContext, useContext, useState, ReactNode } from 'react';

const DEFAULT_CITY = '22222222-2222-2222-2222-222222222222'; // seeded Paris

type CityState = { cityId: string; setCityId: (id: string) => void };
const CityContext = createContext<CityState>({ cityId: DEFAULT_CITY, setCityId: () => {} });

export function CityProvider({ children }: { children: ReactNode }) {
  const [cityId, setCityId] = useState(DEFAULT_CITY);
  return <CityContext.Provider value={{ cityId, setCityId }}>{children}</CityContext.Provider>;
}

export const useCity = () => useContext(CityContext);
