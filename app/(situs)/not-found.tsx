import Link from "next/link";
import { JudulHalaman } from "@/components/situs/JudulHalaman";

export default function TidakDitemukan() {
  return (
    <>
      <JudulHalaman
        judul="Halaman tidak ditemukan"
        sub="Halaman yang Anda cari mungkin sudah dipindahkan atau belum diterbitkan."
        remah={[{ teks: "Tidak ditemukan" }]}
      />
      <section className="bagian">
        <div className="wadah">
          <Link href="/" className="tombol tombol-utama">← Kembali ke Beranda</Link>
        </div>
      </section>
    </>
  );
}
