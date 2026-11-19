"use client";

import { useState } from "react";
import { EditorTeks } from "@/components/admin/EditorTeks";
import { DaftarButir, DaftarTeks, Isian, PesanHasil, useSimpan } from "@/components/admin/Formulir";
import { UnggahFile } from "@/components/admin/Unggah";
import type { Fasilitas, Jabatan, Profil } from "@/lib/jenis";
import { simpanProfil, type DataProfil } from "./aksi";

const TAB = [
  "Identitas", "Beranda", "Sambutan Kepala Sekolah", "Sejarah, Visi & Misi", "Fasilitas",
  "Struktur Organisasi", "Statistik", "Kontak & Lokasi", "Media Sosial",
] as const;

function dataAwal(p: Profil | null): DataProfil {
  return {
    nama_sekolah: p?.nama_sekolah ?? "", slogan: p?.slogan ?? "", jenjang: p?.jenjang ?? "", npsn: p?.npsn ?? "",
    akreditasi: p?.akreditasi ?? "", logo: p?.logo ?? null, gambar_banner: p?.gambar_banner ?? null,
    hero_judul: p?.hero_judul ?? "", hero_deskripsi: p?.hero_deskripsi ?? "", pengenalan_judul: p?.pengenalan_judul ?? "",
    pengenalan: p?.pengenalan ?? "", nama_kepala_sekolah: p?.nama_kepala_sekolah ?? "",
    foto_kepala_sekolah: p?.foto_kepala_sekolah ?? null, kutipan_sambutan: p?.kutipan_sambutan ?? "",
    sambutan: p?.sambutan ?? "", sejarah: p?.sejarah ?? "", visi: p?.visi ?? "", misi: p?.misi ?? [],
    fasilitas: p?.fasilitas ?? [], struktur_organisasi: p?.struktur_organisasi ?? [],
    jumlah_siswa: String(p?.jumlah_siswa ?? 0), jumlah_guru: String(p?.jumlah_guru ?? 0),
    jumlah_kelas: String(p?.jumlah_kelas ?? 0), jumlah_ekstrakurikuler: String(p?.jumlah_ekstrakurikuler ?? 0),
    alamat: p?.alamat ?? "", telepon: p?.telepon ?? "", whatsapp: p?.whatsapp ?? "", email: p?.email ?? "",
    jam_operasional: p?.jam_operasional ?? "", google_maps_embed: p?.google_maps_embed ?? "",
    google_maps_link: p?.google_maps_link ?? "", facebook: p?.facebook ?? "", instagram: p?.instagram ?? "",
    youtube: p?.youtube ?? "", tiktok: p?.tiktok ?? "",
  };
}

