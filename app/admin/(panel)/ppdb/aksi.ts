"use server";

import { updateTag } from "next/cache";
import { aksesAdmin, bulat, daftarTeks, pathFile, pesanGalat, tanggal, teks, waktuWib, type HasilAksi } from "@/lib/admin";
import { TAG_KONTEN } from "@/lib/data";
import type { InfoPpdb, Tahapan } from "@/lib/jenis";

export type DataPpdb = Omit<InfoPpdb, "id" | "kuota" | "ketentuan" | "persyaratan" | "tahapan"> & {
  kuota: string;
  ketentuan: string[];
  persyaratan: string[];
  tahapan: Tahapan[];
};

export async function simpanPpdb(id: number | null, data: DataPpdb): Promise<HasilAksi> {
  try {
    const supabase = await aksesAdmin();

    const buka = tanggal(data.tanggal_buka);
    const tutup = tanggal(data.tanggal_tutup);
    if (buka && tutup && tutup < buka) return { galat: "Tanggal tutup tidak boleh sebelum tanggal buka." };
    const link = teks(data.link_pendaftaran, 1000);
    if (link && !/^https?:\/\/\S+$/i.test(link)) return { galat: "Link pendaftaran harus diawali https://" };
    const email = teks(data.email_panitia);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { galat: "Format email panitia tidak valid." };

    const isiHtml = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

    const baris = {
      tahun_ajaran: teks(data.tahun_ajaran, 20),
      dibuka: Boolean(data.dibuka),
      tanggal_buka: buka,
      tanggal_tutup: tutup,
      kuota: bulat(data.kuota, null),
      judul: teks(data.judul),
      deskripsi: teks(data.deskripsi, 5000),
      gambar: pathFile(data.gambar),
      ketentuan_pengantar: teks(data.ketentuan_pengantar, 2000),
      ketentuan: daftarTeks(data.ketentuan),
      ketentuan_catatan: teks(data.ketentuan_catatan, 2000),
      persyaratan: daftarTeks(data.persyaratan),
      persyaratan_catatan: teks(data.persyaratan_catatan, 2000),
      tahapan: (Array.isArray(data.tahapan) ? data.tahapan : [])
        .map((t) => ({ judul: teks(t?.judul), tanggal: teks(t?.tanggal), keterangan: teks(t?.keterangan, 2000) }))
        .filter((t) => t.judul),
      cara_pendaftaran: isiHtml(data.cara_pendaftaran),
      biaya: isiHtml(data.biaya),
      brosur: pathFile(data.brosur),
      link_pendaftaran: link,
      email_panitia: email,
      telepon_panitia: teks(data.telepon_panitia, 30),
      updated_at: waktuWib(),
    };

    const { error } = id
      ? await supabase.from("info_ppdb").update(baris).eq("id", id)
      : await supabase.from("info_ppdb").insert({ ...baris, created_at: waktuWib() });
    if (error) throw error;
  } catch (e) {
    return pesanGalat(e);
  }

  updateTag(TAG_KONTEN);
  return { pesan: "Informasi PPDB tersimpan." };
}
