import Link from "next/link";

/**
 * Penomoran halaman sesuai desain:
 * "Menampilkan 1–6 dari 6 konten" + Sebelumnya / nomor / Berikutnya.
 */
export function Penomoran({
  total,
  halaman,
  perHalaman,
  satuan = "konten",
  dasar,
  kueri,
}: {
  total: number;
  halaman: number;
  perHalaman: number;
  satuan?: string;
  /** Alamat halaman, misalnya "/berita". */
  dasar: string;
  /** Filter yang sedang aktif (cari, kategori, dll.), ikut dibawa ke halaman lain. */
  kueri: Record<string, string | undefined>;
}) {
  if (total <= 0) return null;

  const terakhir = Math.max(1, Math.ceil(total / perHalaman));
  const pertama = (halaman - 1) * perHalaman + 1;
  const akhir = Math.min(total, halaman * perHalaman);

  const url = (n: number) => {
    const params = new URLSearchParams();
    Object.entries(kueri).forEach(([k, v]) => v && params.set(k, v));
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `${dasar}?${qs}` : dasar;
  };

  const nomor: number[] = [];
  for (let n = Math.max(1, halaman - 2); n <= Math.min(terakhir, halaman + 2); n++) nomor.push(n);

  return (
    <div className="halaman-nomor">
      <span>
        Menampilkan {pertama}–{akhir} dari {total} {satuan}
      </span>
      <div className="tombol-grup">
        {halaman <= 1 ? (
          <span className="nomor mati">Sebelumnya</span>
        ) : (
          <Link href={url(halaman - 1)} rel="prev">
            Sebelumnya
          </Link>
        )}

        {nomor.map((n) =>
          n === halaman ? (
            <span key={n} className="nomor aktif" aria-current="page">
              {n}
            </span>
          ) : (
            <Link key={n} href={url(n)}>
              {n}
            </Link>
          ),
        )}

        {halaman < terakhir ? (
          <Link href={url(halaman + 1)} rel="next">
            Berikutnya
          </Link>
        ) : (
          <span className="nomor mati">Berikutnya</span>
        )}
      </div>
    </div>
  );
}
