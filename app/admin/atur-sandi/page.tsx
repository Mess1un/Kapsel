import type { Metadata } from "next";
import { FormAturSandi } from "./FormAturSandi";

export const metadata: Metadata = { title: "Buat kata sandi baru" };

/** Halaman tujuan tautan "atur ulang kata sandi" dari email. */
export default function HalamanAturSandi() {
  return (
    <main className="adm-login">
      <div className="kotak">
        <h1>Buat kata sandi baru</h1>
        <FormAturSandi />
      </div>
    </main>
  );
}
