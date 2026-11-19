import type { Metadata } from "next";
import Link from "next/link";
import { TombolHapus } from "@/components/admin/Formulir";
import { tanggalIndonesia } from "@/lib/format";
import type { PesanKontak } from "@/lib/jenis";
import { teksParam, type SearchParams } from "@/lib/params";
import { supabaseServer } from "@/lib/supabase/server";
import { hapusPesan } from "./aksi";

export const metadata: Metadata = { title: "Pesan Masuk" };

export const instant = false;

export default async function DaftarPesan({ searchParams }: { searchParams: SearchParams }) {
  const status = teksParam(await searchParams, "status");
  const supabase = await supabaseServer();
  let kueri = supabase.from("pesan_kontak").select("*").order("created_at", { ascending: false }).limit(200);
  if (status) kueri = kueri.eq("sudah_dibaca", status === "dibaca");
  const { data, error } = await kueri;
  const daftar = (data ?? []) as PesanKontak[];

  return (
    <>
      <div className="adm-kepala"><h1>Pesan Masuk</h1></div>

      <form className="filter" method="GET">
        <select name="status" defaultValue={status}>
          <option value="">Semua pesan</option>
          <option value="baru">Belum dibaca</option>
          <option value="dibaca">Sudah dibaca</option>
        </select>
        <button className="tbl" type="submit">Terapkan</button>
      </form>

      {error ? <div className="pesan-galat">Gagal memuat data: {error.message}</div> : null}

      <div className="kotak tabel-wadah" style={{ padding: 0 }}>
        {daftar.length === 0 ? (
          <p className="kosong">Belum ada pesan.</p>
        ) : (
          <table className="tabel">
            <thead>
              <tr><th>Status</th><th>Nama</th><th>Email</th><th>Subjek</th><th>Dikirim</th><th></th></tr>
            </thead>
            <tbody>
              {daftar.map((p) => (
                <tr key={p.id}>
                  <td>{p.sudah_dibaca ? <span className="lencana abu">Dibaca</span> : <span className="lencana oranye">Baru</span>}</td>
                  <td className={p.sudah_dibaca ? undefined : "tebal"}>{p.nama}</td>
                  <td>{p.email}</td>
                  <td>{p.subjek || "—"}</td>
                  <td>{tanggalIndonesia(p.created_at)}</td>
                  <td className="aksi">
                    <span className="baris-tombol" style={{ justifyContent: "flex-end" }}>
                      <Link className="tbl tbl-kecil" href={`/admin/pesan/${p.id}`}>Buka</Link>
                      <TombolHapus aksi={hapusPesan.bind(null, p.id)} konfirmasi={`Hapus pesan dari ${p.nama}?`} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
