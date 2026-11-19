import type { Metadata } from "next";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Ringkasan" };

export const instant = false;

export default async function Ringkasan() {
  const supabase = await supabaseServer();
  const hitung = async (tabel: string, filter?: [string, boolean]) => {
    let kueri = supabase.from(tabel).select("id", { count: "exact", head: true });
    if (filter) kueri = kueri.eq(filter[0], filter[1]);
    const { count } = await kueri;
    return count ?? 0;
  };

  const [berita, beritaTerbit, pengumuman, pengumumanPenting, guruAktif, galeri, pesanBaru] = await Promise.all([
    hitung("berita"),
    hitung("berita", ["diterbitkan", true]),
    hitung("pengumuman"),
    hitung("pengumuman", ["penting", true]),
    hitung("guru", ["aktif", true]),
    hitung("galeri"),
    hitung("pesan_kontak", ["sudah_dibaca", false]),
  ]);

  const kartu = [
    { judul: "Berita", nilai: berita, ket: `${beritaTerbit} sudah terbit`, href: "/admin/berita" },
    { judul: "Pengumuman", nilai: pengumuman, ket: `${pengumumanPenting} ditandai penting`, href: "/admin/pengumuman" },
    { judul: "Guru aktif", nilai: guruAktif, ket: "Tampil di website", href: "/admin/guru" },
    { judul: "Album galeri", nilai: galeri, ket: "Dokumentasi kegiatan", href: "/admin/galeri" },
    { judul: "Pesan belum dibaca", nilai: pesanBaru, ket: "Dari formulir kontak", href: "/admin/pesan" },
  ];

  return (
    <>
      <div className="adm-kepala">
        <h1>Ringkasan</h1>
        <div className="baris-tombol">
          <Link className="tbl tbl-utama" href="/admin/berita/baru">+ Berita baru</Link>
          <Link className="tbl" href="/admin/pengumuman/baru">+ Pengumuman baru</Link>
        </div>
      </div>
      <div className="statistik">
        {kartu.map((k) => (
          <Link key={k.judul} href={k.href} className="kotak" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ket">{k.judul}</div>
            <div className="nilai">{k.nilai}</div>
            <div className="ket">{k.ket}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
