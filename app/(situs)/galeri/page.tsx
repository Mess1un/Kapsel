import type { Metadata } from "next";
import Link from "next/link";
import { JudulHalaman } from "@/components/situs/JudulHalaman";
import { Penomoran } from "@/components/situs/Penomoran";
import { ambilDaftarGaleri, ambilKategoriGaleri } from "@/lib/data";
import { tanggalIndonesia, urlFile } from "@/lib/format";
import { nomorHalaman, teksParam, type SearchParams } from "@/lib/params";
import { DaftarAlbum, type AlbumTampil } from "./DaftarAlbum";

export const metadata: Metadata = { title: "Galeri Kegiatan" };

export const instant = false;

export default async function HalamanGaleri({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const kategori = teksParam(params, "kategori");
  const [galeri, daftarKategori] = await Promise.all([
    ambilDaftarGaleri({ kategori, halaman: nomorHalaman(params) }),
    ambilKategoriGaleri(),
  ]);

  const album: AlbumTampil[] = galeri.data.map((a) => {
    const foto = (a.foto ?? []).map((f) => urlFile(f)).filter((u): u is string => Boolean(u));
    const tanggal = tanggalIndonesia(a.tanggal_kegiatan);
    return {
      id: a.id,
      judul: a.judul,
      deskripsi: a.deskripsi,
      foto,
      meta: `${a.kategori ?? ""}${a.kategori ? " • " : ""}${tanggal} • ${foto.length} foto`,
    };
  });

  return (
    <>
      <JudulHalaman
        judul="Merekam momen, merawat kenangan"
        sub="Dokumentasi kegiatan belajar dan kebersamaan warga sekolah."
        remah={[{ teks: "Galeri" }]}
      />

      <section className="bagian">
        <div className="wadah">
          <nav className="cip" aria-label="Kategori album">
            <Link href="/galeri" className={kategori ? undefined : "aktif"}>
              Semua album
            </Link>
            {daftarKategori.map((k) => (
              <Link
                key={k}
                href={`/galeri?kategori=${encodeURIComponent(k)}`}
                className={kategori === k ? "aktif" : undefined}
              >
                {k}
              </Link>
            ))}
          </nav>

          {album.length === 0 ? (
            <p className="kosong">Belum ada album di kategori ini.</p>
          ) : (
            <>
              <DaftarAlbum album={album} />
              <Penomoran
                total={galeri.total}
                halaman={galeri.halaman}
                perHalaman={galeri.perHalaman}
                satuan="album"
                dasar="/galeri"
                kueri={{ kategori }}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}
