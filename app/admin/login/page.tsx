import type { Metadata } from "next";
import { FormLogin } from "./FormLogin";

export const metadata: Metadata = { title: "Masuk" };

export default function HalamanLogin() {
  return (
    <main className="adm-login">
      <div className="kotak">
        <h1>Panel Admin</h1>
        <p className="sub">Masuk untuk mengelola isi website sekolah.</p>
        <FormLogin />
      </div>
    </main>
  );
}
