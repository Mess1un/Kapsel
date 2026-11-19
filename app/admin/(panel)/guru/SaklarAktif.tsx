"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { ubahAktifGuru } from "./aksi";

/** Tampil/sembunyikan guru langsung dari tabel. */
export function SaklarAktif({ id, aktif }: { id: number; aktif: boolean }) {
  const [nilai, setNilai] = useOptimistic(aktif);
  const [proses, mulai] = useTransition();
  const router = useRouter();

  return (
    <label className="saklar" style={{ fontWeight: 400 }}>
      <input
        type="checkbox"
        checked={nilai}
        disabled={proses}
        onChange={(e) => {
          const baru = e.target.checked;
          mulai(async () => {
            setNilai(baru);
            const h = await ubahAktifGuru(id, baru);
            if (h.galat) window.alert(h.galat);
            router.refresh();
          });
        }}
      />
      {nilai ? "Tampil" : "Disembunyikan"}
    </label>
  );
}
