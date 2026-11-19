/** Bentuk data tiap tabel Supabase (sama dengan tabel buatan Laravel). */

export type Fasilitas = { nama?: string | null; deskripsi?: string | null; foto?: string | null };
export type Jabatan = { jabatan?: string | null; nama?: string | null };
export type Tahapan = { judul?: string | null; tanggal?: string | null; keterangan?: string | null };

export type Profil = {
  id: number;
  nama_sekolah: string;
  slogan: string | null;
  jenjang: string | null;
  npsn: string | null;
  akreditasi: string | null;
  logo: string | null;
  gambar_banner: string | null;
  hero_judul: string | null;
  hero_deskripsi: string | null;
  pengenalan_judul: string | null;
  pengenalan: string | null;
  nama_kepala_sekolah: string | null;
  foto_kepala_sekolah: string | null;
  kutipan_sambutan: string | null;
  sambutan: string | null;
  sejarah: string | null;
  visi: string | null;
  misi: string[] | null;
  fasilitas: Fasilitas[] | null;
  struktur_organisasi: Jabatan[] | null;
  jumlah_siswa: number;
  jumlah_guru: number;
  jumlah_kelas: number;
  jumlah_ekstrakurikuler: number;
  alamat: string | null;
  telepon: string | null;
  whatsapp: string | null;
  email: string | null;
  jam_operasional: string | null;
  google_maps_embed: string | null;
  google_maps_link: string | null;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  tiktok: string | null;
};

export type Guru = {
  id: number;
  nama: string;
  nip: string | null;
  jabatan: string | null;
  mata_pelajaran: string | null;
  pendidikan_terakhir: string | null;
  foto: string | null;
  urutan: number;
  aktif: boolean;
};

export type Berita = {
  id: number;
  judul: string;
  slug: string;
  kategori: string | null;
  ringkasan: string | null;
  isi: string;
  gambar: string | null;
  keterangan_gambar: string | null;
  topik: string | null;
  penulis: string | null;
  diterbitkan: boolean;
  tanggal_terbit: string | null;
  dilihat: number;
};

export type Pengumuman = {
  id: number;
  judul: string;
  slug: string;
  kategori: string | null;
  ringkasan: string | null;
  isi: string;
  lampiran: string | null;
  penting: boolean;
  diterbitkan: boolean;
  tanggal_terbit: string | null;
};

export type Galeri = {
  id: number;
  judul: string;
  kategori: string | null;
  deskripsi: string | null;
  foto: string[] | null;
  tanggal_kegiatan: string | null;
  diterbitkan: boolean;
};

export type InfoPpdb = {
  id: number;
  tahun_ajaran: string | null;
  dibuka: boolean;
  tanggal_buka: string | null;
  tanggal_tutup: string | null;
  kuota: number | null;
  judul: string | null;
  deskripsi: string | null;
  gambar: string | null;
  ketentuan_pengantar: string | null;
  ketentuan: string[] | null;
  ketentuan_catatan: string | null;
  persyaratan: string[] | null;
  persyaratan_catatan: string | null;
  tahapan: Tahapan[] | null;
  cara_pendaftaran: string | null;
  biaya: string | null;
  brosur: string | null;
  link_pendaftaran: string | null;
  email_panitia: string | null;
  telepon_panitia: string | null;
};

export type PesanKontak = {
  id: number;
  nama: string;
  email: string;
  telepon: string | null;
  subjek: string | null;
  pesan: string;
  sudah_dibaca: boolean;
  created_at: string | null;
};

export type Halaman<T> = {
  data: T[];
  total: number;
  halaman: number;
  perHalaman: number;
};

export const KATEGORI_BERITA = ["Kegiatan", "Prestasi", "Akademik", "Lingkungan", "Ekstrakurikuler", "Sekolah"];
export const KATEGORI_PENGUMUMAN = ["Akademik", "Kalender", "Kegiatan", "PPDB", "Layanan", "Umum"];
export const PILIHAN_AKREDITASI = ["A", "B", "C", "Belum"];
