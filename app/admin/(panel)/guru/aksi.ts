"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { aksesAdmin, bulat, pathFile, pesanGalat, teks, waktuWib, type HasilAksi } from "@/lib/admin";
import { TAG_KONTEN } from "@/lib/data";

export type DataGuru = {
  nama: string;
  nip: string;
  jabatan: string;
  mata_pelajaran: string;
  pendidikan_terakhir: string;
  foto: string | null;
  urutan: string;
  aktif: boolean;
};

export async function simpanGuru(id: number | null, data: DataGuru): Promise<HasilAksi> {
  try {
    const supabase = await aksesAdmin();

    const nama = teks(data.nama);
    if (!nama) return { galat: "Nama lengkap wajib diisi." };

    const baris = {
      nama,
      nip: teks(data.nip, 30),
      jabatan: teks(data.jabatan),
      mata_pelajaran: teks(data.mata_pelajaran),
      pendidikan_terakhir: teks(data.pendidikan_terakhir),
      foto: pathFile(data.foto),
      urutan: bulat(data.urutan, 0) ?? 0,
      aktif: Boolean(data.aktif),
      updated_at: waktuWib(),
    };

    const { error } = id
      ? await supabase.from("guru").update(baris).eq("id", id)
      : await supabase.from("guru").insert({ ...baris, created_at: waktuWib() });
    if (error) throw error;
  } catch (e) {
    return pesanGalat(e);
  }

  updateTag(TAG_KONTEN);
  if (!id) redirect("/admin/guru?tersimpan=1");
  return { pesan: "Data guru tersimpan." };
}

export async function ubahAktifGuru(id: number, aktif: boolean): Promise<HasilAksi> {
  try {
    const supabase = await aksesAdmin();
    const { error } = await supabase.from("guru").update({ aktif, updated_at: waktuWib() }).eq("id", id);
    if (error) throw error;
  } catch (e) {
    return pesanGalat(e);
  }
  updateTag(TAG_KONTEN);
  return {};
}

export async function hapusGuru(id: number): Promise<HasilAksi> {
  try {
    const supabase = await aksesAdmin();
    const { error } = await supabase.from("guru").delete().eq("id", id);
    if (error) throw error;
  } catch (e) {
    return pesanGalat(e);
  }
  updateTag(TAG_KONTEN);
  return {};
}
