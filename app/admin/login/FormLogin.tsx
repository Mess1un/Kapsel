"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export function FormLogin() {
  const [galat, setGalat] = useState("");
  const [proses, setProses] = useState(false);

  async function masuk(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setProses(true);
    setGalat("");

    const { error } = await supabaseBrowser().auth.signInWithPassword({
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
    });

    if (error) {
      setProses(false);
      setGalat(
        error.message === "Invalid login credentials"
          ? "Email atau kata sandi salah."
          : `Gagal masuk: ${error.message}`,
      );
      return;
    }

    // Muat ulang penuh supaya cookie sesi terbaca oleh server.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/admin");
  }

  return (
    <form onSubmit={masuk}>
      {galat ? <div className="pesan-galat">{galat}</div> : null}
      <div className="isian">
        <label htmlFor="email" className="wajib">Alamat email</label>
        <input id="email" name="email" type="email" autoComplete="email" required autoFocus />
      </div>
      <div className="isian">
        <label htmlFor="password" className="wajib">Kata sandi</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button type="submit" className="tbl tbl-utama" style={{ width: "100%", justifyContent: "center" }} disabled={proses}>
        {proses ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
