"use client";

/* eslint-disable @next/next/no-img-element -- pratinjau file dari Supabase Storage */
import { useState } from "react";
import { urlFile } from "@/lib/format";
import { supabaseBrowser } from "@/lib/supabase/browser";

export const TIPE_GAMBAR = "image/jpeg,image/png,image/webp,image/gif";
export const TIPE_DOKUMEN =
  "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png";

/**
 * Unggah satu file langsung dari browser ke bucket "kapsel".
 * Mengembalikan path file (misalnya "berita/3f1c...e2.jpg") yang disimpan di database.
 */
export async function unggahKeStorage(file: File, folder: string, maksKb: number): Promise<string> {
  if (file.size > maksKb * 1024) {
    throw new Error(`Ukuran "${file.name}" melebihi ${maksKb >= 1024 ? `${maksKb / 1024} MB` : `${maksKb} KB`}.`);
  }
  const ekstensi = (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ekstensi}`;

  const { error } = await supabaseBrowser().storage.from("kapsel").upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw new Error(`Gagal mengunggah "${file.name}": ${error.message}`);
  return path;
}

/** Satu file (foto atau dokumen) dengan pratinjau. */
export function UnggahFile({
  nilai,
  onUbah,
  folder,
  maksKb = 2048,
  jenis = "gambar",
  bulat = false,
}: {
  nilai: string | null;
  onUbah: (path: string | null) => void;
  folder: string;
  maksKb?: number;
  jenis?: "gambar" | "dokumen";
  bulat?: boolean;
}) {
  const [proses, setProses] = useState(false);
  const [galat, setGalat] = useState("");
  const url = urlFile(nilai);
  const tampilGambar = url && (jenis === "gambar" || /\.(jpe?g|png|webp|gif)$/i.test(nilai ?? ""));

  async function pilih(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setProses(true);
    setGalat("");
    try {
      onUbah(await unggahKeStorage(file, folder, maksKb));
    } catch (err) {
      setGalat(err instanceof Error ? err.message : "Gagal mengunggah file.");
    } finally {
      setProses(false);
    }
  }

  return (
    <div className="unggah">
      {tampilGambar ? <img src={url} alt="" className={bulat ? "pratinjau bulat" : "pratinjau"} /> : null}
      {url && !tampilGambar ? (
        <a href={url} target="_blank" rel="noopener" className="nama-file">
          {nilai?.split("/").pop()}
        </a>
      ) : null}
      {galat ? <div className="pesan-galat">{galat}</div> : null}
      <div className="baris-tombol">
        <input type="file" accept={jenis === "gambar" ? TIPE_GAMBAR : TIPE_DOKUMEN} onChange={pilih} disabled={proses} />
        {nilai ? (
          <button type="button" className="tbl tbl-kecil tbl-bahaya" onClick={() => onUbah(null)} disabled={proses}>
            Hapus
          </button>
        ) : null}
      </div>
      {proses ? <span className="bantuan">Mengunggah...</span> : null}
    </div>
  );
}

/** Banyak foto (album galeri): foto pertama menjadi sampul, urutan bisa diubah. */
export function UnggahBanyak({
  nilai,
  onUbah,
  folder,
  maksKb = 3072,
  maksFile = 50,
}: {
  nilai: string[];
  onUbah: (paths: string[]) => void;
  folder: string;
  maksKb?: number;
  maksFile?: number;
}) {
  const [proses, setProses] = useState("");
  const [galat, setGalat] = useState("");

  async function pilih(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    if (nilai.length + files.length > maksFile) {
      setGalat(`Maksimal ${maksFile} foto per album.`);
      return;
    }
    setGalat("");
    const hasil = [...nilai];
    const gagal: string[] = [];
    for (const [i, file] of files.entries()) {
      setProses(`Mengunggah ${i + 1} dari ${files.length}...`);
      try {
        hasil.push(await unggahKeStorage(file, folder, maksKb));
        onUbah([...hasil]);
      } catch (err) {
        gagal.push(err instanceof Error ? err.message : file.name);
      }
    }
    setProses("");
    if (gagal.length) setGalat(gagal.join(" "));
  }

  const pindah = (dari: number, ke: number) => {
    if (ke < 0 || ke >= nilai.length) return;
    const baru = [...nilai];
    const [f] = baru.splice(dari, 1);
    baru.splice(ke, 0, f);
    onUbah(baru);
  };

  return (
    <div className="unggah">
      {nilai.length > 0 ? (
        <div className="kisi-foto">
          {nilai.map((path, i) => (
            <figure key={path}>
              <img src={urlFile(path) ?? ""} alt={`Foto ${i + 1}`} />
              <figcaption>
                <span className={i === 0 ? "sampul" : undefined}>{i === 0 ? "Sampul" : `#${i + 1}`}</span>
                <span>
                  <button type="button" title="Geser ke kiri" onClick={() => pindah(i, i - 1)} disabled={i === 0}>←</button>
                  <button type="button" title="Geser ke kanan" onClick={() => pindah(i, i + 1)} disabled={i === nilai.length - 1}>→</button>
                  <button type="button" title="Hapus foto" onClick={() => onUbah(nilai.filter((_, j) => j !== i))}>✕</button>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
      {galat ? <div className="pesan-galat">{galat}</div> : null}
      <input type="file" accept={TIPE_GAMBAR} multiple onChange={pilih} disabled={Boolean(proses)} />
      {proses ? <span className="bantuan">{proses}</span> : null}
    </div>
  );
}
