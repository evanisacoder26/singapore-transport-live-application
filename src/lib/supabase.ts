import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const EDGE_BASE = `${supabaseUrl}/functions/v1/mrt-arrivals`;

export async function fetchLTA(params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${EDGE_BASE}?${qs}`, {
    headers: {
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Edge function error ${res.status}`);
  return res.json();
}
