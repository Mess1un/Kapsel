"use client";

import Link from "next/link";
import { useState } from "react";
import { Isian, PesanHasil, useSimpan } from "@/components/admin/Formulir";
import { UnggahBanyak } from "@/components/admin/Unggah";
import type { Galeri } from "@/lib/jenis";
import { simpanGaleri, type DataGaleri } from "./aksi";

export function FormGaleri({ awal, kategoriAda, pesanAwal }: {
  awal: Galeri | null;
  kategoriAda: string[];
  pesanAwal?: string;
}) {
  const [data, setData] = useState<DataGaleri>(() => ({
    judul: awal?.judul ?? "",
    kategori: awal?.kategori ?? "",
    deskripsi: awal?.deskripsi ?? "",
    tanggal_kegiatan: awal?.tanggal_kegiatan?.slice(0, 10) ?? "",
    diterbitkan: awal?.diterbitkan ?? true,
    foto: awal?.foto ?? [],
  }));
  const { hasil, proses, simpan } = useSimpan();
  const ubah = (b: Partial<DataGaleri>) => setData((d) => ({ ...d, ...b }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        simpan(() => simpanGaleri(awal?.id ?? null, data));
      }}
    >
      <PesanHasil hasil={hasil ?? (pesanAwal ? { pesan: pesanAwal } : null)} />
      <div className="kotak">
        <h2>Album Kegiatan</h2>
        <div className="kisi-2">
          <Isian label="Nama kegiatan" wajib htmlFor="judul">
            <input id="judul" type="text" maxLength={255} required value={data.judul} onChange={(e) => ubah({ judul: e.target.value })} />
          </Isian>
          <Isian label="Kategori" htmlFor="kategori">
            <input id="kategori" type="text" maxLength={100} list="kategori-ada" placeholder="Upacara, Lomba, Study Tour, dll." value={data.kategori} onChange={(e) => ubah({ kategori: e.target.value })} />
            <datalist id="kategori-ada">
              {kategoriAda.map((k) => <option key={k} value={k} />)}
            </datalist>
          </Isian>
          <Isian label="Tanggal kegiatan" htmlFor="tgl">
            <input id="tgl" type="date" value={data.tanggal_kegiatan} onChange={(e) => ubah({ tanggal_kegiatan: e.target.value })} />
          </Isian>
          <div className="isian" style={{ justifyContent: "flex-end" }}>
            <label className="saklar">
              <input type="checkbox" checked={data.diterbitkan} onChange={(e) => ubah({ diterbitkan: e.target.checked })} />
              Terbitkan
            </label>
          </div>
          <Isian label="Deskripsi" htmlFor="deskripsi" className="penuh">
            <textarea id="deskripsi" rows={3} value={data.deskripsi} onChange={(e) => ubah({ deskripsi: e.target.value })} />
          </Isian>
          <Isian
            label="Foto kegiatan"
            wajib
            className="penuh"
            bantuan="Bisa pilih banyak foto sekaligus (maks. 3 MB per foto, 50 foto). Foto pertama menjadi sampul album; pakai tombol ← → untuk mengubah urutan."
          >
            <UnggahBanyak nilai={data.foto} onUbah={(foto) => ubah({ foto })} folder="galeri" />
          </Isian>
        </div>
      </div>

      <div className="baris-tombol" style={{ marginTop: 16 }}>
        <button type="submit" className="tbl tbl-utama" disabled={proses}>{proses ? "Menyimpan..." : "Simpan"}</button>
        <Link href="/admin/galeri" className="tbl">Kembali</Link>
      </div>
    </form>
  );
}
