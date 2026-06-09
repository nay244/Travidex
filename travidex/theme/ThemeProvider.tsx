/**
 * ThemeProvider — light by default, dark is the premium (Travidex+) opt-in.
 *
 * Components read tokens via useTheme(); they MUST NOT branch on scheme.
 * Switching scheme here swaps the whole token set underneath them.
 */
import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { Theme, Scheme, lightTheme, darkTheme } from './theme';

type ThemeContextValue = {
  theme: Theme;
  scheme: Scheme;
  setScheme: (s: Scheme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  scheme: 'light',
  setScheme: () => {},
  toggle: () => {},
});

export function ThemeProvider({ children, initialScheme = 'light' }: { children: ReactNode; initialScheme?: Scheme }) {
  const [scheme, setScheme] = useState<Scheme>(initialScheme);
  const value = useMemo<ThemeContextValue>(() => ({
    theme: scheme === 'dark' ? darkTheme : lightTheme,
    scheme,
    setScheme,
    toggle: () => setScheme(prev => (prev === 'dark' ? 'light' : 'dark')),
  }), [scheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Read the active theme tokens. */
export const useTheme = (): Theme => useContext(ThemeContext).theme;

/** Read/control the active scheme (e.g. behind the Travidex+ Appearance setting). */
export const useThemeMode = () => {
  const { scheme, setScheme, toggle } = useContext(ThemeContext);
  return { scheme, setScheme, toggle };
};
