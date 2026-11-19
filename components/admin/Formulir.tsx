"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import type { HasilAksi } from "@/lib/admin";

/** Pesan galat / sukses di atas formulir. */
export function PesanHasil({ hasil }: { hasil: HasilAksi | null }) {
  if (!hasil) return null;
  if (hasil.galat) return <div className="pesan-galat" role="alert">{hasil.galat}</div>;
  if (hasil.pesan) return <div className="pesan-sukses" role="status">{hasil.pesan}</div>;
  return null;
}

/**
 * Menjalankan Server Action simpan, menampilkan hasilnya, lalu menggulir ke atas
 * supaya pesan terlihat.
 */
export function useSimpan() {
  const [hasil, setHasil] = useState<HasilAksi | null>(null);
  const [proses, mulai] = useTransition();
  const router = useRouter();

  const simpan = (aksi: () => Promise<HasilAksi | void>) =>
    mulai(async () => {
      setHasil(null);
      const h = await aksi();
      if (h) {
        setHasil(h);
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (h.pesan) router.refresh();
      }
    });

  return { hasil, proses, simpan };
}

/** Satu isian berlabel. */
export function Isian({
  label,
  wajib,
  bantuan,
  htmlFor,
  className,
  children,
}: {
  label: string;
  wajib?: boolean;
  bantuan?: string;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className ? `isian ${className}` : "isian"}>
      <label htmlFor={htmlFor} className={wajib ? "wajib" : undefined}>
        {label}
      </label>
      {children}
      {bantuan ? <span className="bantuan">{bantuan}</span> : null}
    </div>
  );
}

/** Daftar teks berulang (misi, ketentuan, berkas). */
export function DaftarTeks({
  nilai,
  onUbah,
  tambahLabel,
  placeholder,
}: {
  nilai: string[];
  onUbah: (v: string[]) => void;
  tambahLabel: string;
  placeholder?: string;
}) {
  const ubah = (i: number, v: string) => onUbah(nilai.map((x, j) => (j === i ? v : x)));
  const pindah = (dari: number, ke: number) => {
    if (ke < 0 || ke >= nilai.length) return;
    const baru = [...nilai];
    const [x] = baru.splice(dari, 1);
    baru.splice(ke, 0, x);
    onUbah(baru);
  };

  return (
    <div className="ulang">
      {nilai.map((v, i) => (
        <div className="ulang-baris" key={i}>
          <input type="text" value={v} placeholder={placeholder} onChange={(e) => ubah(i, e.target.value)} />
          <button type="button" className="tbl tbl-kecil" title="Naik" onClick={() => pindah(i, i - 1)} disabled={i === 0}>↑</button>
          <button type="button" className="tbl tbl-kecil" title="Turun" onClick={() => pindah(i, i + 1)} disabled={i === nilai.length - 1}>↓</button>
          <button type="button" className="tbl tbl-kecil tbl-bahaya" title="Hapus" onClick={() => onUbah(nilai.filter((_, j) => j !== i))}>✕</button>
        </div>
      ))}
      <div>
        <button type="button" className="tbl tbl-kecil" onClick={() => onUbah([...nilai, ""])}>+ {tambahLabel}</button>
      </div>
    </div>
  );
}

/** Daftar butir berulang dengan beberapa isian (fasilitas, struktur, tahapan). */
export function DaftarButir<T>({
  nilai,
  onUbah,
  kosong,
  tambahLabel,
  judulButir,
  render,
}: {
  nilai: T[];
  onUbah: (v: T[]) => void;
  kosong: () => T;
  tambahLabel: string;
  judulButir: (butir: T, i: number) => string;
  render: (butir: T, ubah: (b: Partial<T>) => void, i: number) => ReactNode;
}) {
  const pindah = (dari: number, ke: number) => {
    if (ke < 0 || ke >= nilai.length) return;
    const baru = [...nilai];
    const [x] = baru.splice(dari, 1);
    baru.splice(ke, 0, x);
    onUbah(baru);
  };

  return (
    <div className="ulang">
      {nilai.map((butir, i) => (
        <div className="ulang-butir" key={i}>
          <div className="kepala-butir">
            <span>{judulButir(butir, i)}</span>
            <span className="baris-tombol">
              <button type="button" className="tbl tbl-kecil" onClick={() => pindah(i, i - 1)} disabled={i === 0}>↑</button>
              <button type="button" className="tbl tbl-kecil" onClick={() => pindah(i, i + 1)} disabled={i === nilai.length - 1}>↓</button>
              <button type="button" className="tbl tbl-kecil tbl-bahaya" onClick={() => onUbah(nilai.filter((_, j) => j !== i))}>Hapus</button>
            </span>
          </div>
          {render(butir, (b) => onUbah(nilai.map((x, j) => (j === i ? { ...x, ...b } : x))), i)}
        </div>
      ))}
      <div>
        <button type="button" className="tbl tbl-kecil" onClick={() => onUbah([...nilai, kosong()])}>+ {tambahLabel}</button>
      </div>
    </div>
  );
}

/** Tombol hapus dengan konfirmasi. */
export function TombolHapus({
  aksi,
  konfirmasi,
  label = "Hapus",
}: {
  aksi: () => Promise<HasilAksi | void>;
  konfirmasi: string;
  label?: string;
}) {
  const [proses, mulai] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      className="tbl tbl-kecil tbl-bahaya"
      disabled={proses}
      onClick={() => {
        if (!window.confirm(konfirmasi)) return;
        mulai(async () => {
          const h = await aksi();
          if (h?.galat) window.alert(h.galat);
          else router.refresh();
        });
      }}
    >
      {proses ? "Menghapus..." : label}
    </button>
  );
}

/** Nilai awal "sekarang" untuk input datetime-local, dalam WIB. */
export function sekarangWibLokal(): string {
  const b = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date()).map((p) => [p.type, p.value]),
  );
  return `${b.year}-${b.month}-${b.day}T${b.hour}:${b.minute}`;
}

/** "2026-05-12T08:00:00" / "2026-05-12 08:00:00" -> "2026-05-12T08:00" untuk input datetime-local. */
export function keInputWaktu(nilai: string | null | undefined): string {
  const cocok = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/.exec(nilai ?? "");
  return cocok ? `${cocok[1]}T${cocok[2]}` : "";
}
