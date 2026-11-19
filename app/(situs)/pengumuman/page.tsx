import type { Metadata } from "next";
import { FormCari } from "@/components/situs/FormCari";
import { JudulHalaman } from "@/components/situs/JudulHalaman";
import { KartuPengumuman } from "@/components/situs/Kartu";
import { Penomoran } from "@/components/situs/Penomoran";
import { ambilDaftarPengumuman, ambilProfil } from "@/lib/data";
import { tanggalIndonesia } from "@/lib/format";
import { KATEGORI_PENGUMUMAN } from "@/lib/jenis";
import { nomorHalaman, teksParam, type SearchParams } from "@/lib/params";

export const metadata: Metadata = { title: "Pengumuman" };

export const instant = false;

export default async function HalamanPengumuman({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const cari = teksParam(params, "cari");
  const kategori = teksParam(params, "kategori");
  const [profil, pengumuman, terbaru] = await Promise.all([
    ambilProfil(),
    ambilDaftarPengumuman({ cari, kategori, halaman: nomorHalaman(params) }),
    ambilDaftarPengumuman({ perHalaman: 1 }),
  ]);
  const terakhirDiperbarui = tanggalIndonesia(terbaru.data[0]?.tanggal_terbit);

  return (
    <>
      <JudulHalaman
        judul="Pengumuman sekolah"
        sub={`Jadwal dan informasi penting untuk keluarga ${profil.nama_sekolah}. Disusun dari yang terbaru.`}
        remah={[{ teks: "Pengumuman" }]}
      />

      <section className="bagian">
        <div className="wadah">
          <FormCari
            label="Cari pengumuman"
            placeholder="Cari pengumuman..."
            cari={cari}
            namaPilihan="kategori"
            labelPilihan="Kategori"
            semua="Semua kategori"
            pilihan={KATEGORI_PENGUMUMAN}
            terpilih={kategori}
          />

          <p className="ringkasan-hasil">
            {pengumuman.total} pengumuman
            {terakhirDiperbarui ? ` • Diperbarui ${terakhirDiperbarui}` : ""}
          </p>

          {pengumuman.data.length === 0 ? (
            <p className="kosong">Tidak ada pengumuman yang cocok.</p>
          ) : (
            <>
              <div className="kisi kisi-3">
                {pengumuman.data.map((item) => (
                  <KartuPengumuman key={item.id} item={item} />
                ))}
              </div>
              <Penomoran
                total={pengumuman.total}
                halaman={pengumuman.halaman}
                perHalaman={pengumuman.perHalaman}
                dasar="/pengumuman"
                kueri={{ cari, kategori }}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}
