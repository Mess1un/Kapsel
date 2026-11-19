"use client";

import { supabaseBrowser } from "@/lib/supabase/browser";

export function TombolKeluar() {
  return (
    <button
      type="button"
      className="tbl"
      style={{ width: "100%", justifyContent: "center" }}
      onClick={async () => {
        await supabaseBrowser().auth.signOut();
        // Muat ulang penuh supaya data panel admin tidak tersisa di browser.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign("/admin/login");
      }}
    >
      Keluar dan masuk dengan akun lain
    </button>
  );
}
