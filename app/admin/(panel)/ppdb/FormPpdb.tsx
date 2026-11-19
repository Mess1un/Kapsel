"use client";

import { useState } from "react";
import { EditorTeks } from "@/components/admin/EditorTeks";
import { DaftarButir, DaftarTeks, Isian, PesanHasil, useSimpan } from "@/components/admin/Formulir";
import { UnggahFile } from "@/components/admin/Unggah";
import type { InfoPpdb, Tahapan } from "@/lib/jenis";
import { simpanPpdb, type DataPpdb } from "./aksi";

export function FormPpdb({ awal }: { awal: InfoPpdb | null }) {
  const [data, setData] = useState<DataPpdb>(() => ({
    tahun_ajaran: awal?.tahun_ajaran ?? "", dibuka: awal?.dibuka ?? false,
    tanggal_buka: awal?.tanggal_buka?.slice(0, 10) ?? "", tanggal_tutup: awal?.tanggal_tutup?.slice(0, 10) ?? "",
    kuota: awal?.kuota != null ? String(awal.kuota) : "", judul: awal?.judul ?? "", deskripsi: awal?.deskripsi ?? "",
    gambar: awal?.gambar ?? null, ketentuan_pengantar: awal?.ketentuan_pengantar ?? "", ketentuan: awal?.ketentuan ?? [],
    ketentuan_catatan: awal?.ketentuan_catatan ?? "", persyaratan: awal?.persyaratan ?? [],
    persyaratan_catatan: awal?.persyaratan_catatan ?? "", tahapan: awal?.tahapan ?? [],
    cara_pendaftaran: awal?.cara_pendaftaran ?? "", biaya: awal?.biaya ?? "", brosur: awal?.brosur ?? null,
    link_pendaftaran: awal?.link_pendaftaran ?? "", email_panitia: awal?.email_panitia ?? "",
    telepon_panitia: awal?.telepon_panitia ?? "",
  }));
  const { hasil, proses, simpan } = useSimpan();
  const ubah = (b: Partial<DataPpdb>) => setData((d) => ({ ...d, ...b }));
  const nilai = (k: keyof DataPpdb) => (data[k] as string | null) ?? "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        simpan(() => simpanPpdb(awal?.id ?? null, data));
      }}
    >
      <PesanHasil hasil={hasil} />

      <div className="kotak">
        <h2>Status Pendaftaran</h2>
        <div className="kisi-4">
          <Isian label="Tahun ajaran" htmlFor="ta">
            <input id="ta" type="text" maxLength={20} placeholder="2027/2028" value={nilai("tahun_ajaran")} onChange={(e) => ubah({ tahun_ajaran: e.target.value })} />
          </Isian>
          <Isian label="Tanggal buka" htmlFor="buka">
            <input id="buka" type="date" value={nilai("tanggal_buka")} onChange={(e) => ubah({ tanggal_buka: e.target.value })} />
          </Isian>
          <Isian label="Tanggal tutup" htmlFor="tutup">
            <input id="tutup" type="date" value={nilai("tanggal_tutup")} onChange={(e) => ubah({ tanggal_tutup: e.target.value })} />
          </Isian>
          <Isian label="Kuota (siswa)" htmlFor="kuota">
            <input id="kuota" type="number" min={0} value={data.kuota} onChange={(e) => ubah({ kuota: e.target.value })} />
          </Isian>
        </div>
        <label className="saklar">
          <input type="checkbox" checked={data.dibuka} onChange={(e) => ubah({ dibuka: e.target.checked })} />
          Pendaftaran sedang dibuka
        </label>
      </div>

      <div className="kotak">
        <h2>Bagian Atas Halaman</h2>
        <Isian label="Judul" htmlFor="judul">
          <input id="judul" type="text" maxLength={255} placeholder="Langkah awal untuk tumbuh bersama." value={nilai("judul")} onChange={(e) => ubah({ judul: e.target.value })} />
        </Isian>
        <Isian label="Deskripsi" htmlFor="deskripsi">
          <textarea id="deskripsi" rows={3} value={nilai("deskripsi")} onChange={(e) => ubah({ deskripsi: e.target.value })} />
        </Isian>
        <Isian label="Gambar" bantuan="Bila kosong, dipakai foto sekolah dari Profil. Maksimal 3 MB.">
          <UnggahFile nilai={data.gambar} onUbah={(gambar) => ubah({ gambar })} folder="ppdb" maksKb={3072} />
        </Isian>
      </div>

      <div className="kotak">
        <h2>Siapa yang Dapat Mendaftar?</h2>
        <Isian label="Kalimat pengantar" htmlFor="pengantar">
          <textarea id="pengantar" rows={2} value={nilai("ketentuan_pengantar")} onChange={(e) => ubah({ ketentuan_pengantar: e.target.value })} />
        </Isian>
        <Isian label="Butir ketentuan">
          <DaftarTeks nilai={data.ketentuan} onUbah={(ketentuan) => ubah({ ketentuan })} tambahLabel="Tambah ketentuan" />
        </Isian>
        <Isian label="Catatan kecil" htmlFor="kcat">
          <textarea id="kcat" rows={2} value={nilai("ketentuan_catatan")} onChange={(e) => ubah({ ketentuan_catatan: e.target.value })} />
        </Isian>
      </div>

      <div className="kotak">
        <h2>Daftar Berkas yang Disiapkan</h2>
        <Isian label="Berkas">
          <DaftarTeks nilai={data.persyaratan} onUbah={(persyaratan) => ubah({ persyaratan })} tambahLabel="Tambah berkas" />
        </Isian>
        <Isian label="Catatan kecil" htmlFor="pcat">
          <textarea id="pcat" rows={2} value={nilai("persyaratan_catatan")} onChange={(e) => ubah({ persyaratan_catatan: e.target.value })} />
        </Isian>
      </div>

      <div className="kotak">
        <h2>Jadwal &amp; Tahapan</h2>
        <DaftarButir<Tahapan>
          nilai={data.tahapan}
          onUbah={(tahapan) => ubah({ tahapan })}
          kosong={() => ({ judul: "", tanggal: "", keterangan: "" })}
          tambahLabel="Tambah tahapan"
          judulButir={(t, i) => t.judul || `Tahap ${i + 1}`}
          render={(t, ubahButir) => (
            <div className="kisi-2">
              <Isian label="Judul" wajib>
                <input type="text" maxLength={255} value={t.judul ?? ""} onChange={(e) => ubahButir({ judul: e.target.value })} />
              </Isian>
              <Isian label="Tanggal">
                <input type="text" maxLength={255} placeholder="1–12 Juni 2027" value={t.tanggal ?? ""} onChange={(e) => ubahButir({ tanggal: e.target.value })} />
              </Isian>
              <Isian label="Keterangan" className="penuh">
                <textarea rows={2} value={t.keterangan ?? ""} onChange={(e) => ubahButir({ keterangan: e.target.value })} />
              </Isian>
            </div>
          )}
        />
      </div>

      <div className="kotak">
        <h2>Cara Memperoleh Petunjuk Pendaftaran</h2>
        <EditorTeks nilai={nilai("cara_pendaftaran")} onUbah={(cara_pendaftaran) => ubah({ cara_pendaftaran })} />
      </div>

      <div className="kotak">
        <h2>Biaya (opsional)</h2>
        <EditorTeks nilai={nilai("biaya")} onUbah={(biaya) => ubah({ biaya })} />
      </div>

      <div className="kotak">
        <h2>Kontak Panitia &amp; Tautan</h2>
        <div className="kisi-2">
          <Isian label="Email panitia" htmlFor="email">
            <input id="email" type="email" value={nilai("email_panitia")} onChange={(e) => ubah({ email_panitia: e.target.value })} />
          </Isian>
          <Isian label="Telepon panitia" htmlFor="tel">
            <input id="tel" type="tel" maxLength={30} value={nilai("telepon_panitia")} onChange={(e) => ubah({ telepon_panitia: e.target.value })} />
          </Isian>
          <Isian label="Link pendaftaran" htmlFor="link" className="penuh" bantuan="Link formulir online (misalnya Google Form), bila ada.">
            <input id="link" type="url" placeholder="https://" value={nilai("link_pendaftaran")} onChange={(e) => ubah({ link_pendaftaran: e.target.value })} />
          </Isian>
          <Isian label="Brosur PPDB (PDF/gambar)" className="penuh" bantuan="Maksimal 5 MB.">
            <UnggahFile nilai={data.brosur} onUbah={(brosur) => ubah({ brosur })} folder="ppdb" maksKb={5120} jenis="dokumen" />
          </Isian>
        </div>
      </div>

      <div className="baris-tombol" style={{ marginTop: 16 }}>
        <button type="submit" className="tbl tbl-utama" disabled={proses}>{proses ? "Menyimpan..." : "Simpan"}</button>
      </div>
    </form>
  );
}
