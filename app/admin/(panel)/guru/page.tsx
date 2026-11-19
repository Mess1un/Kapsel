/* eslint-disable @next/next/no-img-element -- foto mini dari Supabase Storage */
import type { Metadata } from "next";
import Link from "next/link";
import { TombolHapus } from "@/components/admin/Formulir";
import { urlFile } from "@/lib/format";
import type { Guru } from "@/lib/jenis";
import { teksParam, type SearchParams } from "@/lib/params";
import { supabaseServer } from "@/lib/supabase/server";
import { hapusGuru } from "./aksi";
import { SaklarAktif } from "./SaklarAktif";

export const metadata: Metadata = { title: "Data Guru" };

export const instant = false;

export default async function DaftarGuruAdmin({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const cari = teksParam(params, "cari").toLocaleLowerCase("id");
  const tersimpan = teksParam(params, "tersimpan");

  const supabase = await supabaseServer();
  const { data, error } = await supabase.from("guru").select("*").order("urutan").order("nama");
  const daftar = ((data ?? []) as Guru[]).filter(
    (g) => !cari || [g.nama, g.nip, g.jabatan, g.mata_pelajaran].some((t) => t?.toLocaleLowerCase("id").includes(cari)),
  );

  return (
    <>
      <div className="adm-kepala">
        <h1>Data Guru</h1>
        <Link className="tbl tbl-utama" href="/admin/guru/baru">+ Guru baru</Link>
      </div>

      {tersimpan ? <div className="pesan-sukses">Data guru tersimpan.</div> : null}

      <form className="filter" method="GET">
        <input type="search" name="cari" placeholder="Cari nama, NIP, jabatan..." defaultValue={teksParam(params, "cari")} />
        <button className="tbl" type="submit">Cari</button>
      </form>

      {error ? <div className="pesan-galat">Gagal memuat data: {error.message}</div> : null}

      <div className="kotak tabel-wadah" style={{ padding: 0 }}>
        {daftar.length === 0 ? (
          <p className="kosong">Belum ada data guru.</p>
        ) : (
          <table className="tabel">
            <thead>
              <tr><th>Urutan</th><th></th><th>Nama</th><th>NIP</th><th>Jabatan</th><th>Mata pelajaran</th><th>Di website</th><th></th></tr>
            </thead>
            <tbody>
              {daftar.map((g) => (
                <tr key={g.id}>
                  <td>{g.urutan}</td>
                  <td className="bulat">{g.foto ? <img src={urlFile(g.foto) ?? ""} alt="" /> : null}</td>
                  <td><Link href={`/admin/guru/${g.id}`} className="tebal">{g.nama}</Link></td>
                  <td>{g.nip || "—"}</td>
                  <td>{g.jabatan || "—"}</td>
                  <td>{g.mata_pelajaran || "—"}</td>
                  <td><SaklarAktif id={g.id} aktif={g.aktif} /></td>
                  <td className="aksi">
                    <span className="baris-tombol" style={{ justifyContent: "flex-end" }}>
                      <Link className="tbl tbl-kecil" href={`/admin/guru/${g.id}`}>Ubah</Link>
                      <TombolHapus aksi={hapusGuru.bind(null, g.id)} konfirmasi={`Hapus data guru "${g.nama}"?`} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p className="bantuan" style={{ marginTop: 10 }}>{daftar.length} guru • Urutan tampil diatur dari kolom &quot;Urutan tampil&quot; di formulir.</p>
    </>
  );
}
