import Link from "next/link";
import { Foto } from "@/components/situs/Foto";
import { KartuBerita, KartuPengumuman } from "@/components/situs/Kartu";
import {
  ambilDaftarBerita,
  ambilDaftarGaleri,
  ambilGuruAktif,
  ambilPengumumanBeranda,
  ambilPpdb,
  ambilProfil,
} from "@/lib/data";
import { sebelum } from "@/lib/format";

export default async function Beranda() {
  const [profil, ppdb, pengumumanTerbaru, berita, galeri, guru] = await Promise.all([
    ambilProfil(),
    ambilPpdb(),
    ambilPengumumanBeranda(3),
    ambilDaftarBerita({ perHalaman: 3 }),
    ambilDaftarGaleri({ perHalaman: 6 }),
    ambilGuruAktif(),
  ]);

  const beritaTerbaru = berita.data;
  // Satu foto (sampul) dari tiap album terbaru untuk bagian "Momen kebersamaan".
  const galeriTerbaru = galeri.data.filter((a) => a.foto?.[0]).slice(0, 3);
  const fotoGuru = guru.find((g) => g.foto)?.foto ?? null;
  const paragrafPengenalan = (profil.pengenalan ?? "").trim().split(/\n\s*\n/).filter(Boolean);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="wadah">
          <div className="hero-kotak">
            <div className="hero-teks">
              <span className="label">Selamat datang di {profil.nama_sekolah}</span>
              <h1>{profil.hero_judul || profil.nama_sekolah}</h1>
              {profil.hero_deskripsi ? <p>{profil.hero_deskripsi}</p> : null}
              <div className="hero-tombol">
                <Link href="/profil" className="tombol tombol-putih">Kenali Sekolah</Link>
                <Link href="/ppdb" className="tombol tombol-oranye">Informasi PPDB →</Link>
              </div>
            </div>
            <div className="hero-foto">
              <Foto src={profil.gambar_banner} alt={`Gedung ${profil.nama_sekolah}`} />
            </div>
          </div>
          <div className="hero-pita">
            <span>Informasi terbuka untuk semua</span>
            {profil.jam_operasional ? (
              <span>Layanan sekolah • {sebelum(sebelum(profil.jam_operasional, "\n"), ":")}</span>
            ) : null}
            {ppdb?.tahun_ajaran ? <span>Tahun ajaran {ppdb.tahun_ajaran}</span> : null}
          </div>
        </div>
      </section>

      {/* Mengenal sekolah */}
      {profil.pengenalan ? (
        <section className="bagian" style={{ background: "var(--latar-lembut)" }}>
          <div className="wadah kenal">
            <div>
              <span className="label">Mengenal sekolah</span>
              <h2>{profil.pengenalan_judul || `Mengenal ${profil.nama_sekolah}`}</h2>
            </div>
            <div className="kenal-teks">
              {paragrafPengenalan.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <Link className="tautan-panah" href="/profil">Baca profil sekolah →</Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Sambutan kepala sekolah */}
      {profil.sambutan || profil.kutipan_sambutan ? (
        <section className="bagian-rapat" style={{ background: "var(--latar-lembut)", paddingTop: 0 }}>
          <div className="wadah">
            <div className="kartu sambutan">
              <div className="foto-bingkai">
                <Foto src={profil.foto_kepala_sekolah} alt={profil.nama_kepala_sekolah} ikon="pengguna" />
              </div>
              <div>
                <span className="label">Sambutan kepala sekolah</span>
                {profil.kutipan_sambutan ? <blockquote>“{profil.kutipan_sambutan}”</blockquote> : null}
                {profil.sambutan ? <p>{profil.sambutan}</p> : null}
                {profil.nama_kepala_sekolah ? (
                  <>
                    <p className="nama">{profil.nama_kepala_sekolah}</p>
                    <span className="meta">Kepala Sekolah</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Pengumuman */}
      <section className="bagian">
        <div className="wadah">
          <div className="kepala-bagian">
            <div>
              <span className="label">Papan informasi</span>
              <h2 className="judul-bagian">Pengumuman terbaru</h2>
            </div>
            <Link className="tautan-panah" href="/pengumuman">Semua pengumuman →</Link>
          </div>
          {pengumumanTerbaru.length === 0 ? (
            <p className="kosong">Belum ada pengumuman.</p>
          ) : (
            <div className="kisi kisi-3">
              {pengumumanTerbaru.map((item) => (
                <KartuPengumuman key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Berita */}
      <section className="bagian" style={{ paddingTop: 0 }}>
        <div className="wadah">
          <div className="kepala-bagian">
            <div>
              <span className="label">Berita &amp; kegiatan</span>
              <h2 className="judul-bagian">Cerita dari sekolah</h2>
            </div>
            <Link className="tautan-panah" href="/berita">Semua berita →</Link>
          </div>
          {beritaTerbaru.length === 0 ? (
            <p className="kosong">Belum ada berita.</p>
          ) : (
            <div className="kisi kisi-3">
              {beritaTerbaru.map((item) => (
                <KartuBerita key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sorotan: fasilitas & guru */}
      <section className="bagian" style={{ paddingTop: 0 }}>
        <div className="wadah kisi kisi-2">
          <div className="sorotan">
            <div className="foto-bingkai" style={{ borderRadius: 6 }}>
              <Foto src={profil.fasilitas?.[0]?.foto} alt="Fasilitas sekolah" />
            </div>
            <h3>Ruang yang mendukung rasa ingin tahu</h3>
            <p>
              Ruang kelas, perpustakaan, halaman, dan kebun menjadi bagian dari lingkungan belajar yang dirawat
              bersama.
            </p>
            <Link className="tautan-panah" href="/profil#fasilitas">Jelajahi fasilitas →</Link>
          </div>
          <div className="sorotan">
            <div className="foto-bingkai" style={{ borderRadius: 6 }}>
              <Foto src={fotoGuru} alt="Guru sekolah" ikon="pengguna" />
            </div>
            <h3>Guru yang mendampingi dengan hati</h3>
            <p>
              Kenali para pendidik yang membantu anak bertumbuh melalui bimbingan, keteladanan, dan perhatian.
            </p>
            <Link className="tautan-panah" href="/guru">Kenali para guru →</Link>
          </div>
        </div>
      </section>

      {/* Galeri */}
      {galeriTerbaru.length > 0 ? (
        <section className="bagian" style={{ paddingTop: 0 }}>
          <div className="wadah">
            <div className="kepala-bagian">
              <div>
                <span className="label">Galeri sekolah</span>
                <h2 className="judul-bagian">Momen kebersamaan</h2>
              </div>
              <Link className="tautan-panah" href="/galeri">Lihat galeri →</Link>
            </div>
            <div className="kisi kisi-3 galeri-mini">
              {galeriTerbaru.map((album) => (
                <figure key={album.id}>
                  <div className="foto-bingkai">
                    <Foto src={album.foto?.[0]} alt={album.judul} />
                  </div>
                  <figcaption>{album.deskripsi || album.judul}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Ajakan PPDB */}
      <section className="ajakan">
        <div className="wadah">
          <span className="label">Penerimaan peserta didik baru</span>
          <h2>Mari mengenal sekolah lebih dekat.</h2>
          <p>
            Pelajari persyaratan dan tahapan PPDB{ppdb?.tahun_ajaran ? ` ${ppdb.tahun_ajaran}` : ""}. Untuk konsultasi
            dan petunjuk pendaftaran, silakan menghubungi panitia atau berkunjung ke sekolah.
          </p>
          <div className="hero-tombol" style={{ marginTop: 20 }}>
            <Link href="/ppdb" className="tombol tombol-oranye">Lihat Informasi PPDB →</Link>
            <Link href="/kontak" className="tombol tombol-putih">Kontak Sekolah</Link>
          </div>
        </div>
      </section>
    </>
  );
}
