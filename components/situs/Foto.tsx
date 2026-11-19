/* eslint-disable @next/next/no-img-element -- foto berasal dari Supabase Storage dengan ukuran beragam */
import { urlFile } from "@/lib/format";
import { Ikon } from "./Ikon";

/** Foto dari Supabase Storage. Bila belum ada foto, tampil kotak abu-abu dengan ikon. */
export function Foto({ src, alt = "", ikon = "gambar" }: { src?: string | null; alt?: string | null; ikon?: string }) {
  const url = urlFile(src);

  if (url) {
    return <img src={url} alt={alt ?? ""} loading="lazy" className="foto" />;
  }

  return (
    <div className="foto-kosong" role="img" aria-label={alt || "Foto belum tersedia"}>
      <Ikon nama={ikon} />
    </div>
  );
}
