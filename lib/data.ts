import { cacheLife, cacheTag } from "next/cache";
import { supabasePublik } from "./supabase/publik";
import type { Berita, Galeri, Guru, Halaman, InfoPpdb, Pengumuman, Profil } from "./jenis";

/**
 * Pengambilan data untuk halaman publik.
 *
 * Semua hasil disimpan di cache Next.js (profil "konten" di next.config.ts)
 * dengan tag "konten". Setiap kali admin menyimpan perubahan, panel admin
 * memanggil updateTag("konten") sehingga pengunjung langsung melihat versi baru.
 *
 * Klien publik hanya bisa membaca isi yang sudah terbit (diatur RLS).
 */

export const TAG_KONTEN = "konten";

function simpanDiCache() {
  cacheLife("konten");
  cacheTag(TAG_KONTEN);
}

function gagal(bagian: string, error: { message: string } | null): never {
  throw new Error(`Gagal mengambil ${bagian} dari Supabase: ${error?.message ?? "tidak diketahui"}`);
}

/** Teks pencarian aman untuk filter ilike (karakter khusus di-escape). */
function polaCari(cari: string): string {
  return `%${cari.replace(/[\\%_]/g, (k) => `\\${k}`)}%`;
}

// ---------------------------------------------------------------- Profil

const PROFIL_KOSONG: Profil = {
  id: 0, nama_sekolah: "Web Sekolah", slogan: null, jenjang: null, npsn: null, akreditasi: null,
  logo: null, gambar_banner: null, hero_judul: null, hero_deskripsi: null, pengenalan_judul: null,
  pengenalan: null, nama_kepala_sekolah: null, foto_kepala_sekolah: null, kutipan_sambutan: null,
  sambutan: null, sejarah: null, visi: null, misi: [], fasilitas: [], struktur_organisasi: [],
  jumlah_siswa: 0, jumlah_guru: 0, jumlah_kelas: 0, jumlah_ekstrakurikuler: 0, alamat: null,
  telepon: null, whatsapp: null, email: null, jam_operasional: null, google_maps_embed: null,
  google_maps_link: null, facebook: null, instagram: null, youtube: null, tiktok: null,
};

export async function ambilProfil(): Promise<Profil> {
  "use cache";
  simpanDiCache();

  const { data, error } = await supabasePublik()
    .from("profil_sekolah").select("*").order("id").limit(1).maybeSingle();
  if (error) gagal("profil sekolah", error);

  return data ?? PROFIL_KOSONG;
}

