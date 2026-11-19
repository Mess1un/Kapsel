// Menampilkan daftar akun admin (untuk admin yang lupa email akunnya).
// Jalankan dari folder nextjs:  npm run admin:daftar
// Butuh SUPABASE_SECRET_KEY di file .env.local (jangan dibagikan).
//
// Untuk mengatur ulang kata sandi seorang admin tanpa email, jalankan
// `npm run admin:tambah` dengan email yang sama: kata sandinya akan diganti.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const kunci = process.env.SUPABASE_SECRET_KEY;
if (!url || !kunci) {
  console.error("Isi NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SECRET_KEY di file .env.local terlebih dahulu.");
  process.exit(1);
}

const supabase = createClient(url, kunci, { auth: { persistSession: false, autoRefreshToken: false } });

const [{ data: admin, error }, { data: auth, error: galatAuth }] = await Promise.all([
  supabase.from("admin").select("user_id, nama, dibuat_pada").order("dibuat_pada"),
  supabase.auth.admin.listUsers({ perPage: 1000 }),
]);
if (error || galatAuth) {
  console.error(`Gagal membaca daftar admin: ${(error ?? galatAuth).message}`);
  process.exit(1);
}

const pengguna = new Map(auth.users.map((u) => [u.id, u]));
const tanggal = (t) => (t ? new Date(t).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) : "belum pernah");

console.log(`\n${admin.length} akun admin:\n`);
for (const a of admin) {
  const u = pengguna.get(a.user_id);
  console.log(`- ${u?.email ?? "(akun tidak ditemukan)"}  —  ${a.nama || "-"}  (terakhir masuk: ${tanggal(u?.last_sign_in_at)})`);
}
console.log("\nAtur ulang kata sandi seorang admin: npm run admin:tambah (isi email yang sama).");
