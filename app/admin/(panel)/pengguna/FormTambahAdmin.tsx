"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Isian } from "@/components/admin/Formulir";
import { aturUlangSandi, tambahAdmin } from "./aksi";

/** Kata sandi acak 12 karakter yang mudah dibaca (tanpa huruf mirip seperti l/1/O/0). */
export function sandiAcak(): string {
  const huruf = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const angka = crypto.getRandomValues(new Uint32Array(12));
  return Array.from(angka, (n) => huruf[n % huruf.length]).join("");
}

/** Kotak yang menampilkan email + kata sandi untuk disalin dan diberikan ke admin baru. */
function KotakInfoLogin({ email, sandi }: { email: string; sandi: string }) {
  const [tersalin, setTersalin] = useState(false);
  const teks = `Panel admin: ${window.location.origin}/admin/login\nEmail: ${email}\nKata sandi: ${sandi}`;

  return (
    <div className="pesan-sukses">
      <strong>Berikan info masuk ini kepada {email}:</strong>
      <pre style={{ margin: "8px 0", whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{teks}</pre>
      <div className="baris-tombol">
        <button
          type="button"
          className="tbl tbl-kecil"
          onClick={async () => {
            await navigator.clipboard.writeText(teks);
            setTersalin(true);
          }}
        >
          {tersalin ? "Tersalin ✓" : "Salin"}
        </button>
        <span className="bantuan">Minta admin tersebut mengganti kata sandinya di menu Akun Saya setelah masuk.</span>
      </div>
    </div>
  );
}

export function FormTambahAdmin() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [sandi, setSandi] = useState("");
  const [galat, setGalat] = useState("");
  const [berhasil, setBerhasil] = useState<{ email: string; sandi: string } | null>(null);
  const [proses, mulai] = useTransition();
  const router = useRouter();

  function kirim(e: React.FormEvent) {
    e.preventDefault();
    setGalat("");
    setBerhasil(null);
    mulai(async () => {
      const h = await tambahAdmin({ nama, email, sandi });
      if (h.galat) {
        setGalat(h.galat);
        return;
      }
      setBerhasil({ email: email.trim().toLowerCase(), sandi });
      setNama("");
      setEmail("");
      setSandi("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={kirim}>
      {galat ? <div className="pesan-galat">{galat}</div> : null}
      {berhasil ? <KotakInfoLogin email={berhasil.email} sandi={berhasil.sandi} /> : null}
      <div className="kisi-2">
        <Isian label="Nama" wajib htmlFor="nama-admin">
          <input id="nama-admin" type="text" maxLength={100} required value={nama} onChange={(e) => setNama(e.target.value)} />
        </Isian>
        <Isian label="Email" wajib htmlFor="email-admin">
          <input id="email-admin" type="email" required autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Isian>
        <Isian label="Kata sandi sementara" wajib htmlFor="sandi-admin" bantuan="Minimal 8 karakter. Klik &quot;Buat acak&quot; bila tidak ingin memikirkannya.">
          <div className="ulang-baris">
            <input id="sandi-admin" type="text" minLength={8} required autoComplete="new-password" value={sandi} onChange={(e) => setSandi(e.target.value)} />
            <button type="button" className="tbl tbl-kecil" onClick={() => setSandi(sandiAcak())}>Buat acak</button>
          </div>
        </Isian>
      </div>
      <button type="submit" className="tbl tbl-utama" disabled={proses}>{proses ? "Membuat akun..." : "+ Tambah admin"}</button>
    </form>
  );
}

/** Tombol "Atur ulang sandi" di tabel: membuat kata sandi acak lalu menampilkannya. */
export function TombolAturUlang({ userId, email }: { userId: string; email: string }) {
  const [hasil, setHasil] = useState<string | null>(null);
  const [proses, mulai] = useTransition();

  if (hasil) {
    return (
      <span className="baris-tombol" style={{ justifyContent: "flex-end" }}>
        <span className="lencana hijau">Sandi baru: <code>{hasil}</code></span>
        <button type="button" className="tbl tbl-kecil" onClick={() => navigator.clipboard.writeText(hasil)}>Salin</button>
      </span>
    );
  }

  return (
    <button
      type="button"
      className="tbl tbl-kecil"
      disabled={proses}
      onClick={() => {
        if (!window.confirm(`Buat kata sandi baru untuk ${email}? Kata sandi lamanya tidak bisa dipakai lagi.`)) return;
        const baru = sandiAcak();
        mulai(async () => {
          const h = await aturUlangSandi(userId, baru);
          if (h.galat) window.alert(h.galat);
          else setHasil(baru);
        });
      }}
    >
      {proses ? "Memproses..." : "Atur ulang sandi"}
    </button>
  );
}
