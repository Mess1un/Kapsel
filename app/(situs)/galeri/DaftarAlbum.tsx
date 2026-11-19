"use client";

/* eslint-disable @next/next/no-img-element -- foto album dari Supabase Storage */
import { useCallback, useEffect, useState } from "react";
import { Ikon } from "@/components/situs/Ikon";

export type AlbumTampil = {
  id: number;
  judul: string;
  deskripsi: string | null;
  meta: string;
  foto: string[];
};

/** Kartu album + penampil foto layar penuh (lightbox). */
export function DaftarAlbum({ album }: { album: AlbumTampil[] }) {
  const [aktif, setAktif] = useState<AlbumTampil | null>(null);
  const [posisi, setPosisi] = useState(0);

  const buka = (a: AlbumTampil) => {
    setAktif(a);
    setPosisi(0);
  };
  const tutup = useCallback(() => setAktif(null), []);
  const geser = useCallback(
    (n: number) => setPosisi((p) => (aktif ? (p + n + aktif.foto.length) % aktif.foto.length : 0)),
    [aktif],
  );

  useEffect(() => {
    if (!aktif) return;
    document.body.style.overflow = "hidden";
    const tombol = (e: KeyboardEvent) => {
      if (e.key === "Escape") tutup();
      if (e.key === "ArrowLeft") geser(-1);
      if (e.key === "ArrowRight") geser(1);
    };
    document.addEventListener("keydown", tombol);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", tombol);
    };
  }, [aktif, geser, tutup]);

  return (
    <>
      <div className="kisi kisi-2">
        {album.map((a) => {
          const adaFoto = a.foto.length > 0;
          return (
            <article className="kartu kartu-album" key={a.id}>
              <div
                className="foto-bingkai"
                {...(adaFoto
                  ? {
                      role: "button",
                      tabIndex: 0,
                      "aria-label": `Buka album ${a.judul}`,
                      onClick: () => buka(a),
                      onKeyDown: (e: React.KeyboardEvent) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          buka(a);
                        }
                      },
                    }
                  : {})}
              >
                {adaFoto ? (
                  <img src={a.foto[0]} alt={a.judul} loading="lazy" className="foto" />
                ) : (
                  <div className="foto-kosong" role="img" aria-label={a.judul}>
                    <Ikon nama="gambar" />
                  </div>
                )}
              </div>
              <div className="kartu-isi">
                <span className="meta">{a.meta}</span>
                <h3>{a.judul}</h3>
                {a.deskripsi ? <p>{a.deskripsi}</p> : null}
                {adaFoto ? (
                  <button type="button" className="tautan-panah" onClick={() => buka(a)}>
                    Lihat album →
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      <div
        className={aktif ? "lightbox buka" : "lightbox"}
        role="dialog"
        aria-modal="true"
        aria-label="Foto album"
        onClick={(e) => e.target === e.currentTarget && tutup()}
      >
        {aktif ? (
          <>
            <div className="lb-judul">{aktif.judul}</div>
            <button type="button" className="lb-tutup" aria-label="Tutup" onClick={tutup}>
              <Ikon nama="tutup" />
            </button>
            <button type="button" className="lb-kiri" aria-label="Foto sebelumnya" onClick={() => geser(-1)}>
              <Ikon nama="kiri" />
            </button>
            <img src={aktif.foto[posisi]} alt={`${aktif.judul} — foto ${posisi + 1}`} />
            <button type="button" className="lb-kanan" aria-label="Foto berikutnya" onClick={() => geser(1)}>
              <Ikon nama="kanan" />
            </button>
            <div className="lb-hitung">
              {posisi + 1} / {aktif.foto.length}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
