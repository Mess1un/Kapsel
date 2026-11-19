/* eslint-disable @next/next/no-img-element -- gambar mini dari Supabase Storage */
import type { Metadata } from "next";
import Link from "next/link";
import { TombolHapus } from "@/components/admin/Formulir";
import { HalamanAdmin } from "@/components/admin/Halaman";
import { tanggalIndonesia, urlFile } from "@/lib/format";
import type { Galeri } from "@/lib/jenis";
import { nomorHalaman, teksParam, type SearchParams } from "@/lib/params";
import { supabaseServer } from "@/lib/supabase/server";
import { hapusGaleri } from "./aksi";

export const metadata: Metadata = { title: "Galeri Kegiatan" };

export const instant = false;

const PER_HALAMAN = 20;

export default async function DaftarGaleriAdmin({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const cari = teksParam(params, "cari");
  const halaman = nomorHalaman(params);

  const supabase = await supabaseServer();
  let kueri = supabase.from("galeri").select("*", { count: "exact" });
  if (cari) kueri = kueri.ilike("judul", `%${cari.replace(/[\\%_]/g, (k) => `\\${k}`)}%`);
  const { data, count, error } = await kueri
    .order("tanggal_kegiatan", { ascending: false, nullsFirst: true })
    .order("id", { ascending: false })
    .range((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN - 1);
  const daftar = (data ?? []) as Galeri[];

  return (
    <>
      <div className="adm-kepala">
        <h1>Galeri Kegiatan</h1>
        <Link className="tbl tbl-utama" href="/admin/galeri/baru">+ Album baru</Link>
      </div>

      <form className="filter" method="GET">
        <input type="search" name="cari" placeholder="Cari nama kegiatan..." defaultValue={cari} />
        <button className="tbl" type="submit">Cari</button>
      </form>

      {error ? <div className="pesan-galat">Gagal memuat data: {error.message}</div> : null}

      <div className="kotak tabel-wadah" style={{ padding: 0 }}>
        {daftar.length === 0 ? (
          <p className="kosong">Belum ada album.</p>
        ) : (
          <table className="tabel">
            <thead>
              <tr><th>Foto</th><th>Nama kegiatan</th><th>Kategori</th><th>Tanggal</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {daftar.map((g) => (
                <tr key={g.id}>
                  <td>
                    <span className="baris-tombol" style={{ gap: 4 }}>
                      {(g.foto ?? []).slice(0, 3).map((f) => <img key={f} src={urlFile(f) ?? ""} alt="" />)}
                      {(g.foto?.length ?? 0) > 3 ? <span className="bantuan">+{(g.foto?.length ?? 0) - 3}</span> : null}
                    </span>
                  </td>
                  <td><Link href={`/admin/galeri/${g.id}`} className="tebal">{g.judul}</Link></td>
                  <td>{g.kategori ? <span className="lencana">{g.kategori}</span> : "—"}</td>
                  <td>{tanggalIndonesia(g.tanggal_kegiatan) || "—"}</td>
                  <td>{g.diterbitkan ? <span className="lencana hijau">Terbit</span> : <span className="lencana abu">Draf</span>}</td>
                  <td className="aksi">
                    <span className="baris-tombol" style={{ justifyContent: "flex-end" }}>
                      <Link className="tbl tbl-kecil" href={`/admin/galeri/${g.id}`}>Ubah</Link>
                      <TombolHapus aksi={hapusGaleri.bind(null, g.id)} konfirmasi={`Hapus album "${g.judul}"?`} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <HalamanAdmin total={count ?? 0} halaman={halaman} perHalaman={PER_HALAMAN} dasar="/admin/galeri" kueri={{ cari }} />
    </>
  );
}
