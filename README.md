# Web Profil Sekolah — versi Next.js

Versi Next.js dari website sekolah (sebelumnya Laravel + Filament). Bisa di-deploy ke **Vercel**.
Database dan foto tetap di **Supabase** yang sama dengan versi Laravel.

- **Halaman publik**: `/`, `/profil`, `/guru`, `/pengumuman`, `/berita`, `/galeri`, `/ppdb`, `/kontak`
- **Panel admin**: `/admin` (login dengan Supabase Auth)

## Menjalankan di komputer

Butuh **Node.js 20 atau lebih baru**.

```bash
cd nextjs
npm install
cp .env.example .env.local   # lalu isi nilainya (lihat di bawah)
npm run dev                  # buka http://localhost:3000
```

Isi `.env.local` (dashboard Supabase → **Project Settings → API Keys**):

| Variabel | Isi | Rahasia? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` | Tidak |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Kunci *Publishable* (`sb_publishable_...`) | Tidak (terlihat di browser, aman karena RLS) |
| `SUPABASE_SECRET_KEY` | Kunci *Secret* (`sb_secret_...`) | **Ya** — hanya untuk skrip admin di komputer, jangan masuk ke Vercel/GitHub |

## Persiapan Supabase (sekali saja)

1. **Keamanan database**: di Supabase buka **SQL Editor**, tempel isi
   [`supabase/migrations/0001_keamanan_dan_admin.sql`](supabase/migrations/0001_keamanan_dan_admin.sql), lalu **Run**.
   File ini menyalakan RLS di semua tabel, membuat tabel `admin`, dan mengatur izin unggah foto.
   Aman dijalankan berulang kali.
2. **Matikan pendaftaran akun dari luar**: **Authentication → Sign In / Providers → Allow new users to sign up** → nonaktifkan.
   (Akun yang tidak ada di tabel `admin` memang tidak bisa mengubah apa pun, tetapi lebih baik dimatikan.)
3. **Akun admin**:
   - Pindahkan akun lama Filament (kata sandi tetap sama): `npm run admin:pindah`
   - Tambah admin baru: `npm run admin:tambah`

   Keduanya butuh `SUPABASE_SECRET_KEY` di `.env.local`. Login memakai email dalam huruf kecil.

## Deploy ke Vercel

1. Push repo ke GitHub.
2. Di [vercel.com](https://vercel.com) → **Add New → Project** → pilih repo `Kapsel-Web`.
3. **Root Directory**: pilih `nextjs`. Framework otomatis terdeteksi sebagai Next.js.
4. **Environment Variables**: isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   (**jangan** isi `SUPABASE_SECRET_KEY`).
5. Klik **Deploy**.

Server Vercel diatur di region Mumbai (`bom1`, lihat `vercel.json`), dekat dengan database Supabase,
supaya panel admin tetap cepat.

## Cara kerja singkat

- **Data publik** diambil dengan kunci publik dan disimpan di cache Next.js (`lib/data.ts`).
  Setiap kali admin menyimpan perubahan, cache dikosongkan (`updateTag("konten")`) sehingga perubahan langsung tampil.
  Berita/pengumuman terjadwal tampil paling lambat 10 menit setelah waktunya (`cacheLife.konten` di `next.config.ts`).
- **Keamanan** diatur di database (RLS): pengunjung hanya bisa membaca isi yang sudah terbit;
  hanya akun di tabel `admin` yang bisa mengubah data dan mengunggah file.
- **Foto** diunggah langsung dari browser ke bucket `kapsel` di Supabase Storage (tidak lewat server Vercel),
  jadi tidak terkena batas ukuran upload Vercel. Path foto sama dengan versi Laravel.
- **Tanggal** disimpan dalam WIB tanpa zona waktu, sama seperti Laravel.

## Struktur folder

| Folder | Isi |
|---|---|
| `app/(situs)/` | Halaman publik + `situs.css` (gaya sama dengan versi Laravel) |
| `app/admin/` | Panel admin: login, ringkasan, profil, guru, PPDB, pesan, berita, pengumuman, galeri, akun |
| `components/situs/`, `components/admin/` | Komponen tampilan |
| `lib/data.ts` | Pengambilan data publik (dengan cache) |
| `lib/admin.ts` | Bantuan Server Action admin (cek akses, slug, waktu WIB) |
| `lib/supabase/` | Klien Supabase (publik, server, browser) |
| `proxy.ts` | Memperbarui sesi login dan mengarahkan `/admin` ke halaman login |
| `scripts/` | Skrip akun admin |
| `supabase/migrations/` | SQL keamanan database |
