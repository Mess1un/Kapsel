// Memindahkan akun admin lama (tabel "users" buatan Laravel/Filament) ke Supabase Auth,
// lengkap dengan kata sandi lamanya. Jalankan sekali dari folder nextjs:  npm run admin:pindah
// Butuh SUPABASE_SECRET_KEY di file .env.local (jangan dibagikan).

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const kunci = process.env.SUPABASE_SECRET_KEY;
if (!url || !kunci) {
  console.error("Isi NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SECRET_KEY di file .env.local terlebih dahulu.");
  process.exit(1);
}

const supabase = createClient(url, kunci, { auth: { persistSession: false, autoRefreshToken: false } });

const { data: penggunaLama, error } = await supabase.from("users").select("id, name, email, password").order("id");
if (error) {
  console.error(`Gagal membaca tabel users: ${error.message}`);
  process.exit(1);
}

const { data: daftarAuth } = await supabase.auth.admin.listUsers({ perPage: 1000 });
const sudahAda = new Map((daftarAuth?.users ?? []).map((u) => [u.email?.toLowerCase(), u.id]));

let berhasil = 0;
for (const p of penggunaLama) {
  const email = String(p.email ?? "").trim().toLowerCase();
  const hash = String(p.password ?? "");

  // Laravel memakai bcrypt "$2y$", Supabase menerima bentuk yang sama sebagai "$2a$".
  if (!/^\$2[aby]\$\d{2}\$/.test(hash)) {
    console.warn(`- ${email}: dilewati, kata sandi tidak terenkripsi bcrypt (buat ulang dengan npm run admin:tambah).`);
    continue;
  }
  const passwordHash = hash.replace(/^\$2y\$/, "$2a$");

  let userId = sudahAda.get(email);
  if (userId) {
    console.log(`- ${email}: sudah ada di Supabase Auth, hanya didaftarkan sebagai admin.`);
  } else {
    const { data, error: galat } = await supabase.auth.admin.createUser({
      email,
      password_hash: passwordHash,
      email_confirm: true,
      user_metadata: { nama: p.name },
    });
    if (galat) {
      console.warn(`- ${email}: gagal dibuat (${galat.message}).`);
      continue;
    }
    userId = data.user.id;
    console.log(`- ${email}: dipindahkan.`);
  }

  const { error: galatAdmin } = await supabase.from("admin").upsert({ user_id: userId, nama: p.name ?? email });
  if (galatAdmin) {
    console.warn(`  gagal didaftarkan sebagai admin: ${galatAdmin.message}`);
    continue;
  }
  berhasil++;
}

console.log(`\nSelesai: ${berhasil} dari ${penggunaLama.length} akun bisa masuk di /admin/login dengan email (huruf kecil) dan kata sandi lama.`);
