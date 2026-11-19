import Link from "next/link";
import { Fragment } from "react";

/** Pita abu-abu di atas halaman dalam: remah roti, judul, dan subjudul. */
export function JudulHalaman({
  judul,
  sub,
  remah,
}: {
  judul: string;
  sub?: string | null;
  remah: { teks: string; href?: string }[];
}) {
  return (
    <section className="judul-halaman">
      <div className="wadah">
        <nav className="remah" aria-label="Remah roti">
          <Link href="/">Beranda</Link>
          {remah.map((r) => (
            <Fragment key={r.teks}>
              {" / "}
              {r.href ? <Link href={r.href}>{r.teks}</Link> : <span>{r.teks}</span>}
            </Fragment>
          ))}
        </nav>
        <h1>{judul}</h1>
        {sub ? <p>{sub}</p> : null}
      </div>
    </section>
  );
}
