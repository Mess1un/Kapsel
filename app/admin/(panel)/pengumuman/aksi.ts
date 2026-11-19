"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  aksesAdmin, bulat, pathFile, pesanGalat, slugUnik, tanggalWaktu, teks, waktuWib, type HasilAksi,
} from "@/lib/admin";
import { TAG_KONTEN } from "@/lib/data";
import { teksPolos } from "@/lib/format";
import { KATEGORI_PENGUMUMAN } from "@/lib/jenis";

export type DataPengumuman = {
  judul: string;
  ringkasan: string;
  isi: string;
  kategori: string;
  lampiran: string | null;
  tanggal_terbit: string;
  penting: boolean;
  diterbitkan: boolean;
};

export async function simpanPengumuman(id: number | null, data: DataPengumuman): Promise<HasilAksi> {
  let idTersimpan = id;

  try {
    const supabase = await aksesAdmin();

    const judul = teks(data.judul);
    if (!judul) return { galat: "Judul wajib diisi." };
    const isi = typeof data.isi === "string" ? data.isi.trim() : "";
    if (!teksPolos(isi) && !/<img\s/i.test(isi)) return { galat: "Isi pengumuman wajib diisi." };

    const baris = {
      judul,
      ringkasan: teks(data.ringkasan, 300),
      isi,
      kategori: KATEGORI_PENGUMUMAN.includes(data.kategori) ? data.kategori : null,
      lampiran: pathFile(data.lampiran),
      tanggal_terbit: tanggalWaktu(data.tanggal_terbit),
      penting: Boolean(data.penting),
      diterbitkan: Boolean(data.diterbitkan),
      updated_at: waktuWib(),
    };

    if (id) {
      const { data: lama, error: galatLama } = await supabase.from("pengumuman").select("judul").eq("id", id).maybeSingle();
      if (galatLama) throw galatLama;
      if (!lama) return { galat: "Pengumuman tidak ditemukan." };
      const slug = lama.judul !== judul ? await slugUnik(supabase, "pengumuman", judul, id) : undefined;

      const { error } = await supabase.from("pengumuman").update(slug ? { ...baris, slug } : baris).eq("id", id);
      if (error) throw error;
    } else {
      const { data: baru, error } = await supabase
        .from("pengumuman")
        .insert({ ...baris, slug: await slugUnik(supabase, "pengumuman", judul), created_at: waktuWib() })
        .select("id")
        .single();
      if (error) throw error;
      idTersimpan = bulat(baru.id);
    }
  } catch (e) {
    return pesanGalat(e);
  }

  updateTag(TAG_KONTEN);
  if (!id) redirect(`/admin/pengumuman/${idTersimpan}?tersimpan=1`);
  return { pesan: "Pengumuman tersimpan." };
}

export async function hapusPengumuman(id: number): Promise<HasilAksi> {
  try {
    const supabase = await aksesAdmin();
    const { error } = await supabase.from("pengumuman").delete().eq("id", id);
    if (error) throw error;
  } catch (e) {
    return pesanGalat(e);
  }
  updateTag(TAG_KONTEN);
  return {};
}
