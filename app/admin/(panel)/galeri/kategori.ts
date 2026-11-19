import { supabaseServer } from "@/lib/supabase/server";

/** Kategori album yang sudah pernah dipakai (untuk saran isian). */
export async function kategoriGaleriAda(): Promise<string[]> {
  const supabase = await supabaseServer();
  const { data } = await supabase.from("galeri").select("kategori").not("kategori", "is", null);
  return [...new Set((data ?? []).map((b) => b.kategori as string))].sort((a, b) => a.localeCompare(b, "id"));
}
