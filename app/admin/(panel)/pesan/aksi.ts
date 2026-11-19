"use server";

import { aksesAdmin, pesanGalat, type HasilAksi } from "@/lib/admin";

export async function tandaiPesan(id: number, sudahDibaca: boolean): Promise<HasilAksi> {
  try {
    const supabase = await aksesAdmin();
    const { error } = await supabase.from("pesan_kontak").update({ sudah_dibaca: sudahDibaca }).eq("id", id);
    if (error) throw error;
  } catch (e) {
    return pesanGalat(e);
  }
  return {};
}

export async function hapusPesan(id: number): Promise<HasilAksi> {
  try {
    const supabase = await aksesAdmin();
    const { error } = await supabase.from("pesan_kontak").delete().eq("id", id);
    if (error) throw error;
  } catch (e) {
    return pesanGalat(e);
  }
  return {};
}
