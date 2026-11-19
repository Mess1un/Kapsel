# Kapsel — Web Profil Sekolah

Website profil sekolah dengan **Next.js** dan **Supabase** (database, login admin, dan penyimpanan foto).
Bisa di-deploy ke **Vercel**. Versi lama (Laravel + Filament) diarsipkan di repo `Kapsel-Web`.

- **Halaman publik**: `/`, `/profil`, `/guru`, `/pengumuman`, `/berita`, `/galeri`, `/ppdb`, `/kontak`
- **Panel admin**: `/admin` (login dengan Supabase Auth)

## Menjalankan di komputer

Butuh **Node.js 20 atau lebih baru**.

```bash
npm install
cp .env.example .env.local   # lalu isi nilainya (lihat di bawah)
npm run dev                  # buka http://localhost:3000
```

Isi `.env.local` (dashboard Supabase → **Project Settings → API Keys**):

| Variabel | Isi | Rahasia? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` | Tidak |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Kunci *Publishable* (`sb_publishable_...`) | Tidak (terlihat di browser, aman karena RLS) |
| `SUPABASE_SECRET_KEY` | Kunci *Secret* (`sb_secret_...`) | **Ya** — untuk menu *Akun Admin* dan skrip `npm run admin:*`. Hanya dibaca server; jangan di-commit |

## Persiapan Supabase (sekali saja)

1. **Keamanan database**: di Supabase buka **SQL Editor**, tempel isi
   [`supabase/migrations/0001_keamanan_dan_admin.sql`](supabase/migrations/0001_keamanan_dan_admin.sql), lalu **Run**.
   File ini menyalakan RLS di semua tabel, membuat tabel `admin`, dan mengatur izin unggah foto.
   Aman dijalankan berulang kali.
2. **Matikan pendaftaran akun dari luar**: **Authentication → Sign In / Providers → Allow new users to sign up** → nonaktifkan.
   (Akun yang tidak ada di tabel `admin` memang tidak bisa mengubah apa pun, tetapi lebih baik dimatikan.)
3. **Akun admin**:
   - Pindahkan akun lama Filament (kata sandi tetap sama): `npm run admin:pindah`
   - Tambah admin baru: paling mudah lewat menu **Akun Admin** di panel (lihat di bawah), atau `npm run admin:tambah`

   Keduanya butuh `SUPABASE_SECRET_KEY` di `.env.local`. Login memakai email dalam huruf kecil.
4. **Alamat tautan email** (untuk fitur lupa kata sandi): **Authentication → URL Configuration**
   - *Site URL*: alamat website di Vercel, misalnya `https://kapsel-web.vercel.app`
   - *Redirect URLs*: tambahkan `http://localhost:3000/admin/atur-sandi` dan
     `https://<alamat-vercel>/admin/atur-sandi`
5. **Pengirim email**: layanan email bawaan Supabase hanya mengirim ke email anggota tim di
   organisasi Supabase dan dibatasi beberapa email per jam. Agar email atur ulang sampai ke semua admin,
   atur SMTP sendiri di **Authentication → Emails → SMTP Settings** (misalnya Resend, Brevo, atau Gmail).

## Menambah admin baru (cara mudah)

1. Masuk ke panel admin → menu **Akun Admin**.
2. Isi **Nama** dan **Email**, klik **Buat acak** untuk kata sandi sementara, lalu **+ Tambah admin**.
3. Klik **Salin** pada kotak hijau dan kirim info masuk itu ke admin baru (misalnya lewat WhatsApp).
4. Admin baru masuk di `/admin/login` lalu mengganti kata sandinya di menu **Akun Saya**.

Di menu yang sama ada tombol **Atur ulang sandi** (membuat kata sandi baru untuk admin lain) dan **Hapus**.
Akun sendiri tidak bisa dihapus, dan minimal harus tersisa satu admin.

## Lupa kata sandi / lupa akun

- **Lupa kata sandi**: di halaman masuk klik *Lupa kata sandi atau email akun?*, isi email, lalu buka tautan
  dari email **di browser yang sama**. Admin diminta membuat kata sandi baru dan langsung masuk.
- **Lupa email akun** atau **tidak bisa menerima email**: admin lain membuka menu **Akun Admin** untuk melihat
  email semua admin dan menekan **Atur ulang sandi**. Tanpa panel, pengelola juga bisa menjalankan
  - `npm run admin:daftar` — melihat semua email admin dan kapan terakhir masuk;
  - `npm run admin:tambah` — isi email admin tersebut dengan kata sandi baru; kata sandinya langsung diganti.
- Admin yang sudah masuk bisa mengganti kata sandinya sendiri di menu **Akun Saya**.

## Deploy ke Vercel

1. Push repo ke GitHub.
2. Di [vercel.com](https://vercel.com) → **Add New → Project** → pilih repo `Kapsel`.
3. Framework otomatis terdeteksi sebagai Next.js (Root Directory biarkan kosong).
4. **Environment Variables**: isi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, dan
   `SUPABASE_SECRET_KEY` (centang hanya *Production*/*Preview*; tanpa kunci ini menu *Akun Admin* tidak aktif).
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
