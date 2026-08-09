import { supabase } from './supabase';

function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.');
  }
}

export async function fetchRows(table: string) {
  ensureSupabase();
  const result = await supabase.from(table).select('*').order('created_at', { ascending: false });
  if (result.error) throw result.error;
  return result.data || [];
}

export async function insertRow(table: string, row: any) {
  ensureSupabase();
  const result = await supabase.from(table).insert(row).select().single();
  if (result.error) throw result.error;
  return result.data;
}

export async function updateRow(table: string, id: string, row: any) {
  ensureSupabase();
  const result = await supabase.from(table).update(row).eq('id', id).select().single();
  if (result.error) throw result.error;
  return result.data;
}

export async function deleteRow(table: string, id: string) {
  ensureSupabase();
  const result = await supabase.from(table).delete().eq('id', id);
  if (result.error) throw result.error;
}
