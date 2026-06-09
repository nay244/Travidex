import { supabase } from '../supabase';

describe('supabase client', () => {
  it('exposes auth and from APIs', () => {
    expect(typeof supabase.auth.signInWithPassword).toBe('function');
    expect(typeof supabase.from).toBe('function');
  });
});
