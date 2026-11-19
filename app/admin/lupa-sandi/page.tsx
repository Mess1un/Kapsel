import type { Metadata } from "next";
import Link from "next/link";
import { FormLupaSandi } from "./FormLupaSandi";

export const metadata: Metadata = { title: "Lupa kata sandi" };

export default function HalamanLupaSandi() {
  return (
    <main className="adm-login">
      <div className="kotak">
        <h1>Lupa kata sandi</h1>
        <p className="sub">Masukkan email akun Anda, nanti kami kirimkan tautan untuk membuat kata sandi baru.</p>
        <FormLupaSandi />
        <p className="bantuan" style={{ textAlign: "center", marginTop: 18 }}>
          <Link href="/admin/login">← Kembali ke halaman masuk</Link>
        </p>
        <div className="catatan">
          <strong>Lupa email yang dipakai?</strong>
          <p>Hubungi admin sekolah. Admin bisa melihat email akun Anda dan membuatkan kata sandi baru.</p>
        </div>
      </div>
    </main>
  );
}
