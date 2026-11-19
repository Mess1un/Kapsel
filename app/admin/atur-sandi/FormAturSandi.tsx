"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

type Status = "memeriksa" | "siap" | "tidak-sah" | "proses" | "selesai";

/**
 * Tautan dari email membawa kode (?code=...). Klien Supabase menukarnya otomatis
 * menjadi sesi login sementara, lalu admin bisa menyimpan kata sandi baru.
 */
export function FormAturSandi() {
  const [status, setStatus] = useState<Status>("memeriksa");
  const [email, setEmail] = useState("");
  const [galat, setGalat] = useState("");

  useEffect(() => {
    let batal = false;
    supabaseBrowser()
      .auth.getSession()
      .then(({ data }) => {
        if (batal) return;
        // Hapus kode dari alamat supaya tidak tersimpan di riwayat browser.
        window.history.replaceState(null, "", "/admin/atur-sandi");
        if (data.session) {
          setEmail(data.session.user.email ?? "");
          setStatus("siap");
        } else {
          setStatus("tidak-sah");
        }
      });
    return () => {
      batal = true;
    };
  }, []);

  async function simpan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const baru = String(data.get("baru") ?? "");
    const ulang = String(data.get("ulang") ?? "");
    if (baru.length < 8) return setGalat("Kata sandi minimal 8 karakter.");
    if (baru !== ulang) return setGalat("Ulangi kata sandi tidak sama.");

    setStatus("proses");
    setGalat("");
    const { error } = await supabaseBrowser().auth.updateUser({ password: baru });
    if (error) {
      setStatus("siap");
      setGalat(
        /different from the old/i.test(error.message)
          ? "Kata sandi baru harus berbeda dari kata sandi lama."
          : `Gagal menyimpan kata sandi: ${error.message}`,
      );
      return;
    }
    setStatus("selesai");
  }

  if (status === "memeriksa") return <p className="sub">Memeriksa tautan...</p>;

  if (status === "tidak-sah") {
    return (
      <>
        <div className="pesan-galat">
          Tautan tidak berlaku atau sudah kedaluwarsa. Pastikan tautan dibuka di browser yang sama dengan tempat Anda
          meminta atur ulang kata sandi, lalu coba minta tautan baru.
        </div>
        <Link href="/admin/lupa-sandi" className="tbl tbl-utama" style={{ width: "100%", justifyContent: "center" }}>
          Minta tautan baru
        </Link>
      </>
    );
  }

  if (status === "selesai") {
    return (
      <>
        <div className="pesan-sukses">Kata sandi baru tersimpan. Anda sudah masuk ke panel admin.</div>
        {/* Tautan biasa: muat ulang penuh supaya sesi terbaca server. */}
        <a href="/admin" className="tbl tbl-utama" style={{ width: "100%", justifyContent: "center" }}>
          Buka panel admin
        </a>
      </>
    );
  }

  return (
    <form onSubmit={simpan}>
      <p className="sub">Akun: <strong>{email}</strong></p>
      {galat ? <div className="pesan-galat">{galat}</div> : null}
      <div className="isian">
        <label htmlFor="baru" className="wajib">Kata sandi baru</label>
        <input id="baru" name="baru" type="password" autoComplete="new-password" minLength={8} required autoFocus />
      </div>
      <div className="isian">
        <label htmlFor="ulang" className="wajib">Ulangi kata sandi baru</label>
        <input id="ulang" name="ulang" type="password" autoComplete="new-password" minLength={8} required />
      </div>
      <button type="submit" className="tbl tbl-utama" style={{ width: "100%", justifyContent: "center" }} disabled={status === "proses"}>
        {status === "proses" ? "Menyimpan..." : "Simpan kata sandi baru"}
      </button>
    </form>
  );
}
