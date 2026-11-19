import type { Metadata } from "next";
import { FormCari } from "@/components/situs/FormCari";
import { Foto } from "@/components/situs/Foto";
import { JudulHalaman } from "@/components/situs/JudulHalaman";
import { ambilGuruAktif } from "@/lib/data";
import { teksParam, type SearchParams } from "@/lib/params";

export const metadata: Metadata = { title: "Informasi Guru" };

// Halaman ini membaca filter dari alamat (?cari=, ?bidang=), jadi dibuat saat dibuka.
export const instant = false;

export default async function HalamanGuru({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const cari = teksParam(params, "cari");
  const bidang = teksParam(params, "bidang");
  const semuaGuru = await ambilGuruAktif();

  const daftarBidang = [...new Set(semuaGuru.flatMap((g) => [g.jabatan, g.mata_pelajaran]).filter(Boolean) as string[])]
    .sort((a, b) => a.localeCompare(b, "id"));

  const kataKunci = cari.toLocaleLowerCase("id");
  const guru = semuaGuru.filter((g) => {
    if (bidang && g.jabatan !== bidang && g.mata_pelajaran !== bidang) return false;
    if (!kataKunci) return true;
    return [g.nama, g.jabatan, g.mata_pelajaran].some((t) => t?.toLocaleLowerCase("id").includes(kataKunci));
  });

  return (
    <>
      <JudulHalaman
        judul="Berkenalan dengan para pendidik"
        sub="Mendampingi proses belajar dengan pengetahuan, keteladanan, dan kepedulian."
        remah={[{ teks: "Guru" }]}
      />

      <section className="bagian">
        <div className="wadah">
          <FormCari
            label="Cari guru"
            placeholder="Cari nama guru atau bidang pengajaran..."
            cari={cari}
            namaPilihan="bidang"
            labelPilihan="Bidang"
            semua="Semua bidang"
            pilihan={daftarBidang}
            terpilih={bidang}
          />

          <p className="ringkasan-hasil">
            {guru.length} pendidik • Tidak menampilkan data pribadi atau identitas kepegawaian
          </p>

          {guru.length === 0 ? (
            <p className="kosong">Tidak ada guru yang cocok dengan pencarian.</p>
          ) : (
            <div className="kisi kisi-4">
              {guru.map((g) => (
                <article className="kartu kartu-guru" key={g.id}>
                  <div className="foto-bingkai">
                    <Foto src={g.foto} alt={g.nama} ikon="pengguna" />
                  </div>
                  <div className="kartu-isi">
                    <strong>{g.nama}</strong>
                    <span>
                      {g.jabatan}
                      {g.mata_pelajaran && g.mata_pelajaran !== g.jabatan ? ` · ${g.mata_pelajaran}` : ""}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
