import type { Metadata } from "next";
import { FormPengumuman } from "../FormPengumuman";

export const metadata: Metadata = { title: "Pengumuman baru" };

export default function PengumumanBaru() {
  return (
    <>
      <div className="adm-kepala"><h1>Pengumuman baru</h1></div>
      <FormPengumuman awal={null} />
    </>
  );
}
