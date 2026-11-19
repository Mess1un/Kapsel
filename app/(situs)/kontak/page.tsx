import type { Metadata } from "next";
import { Fragment } from "react";
import { Ikon } from "@/components/situs/Ikon";
import { JudulHalaman } from "@/components/situs/JudulHalaman";
import { ambilProfil } from "@/lib/data";
import { nomorTel, nomorWa } from "@/lib/format";

export const metadata: Metadata = { title: "Kontak dan Lokasi" };

export default async function HalamanKontak() {
  const profil = await ambilProfil();
  const petaAman = profil.google_maps_embed?.startsWith("https://www.google.com/maps/embed");

  return (
    <>
      <JudulHalaman
        judul="Mari terhubung dengan sekolah"
        sub="Informasi layanan untuk orang tua, calon wali murid, dan masyarakat."
        remah={[{ teks: "Kontak" }]}
      />

      <section className="bagian">
        <div className="wadah kontak-tata">
          <div>
            <div className="kartu kartu-isi">
              <h3 className="kecil">Kontak resmi sekolah</h3>
              <ul className="daftar-kontak">
                {profil.alamat ? (
                  <li>
                    <Ikon nama="lokasi" />
                    <div>
                      <small>Alamat</small>
                      {profil.alamat}
                    </div>
                  </li>
                ) : null}
                {profil.telepon ? (
                  <li>
                    <Ikon nama="telepon" />
                    <div>
                      <small>Telepon</small>
                      <a href={`tel:${nomorTel(profil.telepon)}`}>{profil.telepon}</a>
                    </div>
                  </li>
                ) : null}
                {profil.whatsapp ? (
                  <li>
                    <Ikon nama="telepon" />
                    <div>
                      <small>WhatsApp</small>
                      <a href={`https://wa.me/${nomorWa(profil.whatsapp)}`} target="_blank" rel="noopener">
                        {profil.whatsapp}
                      </a>
                    </div>
                  </li>
                ) : null}
                {profil.email ? (
                  <li>
                    <Ikon nama="email" />
                    <div>
                      <small>Email</small>
                      <a href={`mailto:${profil.email}`}>{profil.email}</a>
                    </div>
                  </li>
                ) : null}
              </ul>
            </div>

            {profil.jam_operasional ? (
              <div className="kartu kartu-isi" style={{ marginTop: 16 }}>
                <h3 className="kecil">Jam layanan administrasi</h3>
                <p style={{ fontSize: 14, margin: 0 }}>
                  {profil.jam_operasional.split("\n").map((baris, i) => (
                    <Fragment key={i}>
                      {i > 0 ? <br /> : null}
                      {baris}
                    </Fragment>
                  ))}
                </p>
              </div>
            ) : null}
          </div>

          <div>
            <div className="peta">
              {petaAman ? (
                <iframe
                  src={profil.google_maps_embed ?? undefined}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Peta lokasi ${profil.nama_sekolah}`}
                />
              ) : (
                <div className="peta-kosong">
                  <div className="pin">
                    <Ikon nama="lokasi" />
                    <strong>{profil.nama_sekolah}</strong>
                    <span className="meta">Peta belum diatur</span>
                  </div>
                </div>
              )}
            </div>
            {profil.google_maps_link ? (
              <p style={{ marginTop: 12 }}>
                <a className="tombol tombol-garis tombol-kecil" href={profil.google_maps_link} target="_blank" rel="noopener">
                  Buka di Google Maps →
                </a>
              </p>
            ) : null}

            <div className="kartu kartu-isi" style={{ marginTop: 16 }}>
              <h3 className="kecil" style={{ marginBottom: 8 }}>Sebelum berkunjung</h3>
              <p style={{ fontSize: 13.5, color: "var(--teks-redup)", margin: 0 }}>
                Sampaikan tujuan kunjungan kepada petugas administrasi. Untuk konsultasi PPDB, siapkan pertanyaan dan
                konfirmasikan waktu layanan panitia terlebih dahulu.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
