"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export function FormLupaSandi() {
  const [status, setStatus] = useState<"isi" | "proses" | "terkirim">("isi");
  const [galat, setGalat] = useState("");

  async function kirim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim().toLowerCase();
    setStatus("proses");
    setGalat("");

    const { error } = await supabaseBrowser().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/atur-sandi`,
    });

    // Batas kirim email Supabase (mis. terlalu sering) perlu diberitahukan.
    if (error && /rate|limit|seconds/i.test(error.message)) {
      setStatus("isi");
      setGalat("Terlalu sering meminta tautan. Tunggu sebentar lalu coba lagi.");
      return;
    }

    // Pesan sama untuk email terdaftar maupun tidak, supaya daftar admin tidak bisa ditebak.
    setStatus("terkirim");
  }

  if (status === "terkirim") {
    return (
      <div className="pesan-sukses" role="status">
        Bila email tersebut terdaftar sebagai admin, tautan untuk membuat kata sandi baru sudah dikirim. Periksa kotak
        masuk (dan folder Spam), lalu buka tautannya <strong>di browser yang sama</strong> dengan halaman ini.
        Tautan berlaku 1 jam.
      </div>
    );
  }

  return (
    <form onSubmit={kirim}>
      {galat ? <div className="pesan-galat">{galat}</div> : null}
      <div className="isian">
        <label htmlFor="email" className="wajib">Alamat email</label>
        <input id="email" name="email" type="email" autoComplete="email" required autoFocus />
      </div>
      <button type="submit" className="tbl tbl-utama" style={{ width: "100%", justifyContent: "center" }} disabled={status === "proses"}>
        {status === "proses" ? "Mengirim..." : "Kirim tautan atur ulang"}
      </button>
    </form>
  );
}
