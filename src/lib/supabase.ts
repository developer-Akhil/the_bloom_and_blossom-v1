import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder')
  ? ({
      from: () => ({ 
          select: async () => ({ data: null, error: new Error('Supabase not fully configured') }),
          insert: async () => ({ data: null, error: new Error('Supabase not fully configured') }),
          delete: () => ({ eq: async () => ({ data: null, error: new Error('Supabase not fully configured') }) }),
          update: async () => ({ data: null, error: new Error('Supabase not fully configured') }),
      }),
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        getUser: async () => ({ data: { user: null }, error: null }),
        updateUser: async () => ({ data: { user: null }, error: null }),
      }
    } as any)
  : createClient(supabaseUrl, supabaseAnonKey, {
      db: {
        schema: 'bb_ecommerce_sc',
      },
    });
