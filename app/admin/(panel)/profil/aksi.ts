"use server";

import { updateTag } from "next/cache";
import { aksesAdmin, bulat, daftarTeks, pathFile, pesanGalat, teks, waktuWib, type HasilAksi } from "@/lib/admin";
import { TAG_KONTEN } from "@/lib/data";
import { PILIHAN_AKREDITASI, type Fasilitas, type Jabatan, type Profil } from "@/lib/jenis";

export type DataProfil = Omit<Profil, "id" | "jumlah_siswa" | "jumlah_guru" | "jumlah_kelas" | "jumlah_ekstrakurikuler" | "misi" | "fasilitas" | "struktur_organisasi"> & {
  jumlah_siswa: string;
  jumlah_guru: string;
  jumlah_kelas: string;
  jumlah_ekstrakurikuler: string;
  misi: string[];
  fasilitas: Fasilitas[];
  struktur_organisasi: Jabatan[];
};

const URL_VALID = /^https?:\/\/\S+$/i;

function tautan(nilai: unknown, nama: string): string | null {
  const t = teks(nilai, 1000);
  if (t && !URL_VALID.test(t)) throw new GalatIsian(`${nama} harus berupa alamat lengkap yang diawali https://`);
  return t;
}

class GalatIsian extends Error {}

export async function simpanProfil(id: number | null, data: DataProfil): Promise<HasilAksi> {
  try {
    const supabase = await aksesAdmin();

    const nama = teks(data.nama_sekolah);
    if (!nama) return { galat: "Nama sekolah wajib diisi." };
    const email = teks(data.email);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { galat: "Format email tidak valid." };

    const baris = {
      nama_sekolah: nama,
      slogan: teks(data.slogan),
      jenjang: teks(data.jenjang),
      npsn: teks(data.npsn, 20),
      akreditasi: PILIHAN_AKREDITASI.includes(data.akreditasi ?? "") ? data.akreditasi : null,
      logo: pathFile(data.logo),
      gambar_banner: pathFile(data.gambar_banner),
      hero_judul: teks(data.hero_judul),
      hero_deskripsi: teks(data.hero_deskripsi, 2000),
      pengenalan_judul: teks(data.pengenalan_judul),
      pengenalan: teks(data.pengenalan, 10000),
      nama_kepala_sekolah: teks(data.nama_kepala_sekolah),
      foto_kepala_sekolah: pathFile(data.foto_kepala_sekolah),
      kutipan_sambutan: teks(data.kutipan_sambutan),
      sambutan: teks(data.sambutan, 10000),
      sejarah: typeof data.sejarah === "string" && data.sejarah.trim() ? data.sejarah.trim() : null,
      visi: teks(data.visi, 2000),
      misi: daftarTeks(data.misi),
      fasilitas: (Array.isArray(data.fasilitas) ? data.fasilitas : [])
        .map((f) => ({ nama: teks(f?.nama, 100), deskripsi: teks(f?.deskripsi, 1000), foto: pathFile(f?.foto) }))
        .filter((f) => f.nama),
      struktur_organisasi: (Array.isArray(data.struktur_organisasi) ? data.struktur_organisasi : [])
        .map((s) => ({ jabatan: teks(s?.jabatan, 100), nama: teks(s?.nama, 150) }))
        .filter((s) => s.jabatan),
      jumlah_siswa: bulat(data.jumlah_siswa, 0),
      jumlah_guru: bulat(data.jumlah_guru, 0),
      jumlah_kelas: bulat(data.jumlah_kelas, 0),
      jumlah_ekstrakurikuler: bulat(data.jumlah_ekstrakurikuler, 0),
      alamat: teks(data.alamat, 1000),
      telepon: teks(data.telepon, 30),
      whatsapp: teks(data.whatsapp, 30),
      email,
      jam_operasional: teks(data.jam_operasional, 1000),
      google_maps_embed: tautan(data.google_maps_embed, "Link embed Google Maps"),
      google_maps_link: tautan(data.google_maps_link, "Link Google Maps"),
      facebook: tautan(data.facebook, "Facebook"),
      instagram: tautan(data.instagram, "Instagram"),
      youtube: tautan(data.youtube, "YouTube"),
      tiktok: tautan(data.tiktok, "TikTok"),
      updated_at: waktuWib(),
    };

    const { error } = id
      ? await supabase.from("profil_sekolah").update(baris).eq("id", id)
      : await supabase.from("profil_sekolah").insert({ ...baris, created_at: waktuWib() });
    if (error) throw error;
  } catch (e) {
    if (e instanceof GalatIsian) return { galat: e.message };
    return pesanGalat(e);
  }

  updateTag(TAG_KONTEN);
  return { pesan: "Profil sekolah tersimpan." };
}
