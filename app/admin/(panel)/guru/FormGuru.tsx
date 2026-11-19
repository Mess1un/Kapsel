"use client";

import Link from "next/link";
import { useState } from "react";
import { Isian, PesanHasil, useSimpan } from "@/components/admin/Formulir";
import { UnggahFile } from "@/components/admin/Unggah";
import type { Guru } from "@/lib/jenis";
import { simpanGuru, type DataGuru } from "./aksi";

export function FormGuru({ awal }: { awal: Guru | null }) {
  const [data, setData] = useState<DataGuru>(() => ({
    nama: awal?.nama ?? "",
    nip: awal?.nip ?? "",
    jabatan: awal?.jabatan ?? "",
    mata_pelajaran: awal?.mata_pelajaran ?? "",
    pendidikan_terakhir: awal?.pendidikan_terakhir ?? "",
    foto: awal?.foto ?? null,
    urutan: String(awal?.urutan ?? 0),
    aktif: awal?.aktif ?? true,
  }));
  const { hasil, proses, simpan } = useSimpan();
  const ubah = (b: Partial<DataGuru>) => setData((d) => ({ ...d, ...b }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        simpan(() => simpanGuru(awal?.id ?? null, data));
      }}
    >
      <PesanHasil hasil={hasil} />
      <div className="form-tata">
        <div className="kotak">
          <h2>Data Guru</h2>
          <div className="kisi-2">
            <Isian label="Nama lengkap (dengan gelar)" wajib htmlFor="nama" className="penuh">
              <input id="nama" type="text" maxLength={255} required value={data.nama} onChange={(e) => ubah({ nama: e.target.value })} />
            </Isian>
            <Isian label="NIP" htmlFor="nip">
              <input id="nip" type="text" maxLength={30} value={data.nip} onChange={(e) => ubah({ nip: e.target.value })} />
            </Isian>
            <Isian label="Jabatan" htmlFor="jabatan">
              <input id="jabatan" type="text" maxLength={255} placeholder="Guru, Wakasek Kurikulum, dll." value={data.jabatan} onChange={(e) => ubah({ jabatan: e.target.value })} />
            </Isian>
            <Isian label="Mata pelajaran" htmlFor="mapel">
              <input id="mapel" type="text" maxLength={255} value={data.mata_pelajaran} onChange={(e) => ubah({ mata_pelajaran: e.target.value })} />
            </Isian>
            <Isian label="Pendidikan terakhir" htmlFor="pendidikan">
              <input id="pendidikan" type="text" maxLength={255} placeholder="S1 Pendidikan Matematika" value={data.pendidikan_terakhir} onChange={(e) => ubah({ pendidikan_terakhir: e.target.value })} />
            </Isian>
          </div>
        </div>

        <div className="kotak">
          <h2>Foto &amp; Tampilan</h2>
          <Isian label="Foto" bantuan="Maksimal 1 MB.">
            <UnggahFile nilai={data.foto} onUbah={(foto) => ubah({ foto })} folder="guru" maksKb={1024} bulat />
          </Isian>
          <Isian label="Urutan tampil" htmlFor="urutan" bantuan="Angka kecil tampil lebih dulu.">
            <input id="urutan" type="number" min={0} value={data.urutan} onChange={(e) => ubah({ urutan: e.target.value })} />
          </Isian>
          <div className="isian">
            <label className="saklar">
              <input type="checkbox" checked={data.aktif} onChange={(e) => ubah({ aktif: e.target.checked })} />
              Tampilkan di website
            </label>
          </div>
        </div>
      </div>

      <div className="baris-tombol" style={{ marginTop: 16 }}>
        <button type="submit" className="tbl tbl-utama" disabled={proses}>{proses ? "Menyimpan..." : "Simpan"}</button>
        <Link href="/admin/guru" className="tbl">Kembali</Link>
      </div>
    </form>
  );
}
