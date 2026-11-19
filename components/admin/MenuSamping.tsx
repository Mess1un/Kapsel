"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

const MENU = [
  { grup: null, label: "Ringkasan", href: "/admin" },
  { grup: "Sekolah", label: "Profil Sekolah", href: "/admin/profil" },
  { grup: null, label: "Data Guru", href: "/admin/guru" },
  { grup: null, label: "Informasi PPDB", href: "/admin/ppdb" },
  { grup: null, label: "Pesan Masuk", href: "/admin/pesan" },
  { grup: "Konten", label: "Berita & Kegiatan", href: "/admin/berita" },
  { grup: null, label: "Pengumuman", href: "/admin/pengumuman" },
  { grup: null, label: "Galeri Kegiatan", href: "/admin/galeri" },
  { grup: "Akun", label: "Akun Saya", href: "/admin/akun" },
];

export function MenuSamping({ namaSekolah, namaAdmin, pesanBaru }: {
  namaSekolah: string;
  namaAdmin: string;
  pesanBaru: number;
}) {
  const pathname = usePathname();
  const aktif = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  async function keluar() {
    await supabaseBrowser().auth.signOut();
    // Muat ulang penuh supaya data panel admin tidak tersisa di browser.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/admin/login");
  }

  return (
    <aside className="adm-samping">
      <div className="adm-merek">
        {namaSekolah}
        <small>Panel Admin</small>
      </div>
      {MENU.map((m) => (
        <div key={m.href} style={{ display: "contents" }}>
          {m.grup ? <div className="grup">{m.grup}</div> : null}
          <Link href={m.href} className={aktif(m.href) ? "aktif" : undefined}>
            {m.label}
            {m.href === "/admin/pesan" && pesanBaru > 0 ? <span className="angka-baru">{pesanBaru}</span> : null}
          </Link>
        </div>
      ))}
      <div className="bawah">
        <div style={{ padding: "0 10px 4px" }}>{namaAdmin}</div>
        <a href="/" target="_blank" rel="noopener">Lihat website ↗</a>
        <button type="button" onClick={keluar}>Keluar</button>
      </div>
    </aside>
  );
}
