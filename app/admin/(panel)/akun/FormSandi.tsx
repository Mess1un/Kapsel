"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export function FormSandi() {
  const [hasil, setHasil] = useState<{ galat?: string; pesan?: string }>({});
  const [proses, setProses] = useState(false);

  async function ganti(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const baru = String(data.get("baru") ?? "");
    const ulang = String(data.get("ulang") ?? "");

    if (baru.length < 8) return setHasil({ galat: "Kata sandi minimal 8 karakter." });
    if (baru !== ulang) return setHasil({ galat: "Ulangi kata sandi tidak sama." });

    setProses(true);
    const { error } = await supabaseBrowser().auth.updateUser({ password: baru });
    setProses(false);

    if (error) return setHasil({ galat: `Gagal mengganti kata sandi: ${error.message}` });
    form.reset();
    setHasil({ pesan: "Kata sandi berhasil diganti." });
  }

  return (
    <form onSubmit={ganti}>
      {hasil.galat ? <div className="pesan-galat">{hasil.galat}</div> : null}
      {hasil.pesan ? <div className="pesan-sukses">{hasil.pesan}</div> : null}
      <div className="isian">
        <label htmlFor="baru" className="wajib">Kata sandi baru</label>
        <input id="baru" name="baru" type="password" autoComplete="new-password" minLength={8} required />
      </div>
      <div className="isian">
        <label htmlFor="ulang" className="wajib">Ulangi kata sandi baru</label>
        <input id="ulang" name="ulang" type="password" autoComplete="new-password" minLength={8} required />
      </div>
      <button type="submit" className="tbl tbl-utama" disabled={proses}>{proses ? "Menyimpan..." : "Ganti kata sandi"}</button>
    </form>
  );
}
