// Membuat akun admin baru, atau MENGATUR ULANG kata sandi admin yang sudah ada
// (isi email yang sama). Berguna bila admin lupa kata sandi dan tidak bisa
// menerima email atur ulang.
// Jalankan dari folder nextjs:  npm run admin:tambah
// Butuh SUPABASE_SECRET_KEY di file .env.local (jangan dibagikan).

import { createClient } from "@supabase/supabase-js";
import { createInterface } from "node:readline";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const kunci = process.env.SUPABASE_SECRET_KEY;
if (!url || !kunci) {
  console.error("Isi NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SECRET_KEY di file .env.local terlebih dahulu.");
  process.exit(1);
}

const supabase = createClient(url, kunci, { auth: { persistSession: false, autoRefreshToken: false } });

/** Tanya satu baris. Bila tersembunyi, ketikan tidak ditampilkan (untuk kata sandi). */
function tanya(pertanyaan, tersembunyi = false) {
  return new Promise((selesai) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (tersembunyi) {
      rl._writeToOutput = (teks) => {
        if (teks.includes(pertanyaan)) rl.output.write(teks);
      };
    }
    rl.question(pertanyaan, (jawaban) => {
      rl.close();
      if (tersembunyi) process.stdout.write("\n");
      selesai(jawaban.trim());
    });
  });
}

const email = (await tanya("Email admin: ")).toLowerCase();
const nama = await tanya("Nama admin: ");
const sandi = await tanya("Kata sandi (min. 8 karakter, tidak terlihat saat diketik): ", true);

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Format email tidak valid.");
  process.exit(1);
}
if (sandi.length < 8) {
  console.error("Kata sandi minimal 8 karakter.");
  process.exit(1);
}

let userId;
const { data: dibuat, error } = await supabase.auth.admin.createUser({
  email,
  password: sandi,
  email_confirm: true,
  user_metadata: { nama },
});

if (error) {
  // Akun sudah ada: cari lalu perbarui kata sandinya.
  const { data: daftar, error: galatDaftar } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const ada = daftar?.users.find((u) => u.email?.toLowerCase() === email);
  if (galatDaftar || !ada) {
    console.error(`Gagal membuat akun: ${error.message}`);
    process.exit(1);
  }
  const { error: galatUbah } = await supabase.auth.admin.updateUserById(ada.id, { password: sandi, email_confirm: true });
  if (galatUbah) {
    console.error(`Gagal memperbarui akun: ${galatUbah.message}`);
    process.exit(1);
  }
  userId = ada.id;
  console.log("Akun sudah ada, kata sandi diperbarui.");
} else {
  userId = dibuat.user.id;
}

const { error: galatAdmin } = await supabase.from("admin").upsert({ user_id: userId, nama: nama || email });
if (galatAdmin) {
  console.error(`Akun dibuat, tetapi gagal didaftarkan sebagai admin: ${galatAdmin.message}`);
  console.error("Pastikan file supabase/migrations/0001_keamanan_dan_admin.sql sudah dijalankan.");
  process.exit(1);
}

console.log(`Selesai. ${email} sekarang bisa masuk di /admin/login`);