export function FormProfil({ awal }: { awal: Profil | null }) {
  const [data, setData] = useState<DataProfil>(() => dataAwal(awal));
  const [tab, setTab] = useState<(typeof TAB)[number]>("Identitas");
  const { hasil, proses, simpan } = useSimpan();
  const ubah = (b: Partial<DataProfil>) => setData((d) => ({ ...d, ...b }));

  const input = (nama: keyof DataProfil, label: string, opsi: { tipe?: string; maks?: number; placeholder?: string; bantuan?: string; wajib?: boolean; penuh?: boolean } = {}) => (
    <Isian label={label} wajib={opsi.wajib} htmlFor={nama} bantuan={opsi.bantuan} className={opsi.penuh ? "penuh" : undefined}>
      <input
        id={nama}
        type={opsi.tipe ?? "text"}
        maxLength={opsi.maks}
        placeholder={opsi.placeholder}
        required={opsi.wajib}
        min={opsi.tipe === "number" ? 0 : undefined}
        value={(data[nama] as string | null) ?? ""}
        onChange={(e) => ubah({ [nama]: e.target.value } as Partial<DataProfil>)}
      />
    </Isian>
  );

  const area = (nama: keyof DataProfil, label: string, baris = 3, opsi: { placeholder?: string; bantuan?: string; penuh?: boolean } = {}) => (
    <Isian label={label} htmlFor={nama} bantuan={opsi.bantuan} className={opsi.penuh ? "penuh" : undefined}>
      <textarea
        id={nama}
        rows={baris}
        placeholder={opsi.placeholder}
        value={(data[nama] as string | null) ?? ""}
        onChange={(e) => ubah({ [nama]: e.target.value } as Partial<DataProfil>)}
      />
    </Isian>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        simpan(() => simpanProfil(awal?.id ?? null, data));
      }}
    >
      <PesanHasil hasil={hasil} />
      <div className="kotak">
        <div className="tab" role="tablist">
          {TAB.map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} className={tab === t ? "aktif" : undefined} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        {tab === "Identitas" ? (
          <div className="kisi-2">
            {input("nama_sekolah", "Nama sekolah", { wajib: true, maks: 255 })}
            {input("slogan", "Slogan", { maks: 255, bantuan: "Tampil di bawah nama sekolah pada header." })}
            {input("jenjang", "Jenjang", { maks: 255, placeholder: "Sekolah Dasar" })}
            {input("npsn", "NPSN", { maks: 20 })}
            <Isian label="Akreditasi" htmlFor="akreditasi">
              <select id="akreditasi" value={data.akreditasi ?? ""} onChange={(e) => ubah({ akreditasi: e.target.value })}>
                <option value="">—</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="Belum">Belum terakreditasi</option>
              </select>
            </Isian>
            <Isian label="Logo" bantuan="Bila kosong, dipakai ikon buku. Maksimal 1 MB.">
              <UnggahFile nilai={data.logo} onUbah={(logo) => ubah({ logo })} folder="profil" maksKb={1024} />
            </Isian>
          </div>
        ) : null}

        {tab === "Beranda" ? (
          <div className="kisi-2">
            {input("hero_judul", "Judul besar", { maks: 255, penuh: true, placeholder: "Tempat tumbuh, belajar, dan menjadi berarti." })}
            {area("hero_deskripsi", "Deskripsi singkat", 2, { penuh: true })}
            <Isian label="Foto sekolah" className="penuh" bantuan="Dipakai di beranda, profil, dan PPDB. Maksimal 3 MB.">
              <UnggahFile nilai={data.gambar_banner} onUbah={(gambar_banner) => ubah({ gambar_banner })} folder="profil" maksKb={3072} />
            </Isian>
            {input("pengenalan_judul", "Judul bagian \"Mengenal sekolah\"", { maks: 255, penuh: true, placeholder: "Pendidikan yang dekat dengan kehidupan." })}
            {area("pengenalan", "Paragraf pengenalan", 5, { penuh: true, bantuan: "Pisahkan paragraf dengan baris kosong." })}
          </div>
        ) : null}

        {tab === "Sambutan Kepala Sekolah" ? (
          <div className="kisi-2">
            {input("nama_kepala_sekolah", "Nama kepala sekolah", { maks: 255 })}
            <Isian label="Foto kepala sekolah" bantuan="Maksimal 1 MB.">
              <UnggahFile nilai={data.foto_kepala_sekolah} onUbah={(foto_kepala_sekolah) => ubah({ foto_kepala_sekolah })} folder="profil" maksKb={1024} />
            </Isian>
            {input("kutipan_sambutan", "Kutipan", { maks: 255, penuh: true, placeholder: "Setiap anak membawa potensi yang layak kita rawat bersama." })}
            {area("sambutan", "Isi sambutan", 5, { penuh: true })}
          </div>
        ) : null}

        {tab === "Sejarah, Visi & Misi" ? (
          <>
            <Isian label="Sejarah">
              <EditorTeks nilai={data.sejarah ?? ""} onUbah={(sejarah) => ubah({ sejarah })} folderGambar="profil" />
            </Isian>
            {area("visi", "Visi", 3)}
            <Isian label="Misi">
              <DaftarTeks nilai={data.misi} onUbah={(misi) => ubah({ misi })} tambahLabel="Tambah butir misi" />
            </Isian>
          </>
        ) : null}

        {tab === "Fasilitas" ? (
          <DaftarButir<Fasilitas>
            nilai={data.fasilitas}
            onUbah={(fasilitas) => ubah({ fasilitas })}
            kosong={() => ({ nama: "", deskripsi: "", foto: null })}
            tambahLabel="Tambah fasilitas"
            judulButir={(f, i) => f.nama || `Fasilitas ${i + 1}`}
            render={(f, ubahButir) => (
              <div className="kisi-2">
                <Isian label="Nama" wajib>
                  <input type="text" maxLength={100} value={f.nama ?? ""} onChange={(e) => ubahButir({ nama: e.target.value })} />
                </Isian>
                <Isian label="Deskripsi">
                  <textarea rows={2} value={f.deskripsi ?? ""} onChange={(e) => ubahButir({ deskripsi: e.target.value })} />
                </Isian>
                <Isian label="Foto" className="penuh" bantuan="Maksimal 2 MB.">
                  <UnggahFile nilai={f.foto ?? null} onUbah={(foto) => ubahButir({ foto })} folder="fasilitas" maksKb={2048} />
                </Isian>
              </div>
            )}
          />
        ) : null}

        {tab === "Struktur Organisasi" ? (
          <>
            <p className="bantuan">Butir pertama tampil paling atas sebagai pimpinan.</p>
            <DaftarButir<Jabatan>
              nilai={data.struktur_organisasi}
              onUbah={(struktur_organisasi) => ubah({ struktur_organisasi })}
              kosong={() => ({ jabatan: "", nama: "" })}
              tambahLabel="Tambah jabatan"
              judulButir={(s, i) => s.jabatan || `Jabatan ${i + 1}`}
              render={(s, ubahButir) => (
                <div className="kisi-2">
                  <Isian label="Jabatan" wajib>
                    <input type="text" maxLength={100} value={s.jabatan ?? ""} onChange={(e) => ubahButir({ jabatan: e.target.value })} />
                  </Isian>
                  <Isian label="Nama">
                    <input type="text" maxLength={150} value={s.nama ?? ""} onChange={(e) => ubahButir({ nama: e.target.value })} />
                  </Isian>
                </div>
              )}
            />
          </>
        ) : null}

        {tab === "Statistik" ? (
          <div className="kisi-4">
            {input("jumlah_siswa", "Jumlah siswa", { tipe: "number" })}
            {input("jumlah_guru", "Jumlah guru", { tipe: "number" })}
            {input("jumlah_kelas", "Jumlah kelas", { tipe: "number" })}
            {input("jumlah_ekstrakurikuler", "Jumlah ekstrakurikuler", { tipe: "number" })}
          </div>
        ) : null}

        {tab === "Kontak & Lokasi" ? (
          <div className="kisi-2">
            {area("alamat", "Alamat", 2, { penuh: true })}
            {input("telepon", "Telepon", { tipe: "tel", maks: 30 })}
            {input("whatsapp", "WhatsApp", { tipe: "tel", maks: 30, placeholder: "6281234567890", bantuan: "Format internasional tanpa tanda +" })}
            {input("email", "Email", { tipe: "email", maks: 255 })}
            {area("jam_operasional", "Jam layanan", 3, { placeholder: "Senin–Jumat: 07.30–14.00 WIB\nSabtu–Minggu: Tidak melayani", bantuan: "Satu baris untuk tiap hari/jadwal." })}
            {input("google_maps_link", "Link Google Maps", { tipe: "url", penuh: true, bantuan: "Untuk tombol \"Buka di Google Maps\"." })}
            {area("google_maps_embed", "Link embed Google Maps", 2, { penuh: true, bantuan: "Di Google Maps: Bagikan → Sematkan peta → salin alamat di dalam src=\"...\"" })}
          </div>
        ) : null}

        {tab === "Media Sosial" ? (
          <div className="kisi-2">
            {input("facebook", "Facebook", { tipe: "url", placeholder: "https://" })}
            {input("instagram", "Instagram", { tipe: "url", placeholder: "https://" })}
            {input("youtube", "YouTube", { tipe: "url", placeholder: "https://" })}
            {input("tiktok", "TikTok", { tipe: "url", placeholder: "https://" })}
          </div>
        ) : null}
      </div>

      <div className="baris-tombol" style={{ marginTop: 16 }}>
        <button type="submit" className="tbl tbl-utama" disabled={proses}>{proses ? "Menyimpan..." : "Simpan semua perubahan"}</button>
        <span className="bantuan">Isian di semua tab disimpan sekaligus.</span>
      </div>
    </form>
  );
}
