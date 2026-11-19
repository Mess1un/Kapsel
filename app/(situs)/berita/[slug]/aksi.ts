"use server";

import { supabasePublik } from "@/lib/supabase/publik";

/** Tambah 1 pembaca berita. Fungsi database hanya menambah berita yang sudah terbit. */
export async function catatPembaca(slug: string): Promise<void> {
  if (typeof slug !== "string" || slug.length === 0 || slug.length > 255) return;
  await supabasePublik().rpc("tambah_dilihat", { p_slug: slug });
}
