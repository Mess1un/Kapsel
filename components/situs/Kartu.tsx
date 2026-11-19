import Link from "next/link";
import { cuplikan, menitBaca, tanggalIndonesia } from "@/lib/format";
import type { Berita, Pengumuman } from "@/lib/jenis";
import { Foto } from "./Foto";

export function KartuBerita({ item }: { item: Berita }) {
  const href = `/berita/${item.slug}`;
  const tanggal = tanggalIndonesia(item.tanggal_terbit);

  return (
    <article className="kartu kartu-berita">
      <Link href={href} className="foto-bingkai" tabIndex={-1} aria-hidden="true">
        <Foto src={item.gambar} alt={item.judul} />
      </Link>
      <div className="kartu-isi">
        <span className="meta">
          {item.kategori}
          {item.kategori && tanggal ? " / " : ""}
          {tanggal}
        </span>
        <h3>
          <Link href={href}>{item.judul}</Link>
        </h3>
        <p>{cuplikan(item)}</p>
        <div className="bawah">
          <span className="meta">{menitBaca(item.isi)} menit baca</span>
          <Link className="tautan-panah" href={href}>
            Baca berita →
          </Link>
        </div>
      </div>
    </article>
  );
}

export function KartuPengumuman({ item }: { item: Pengumuman }) {
  const href = `/pengumuman/${item.slug}`;

  return (
    <article className="kartu kartu-info">
      <div className="atas">
        <span className="meta">{tanggalIndonesia(item.tanggal_terbit)}</span>
        {item.kategori ? <span className="badge">{item.kategori}</span> : null}
      </div>
      <h3>
        <Link href={href}>{item.judul}</Link>
      </h3>
      <p>{cuplikan(item)}</p>
      <Link className="tautan-panah" href={href}>
        Baca Selengkapnya →
      </Link>
    </article>
  );
}
