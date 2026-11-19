"use client";

import Link from "next/link";
import { useState } from "react";
import { EditorTeks } from "@/components/admin/EditorTeks";
import { Isian, PesanHasil, keInputWaktu, sekarangWibLokal, useSimpan } from "@/components/admin/Formulir";
import { UnggahFile } from "@/components/admin/Unggah";
import { KATEGORI_BERITA, type Berita } from "@/lib/jenis";
import { simpanBerita, type DataBerita } from "./aksi";

export function FormBerita({ awal, pesanAwal }: { awal: Berita | null; pesanAwal?: string }) {
  const [data, setData] = useState<DataBerita>(() => ({
    judul: awal?.judul ?? "",
    ringkasan: awal?.ringkasan ?? "",
    isi: awal?.isi ?? "",
    gambar: awal?.gambar ?? null,
    keterangan_gambar: awal?.keterangan_gambar ?? "",
    kategori: awal?.kategori ?? "Kegiatan",
    topik: awal?.topik ?? "",
    penulis: awal?.penulis ?? "",
    tanggal_terbit: awal ? keInputWaktu(awal.tanggal_terbit) : sekarangWibLokal(),
    diterbitkan: awal?.diterbitkan ?? true,
  }));
  const { hasil, proses, simpan } = useSimpan();
  const ubah = (b: Partial<DataBerita>) => setData((d) => ({ ...d, ...b }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        simpan(() => simpanBerita(awal?.id ?? null, data));
      }}
    >
      <PesanHasil hasil={hasil ?? (pesanAwal ? { pesan: pesanAwal } : null)} />
      <div className="form-tata">
        <div className="kotak">
          <h2>Isi Berita</h2>
          <Isian label="Judul" wajib htmlFor="judul">
            <input id="judul" type="text" value={data.judul} maxLength={255} required onChange={(e) => ubah({ judul: e.target.value })} />
          </Isian>
          <Isian label="Ringkasan" htmlFor="ringkasan" bantuan="Ditampilkan di kartu berita. Kosongkan untuk memakai awal isi berita.">
            <textarea id="ringkasan" rows={3} maxLength={300} value={data.ringkasan} onChange={(e) => ubah({ ringkasan: e.target.value })} />
          </Isian>
          <Isian label="Isi" wajib>
            <EditorTeks nilai={data.isi} onUbah={(isi) => ubah({ isi })} folderGambar="berita/lampiran" />
          </Isian>
        </div>

        <div className="kotak">
          <h2>Pengaturan</h2>
          <Isian label="Gambar utama" bantuan="Maksimal 2 MB.">
            <UnggahFile nilai={data.gambar} onUbah={(gambar) => ubah({ gambar })} folder="berita" maksKb={2048} />
          </Isian>
          <Isian label="Keterangan gambar" htmlFor="ket">
            <input id="ket" type="text" maxLength={255} placeholder="Membaca bersama di perpustakaan sekolah." value={data.keterangan_gambar} onChange={(e) => ubah({ keterangan_gambar: e.target.value })} />
          </Isian>
          <Isian label="Kategori" htmlFor="kategori">
            <select id="kategori" value={data.kategori} onChange={(e) => ubah({ kategori: e.target.value })}>
              <option value="">— Tanpa kategori —</option>
              {KATEGORI_BERITA.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </Isian>
          <Isian label="Topik" htmlFor="topik">
            <input id="topik" type="text" maxLength={255} placeholder="Literasi dan kebiasaan membaca" value={data.topik} onChange={(e) => ubah({ topik: e.target.value })} />
          </Isian>
          <Isian label="Penulis / dokumentasi" htmlFor="penulis">
            <input id="penulis" type="text" maxLength={255} placeholder="Tim Publikasi Sekolah" value={data.penulis} onChange={(e) => ubah({ penulis: e.target.value })} />
          </Isian>
          <Isian label="Tanggal terbit" htmlFor="tgl" bantuan="Waktu Indonesia Barat. Berita tampil di website mulai waktu ini.">
            <input id="tgl" type="datetime-local" value={data.tanggal_terbit} onChange={(e) => ubah({ tanggal_terbit: e.target.value })} />
          </Isian>
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
        <Link href="/admin/berita" className="tbl">Kembali</Link>
        {awal ? <a href={`/berita/${awal.slug}`} target="_blank" rel="noopener" className="tbl tbl-teks">Lihat di website ↗</a> : null}
      </div>
    </form>
  );
}
