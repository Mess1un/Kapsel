import "server-only";
import { createClient } from "@supabase/supabase-js";
import { urlSupabase } from "./publik";

/**
 * Klien Supabase dengan kunci rahasia (SUPABASE_SECRET_KEY), HANYA di server.
 * Dipakai untuk mengelola akun login admin (membuat akun, mengganti kata sandi).
 * "server-only" membuat build gagal bila file ini sampai terbawa ke browser.
 *
 * Selalu panggil aksesAdmin() lebih dulu sebelum memakai klien ini.
 */
export function supabaseRahasia() {
  const kunci = process.env.SUPABASE_SECRET_KEY;
  if (!kunci) {
    throw new KunciRahasiaKosong(
      "Fitur ini butuh SUPABASE_SECRET_KEY. Isi di .env.local (komputer) atau Environment Variables di Vercel.",
    );
  }
  return createClient(urlSupabase(), kunci, { auth: { persistSession: false, autoRefreshToken: false } });
}

export class KunciRahasiaKosong extends Error {}

export function adaKunciRahasia(): boolean {
  return Boolean(process.env.SUPABASE_SECRET_KEY);
}
