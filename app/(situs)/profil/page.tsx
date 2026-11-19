import type { Metadata } from "next";
import { Foto } from "@/components/situs/Foto";
import { JudulHalaman } from "@/components/situs/JudulHalaman";
import { ambilProfil } from "@/lib/data";
import { duaDigit, htmlAman } from "@/lib/format";

export const metadata: Metadata = { title: "Profil Sekolah" };

export default async function HalamanProfil() {
  const profil = await ambilProfil();
  const misi = profil.misi ?? [];
  const fasilitas = profil.fasilitas ?? [];
  const struktur = profil.struktur_organisasi ?? [];
  const [pimpinan, ...anggota] = struktur;

  return (
    <>
      <JudulHalaman
        judul={`Mengenal ${profil.nama_sekolah}`}
        sub="Membangun fondasi pengetahuan, karakter, dan kepedulian bersama keluarga."
        remah={[{ teks: "Profil" }]}
      />

      <section className="bagian-rapat">
        <div className="wadah">
          <div className="banner-profil">
            <Foto src={profil.gambar_banner} alt={`Gedung ${profil.nama_sekolah}`} />
          </div>
        </div>
      </section>

      {/* Sejarah + identitas */}
      <section className="bagian-rapat">
        <div className="wadah sejarah">
          <div>
            <span className="label">Sejarah sekolah</span>
            <h2 className="judul-bagian" style={{ marginBottom: 16 }}>Berakar pada kebersamaan</h2>
            <div className="konten" dangerouslySetInnerHTML={{ __html: htmlAman(profil.sejarah) }} />
          </div>
          <aside className="kartu kartu-isi">
            <h3 style={{ fontSize: 16 }}>Identitas sekolah</h3>
            <dl className="daftar-info">
              <dt>Nama</dt>
              <dd>{profil.nama_sekolah}</dd>
              {profil.jenjang ? (
                <>
                  <dt>Jenjang</dt>
                  <dd>{profil.jenjang}</dd>
                </>
              ) : null}
              <dt>NPSN / status</dt>
              <dd>
                {profil.npsn || "—"}
                {profil.akreditasi ? ` · Akreditasi ${profil.akreditasi}` : ""}
              </dd>
              {profil.alamat ? (
                <>
                  <dt>Alamat</dt>
                  <dd>{profil.alamat}</dd>
                </>
              ) : null}
            </dl>
          </aside>
        </div>
      </section>

      {/* Visi & misi */}
      {profil.visi || misi.length > 0 ? (
        <section className="bagian-rapat">
          <div className="wadah visi-misi">
            <div className="kartu-visi">
              <span className="label">Visi kami</span>
              <p className="visi">{profil.visi}</p>
              <small style={{ color: "#a9b8e0" }}>Nilai yang hidup dalam tindakan sehari-hari.</small>
            </div>
            <div className="kartu kartu-isi">
              <h3 className="kecil" style={{ fontSize: 17, marginBottom: 16 }}>Misi sekolah</h3>
              <ol className="daftar-misi">
                {misi.map((butir, i) => (
                  <li key={i}>
                    <span>{duaDigit(i + 1)}</span>
                    {butir}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      ) : null}

      {/* Fasilitas */}
      {fasilitas.length > 0 ? (
        <section className="bagian-rapat" id="fasilitas">
          <div className="wadah">
            <span className="label">Fasilitas</span>
            <h2 className="judul-bagian" style={{ marginBottom: 22 }}>Lingkungan untuk belajar dan tumbuh</h2>
            <div className="kisi kisi-3 fasilitas">
              {fasilitas.map((f, i) => (
                <div key={i}>
                  <div className="foto-bingkai">
                    <Foto src={f.foto} alt={f.nama ?? ""} />
                  </div>
                  <h3>{f.nama ?? ""}</h3>
                  <p>{f.deskripsi ?? ""}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Struktur organisasi */}
      {pimpinan ? (
        <section className="bagian-rapat" style={{ paddingBottom: 60 }}>
          <div className="wadah">
            <span className="label">Struktur organisasi</span>
            <h2 className="judul-bagian" style={{ marginBottom: 22 }}>Bekerja bersama untuk sekolah</h2>
            <div className="bagan">
              <div className="bagan-puncak">
                <div className="kotak">
                  <strong>{pimpinan.jabatan ?? ""}</strong>
                  <span>{pimpinan.nama ?? ""}</span>
                </div>
              </div>
              {anggota.length > 0 ? (
                <div className="bagan-bawah">
                  {anggota.map((s, i) => (
                    <div className="kotak" key={i}>
                      <strong>{s.jabatan ?? ""}</strong>
                      <span>{s.nama ?? ""}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
