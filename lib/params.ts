export type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Nilai teks dari parameter alamat (?cari=...), atau "" bila tidak ada. */
export function teksParam(params: Record<string, string | string[] | undefined>, nama: string): string {
  const nilai = params[nama];
  return (Array.isArray(nilai) ? nilai[0] : nilai)?.trim() ?? "";
}

/** Nomor halaman dari ?page=..., minimal 1. */
export function nomorHalaman(params: Record<string, string | string[] | undefined>): number {
  const n = Number.parseInt(teksParam(params, "page"), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
