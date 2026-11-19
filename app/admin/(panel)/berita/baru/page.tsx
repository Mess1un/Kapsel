import type { Metadata } from "next";
import { FormBerita } from "../FormBerita";

export const metadata: Metadata = { title: "Berita baru" };

export default function BeritaBaru() {
  return (
    <>
      <div className="adm-kepala"><h1>Berita baru</h1></div>
      <FormBerita awal={null} />
    </>
  );
}
