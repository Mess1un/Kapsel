"use client";

import { Ikon } from "./Ikon";

/**
 * Kotak pencarian + pilihan kategori di atas daftar berita/pengumuman/guru.
 * Memakai formulir GET biasa, jadi filternya tersimpan di alamat halaman.
 */
export function FormCari({
  label,
  placeholder,
  cari,
  namaPilihan,
  labelPilihan,
  semua,
  pilihan,
  terpilih,
}: {
  label: string;
  placeholder: string;
  cari: string;
  namaPilihan: string;
  labelPilihan: string;
  semua: string;
  pilihan: string[];
  terpilih: string;
}) {
  return (
    <form method="GET" className="alat" role="search">
      <label className="cari">
        <span className="sr-only">{label}</span>
        <Ikon nama="cari" />
        <input className="input" type="search" name="cari" defaultValue={cari} placeholder={placeholder} />
      </label>
      <label>
        <span className="sr-only">{labelPilihan}</span>
        <select
          className="pilih"
          name={namaPilihan}
          defaultValue={terpilih}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
        >
          <option value="">{semua}</option>
          {pilihan.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
