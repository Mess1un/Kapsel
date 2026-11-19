"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { aksesAdmin, bulat, pathFile, pesanGalat, tanggal, teks, waktuWib, type HasilAksi } from "@/lib/admin";
import { TAG_KONTEN } from "@/lib/data";

export type DataGaleri = {
  judul: string;
  kategori: string;
  deskripsi: string;
  tanggal_kegiatan: string;
  diterbitkan: boolean;
  foto: string[];
};

export async function simpanGaleri(id: number | null, data: DataGaleri): Promise<HasilAksi> {
  let idTersimpan = id;

  try {
    const supabase = await aksesAdmin();

    const judul = teks(data.judul);
    if (!judul) return { galat: "Nama kegiatan wajib diisi." };
    const foto = (Array.isArray(data.foto) ? data.foto : []).map(pathFile).filter((p): p is string => p !== null).slice(0, 50);
    if (foto.length === 0) return { galat: "Unggah minimal satu foto kegiatan." };

    const baris = {
      judul,
      kategori: teks(data.kategori, 100),
      deskripsi: teks(data.deskripsi, 5000),
      tanggal_kegiatan: tanggal(data.tanggal_kegiatan),
      diterbitkan: Boolean(data.diterbitkan),
      foto,
      updated_at: waktuWib(),
    };

    if (id) {
      const { error } = await supabase.from("galeri").update(baris).eq("id", id);
      if (error) throw error;
    } else {
      const { data: baru, error } = await supabase
        .from("galeri").insert({ ...baris, created_at: waktuWib() }).select("id").single();
      if (error) throw error;
      idTersimpan = bulat(baru.id);
    }
  } catch (e) {
    return pesanGalat(e);
  }

  updateTag(TAG_KONTEN);
  if (!id) redirect(`/admin/galeri/${idTersimpan}?tersimpan=1`);
  return { pesan: "Album tersimpan." };
}

export async function hapusGaleri(id: number): Promise<HasilAksi> {
  try {
    const supabase = await aksesAdmin();
    const { error } = await supabase.from("galeri").delete().eq("id", id);
    if (error) throw error;
  } catch (e) {
    return pesanGalat(e);
  }
  updateTag(TAG_KONTEN);
  return {};
}
