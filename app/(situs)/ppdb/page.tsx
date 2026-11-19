import type { Metadata } from "next";
import Link from "next/link";
import { Foto } from "@/components/situs/Foto";
import { Ikon } from "@/components/situs/Ikon";
import { JudulHalaman } from "@/components/situs/JudulHalaman";
import { ambilPpdb, ambilProfil } from "@/lib/data";
import { duaDigit, htmlAman, nomorTel, nomorWa, sebelum, tanggalIndonesia, urlFile } from "@/lib/format";

export const metadata: Metadata = { title: "Informasi PPDB" };

export default async function HalamanPpdb() {
  const [profil, data] = await Promise.all([ambilProfil(), ambilPpdb()]);
  const ppdb = data ?? {
    tahun_ajaran: null, dibuka: false, tanggal_buka: null, tanggal_tutup: null, kuota: null, judul: null,
    deskripsi: null, gambar: null, ketentuan_pengantar: null, ketentuan: null, ketentuan_catatan: null,
    persyaratan: null, persyaratan_catatan: null, tahapan: null, cara_pendaftaran: null, biaya: null,
    brosur: null, link_pendaftaran: null, email_panitia: null, telepon_panitia: null,
  };

  const ketentuan = ppdb.ketentuan ?? [];
  const persyaratan = ppdb.persyaratan ?? [];
  const tahapan = ppdb.tahapan ?? [];
  const brosur = urlFile(ppdb.brosur);
  const emailPanitia = ppdb.email_panitia || profil.email;
  const teleponPanitia = ppdb.telepon_panitia || profil.telepon;

  return (
    <>
      <JudulHalaman
        judul="Informasi PPDB"
        sub="Panduan bagi calon orang tua dan wali murid untuk mengenal proses penerimaan peserta didik baru."
        remah={[{ teks: "PPDB" }]}
      />

      <section className="bagian">
        <div className="wadah">
          {/* Bagian atas */}
          <div className="ppdb-atas">
            <div>
              <span className="label">
                Tahun ajaran {ppdb.tahun_ajaran}{" "}
                <span className={ppdb.dibuka ? "status-ppdb buka" : "status-ppdb tutup"}>
                  {ppdb.dibuka ? "Pendaftaran dibuka" : "Pendaftaran ditutup"}
                </span>
              </span>
              <h2>{ppdb.judul || "Penerimaan Peserta Didik Baru"}</h2>
              {ppdb.deskripsi ? <p>{ppdb.deskripsi}</p> : null}
              {ppdb.tanggal_buka ? (
                <p className="meta">
                  Periode: {tanggalIndonesia(ppdb.tanggal_buka)}
                  {ppdb.tanggal_tutup ? ` – ${tanggalIndonesia(ppdb.tanggal_tutup)}` : ""}
                  {ppdb.kuota ? ` • Kuota ${ppdb.kuota} siswa` : ""}
                </p>
              ) : null}
              <div className="hero-tombol">
                <a href="#kontak-panitia" className="tombol tombol-utama">Hubungi Panitia PPDB</a>
                {ppdb.dibuka && ppdb.link_pendaftaran ? (
                  <a href={ppdb.link_pendaftaran} className="tombol tombol-oranye" target="_blank" rel="noopener">
                    Daftar Online →
                  </a>
                ) : null}
                {brosur ? (
                  <a href={brosur} className="tombol tombol-garis" target="_blank" rel="noopener">
                    <Ikon nama="unduh" /> Brosur
                  </a>
                ) : null}
              </div>
            </div>
            <div className="foto-bingkai">
              <Foto src={ppdb.gambar || profil.gambar_banner} alt={`Gedung ${profil.nama_sekolah}`} />
            </div>
          </div>

          {/* Ketentuan & berkas */}
          {ketentuan.length > 0 || persyaratan.length > 0 ? (
            <div className="kisi kisi-2" style={{ marginTop: 36 }}>
              <div className="kartu kartu-isi">
                <h3 className="kecil">Siapa yang dapat mendaftar?</h3>
                {ppdb.ketentuan_pengantar ? <p style={{ fontSize: 14 }}>{ppdb.ketentuan_pengantar}</p> : null}
                <ul className="daftar-titik">
                  {ketentuan.map((butir, i) => (
                    <li key={i}>{butir}</li>
                  ))}
                </ul>
                {ppdb.ketentuan_catatan ? <p className="catatan-kecil">{ppdb.ketentuan_catatan}</p> : null}
              </div>
              <div className="kartu kartu-isi">
                <h3 className="kecil">Daftar berkas yang disiapkan</h3>
                <ul className="daftar-centang">
                  {persyaratan.map((berkas, i) => (
                    <li key={i}>
                      <Ikon nama="centang" />
                      {berkas}
                    </li>
                  ))}
                </ul>
                {ppdb.persyaratan_catatan ? <p className="catatan-kecil">{ppdb.persyaratan_catatan}</p> : null}
              </div>
            </div>
          ) : null}

          {/* Tahapan */}
          {tahapan.length > 0 ? (
            <div style={{ marginTop: 48 }}>
              <span className="label">Alur penerimaan</span>
              <h2 className="judul-bagian" style={{ marginBottom: 20 }}>Jadwal &amp; tahapan</h2>
              <div className="tahapan">
                {tahapan.map((tahap, i) => (
                  <div className="kartu tahap" key={i}>
                    <span className="nomor">{duaDigit(i + 1)}</span>
                    <div>
                      <h3>{tahap.judul ?? ""}</h3>
                      {tahap.tanggal ? <p className="tanggal">{tahap.tanggal}</p> : null}
                      {tahap.keterangan ? <p>{tahap.keterangan}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Cara pendaftaran */}
          {ppdb.cara_pendaftaran ? (
            <div className="kartu kartu-isi" style={{ marginTop: 36 }}>
              <h3 className="kecil">Cara memperoleh petunjuk pendaftaran</h3>
              <div
                className="konten"
                style={{ fontSize: 14 }}
                dangerouslySetInnerHTML={{ __html: htmlAman(ppdb.cara_pendaftaran) }}
              />
              <Link href="/kontak" className="tombol tombol-garis tombol-kecil">
                Lihat Kontak &amp; Lokasi →
              </Link>
            </div>
          ) : null}

          {ppdb.biaya ? (
            <div className="kartu kartu-isi" style={{ marginTop: 20 }}>
              <h3 className="kecil">Rincian biaya</h3>
              <div className="konten" style={{ fontSize: 14 }} dangerouslySetInnerHTML={{ __html: htmlAman(ppdb.biaya) }} />
            </div>
          ) : null}

          {/* Kontak panitia */}
          <div className="kotak-tanya" id="kontak-panitia" style={{ marginTop: 36 }}>
            <h2>Ada yang ingin ditanyakan?</h2>
            <p style={{ marginBottom: 16 }}>
              Panitia PPDB {profil.nama_sekolah} siap membantu menjelaskan proses penerimaan pada jam layanan sekolah.
            </p>
            {emailPanitia ? (
              <p>
                Email: <a href={`mailto:${emailPanitia}`}>{emailPanitia}</a>
              </p>
            ) : null}
            {teleponPanitia ? (
              <p>
                Telepon: <a href={`tel:${nomorTel(teleponPanitia)}`}>{teleponPanitia}</a>
              </p>
            ) : null}
            {profil.whatsapp ? (
              <p>
                WhatsApp:{" "}
                <a href={`https://wa.me/${nomorWa(profil.whatsapp)}`} target="_blank" rel="noopener">
                  {profil.whatsapp}
                </a>
              </p>
            ) : null}
            {profil.jam_operasional ? <p>{sebelum(profil.jam_operasional, "\n")}</p> : null}
            {profil.alamat ? <p>{profil.alamat}</p> : null}
          </div>
        </div>
      </section>
    </>
  );
}
