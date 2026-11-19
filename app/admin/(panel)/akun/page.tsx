import type { Metadata } from "next";
import { adminSaatIni } from "@/lib/supabase/server";
import { FormSandi } from "./FormSandi";

export const metadata: Metadata = { title: "Akun Saya" };

export const instant = false;

export default async function AkunSaya() {
  const admin = await adminSaatIni();

  return (
    <>
      <div className="adm-kepala"><h1>Akun Saya</h1></div>
      <div className="kotak">
        <dl className="info">
          <dt>Nama</dt><dd>{admin?.nama}</dd>
          <dt>Email</dt><dd>{admin?.email}</dd>
        </dl>
      </div>
      <div className="kotak" style={{ maxWidth: 480 }}>
        <h2>Ganti kata sandi</h2>
        <FormSandi />
      </div>
      <div className="kotak">
        <h2>Menambah admin lain</h2>
        <p className="bantuan" style={{ margin: 0 }}>
          Akun admin baru dibuat dari komputer pengelola dengan perintah <code>npm run admin:tambah</code> di folder{" "}
          <code>nextjs</code> (lihat README). Akun yang dibuat lewat cara lain tidak otomatis menjadi admin.
        </p>
      </div>
    </>
  );
}
