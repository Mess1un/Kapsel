import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { MenuSamping } from "@/components/admin/MenuSamping";
import { adminSaatIni, supabaseServer } from "@/lib/supabase/server";
import { TombolKeluar } from "./TombolKeluar";

// Panel admin selalu dibuat saat dibuka (butuh sesi login), tidak di-cache.
export const instant = false;

export default async function LayoutPanel({ children }: { children: ReactNode }) {
  const admin = await adminSaatIni();

  if (!admin) {
    const supabase = await supabaseServer();
    const { data } = await supabase.auth.getUser();
    if (!data.user) redirect("/admin/login");

    // Sudah login, tetapi akunnya tidak terdaftar di tabel admin.
    return (
      <main className="adm-login">
        <div className="kotak">
          <h1>Akses ditolak</h1>
          <p className="sub">
            Akun <strong>{data.user.email}</strong> tidak terdaftar sebagai admin website ini.
          </p>
          <TombolKeluar />
        </div>
      </main>
    );
  }

  const supabase = await supabaseServer();
  const [{ data: profil }, { count: pesanBaru }] = await Promise.all([
    supabase.from("profil_sekolah").select("nama_sekolah").order("id").limit(1).maybeSingle(),
    supabase.from("pesan_kontak").select("id", { count: "exact", head: true }).eq("sudah_dibaca", false),
  ]);

  return (
    <div className="adm-tata">
      <MenuSamping
        namaSekolah={profil?.nama_sekolah ?? "Website Sekolah"}
        namaAdmin={admin.nama}
        pesanBaru={pesanBaru ?? 0}
      />
      <main className="adm-isi">{children}</main>
    </div>
  );
}
