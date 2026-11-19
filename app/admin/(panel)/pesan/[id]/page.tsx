import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tanggalIndonesia } from "@/lib/format";
import type { PesanKontak } from "@/lib/jenis";
import { supabaseServer } from "@/lib/supabase/server";
import { TandaiDibaca, TombolBelumDibaca } from "./TandaiDibaca";

export const metadata: Metadata = { title: "Pesan" };

export const instant = false;

export default async function BukaPesan({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const supabase = await supabaseServer();
  const { data } = await supabase.from("pesan_kontak").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const pesan = data as PesanKontak;

  return (
    <>
      {pesan.sudah_dibaca ? null : <TandaiDibaca id={pesan.id} />}
      <div className="adm-kepala">
        <h1>{pesan.subjek || "Pesan tanpa subjek"}</h1>
        <div className="baris-tombol">
          <TombolBelumDibaca id={pesan.id} />
          <Link className="tbl" href="/admin/pesan">Kembali</Link>
        </div>
      </div>
      <div className="kotak">
        <dl className="info">
          <dt>Nama</dt><dd>{pesan.nama}</dd>
          <dt>Email</dt><dd><a href={`mailto:${pesan.email}`}>{pesan.email}</a></dd>
          {pesan.telepon ? (<><dt>Telepon</dt><dd>{pesan.telepon}</dd></>) : null}
          <dt>Dikirim</dt><dd>{tanggalIndonesia(pesan.created_at)}</dd>
        </dl>
        <div className="isi-pesan">{pesan.pesan}</div>
      </div>
    </>
  );
}
