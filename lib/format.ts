import sanitizeHtml from "sanitize-html";

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/**
 * "2026-05-12T08:00:00" / "2026-05-12" -> "12 Mei 2026".
 * Tanggal di database disimpan dalam waktu Indonesia (WIB) tanpa zona waktu,
 * jadi cukup dibaca angkanya tanpa konversi.
 */
export function tanggalIndonesia(nilai: string | null | undefined): string {
  if (!nilai) return "";
  const cocok = /^(\d{4})-(\d{2})-(\d{2})/.exec(nilai);
  if (!cocok) return "";
  return `${Number(cocok[3])} ${BULAN[Number(cocok[2]) - 1]} ${cocok[1]}`;
}

/** Teks polos dari HTML, spasi dirapikan. */
export function teksPolos(html: string | null | undefined): string {
  return sanitizeHtml(html ?? "", { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Potong teks dan tambahkan "..." (seperti Str::limit di Laravel). */
export function batasi(teks: string, panjang: number): string {
  return teks.length <= panjang ? teks : teks.slice(0, panjang).trimEnd() + "...";
}

/** Ringkasan untuk kartu: kolom ringkasan, atau awal isi. */
export function cuplikan(item: { ringkasan: string | null; isi: string | null }): string {
  return item.ringkasan || batasi(teksPolos(item.isi), 130);
}

/** Perkiraan waktu baca (±200 kata per menit). */
export function menitBaca(isi: string | null | undefined): number {
  const kata = teksPolos(isi).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(kata / 200));
}

/** HTML dari editor teks yang aman ditampilkan (skrip dan atribut berbahaya dibuang). */
export function htmlAman(html: string | null | undefined): string {
  return sanitizeHtml(html ?? "", {
    allowedTags: [
      "p", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "u", "s", "del",
      "a", "ul", "ol", "li", "blockquote", "code", "pre", "span", "sub", "sup", "mark",
      "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "title"],
      img: ["src", "alt", "title", "width", "height"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: attribs.target === "_blank" ? { ...attribs, rel: "noopener noreferrer" } : attribs,
      }),
    },
  });
}

/** Alamat publik file di Supabase Storage (bucket "kapsel"). */
export function urlFile(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  const dasar = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
  const jalur = path.replace(/^\/+/, "").split("/").map(encodeURIComponent).join("/");
  return `${dasar}/storage/v1/object/public/kapsel/${jalur}`;
}

/** Nomor telepon untuk tautan tel: (angka dan + saja). */
export function nomorTel(teks: string): string {
  return teks.replace(/[^0-9+]/g, "");
}

/** Nomor WhatsApp untuk wa.me (angka saja). */
export function nomorWa(teks: string): string {
  return teks.replace(/\D/g, "");
}

/** Bagian teks sebelum pemisah pertama (seperti Str::before). */
export function sebelum(teks: string, pemisah: string): string {
  const i = teks.indexOf(pemisah);
  return i === -1 ? teks : teks.slice(0, i);
}

export function duaDigit(n: number): string {
  return String(n).padStart(2, "0");
}

export function angka(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}
