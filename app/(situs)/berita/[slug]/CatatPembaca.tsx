"use client";

import { useEffect } from "react";
import { catatPembaca } from "./aksi";

/**
 * Menambah jumlah pembaca setelah halaman benar-benar dibuka di browser
 * (bukan saat halaman di-prefetch atau diambil dari cache).
 */
export function CatatPembaca({ slug }: { slug: string }) {
  useEffect(() => {
    const kunci = `dibaca:${slug}`;
    try {
      // Hitung sekali per sesi browser supaya refresh tidak menambah angka.
      if (sessionStorage.getItem(kunci)) return;
      sessionStorage.setItem(kunci, "1");
    } catch {
      // sessionStorage tidak tersedia (mode privat); tetap dihitung.
    }
    void catatPembaca(slug);
  }, [slug]);

  return null;
}
