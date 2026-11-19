import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Guru } from "@/lib/jenis";
import { supabaseServer } from "@/lib/supabase/server";
import { FormGuru } from "../FormGuru";

export const metadata: Metadata = { title: "Ubah data guru" };

export const instant = false;

export default async function UbahGuru({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const supabase = await supabaseServer();
  const { data } = await supabase.from("guru").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <>
      <div className="adm-kepala"><h1>Ubah data guru</h1></div>
      <FormGuru key={data.id} awal={data as Guru} />
    </>
  );
}
