import type { Metadata } from "next";
import Link from "next/link";
import { FormLupaSandi } from "./FormLupaSandi";

export const metadata: Metadata = { title: "Lupa kata sandi" };

export default function HalamanLupaSandi() {
  return (
    <main className="adm-login">
      <div className="kotak">
        <h1>Lupa kata sandi</h1>
        <p className="sub">Masukkan email akun admin. Kami akan mengirim tautan untuk membuat kata sandi baru.</p>
        <FormLupaSandi />
        <p className="bantuan" style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/admin/login">← Kembali ke halaman masuk</Link>
        </p>
        <details className="bantuan" style={{ marginTop: 12 }}>
          <summary style={{ cursor: "pointer" }}>Lupa email akun?</summary>
          <p style={{ margin: "8px 0 0" }}>
            Hubungi admin lain atau pengelola website. Pengelola bisa melihat daftar email admin dan mengatur ulang
            kata sandi dari komputernya dengan perintah <code>npm run admin:daftar</code> dan{" "}
            <code>npm run admin:tambah</code>.
          </p>
        </details>
      </div>
    </main>
  );
}
