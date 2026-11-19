"use client";

import Link from "next/link";
import { useState } from "react";
import { EditorTeks } from "@/components/admin/EditorTeks";
import { Isian, PesanHasil, keInputWaktu, sekarangWibLokal, useSimpan } from "@/components/admin/Formulir";
import { UnggahFile } from "@/components/admin/Unggah";
import { KATEGORI_PENGUMUMAN, type Pengumuman } from "@/lib/jenis";
import { simpanPengumuman, type DataPengumuman } from "./aksi";

export function FormPengumuman({ awal, pesanAwal }: { awal: Pengumuman | null; pesanAwal?: string }) {
  const [data, setData] = useState<DataPengumuman>(() => ({
    judul: awal?.judul ?? "",
    ringkasan: awal?.ringkasan ?? "",
    isi: awal?.isi ?? "",
    kategori: awal?.kategori ?? "Umum",
    lampiran: awal?.lampiran ?? null,
    tanggal_terbit: awal ? keInputWaktu(awal.tanggal_terbit) : sekarangWibLokal(),
    penting: awal?.penting ?? false,
    diterbitkan: awal?.diterbitkan ?? true,
  }));
  const { hasil, proses, simpan } = useSimpan();
  const ubah = (b: Partial<DataPengumuman>) => setData((d) => ({ ...d, ...b }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        simpan(() => simpanPengumuman(awal?.id ?? null, data));
      }}
    >
      <PesanHasil hasil={hasil ?? (pesanAwal ? { pesan: pesanAwal } : null)} />
      <div className="form-tata">
        <div className="kotak">
          <h2>Isi Pengumuman</h2>
          <Isian label="Judul" wajib htmlFor="judul">
            <input id="judul" type="text" value={data.judul} maxLength={255} required onChange={(e) => ubah({ judul: e.target.value })} />
          </Isian>
          <Isian label="Ringkasan" htmlFor="ringkasan" bantuan="Ditampilkan di kartu pengumuman. Kosongkan untuk memakai awal isi.">
            <textarea id="ringkasan" rows={2} maxLength={300} value={data.ringkasan} onChange={(e) => ubah({ ringkasan: e.target.value })} />
          </Isian>
          <Isian label="Isi" wajib>
            <EditorTeks nilai={data.isi} onUbah={(isi) => ubah({ isi })} folderGambar="pengumuman/lampiran" />
          </Isian>
        </div>

        <div className="kotak">
          <h2>Pengaturan</h2>
          <Isian label="Kategori" htmlFor="kategori">
            <select id="kategori" value={data.kategori} onChange={(e) => ubah({ kategori: e.target.value })}>
              <option value="">— Tanpa kategori —</option>
              {KATEGORI_PENGUMUMAN.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </Isian>
          <Isian label="Lampiran (PDF/dokumen)" bantuan="PDF, Word, JPG, atau PNG. Maksimal 5 MB.">
            <UnggahFile nilai={data.lampiran} onUbah={(lampiran) => ubah({ lampiran })} folder="pengumuman" maksKb={5120} jenis="dokumen" />
          </Isian>
          <Isian label="Tanggal terbit" htmlFor="tgl" bantuan="Waktu Indonesia Barat.">
            <input id="tgl" type="datetime-local" value={data.tanggal_terbit} onChange={(e) => ubah({ tanggal_terbit: e.target.value })} />
          </Isian>
          <div className="isian">
            <label className="saklar">
              <input type="checkbox" checked={data.penting} onChange={(e) => ubah({ penting: e.target.checked })} />
              Tandai sebagai penting
            </label>
            <span className="bantuan">Pengumuman penting tampil paling menonjol di beranda.</span>
          </div>
          <div className="isian">
            <label className="saklar">
              <input type="checkbox" checked={data.diterbitkan} onChange={(e) => ubah({ diterbitkan: e.target.checked })} />
              Terbitkan
            </label>
          </div>
        </div>
      </div>

      <div className="baris-tombol" style={{ marginTop: 16 }}>
        <button type="submit" className="tbl tbl-utama" disabled={proses}>{proses ? "Menyimpan..." : "Simpan"}</button>
        <Link href="/admin/pengumuman" className="tbl">Kembali</Link>
        {awal ? <a href={`/pengumuman/${awal.slug}`} target="_blank" rel="noopener" className="tbl tbl-teks">Lihat di website ↗</a> : null}
      </div>
    </form>
  );
}
