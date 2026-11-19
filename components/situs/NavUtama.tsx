"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Ikon } from "./Ikon";

const MENU = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Guru", href: "/guru" },
  { label: "Pengumuman", href: "/pengumuman" },
  { label: "Berita", href: "/berita" },
  { label: "Galeri", href: "/galeri" },
  { label: "Kontak", href: "/kontak" },
];

/** Tombol menu HP + menu utama. Menu yang sedang dibuka diberi tanda aktif. */
export function NavUtama() {
  const pathname = usePathname();
  // Menu HP dibuka "di halaman tertentu", jadi otomatis tertutup saat pindah halaman.
  const [bukaDi, setBukaDi] = useState<string | null>(null);
  const buka = bukaDi === pathname;
  const setBuka = (fn: (b: boolean) => boolean) => setBukaDi(fn(buka) ? pathname : null);

  const aktif = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <button
        className="tombol-menu"
        type="button"
        aria-label="Buka menu"
        aria-expanded={buka}
        aria-controls="menu-utama"
        onClick={() => setBuka((b) => !b)}
      >
        <Ikon nama="menu" style={{ width: 22, height: 22 }} />
      </button>

      <nav className={buka ? "nav buka" : "nav"} id="menu-utama" aria-label="Menu utama">
        {MENU.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className={aktif(m.href) ? "aktif" : undefined}
            aria-current={aktif(m.href) ? "page" : undefined}
          >
            {m.label}
          </Link>
        ))}
        <Link href="/ppdb" className="tombol tombol-oranye tombol-kecil">
          PPDB Info
        </Link>
      </nav>
    </>
  );
}
