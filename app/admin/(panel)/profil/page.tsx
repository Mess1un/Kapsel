import type { Metadata } from "next";
import type { Profil } from "@/lib/jenis";
import { supabaseServer } from "@/lib/supabase/server";
import { FormProfil } from "./FormProfil";

export const metadata: Metadata = { title: "Profil Sekolah" };

export const instant = false;

export default async function ProfilAdmin() {
  const supabase = await supabaseServer();
  const { data } = await supabase.from("profil_sekolah").select("*").order("id").limit(1).maybeSingle();

  return (
    <>
      <div className="adm-kepala"><h1>Profil Sekolah</h1></div>
      <FormProfil awal={(data as Profil | null) ?? null} />
    </>
  );
}
