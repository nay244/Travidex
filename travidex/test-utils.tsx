import { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme';

// Wrap any component under test in the real ThemeProvider so useTheme() works.
export function renderWithTheme(ui: ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

export * from '@testing-library/react-native';
