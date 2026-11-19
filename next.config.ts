import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  // Lama isi website disimpan di cache sebelum diambil ulang dari Supabase.
  // Perubahan dari panel admin langsung tampil karena cache dikosongkan
  // dengan updateTag("konten"). Batas 10 menit ini untuk berita/pengumuman
  // yang dijadwalkan terbit di waktu tertentu.
  cacheLife: {
    konten: {
      stale: 300,
      revalidate: 600,
      expire: 86400,
    },
  },

  experimental: {
    serverActions: {
      // Isi berita (HTML) bisa cukup panjang.
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
