import type { Metadata } from "next";
import Link from "next/link";
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
        <p className="bantuan" style={{ margin: "0 0 12px" }}>
          Tambah, atur ulang kata sandi, atau hapus akun admin lain di menu Akun Admin.
        </p>
        <Link className="tbl" href="/admin/pengguna">Buka Akun Admin →</Link>
      </div>
    </>
  );
}
