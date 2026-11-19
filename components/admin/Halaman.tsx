import Link from "next/link";

/** Penomoran sederhana untuk tabel admin. */
export function HalamanAdmin({
  total,
  halaman,
  perHalaman,
  dasar,
  kueri,
}: {
  total: number;
  halaman: number;
  perHalaman: number;
  dasar: string;
  kueri: Record<string, string>;
}) {
  const terakhir = Math.max(1, Math.ceil(total / perHalaman));
  if (terakhir <= 1) return <p className="bantuan" style={{ marginTop: 10 }}>{total} data</p>;

  const url = (n: number) => {
    const p = new URLSearchParams(Object.entries(kueri).filter(([, v]) => v));
    if (n > 1) p.set("page", String(n));
    const qs = p.toString();
    return qs ? `${dasar}?${qs}` : dasar;
  };

  return (
    <div className="baris-tombol" style={{ marginTop: 12, justifyContent: "space-between" }}>
      <span className="bantuan">
        Halaman {halaman} dari {terakhir} • {total} data
      </span>
      <span className="baris-tombol">
        {halaman > 1 ? <Link className="tbl tbl-kecil" href={url(halaman - 1)}>← Sebelumnya</Link> : null}
        {halaman < terakhir ? <Link className="tbl tbl-kecil" href={url(halaman + 1)}>Berikutnya →</Link> : null}
      </span>
    </div>
  );
}
