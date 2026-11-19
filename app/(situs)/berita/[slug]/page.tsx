import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Foto } from "@/components/situs/Foto";
import { KartuBerita } from "@/components/situs/Kartu";
import { ambilBerita, ambilBeritaLain } from "@/lib/data";
import { angka, batasi, cuplikan, htmlAman, menitBaca, tanggalIndonesia } from "@/lib/format";
import { CatatPembaca } from "./CatatPembaca";

export const instant = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const berita = await ambilBerita((await params).slug);
  if (!berita) return {};
  return { title: berita.judul, description: batasi(cuplikan(berita), 160) };
}

export default async function DetailBerita({ params }: Props) {
  const { slug } = await params;
  const berita = await ambilBerita(slug);
  if (!berita) notFound();

  const terkait = await ambilBeritaLain(berita.id, 3);

  return (
    <>
      <CatatPembaca slug={berita.slug} />

      <section className="wadah">
        <div className="detail-kepala">
          <nav className="remah" aria-label="Remah roti">
            <Link href="/">Beranda</Link> / <Link href="/berita">Berita &amp; Kegiatan</Link> /{" "}
            <span>{batasi(berita.judul, 40)}</span>
          </nav>
          {berita.kategori ? <span className="badge">{berita.kategori}</span> : null}
          <h1>{berita.judul}</h1>
          {berita.ringkasan ? <p className="sub">{berita.ringkasan}</p> : null}
          <p className="meta">
            {tanggalIndonesia(berita.tanggal_terbit)}
            {berita.penulis ? ` • ${berita.penulis}` : ""} • {menitBaca(berita.isi)} menit baca
          </p>
        </div>
      </section>

      {berita.gambar ? (
        <div className="wadah">
          <div className="foto-utama">
            <Foto src={berita.gambar} alt={berita.judul} />
          </div>
          {berita.keterangan_gambar ? <p className="keterangan-foto">{berita.keterangan_gambar}</p> : null}
        </div>
      ) : null}

      <section className="bagian-rapat" style={{ paddingTop: berita.gambar ? 0 : 8 }}>
        <div className="wadah detail-tata">
          <article>
            <div className="konten" dangerouslySetInnerHTML={{ __html: htmlAman(berita.isi) }} />
            <Link className="tombol tombol-garis tombol-kecil" href="/berita" style={{ marginTop: 12 }}>
              ← Kembali ke Berita
            </Link>
          </article>
          <aside className="sisi">
            <div className="kartu kartu-isi">
              <h3>Tentang kegiatan</h3>
              <dl className="daftar-info">
                {berita.kategori ? (
                  <>
                    <dt>Kategori</dt>
                    <dd>{berita.kategori}</dd>
                  </>
                ) : null}
                {berita.penulis ? (
                  <>
                    <dt>Dokumentasi</dt>
                    <dd>{berita.penulis}</dd>
                  </>
                ) : null}
                {berita.topik ? (
                  <>
                    <dt>Topik</dt>
                    <dd>{berita.topik}</dd>
                  </>
                ) : null}
                <dt>Dilihat</dt>
                <dd>{angka(berita.dilihat)} kali</dd>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {terkait.length > 0 ? (
        <section className="bagian" style={{ paddingTop: 8 }}>
          <div className="wadah">
            <h2 className="judul-bagian" style={{ marginBottom: 20 }}>Cerita lainnya</h2>
            <div className="kisi kisi-3">
              {terkait.map((item) => (
                <KartuBerita key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
