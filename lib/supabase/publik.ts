import { createClient } from "@supabase/supabase-js";

/**
 * Klien Supabase untuk halaman publik: memakai kunci publik tanpa sesi login,
 * jadi hanya bisa membaca isi yang sudah terbit (diatur oleh RLS di database).
 */
export function supabasePublik() {
  return createClient(urlSupabase(), kunciPublik(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function urlSupabase(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL belum diisi di .env.local / Vercel.");
  return url.replace(/\/+$/, "");
}

export function kunciPublik(): string {
  const kunci = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!kunci) throw new Error("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY belum diisi di .env.local / Vercel.");
  return kunci;
}
