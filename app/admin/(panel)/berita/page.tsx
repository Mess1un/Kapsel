/* eslint-disable @next/next/no-img-element -- gambar mini dari Supabase Storage */
import type { Metadata } from "next";
import Link from "next/link";
import { TombolHapus } from "@/components/admin/Formulir";
import { HalamanAdmin } from "@/components/admin/Halaman";
import { tanggalIndonesia, urlFile } from "@/lib/format";
import { KATEGORI_BERITA, type Berita } from "@/lib/jenis";
import { nomorHalaman, teksParam, type SearchParams } from "@/lib/params";
import { supabaseServer } from "@/lib/supabase/server";
import { hapusBerita } from "./aksi";

export const metadata: Metadata = { title: "Berita & Kegiatan" };

export const instant = false;

const PER_HALAMAN = 20;

export default async function DaftarBeritaAdmin({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const cari = teksParam(params, "cari");
  const kategori = teksParam(params, "kategori");
  const status = teksParam(params, "status");
  const halaman = nomorHalaman(params);

  const supabase = await supabaseServer();
  let kueri = supabase.from("berita").select("*", { count: "exact" });
  if (cari) kueri = kueri.ilike("judul", `%${cari.replace(/[\\%_]/g, (k) => `\\${k}`)}%`);
  if (kategori) kueri = kueri.eq("kategori", kategori);
  if (status) kueri = kueri.eq("diterbitkan", status === "terbit");
  const { data, count, error } = await kueri
    .order("tanggal_terbit", { ascending: false, nullsFirst: true })
    .order("id", { ascending: false })
    .range((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN - 1);
  const daftar = (data ?? []) as Berita[];

  return (
    <>
      <div className="adm-kepala">
        <h1>Berita &amp; Kegiatan</h1>
        <Link className="tbl tbl-utama" href="/admin/berita/baru">+ Berita baru</Link>
      </div>

      <form className="filter" method="GET">
        <input type="search" name="cari" placeholder="Cari judul..." defaultValue={cari} />
        <select name="kategori" defaultValue={kategori}>
          <option value="">Semua kategori</option>
          {KATEGORI_BERITA.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <select name="status" defaultValue={status}>
          <option value="">Semua status</option>
          <option value="terbit">Terbit</option>
          <option value="draf">Belum terbit</option>
        </select>
        <button className="tbl" type="submit">Terapkan</button>
      </form>

      {error ? <div className="pesan-galat">Gagal memuat data: {error.message}</div> : null}

      <div className="kotak tabel-wadah" style={{ padding: 0 }}>
        {daftar.length === 0 ? (
          <p className="kosong">Belum ada berita.</p>
        ) : (
          <table className="tabel">
            <thead>
              <tr><th></th><th>Judul</th><th>Kategori</th><th>Tanggal terbit</th><th>Status</th><th>Dilihat</th><th></th></tr>
            </thead>
            <tbody>
              {daftar.map((b) => (
                <tr key={b.id}>
                  <td>{b.gambar ? <img src={urlFile(b.gambar) ?? ""} alt="" /> : null}</td>
                  <td><Link href={`/admin/berita/${b.id}`} className="tebal">{b.judul}</Link></td>
                  <td>{b.kategori ? <span className="lencana">{b.kategori}</span> : "—"}</td>
                  <td>{tanggalIndonesia(b.tanggal_terbit) || "—"}</td>
                  <td>{b.diterbitkan ? <span className="lencana hijau">Terbit</span> : <span className="lencana abu">Draf</span>}</td>
                  <td>{b.dilihat}</td>
                  <td className="aksi">
                    <span className="baris-tombol" style={{ justifyContent: "flex-end" }}>
                      <Link className="tbl tbl-kecil" href={`/admin/berita/${b.id}`}>Ubah</Link>
                      <TombolHapus aksi={hapusBerita.bind(null, b.id)} konfirmasi={`Hapus berita "${b.judul}"?`} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <HalamanAdmin total={count ?? 0} halaman={halaman} perHalaman={PER_HALAMAN} dasar="/admin/berita" kueri={{ cari, kategori, status }} />
    </>
  );
}
