"use client";

import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { urlFile } from "@/lib/format";
import { TIPE_GAMBAR, unggahKeStorage } from "./Unggah";

/**
 * Editor teks kaya (tebal, miring, judul, daftar, tautan, gambar).
 * Hasilnya HTML, sama seperti RichEditor di panel Filament sebelumnya.
 */
export function EditorTeks({
  nilai,
  onUbah,
  folderGambar,
}: {
  nilai: string;
  onUbah: (html: string) => void;
  /** Folder di Storage untuk gambar yang disisipkan; kosongkan untuk mematikan tombol gambar. */
  folderGambar?: string;
}) {
  const [galat, setGalat] = useState("");

  const editor = useEditor({
    extensions: [StarterKit.configure({ link: { openOnClick: false } }), Image],
    content: nilai,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor }) => onUbah(editor.isEmpty ? "" : editor.getHTML()),
  });

  if (!editor) return <div className="editor"><div className="ProseMirror" /></div>;

  const tombol = (label: string, judul: string, aktif: boolean, aksi: () => void) => (
    <button type="button" title={judul} className={aktif ? "aktif" : undefined} onMouseDown={(e) => e.preventDefault()} onClick={aksi}>
      {label}
    </button>
  );

  function aturTautan() {
    const lama = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("Alamat tautan (kosongkan untuk menghapus):", lama ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor!.chain().focus().extendMarkRange("link").setLink({ href: url.trim(), target: "_blank" }).run();
    }
  }

  async function sisipkanGambar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !folderGambar) return;
    setGalat("");
    try {
      const path = await unggahKeStorage(file, folderGambar, 3072);
      editor!.chain().focus().setImage({ src: urlFile(path) ?? "", alt: file.name }).run();
    } catch (err) {
      setGalat(err instanceof Error ? err.message : "Gagal mengunggah gambar.");
    }
  }

  return (
    <div className="editor">
      <div className="alat-editor">
        {tombol("B", "Tebal", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run())}
        {tombol("I", "Miring", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run())}
        {tombol("U", "Garis bawah", editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run())}
        {tombol("S", "Coret", editor.isActive("strike"), () => editor.chain().focus().toggleStrike().run())}
        {tombol("H2", "Judul", editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
        {tombol("H3", "Subjudul", editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run())}
        {tombol("• Daftar", "Daftar berbutir", editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run())}
        {tombol("1. Daftar", "Daftar bernomor", editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run())}
        {tombol("❝", "Kutipan", editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run())}
        {tombol("Tautan", "Tautan", editor.isActive("link"), aturTautan)}
        {folderGambar ? (
          <label className="tombol-gambar" title="Sisipkan gambar">
            Gambar
            <input type="file" accept={TIPE_GAMBAR} hidden onChange={sisipkanGambar} />
          </label>
        ) : null}
        {tombol("↶", "Urungkan", false, () => editor.chain().focus().undo().run())}
        {tombol("↷", "Ulangi", false, () => editor.chain().focus().redo().run())}
      </div>
      {galat ? <div className="pesan-galat" style={{ margin: 8 }}>{galat}</div> : null}
      <EditorContent editor={editor} />
    </div>
  );
}
