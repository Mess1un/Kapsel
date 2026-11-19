import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseServer } from "./supabase/server";

export type HasilAksi = { galat?: string; pesan?: string };

/**
 * Dipakai di awal setiap Server Action admin: memastikan yang memanggil
 * benar-benar admin yang sedang login. Database juga memeriksa hal yang
 * sama lewat RLS, jadi ini lapisan pengaman kedua dengan pesan yang jelas.
 */
export async function aksesAdmin(): Promise<SupabaseClient> {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new GalatAdmin("Sesi login sudah berakhir. Silakan masuk lagi.");

  const { data: admin } = await supabase.from("admin").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) throw new GalatAdmin("Akun ini tidak terdaftar sebagai admin.");

  return supabase;
}

export class GalatAdmin extends Error {}

/** Ubah galat menjadi pesan yang bisa ditampilkan di formulir. */
export function pesanGalat(e: unknown): HasilAksi {
  if (e instanceof GalatAdmin) return { galat: e.message };
  if (e && typeof e === "object" && "message" in e) return { galat: `Gagal menyimpan: ${String(e.message)}` };
  return { galat: "Terjadi kesalahan. Coba lagi." };
}

/** "Pekan Olahraga 2027" -> "pekan-olahraga-2027" */
export function buatSlug(judul: string): string {
  return (
    judul
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 200) || "tanpa-judul"
  );
}

/** Slug unik untuk tabel berita/pengumuman (ditambah -2, -3, dst. bila sudah dipakai). */
export async function slugUnik(
  supabase: SupabaseClient,
  tabel: "berita" | "pengumuman",
  judul: string,
  kecualiId?: number,
): Promise<string> {
  const dasar = buatSlug(judul);
  let slug = dasar;

  for (let i = 2; ; i++) {
    let kueri = supabase.from(tabel).select("id").eq("slug", slug).limit(1);
    if (kecualiId) kueri = kueri.neq("id", kecualiId);
    const { data, error } = await kueri;
    if (error) throw error;
    if (!data || data.length === 0) return slug;
    slug = `${dasar}-${i}`;
  }
}

/**
 * Waktu sekarang dalam WIB tanpa zona waktu ("2026-11-20 14:05:00"),
 * sama dengan format kolom timestamp yang dibuat Laravel.
 */
export function waktuWib(tanggal = new Date()): string {
  const bagian = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(tanggal)
      .map((p) => [p.type, p.value]),
  );
  return `${bagian.year}-${bagian.month}-${bagian.day} ${bagian.hour}:${bagian.minute}:${bagian.second}`;
}

/** Teks dari formulir: dirapikan, kosong menjadi null, dipotong sesuai batas kolom. */
export function teks(nilai: unknown, maks = 255): string | null {
  if (typeof nilai !== "string") return null;
  const t = nilai.trim();
  return t === "" ? null : t.slice(0, maks);
}

/** Bilangan bulat >= 0, atau nilai bawaan. */
export function bulat(nilai: unknown, bawaan: number | null = 0): number | null {
  const n = typeof nilai === "number" ? nilai : Number.parseInt(String(nilai ?? ""), 10);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : bawaan;
}

/** "2026-11-20T14:05" (input datetime-local) -> "2026-11-20 14:05:00", atau null. */
export function tanggalWaktu(nilai: unknown): string | null {
  if (typeof nilai !== "string") return null;
  const cocok = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})(?::\d{2})?/.exec(nilai.trim());
  return cocok ? `${cocok[1]} ${cocok[2]}:00` : null;
}

/** "2026-11-20" (input date), atau null. */
export function tanggal(nilai: unknown): string | null {
  if (typeof nilai !== "string") return null;
  const cocok = /^\d{4}-\d{2}-\d{2}/.exec(nilai.trim());
  return cocok ? cocok[0] : null;
}

/** Path file di bucket "kapsel" yang boleh disimpan (bukan alamat luar). */
export function pathFile(nilai: unknown): string | null {
  if (typeof nilai !== "string") return null;
  const t = nilai.trim().replace(/^\/+/, "");
  if (t === "" || t.includes("..") || /^[a-z]+:/i.test(t)) return null;
  return t.slice(0, 255);
}

/** Daftar teks (misi, ketentuan, berkas) tanpa butir kosong. */
export function daftarTeks(nilai: unknown, maks = 500): string[] {
  if (!Array.isArray(nilai)) return [];
  return nilai.map((v) => teks(v, maks)).filter((v): v is string => v !== null);
}
