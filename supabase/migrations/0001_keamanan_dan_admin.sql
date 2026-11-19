-- =====================================================================
-- Keamanan database untuk versi Next.js (aman dijalankan berulang kali).
--
-- Next.js mengakses Supabase memakai kunci publik (publishable/anon key)
-- yang terlihat di browser. Karena itu setiap tabel WAJIB memakai
-- Row Level Security (RLS): pengunjung hanya boleh MEMBACA isi yang sudah
-- terbit, dan hanya akun yang terdaftar di tabel `admin` yang boleh mengubah.
--
-- Laravel tidak terpengaruh: Laravel memakai akun pemilik tabel (postgres)
-- yang tidak dibatasi RLS.
--
-- Jalankan di Supabase: SQL Editor -> tempel seluruh isi file ini -> Run.
-- =====================================================================

-- 1. Nyalakan RLS di SEMUA tabel schema public --------------------------
do $$
declare t record;
begin
    for t in select tablename from pg_tables where schemaname = 'public' loop
        execute format('alter table public.%I enable row level security', t.tablename);
    end loop;
end $$;

-- Tabel bawaan Laravel (akun & hash password, sesi, cache, antrean) tidak
-- boleh bisa dibaca lewat API sama sekali.
do $$
declare t text;
begin
    foreach t in array array['users', 'password_reset_tokens', 'sessions', 'cache', 'cache_locks',
                             'jobs', 'job_batches', 'failed_jobs', 'migrations'] loop
        if to_regclass('public.' || t) is not null then
            execute format('revoke all on table public.%I from anon, authenticated', t);
        end if;
    end loop;
end $$;

-- Kunci rahasia (service_role) dipakai skrip admin di komputer pengelola:
-- `npm run admin:pindah` membaca akun lama di tabel users.
do $$
begin
    if to_regclass('public.users') is not null then
        grant select on table public.users to service_role;
    end if;
end $$;

-- 2. Daftar admin --------------------------------------------------------
-- Akun login dibuat di Supabase Auth; hanya yang tercatat di sini yang
-- dianggap admin. Pendaftaran akun dari luar tidak memberi akses apa pun.
create table if not exists public.admin (
    user_id uuid primary key references auth.users (id) on delete cascade,
    nama text not null default '',
    dibuat_pada timestamptz not null default now()
);
alter table public.admin enable row level security;
revoke all on table public.admin from anon;
grant select on table public.admin to authenticated;
grant select, insert, update, delete on table public.admin to service_role;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (select 1 from public.admin where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admin melihat daftar admin" on public.admin;
create policy "admin melihat daftar admin" on public.admin
    for select to authenticated using ((select public.is_admin()));

-- Waktu "sekarang" dalam zona Asia/Jakarta, sama seperti cara Laravel
-- menyimpan kolom tanggal_terbit (timestamp tanpa zona waktu).
create or replace function public.sekarang_wib()
returns timestamp
language sql
stable
set search_path = ''
as $$
    select (now() at time zone 'Asia/Jakarta');
$$;

-- 3. Hak akses tabel isi website ----------------------------------------
grant select on table public.profil_sekolah, public.info_ppdb, public.guru,
                      public.berita, public.pengumuman, public.galeri
    to anon, authenticated;
grant insert, update, delete on table public.profil_sekolah, public.info_ppdb, public.guru,
                                      public.berita, public.pengumuman, public.galeri
    to authenticated;
grant select, update, delete on table public.pesan_kontak to authenticated;
revoke all on table public.pesan_kontak from anon;
grant usage, select on all sequences in schema public to authenticated;

-- 4. Aturan baca untuk pengunjung ---------------------------------------
drop policy if exists "publik membaca profil" on public.profil_sekolah;
create policy "publik membaca profil" on public.profil_sekolah
    for select to anon, authenticated using (true);

drop policy if exists "publik membaca ppdb" on public.info_ppdb;
create policy "publik membaca ppdb" on public.info_ppdb
    for select to anon, authenticated using (true);

drop policy if exists "publik membaca guru aktif" on public.guru;
create policy "publik membaca guru aktif" on public.guru
    for select to anon, authenticated using (aktif or (select public.is_admin()));

drop policy if exists "publik membaca berita terbit" on public.berita;
create policy "publik membaca berita terbit" on public.berita
    for select to anon, authenticated
    using ((diterbitkan and (tanggal_terbit is null or tanggal_terbit <= public.sekarang_wib()))
           or (select public.is_admin()));

drop policy if exists "publik membaca pengumuman terbit" on public.pengumuman;
create policy "publik membaca pengumuman terbit" on public.pengumuman
    for select to anon, authenticated
    using ((diterbitkan and (tanggal_terbit is null or tanggal_terbit <= public.sekarang_wib()))
           or (select public.is_admin()));

drop policy if exists "publik membaca galeri terbit" on public.galeri;
create policy "publik membaca galeri terbit" on public.galeri
    for select to anon, authenticated using (diterbitkan or (select public.is_admin()));

-- 5. Aturan ubah untuk admin --------------------------------------------
do $$
declare t text;
begin
    foreach t in array array['profil_sekolah', 'info_ppdb', 'guru', 'berita', 'pengumuman', 'galeri'] loop
        execute format('drop policy if exists "admin menambah" on public.%I', t);
        execute format('create policy "admin menambah" on public.%I for insert to authenticated with check ((select public.is_admin()))', t);
        execute format('drop policy if exists "admin mengubah" on public.%I', t);
        execute format('create policy "admin mengubah" on public.%I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);
        execute format('drop policy if exists "admin menghapus" on public.%I', t);
        execute format('create policy "admin menghapus" on public.%I for delete to authenticated using ((select public.is_admin()))', t);
    end loop;
end $$;

drop policy if exists "admin mengelola pesan" on public.pesan_kontak;
create policy "admin mengelola pesan" on public.pesan_kontak
    for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- 6. Jumlah pembaca berita (dipanggil dari halaman publik) ---------------
create or replace function public.tambah_dilihat(p_slug text)
returns void
language sql
security definer
set search_path = ''
as $$
    update public.berita
       set dilihat = dilihat + 1
     where slug = p_slug
       and diterbitkan
       and (tanggal_terbit is null or tanggal_terbit <= public.sekarang_wib());
$$;
revoke all on function public.tambah_dilihat(text) from public;
grant execute on function public.tambah_dilihat(text) to anon, authenticated;

-- 7. Supabase Storage: hanya admin yang boleh mengunggah/menghapus file --
-- Bucket "kapsel" bersifat Public, jadi semua orang tetap bisa MELIHAT foto.
drop policy if exists "admin melihat file kapsel" on storage.objects;
create policy "admin melihat file kapsel" on storage.objects
    for select to authenticated using (bucket_id = 'kapsel' and (select public.is_admin()));

drop policy if exists "admin mengunggah file kapsel" on storage.objects;
create policy "admin mengunggah file kapsel" on storage.objects
    for insert to authenticated with check (bucket_id = 'kapsel' and (select public.is_admin()));

drop policy if exists "admin mengganti file kapsel" on storage.objects;
create policy "admin mengganti file kapsel" on storage.objects
    for update to authenticated using (bucket_id = 'kapsel' and (select public.is_admin()));

drop policy if exists "admin menghapus file kapsel" on storage.objects;
create policy "admin menghapus file kapsel" on storage.objects
    for delete to authenticated using (bucket_id = 'kapsel' and (select public.is_admin()));
