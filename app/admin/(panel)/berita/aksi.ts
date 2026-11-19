"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  aksesAdmin, bulat, pathFile, pesanGalat, slugUnik, tanggalWaktu, teks, waktuWib, type HasilAksi,
} from "@/lib/admin";
import { TAG_KONTEN } from "@/lib/data";
import { teksPolos } from "@/lib/format";
import { KATEGORI_BERITA } from "@/lib/jenis";

export type DataBerita = {
  judul: string;
  ringkasan: string;
  isi: string;
  gambar: string | null;
  keterangan_gambar: string;
  kategori: string;
  topik: string;
  penulis: string;
  tanggal_terbit: string;
  diterbitkan: boolean;
};

export async function simpanBerita(id: number | null, data: DataBerita): Promise<HasilAksi> {
  let idTersimpan = id;

  try {
    const supabase = await aksesAdmin();

    const judul = teks(data.judul);
    if (!judul) return { galat: "Judul wajib diisi." };
    const isi = typeof data.isi === "string" ? data.isi.trim() : "";
    if (!teksPolos(isi) && !/<img\s/i.test(isi)) return { galat: "Isi berita wajib diisi." };

    const baris = {
      judul,
      ringkasan: teks(data.ringkasan, 300),
      isi,
      gambar: pathFile(data.gambar),
      keterangan_gambar: teks(data.keterangan_gambar),
      kategori: KATEGORI_BERITA.includes(data.kategori) ? data.kategori : null,
      topik: teks(data.topik),
      penulis: teks(data.penulis),
      tanggal_terbit: tanggalWaktu(data.tanggal_terbit),
      diterbitkan: Boolean(data.diterbitkan),
      updated_at: waktuWib(),
    };

    if (id) {
      const { data: lama, error: galatLama } = await supabase.from("berita").select("judul").eq("id", id).maybeSingle();
      if (galatLama) throw galatLama;
      if (!lama) return { galat: "Berita tidak ditemukan." };
      // Seperti di Laravel: slug ikut berubah bila judul diubah.
      const slug = lama.judul !== judul ? await slugUnik(supabase, "berita", judul, id) : undefined;

      const { error } = await supabase.from("berita").update(slug ? { ...baris, slug } : baris).eq("id", id);
      if (error) throw error;
    } else {
      const { data: baru, error } = await supabase
        .from("berita")
        .insert({ ...baris, slug: await slugUnik(supabase, "berita", judul), dilihat: 0, created_at: waktuWib() })
        .select("id")
        .single();
      if (error) throw error;
      idTersimpan = bulat(baru.id);
    }
  } catch (e) {
    return pesanGalat(e);
  }

  updateTag(TAG_KONTEN);
  if (!id) redirect(`/admin/berita/${idTersimpan}?tersimpan=1`);
  return { pesan: "Berita tersimpan." };
}

export async function hapusBerita(id: number): Promise<HasilAksi> {
  try {
    const supabase = await aksesAdmin();
    const { error } = await supabase.from("berita").delete().eq("id", id);
    if (error) throw error;
  } catch (e) {
    return pesanGalat(e);
  }
  updateTag(TAG_KONTEN);
  return {};
}
