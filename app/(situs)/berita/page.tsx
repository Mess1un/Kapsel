import type { Metadata } from "next";
import { FormCari } from "@/components/situs/FormCari";
import { JudulHalaman } from "@/components/situs/JudulHalaman";
import { KartuBerita } from "@/components/situs/Kartu";
import { Penomoran } from "@/components/situs/Penomoran";
import { ambilDaftarBerita, ambilProfil } from "@/lib/data";
import { KATEGORI_BERITA } from "@/lib/jenis";
import { nomorHalaman, teksParam, type SearchParams } from "@/lib/params";

export const metadata: Metadata = { title: "Berita dan Kegiatan" };

export const instant = false;

export default async function HalamanBerita({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const cari = teksParam(params, "cari");
  const kategori = teksParam(params, "kategori");
  const [profil, berita] = await Promise.all([
    ambilProfil(),
    ambilDaftarBerita({ cari, kategori, halaman: nomorHalaman(params) }),
  ]);

  return (
    <>
      <JudulHalaman
        judul="Cerita dari sekolah"
        sub={`Kabar kegiatan, pengalaman belajar, dan kebersamaan warga ${profil.nama_sekolah}.`}
        remah={[{ teks: "Berita" }]}
      />

      <section className="bagian">
        <div className="wadah">
          <FormCari
            label="Cari berita"
            placeholder="Cari berita dan kegiatan..."
            cari={cari}
            namaPilihan="kategori"
            labelPilihan="Kategori"
            semua="Semua kategori"
            pilihan={KATEGORI_BERITA}
            terpilih={kategori}
          />

          <p className="ringkasan-hasil">{berita.total} berita • Urutan terbaru</p>

          {berita.data.length === 0 ? (
            <p className="kosong">Tidak ada berita yang cocok.</p>
          ) : (
            <>
              <div className="kisi kisi-3">
                {berita.data.map((item) => (
                  <KartuBerita key={item.id} item={item} />
                ))}
              </div>
              <Penomoran
                total={berita.total}
                halaman={berita.halaman}
                perHalaman={berita.perHalaman}
                dasar="/berita"
                kueri={{ cari, kategori }}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}
