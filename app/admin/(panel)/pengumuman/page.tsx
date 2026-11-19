import type { Metadata } from "next";
import Link from "next/link";
import { TombolHapus } from "@/components/admin/Formulir";
import { HalamanAdmin } from "@/components/admin/Halaman";
import { tanggalIndonesia } from "@/lib/format";
import type { Pengumuman } from "@/lib/jenis";
import { nomorHalaman, teksParam, type SearchParams } from "@/lib/params";
import { supabaseServer } from "@/lib/supabase/server";
import { hapusPengumuman } from "./aksi";

export const metadata: Metadata = { title: "Pengumuman" };

export const instant = false;

const PER_HALAMAN = 20;

export default async function DaftarPengumumanAdmin({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const cari = teksParam(params, "cari");
  const penting = teksParam(params, "penting");
  const status = teksParam(params, "status");
  const halaman = nomorHalaman(params);

  const supabase = await supabaseServer();
  let kueri = supabase.from("pengumuman").select("*", { count: "exact" });
  if (cari) kueri = kueri.ilike("judul", `%${cari.replace(/[\\%_]/g, (k) => `\\${k}`)}%`);
  if (penting) kueri = kueri.eq("penting", penting === "ya");
  if (status) kueri = kueri.eq("diterbitkan", status === "terbit");
  const { data, count, error } = await kueri
    .order("tanggal_terbit", { ascending: false, nullsFirst: true })
    .order("id", { ascending: false })
    .range((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN - 1);
  const daftar = (data ?? []) as Pengumuman[];

  return (
    <>
      <div className="adm-kepala">
        <h1>Pengumuman</h1>
        <Link className="tbl tbl-utama" href="/admin/pengumuman/baru">+ Pengumuman baru</Link>
      </div>

      <form className="filter" method="GET">
        <input type="search" name="cari" placeholder="Cari judul..." defaultValue={cari} />
        <select name="penting" defaultValue={penting}>
          <option value="">Penting & biasa</option>
          <option value="ya">Hanya penting</option>
          <option value="tidak">Hanya biasa</option>
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
          <p className="kosong">Belum ada pengumuman.</p>
        ) : (
          <table className="tabel">
            <thead>
              <tr><th>Judul</th><th>Kategori</th><th>Penting</th><th>Tanggal terbit</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {daftar.map((p) => (
                <tr key={p.id}>
                  <td><Link href={`/admin/pengumuman/${p.id}`} className="tebal">{p.judul}</Link></td>
                  <td>{p.kategori ? <span className="lencana">{p.kategori}</span> : "—"}</td>
                  <td>{p.penting ? <span className="lencana oranye">Penting</span> : "—"}</td>
                  <td>{tanggalIndonesia(p.tanggal_terbit) || "—"}</td>
                  <td>{p.diterbitkan ? <span className="lencana hijau">Terbit</span> : <span className="lencana abu">Draf</span>}</td>
                  <td className="aksi">
                    <span className="baris-tombol" style={{ justifyContent: "flex-end" }}>
                      <Link className="tbl tbl-kecil" href={`/admin/pengumuman/${p.id}`}>Ubah</Link>
                      <TombolHapus aksi={hapusPengumuman.bind(null, p.id)} konfirmasi={`Hapus pengumuman "${p.judul}"?`} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <HalamanAdmin total={count ?? 0} halaman={halaman} perHalaman={PER_HALAMAN} dasar="/admin/pengumuman" kueri={{ cari, penting, status }} />
    </>
  );
}
