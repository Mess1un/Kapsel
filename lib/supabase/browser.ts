"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Klien Supabase di browser (halaman login dan unggah file di panel admin). */
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
