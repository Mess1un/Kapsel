import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Pengumuman } from "@/lib/jenis";
import { teksParam, type SearchParams } from "@/lib/params";
import { supabaseServer } from "@/lib/supabase/server";
import { FormPengumuman } from "../FormPengumuman";

export const metadata: Metadata = { title: "Ubah pengumuman" };

export const instant = false;

export default async function UbahPengumuman({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: SearchParams;
}) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const supabase = await supabaseServer();
  const { data } = await supabase.from("pengumuman").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const tersimpan = teksParam(await searchParams, "tersimpan");

  return (
    <>
      <div className="adm-kepala"><h1>Ubah pengumuman</h1></div>
      <FormPengumuman key={data.id} awal={data as Pengumuman} pesanAwal={tersimpan ? "Pengumuman tersimpan." : undefined} />
    </>
  );
}
