import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ikon } from "@/components/situs/Ikon";
import { KartuPengumuman } from "@/components/situs/Kartu";
import { ambilPengumuman, ambilPengumumanLain } from "@/lib/data";
import { batasi, cuplikan, htmlAman, tanggalIndonesia, urlFile } from "@/lib/format";

export const instant = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pengumuman = await ambilPengumuman((await params).slug);
  if (!pengumuman) return {};
  return { title: pengumuman.judul, description: batasi(cuplikan(pengumuman), 160) };
}

export default async function DetailPengumuman({ params }: Props) {
  const { slug } = await params;
  const pengumuman = await ambilPengumuman(slug);
  if (!pengumuman) notFound();

  const lainnya = await ambilPengumumanLain(pengumuman.id, 3);
  const lampiran = urlFile(pengumuman.lampiran);

  return (
    <section className="bagian-rapat" style={{ paddingBottom: 60 }}>
      <div className="wadah detail-tata">
        <article>
          <nav className="remah" aria-label="Remah roti">
            <Link href="/">Beranda</Link> / <Link href="/pengumuman">Pengumuman</Link> /{" "}
            <span>{pengumuman.judul}</span>
          </nav>
          {pengumuman.kategori ? <span className="badge">{pengumuman.kategori}</span> : null}
          <h1 style={{ fontSize: 32, margin: "14px 0 10px" }}>{pengumuman.judul}</h1>
          <p className="meta" style={{ marginBottom: 20 }}>
            Dipublikasikan {tanggalIndonesia(pengumuman.tanggal_terbit)}
          </p>

          <div className="konten" dangerouslySetInnerHTML={{ __html: htmlAman(pengumuman.isi) }} />

          {lampiran ? (
            <p>
              <a className="tombol tombol-garis" href={lampiran} target="_blank" rel="noopener">
                <Ikon nama="unduh" /> Unduh lampiran
              </a>
            </p>
          ) : null}

          <Link className="tombol tombol-garis tombol-kecil" href="/pengumuman" style={{ marginTop: 12 }}>
            ← Kembali ke Pengumuman
          </Link>
        </article>

        {lainnya.length > 0 ? (
          <aside className="sisi" style={{ paddingTop: 40 }}>
            <h3>Informasi lainnya</h3>
            {lainnya.map((item) => (
              <KartuPengumuman key={item.id} item={item} />
            ))}
          </aside>
        ) : null}
      </div>
    </section>
  );
}
