import type { Metadata } from "next";
import type { InfoPpdb } from "@/lib/jenis";
import { supabaseServer } from "@/lib/supabase/server";
import { FormPpdb } from "./FormPpdb";

export const metadata: Metadata = { title: "Informasi PPDB" };

export const instant = false;

export default async function PpdbAdmin() {
  const supabase = await supabaseServer();
  const { data } = await supabase.from("info_ppdb").select("*").order("id").limit(1).maybeSingle();

  return (
    <>
      <div className="adm-kepala"><h1>Informasi PPDB</h1></div>
      <FormPpdb awal={(data as InfoPpdb | null) ?? null} />
    </>
  );
}
