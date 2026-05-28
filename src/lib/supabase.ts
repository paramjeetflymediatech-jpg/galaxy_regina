import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
// Use service role key on server if available (to bypass RLS), fallback to anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('⚠️ Supabase URL or Auth Key is missing in environment variables.');
  }
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
