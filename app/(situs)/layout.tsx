/* eslint-disable @next/next/no-img-element -- logo dari Supabase Storage */
import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import { Ikon } from "@/components/situs/Ikon";
import { NavUtama } from "@/components/situs/NavUtama";
import { ambilProfil, tahunIni } from "@/lib/data";
import { batasi, nomorTel, sebelum, urlFile } from "@/lib/format";
import "./situs.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], axes: ["opsz"], variable: "--font-fraunces", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const profil = await ambilProfil();
  const deskripsi = profil.hero_deskripsi || profil.slogan;
  const logo = urlFile(profil.logo);

  return {
    title: { default: profil.nama_sekolah, template: `%s — ${profil.nama_sekolah}` },
    description: deskripsi ? batasi(deskripsi, 160) : undefined,
    openGraph: { siteName: profil.nama_sekolah },
    icons: logo ? { icon: logo } : undefined,
  };
}

const MEDSOS = ["facebook", "instagram", "youtube", "tiktok"] as const;

export default async function LayoutSitus({ children }: { children: ReactNode }) {
  const profil = await ambilProfil();
  const tahun = await tahunIni();
  const logo = urlFile(profil.logo);
  const medsos = MEDSOS.filter((m) => profil[m]);

  return (
    <html lang="id" className={`${jakarta.variable} ${fraunces.variable}`}>
      <body>
        <div className="pita-atas">
          <div className="wadah">
            <div>
              {profil.telepon ? (
                <span>
                  Telepon: <a href={`tel:${nomorTel(profil.telepon)}`}>{profil.telepon}</a>
                </span>
              ) : null}
              {profil.email ? (
                <span className="email">
                  &nbsp;•&nbsp; <a href={`mailto:${profil.email}`}>{profil.email}</a>
                </span>
              ) : null}
            </div>
            {profil.alamat ? (
              <div className="alamat">
                <Ikon nama="lokasi" /> {sebelum(profil.alamat, ",")}
              </div>
            ) : null}
          </div>
        </div>

        <header className="header">
          <div className="wadah">
            <Link href="/" className="merek">
              <span className="merek-logo">
                {logo ? <img src={logo} alt="" /> : <Ikon nama="buku" style={{ width: 20, height: 20 }} />}
              </span>
              <span>
                <span className="merek-nama">{profil.nama_sekolah}</span>
                <br />
                {profil.slogan ? <span className="merek-slogan">{profil.slogan}</span> : null}
              </span>
            </Link>

            <NavUtama />
          </div>
        </header>

        <main>{children}</main>

        <footer className="footer">
          <div className="wadah">
            <div className="footer-atas">
              <div>
                <Link href="/" className="merek">
                  <span className="merek-logo">
                    <Ikon nama="buku" style={{ width: 18, height: 18 }} />
                  </span>
                  <span>
                    <span className="merek-nama">{profil.nama_sekolah}</span>
                    <br />
                    {profil.slogan ? <span className="merek-slogan">{profil.slogan}</span> : null}
                  </span>
                </Link>
                <p style={{ marginTop: 14 }}>
                  Ruang informasi dan kabar sekolah untuk orang tua, guru, dan masyarakat. Bersama mendampingi setiap
                  langkah anak.
                </p>
                {medsos.length > 0 ? (
                  <div className="medsos">
                    {medsos.map((m) => (
                      <a
                        key={m}
                        href={profil[m] ?? "#"}
                        target="_blank"
                        rel="noopener"
                        aria-label={m.charAt(0).toUpperCase() + m.slice(1)}
                      >
                        <Ikon nama={m} />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
              <div>
                <h4>Jelajahi sekolah</h4>
                <ul>
                  <li><Link href="/profil">Profil Sekolah</Link></li>
                  <li><Link href="/guru">Informasi Guru</Link></li>
                  <li><Link href="/pengumuman">Pengumuman</Link></li>
                  <li><Link href="/ppdb">Informasi PPDB</Link></li>
                </ul>
              </div>
              <div>
                <h4>Hubungi sekolah</h4>
                {profil.alamat ? <p>{profil.alamat}</p> : null}
                <p>
                  {profil.email ? (
                    <>
                      <a href={`mailto:${profil.email}`}>{profil.email}</a>
                      <br />
                    </>
                  ) : null}
                  {profil.telepon ? `Telepon: ${profil.telepon}` : null}
                </p>
                {profil.jam_operasional ? (
                  <p style={{ fontSize: 12 }}>{sebelum(profil.jam_operasional, "\n")}</p>
                ) : null}
              </div>
            </div>
            <div className="footer-bawah">
              <span>
                &copy; {tahun} {profil.nama_sekolah}. Seluruh hak cipta dilindungi.
              </span>
              {/* Tautan biasa (bukan Link): panel admin punya tampilan sendiri. */}
              <a href="/admin">Akses Admin</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
