import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Berita } from "@/lib/jenis";
import { teksParam, type SearchParams } from "@/lib/params";
import { supabaseServer } from "@/lib/supabase/server";
import { FormBerita } from "../FormBerita";

export const metadata: Metadata = { title: "Ubah berita" };

export const instant = false;

export default async function UbahBerita({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: SearchParams;
}) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const supabase = await supabaseServer();
  const { data } = await supabase.from("berita").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const tersimpan = teksParam(await searchParams, "tersimpan");

  return (
    <>
      <div className="adm-kepala"><h1>Ubah berita</h1></div>
      <FormBerita key={data.id} awal={data as Berita} pesanAwal={tersimpan ? "Berita tersimpan." : undefined} />
    </>
  );
}