/** Tahun sekarang untuk footer (disimpan di cache agar halaman tetap statis). */
export async function tahunIni(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

// ---------------------------------------------------------------- PPDB

export async function ambilPpdb(): Promise<InfoPpdb | null> {
  "use cache";
  simpanDiCache();

  const { data, error } = await supabasePublik()
    .from("info_ppdb").select("*").order("id").limit(1).maybeSingle();
  if (error) gagal("info PPDB", error);

  return data;
}

// ---------------------------------------------------------------- Guru

/** Semua guru aktif, urut sesuai kolom "urutan" lalu nama. */
export async function ambilGuruAktif(): Promise<Guru[]> {
  "use cache";
  simpanDiCache();

  const { data, error } = await supabasePublik()
    .from("guru").select("*").eq("aktif", true)
    .order("urutan").order("nama");
  if (error) gagal("data guru", error);

  return data ?? [];
}

// ---------------------------------------------------------------- Berita

const URUT_TERBIT = { ascending: false, nullsFirst: true } as const;

export async function ambilDaftarBerita(opsi: {
  cari?: string; kategori?: string; halaman?: number; perHalaman?: number;
}): Promise<Halaman<Berita>> {
  "use cache";
  simpanDiCache();

  const perHalaman = opsi.perHalaman ?? 9;
  const halaman = Math.max(1, opsi.halaman ?? 1);
  let kueri = supabasePublik()
    .from("berita").select("*", { count: "exact" }).eq("diterbitkan", true);
  if (opsi.kategori) kueri = kueri.eq("kategori", opsi.kategori);
  if (opsi.cari) kueri = kueri.ilike("judul", polaCari(opsi.cari));

  const { data, error, count } = await kueri
    .order("tanggal_terbit", URUT_TERBIT).order("id", { ascending: false })
    .range((halaman - 1) * perHalaman, halaman * perHalaman - 1);
  if (error) gagal("daftar berita", error);

  return { data: data ?? [], total: count ?? 0, halaman, perHalaman };
}

export async function ambilBerita(slug: string): Promise<Berita | null> {
  "use cache";
  simpanDiCache();

  const { data, error } = await supabasePublik()
    .from("berita").select("*").eq("slug", slug).eq("diterbitkan", true).maybeSingle();
  if (error) gagal("berita", error);

  return data;
}

export async function ambilBeritaLain(kecualiId: number, jumlah = 3): Promise<Berita[]> {
  "use cache";
  simpanDiCache();

  const { data, error } = await supabasePublik()
    .from("berita").select("*").eq("diterbitkan", true).neq("id", kecualiId)
    .order("tanggal_terbit", URUT_TERBIT).order("id", { ascending: false }).limit(jumlah);
  if (error) gagal("berita lainnya", error);

  return data ?? [];
}

// ---------------------------------------------------------------- Pengumuman

export async function ambilDaftarPengumuman(opsi: {
  cari?: string; kategori?: string; halaman?: number; perHalaman?: number;
}): Promise<Halaman<Pengumuman>> {
  "use cache";
  simpanDiCache();

  const perHalaman = opsi.perHalaman ?? 9;
  const halaman = Math.max(1, opsi.halaman ?? 1);
  let kueri = supabasePublik()
    .from("pengumuman").select("*", { count: "exact" }).eq("diterbitkan", true);
  if (opsi.kategori) kueri = kueri.eq("kategori", opsi.kategori);
  if (opsi.cari) kueri = kueri.ilike("judul", polaCari(opsi.cari));

  const { data, error, count } = await kueri
    .order("tanggal_terbit", URUT_TERBIT).order("id", { ascending: false })
    .range((halaman - 1) * perHalaman, halaman * perHalaman - 1);
  if (error) gagal("daftar pengumuman", error);

  return { data: data ?? [], total: count ?? 0, halaman, perHalaman };
}

/** Pengumuman untuk beranda: yang penting dulu, lalu terbaru. */
export async function ambilPengumumanBeranda(jumlah = 3): Promise<Pengumuman[]> {
  "use cache";
  simpanDiCache();

  const { data, error } = await supabasePublik()
    .from("pengumuman").select("*").eq("diterbitkan", true)
    .order("penting", { ascending: false })
    .order("tanggal_terbit", URUT_TERBIT).limit(jumlah);
  if (error) gagal("pengumuman beranda", error);

  return data ?? [];
}

export async function ambilPengumuman(slug: string): Promise<Pengumuman | null> {
  "use cache";
  simpanDiCache();

  const { data, error } = await supabasePublik()
    .from("pengumuman").select("*").eq("slug", slug).eq("diterbitkan", true).maybeSingle();
  if (error) gagal("pengumuman", error);

  return data;
}

export async function ambilPengumumanLain(kecualiId: number, jumlah = 3): Promise<Pengumuman[]> {
  "use cache";
  simpanDiCache();

  const { data, error } = await supabasePublik()
    .from("pengumuman").select("*").eq("diterbitkan", true).neq("id", kecualiId)
    .order("tanggal_terbit", URUT_TERBIT).order("id", { ascending: false }).limit(jumlah);
  if (error) gagal("pengumuman lainnya", error);

  return data ?? [];
}

// ---------------------------------------------------------------- Galeri

export async function ambilDaftarGaleri(opsi: {
  kategori?: string; halaman?: number; perHalaman?: number;
}): Promise<Halaman<Galeri>> {
  "use cache";
  simpanDiCache();

  const perHalaman = opsi.perHalaman ?? 10;
  const halaman = Math.max(1, opsi.halaman ?? 1);
  let kueri = supabasePublik()
    .from("galeri").select("*", { count: "exact" }).eq("diterbitkan", true);
  if (opsi.kategori) kueri = kueri.eq("kategori", opsi.kategori);

  const { data, error, count } = await kueri
    .order("tanggal_kegiatan", URUT_TERBIT).order("id", { ascending: false })
    .range((halaman - 1) * perHalaman, halaman * perHalaman - 1);
  if (error) gagal("galeri", error);

  return { data: data ?? [], total: count ?? 0, halaman, perHalaman };
}

export async function ambilKategoriGaleri(): Promise<string[]> {
  "use cache";
  simpanDiCache();

  const { data, error } = await supabasePublik()
    .from("galeri").select("kategori").eq("diterbitkan", true).not("kategori", "is", null);
  if (error) gagal("kategori galeri", error);

  return [...new Set((data ?? []).map((b) => b.kategori as string))].sort((a, b) => a.localeCompare(b, "id"));
}
