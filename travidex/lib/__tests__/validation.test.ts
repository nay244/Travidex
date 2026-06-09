import { isValidEmail, validatePassword, passwordsMatch } from '../validation';

describe('isValidEmail', () => {
  it('accepts a normal email', () => expect(isValidEmail('a@b.com')).toBe(true));
  it('rejects missing @', () => expect(isValidEmail('ab.com')).toBe(false));
  it('rejects empty', () => expect(isValidEmail('')).toBe(false));
});

describe('validatePassword', () => {
  it('accepts 8+ chars', () => expect(validatePassword('abcd1234')).toBeNull());
  it('rejects short', () => expect(validatePassword('abc')).toBe('Password must be at least 8 characters'));
});

describe('passwordsMatch', () => {
  it('true when equal', () => expect(passwordsMatch('abc', 'abc')).toBe(true));
  it('false when different', () => expect(passwordsMatch('abc', 'abd')).toBe(false));
});
