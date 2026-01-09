// Wrapper para compatibilidade com imports @/lib/supabase/client
import { supabase } from '../supabase';

export function createClient() {
  return supabase;
}

export { supabase };
