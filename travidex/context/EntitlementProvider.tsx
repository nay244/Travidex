import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import Purchases from 'react-native-purchases';
import { hasPremium } from '../lib/premium/entitlement';

type EntitlementState = {
  isPremium: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  restore: () => Promise<void>;
};

const EntitlementContext = createContext<EntitlementState>({
  isPremium: false,
  loading: true,
  refresh: async () => {},
  restore: async () => {},
});

export function EntitlementProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setIsPremium(hasPremium(info));
    } catch (err) {
      console.warn('EntitlementProvider: refresh failed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const restore = useCallback(async () => {
    try {
      const info = await Purchases.restorePurchases();
      setIsPremium(hasPremium(info));
    } catch (err) {
      console.warn('EntitlementProvider: restore failed', err);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <EntitlementContext.Provider value={{ isPremium, loading, refresh, restore }}>
      {children}
    </EntitlementContext.Provider>
  );
}

export const useEntitlement = () => useContext(EntitlementContext);
