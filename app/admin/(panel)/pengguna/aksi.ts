"use server";

import { aksesAdmin, pesanGalat, teks, type HasilAksi } from "@/lib/admin";
import { KunciRahasiaKosong, supabaseRahasia } from "@/lib/supabase/rahasia";

const EMAIL_VALID = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function galat(e: unknown): HasilAksi {
  if (e instanceof KunciRahasiaKosong) return { galat: e.message };
  return pesanGalat(e);
}

/** Id akun admin yang sedang login. */
async function idSaya(): Promise<string> {
  const supabase = await aksesAdmin();
  const { data } = await supabase.auth.getUser();
  return data.user!.id;
}

async function cariAkun(email: string) {
  const { data, error } = await supabaseRahasia().auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  return data.users.find((u) => u.email?.toLowerCase() === email) ?? null;
}

export async function tambahAdmin(input: { nama: string; email: string; sandi: string }): Promise<HasilAksi> {
  try {
    await aksesAdmin();
    const rahasia = supabaseRahasia();

    const nama = teks(input.nama, 100);
    const email = (teks(input.email) ?? "").toLowerCase();
    const sandi = typeof input.sandi === "string" ? input.sandi : "";
    if (!nama) return { galat: "Nama wajib diisi." };
    if (!EMAIL_VALID.test(email)) return { galat: "Format email tidak valid." };
    if (sandi.length < 8) return { galat: "Kata sandi sementara minimal 8 karakter." };

    let userId: string;
    const ada = await cariAkun(email);
    if (ada) {
      const { data: sudahAdmin } = await rahasia.from("admin").select("user_id").eq("user_id", ada.id).maybeSingle();
      if (sudahAdmin) return { galat: `${email} sudah terdaftar sebagai admin.` };
      const { error } = await rahasia.auth.admin.updateUserById(ada.id, { password: sandi, email_confirm: true });
      if (error) throw error;
      userId = ada.id;
    } else {
      const { data, error } = await rahasia.auth.admin.createUser({
        email,
        password: sandi,
        email_confirm: true,
        user_metadata: { nama },
      });
      if (error) throw error;
      userId = data.user.id;
    }

    const { error } = await rahasia.from("admin").insert({ user_id: userId, nama });
    if (error) throw error;

    return { pesan: `Akun ${email} sudah bisa dipakai masuk.` };
  } catch (e) {
    return galat(e);
  }
}

export async function aturUlangSandi(userId: string, sandi: string): Promise<HasilAksi> {
  try {
    await aksesAdmin();
    if (typeof sandi !== "string" || sandi.length < 8) return { galat: "Kata sandi minimal 8 karakter." };
    const rahasia = supabaseRahasia();

    const { data: target } = await rahasia.from("admin").select("user_id").eq("user_id", userId).maybeSingle();
    if (!target) return { galat: "Akun admin tidak ditemukan." };

    const { error } = await rahasia.auth.admin.updateUserById(userId, { password: sandi });
    if (error) throw error;
    return { pesan: "Kata sandi diganti. Berikan kata sandi baru ini kepada admin tersebut." };
  } catch (e) {
    return galat(e);
  }
}

export async function hapusAdmin(userId: string): Promise<HasilAksi> {
  try {
    if (userId === (await idSaya())) return { galat: "Tidak bisa menghapus akun Anda sendiri." };
    const rahasia = supabaseRahasia();

    const { count } = await rahasia.from("admin").select("user_id", { count: "exact", head: true });
    if ((count ?? 0) <= 1) return { galat: "Harus tersisa minimal satu admin." };

    // Hapus akun login sekaligus (baris di tabel admin ikut terhapus otomatis).
    const { error } = await rahasia.auth.admin.deleteUser(userId);
    if (error) throw error;
    return {};
  } catch (e) {
    return galat(e);
  }
}
