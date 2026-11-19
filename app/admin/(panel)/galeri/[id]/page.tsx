import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Galeri } from "@/lib/jenis";
import { teksParam, type SearchParams } from "@/lib/params";
import { supabaseServer } from "@/lib/supabase/server";
import { FormGaleri } from "../FormGaleri";
import { kategoriGaleriAda } from "../kategori";

export const metadata: Metadata = { title: "Ubah album" };

export const instant = false;

export default async function UbahGaleri({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: SearchParams;
}) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const supabase = await supabaseServer();
  const [{ data }, kategoriAda] = await Promise.all([
    supabase.from("galeri").select("*").eq("id", id).maybeSingle(),
    kategoriGaleriAda(),
  ]);
  if (!data) notFound();
  const tersimpan = teksParam(await searchParams, "tersimpan");

  return (
    <>
      <div className="adm-kepala"><h1>Ubah album</h1></div>
      <FormGaleri key={data.id} awal={data as Galeri} kategoriAda={kategoriAda} pesanAwal={tersimpan ? "Album tersimpan." : undefined} />
    </>
  );
}
