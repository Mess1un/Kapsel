import type { Metadata } from "next";
import { FormGaleri } from "../FormGaleri";
import { kategoriGaleriAda } from "../kategori";

export const metadata: Metadata = { title: "Album baru" };

export const instant = false;

export default async function GaleriBaru() {
  return (
    <>
      <div className="adm-kepala"><h1>Album baru</h1></div>
      <FormGaleri awal={null} kategoriAda={await kategoriGaleriAda()} />
    </>
  );
}
