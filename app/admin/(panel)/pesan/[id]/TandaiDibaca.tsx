"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { tandaiPesan } from "../aksi";

/** Menandai pesan sebagai sudah dibaca saat benar-benar dibuka. */
export function TandaiDibaca({ id }: { id: number }) {
  const router = useRouter();
  useEffect(() => {
    void tandaiPesan(id, true).then(() => router.refresh());
  }, [id, router]);
  return null;
}

export function TombolBelumDibaca({ id }: { id: number }) {
  const router = useRouter();
  const [proses, mulai] = useTransition();
  return (
    <button
      type="button"
      className="tbl"
      disabled={proses}
      onClick={() =>
        mulai(async () => {
          await tandaiPesan(id, false);
          router.push("/admin/pesan");
        })
      }
    >
      Tandai belum dibaca
    </button>
  );
}
