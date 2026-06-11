import { screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../test-utils';
import { CompletionBar } from '../CompletionBar';

it('renders the label with found/total', async () => {
  await renderWithTheme(<CompletionBar label="Paris" found={3} total={40} />);
  expect(screen.getByText('Paris · 3 / 40')).toBeOnTheScreen();
});
