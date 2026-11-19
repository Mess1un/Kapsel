import type { Metadata } from "next";
import { FormGuru } from "../FormGuru";

export const metadata: Metadata = { title: "Guru baru" };

export default function GuruBaru() {
  return (
    <>
      <div className="adm-kepala"><h1>Guru baru</h1></div>
      <FormGuru awal={null} />
    </>
  );
}
