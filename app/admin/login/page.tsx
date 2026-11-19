import type { Metadata } from "next";
import Link from "next/link";
import { FormLogin } from "./FormLogin";

export const metadata: Metadata = { title: "Masuk" };

export default function HalamanLogin() {
  return (
    <main className="adm-login">
      <div className="kotak">
        <h1>Panel Admin</h1>
        <p className="sub">Masuk untuk mengelola isi website sekolah.</p>
        <FormLogin />
        <p className="bantuan" style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/admin/lupa-sandi">Lupa kata sandi atau email akun?</Link>
        </p>
      </div>
    </main>
  );
}
