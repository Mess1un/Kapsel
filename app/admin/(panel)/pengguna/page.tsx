import type { Metadata } from "next";
import { TombolHapus } from "@/components/admin/Formulir";
import { adminSaatIni } from "@/lib/supabase/server";
import { adaKunciRahasia, supabaseRahasia } from "@/lib/supabase/rahasia";
import { hapusAdmin } from "./aksi";
import { FormTambahAdmin, TombolAturUlang } from "./FormTambahAdmin";

export const metadata: Metadata = { title: "Akun Admin" };

export const instant = false;

function waktu(t: string | null | undefined): string {
  if (!t) return "Belum pernah";
  return new Date(t).toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium", timeStyle: "short" });
}

export default async function AkunAdmin() {
  const saya = await adminSaatIni();

  if (!adaKunciRahasia()) {
    return (
      <>
        <div className="adm-kepala"><h1>Akun Admin</h1></div>
        <div className="pesan-galat">
          Menu ini butuh <code>SUPABASE_SECRET_KEY</code>. Isi di <code>.env.local</code> (komputer) atau di
          Environment Variables Vercel, lalu jalankan ulang / deploy ulang website.
        </div>
      </>
    );
  }

  const rahasia = supabaseRahasia();
  const [{ data: daftar, error }, { data: auth }] = await Promise.all([
    rahasia.from("admin").select("user_id, nama, dibuat_pada").order("dibuat_pada"),
    rahasia.auth.admin.listUsers({ perPage: 1000 }),
  ]);
  const akun = new Map((auth?.users ?? []).map((u) => [u.id, u]));
  const admin = (daftar ?? []).map((a) => ({ ...a, akun: akun.get(a.user_id) }));

  return (
    <>
      <div className="adm-kepala"><h1>Akun Admin</h1></div>

      <div className="kotak">
        <h2>Tambah admin baru</h2>
        <p className="bantuan" style={{ marginTop: -6 }}>
          Akun langsung aktif tanpa perlu konfirmasi email. Setelah dibuat, salin info masuknya dan berikan kepada
          admin baru.
        </p>
        <FormTambahAdmin />
      </div>

      <div className="kotak tabel-wadah" style={{ padding: 0 }}>
        {error ? <div className="pesan-galat" style={{ margin: 12 }}>Gagal memuat daftar admin: {error.message}</div> : null}
        <table className="tabel">
          <thead>
            <tr><th>Nama</th><th>Email</th><th>Terakhir masuk</th><th></th></tr>
          </thead>
          <tbody>
            {admin.map((a) => {
              const email = a.akun?.email ?? "(akun tidak ditemukan)";
              const diriSendiri = a.user_id === saya?.id;
              return (
                <tr key={a.user_id}>
                  <td className="tebal">
                    {a.nama || "—"} {diriSendiri ? <span className="lencana">Anda</span> : null}
                  </td>
                  <td>{email}</td>
                  <td>{waktu(a.akun?.last_sign_in_at)}</td>
                  <td className="aksi">
                    {diriSendiri ? (
                      <span className="bantuan">Ganti sandi di menu Akun Saya</span>
                    ) : (
                      <span className="baris-tombol" style={{ justifyContent: "flex-end" }}>
                        <TombolAturUlang userId={a.user_id} email={email} />
                        <TombolHapus
                          aksi={hapusAdmin.bind(null, a.user_id)}
                          konfirmasi={`Hapus akun admin ${email}? Orang tersebut tidak akan bisa masuk lagi.`}
                        />
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
