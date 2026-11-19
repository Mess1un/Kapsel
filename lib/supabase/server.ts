import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { kunciPublik, urlSupabase } from "./publik";

/**
 * Klien Supabase untuk panel admin (Server Component & Server Action).
 * Memakai sesi login admin dari cookie, sehingga RLS mengizinkan perubahan data.
 */
export async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(urlSupabase(), kunciPublik(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(daftar) {
        try {
          daftar.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Dipanggil dari Server Component (cookie tidak bisa ditulis di sana).
          // Aman diabaikan karena sesi diperbarui oleh proxy.ts.
        }
      },
    },
  });
}

export type Admin = { id: string; email: string; nama: string };

/**
 * Admin yang sedang login, atau null bila belum login / bukan admin.
 */
export async function adminSaatIni(): Promise<Admin | null> {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  const { data: baris } = await supabase
    .from("admin")
    .select("nama")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (!baris) return null;

  return { id: data.user.id, email: data.user.email ?? "", nama: baris.nama || data.user.email || "Admin" };
}
