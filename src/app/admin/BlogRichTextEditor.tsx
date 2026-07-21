"use client";

import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { sanitizeBlogHtml } from "@/lib/blogHtml";

type BlogRichTextEditorProps = {
  html: string;
  json: string;
  onChange: (html: string, json: string) => void;
  onUploadImage: (file: File) => Promise<string>;
};

const toolbarButton =
  "border border-[#D8D2C8] px-2.5 py-1.5 text-xs transition-colors hover:bg-[#F2EEE8] disabled:cursor-not-allowed disabled:opacity-40";

const LegacyCompatibleHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: { default: null },
    };
  },
});

export default function BlogRichTextEditor({
  html,
  json,
  onChange,
  onUploadImage,
}: BlogRichTextEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  let initialContent: string | Record<string, unknown> = html || "<p></p>";
  try {
    const parsed = JSON.parse(json || "null") as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      initialContent = parsed as Record<string, unknown>;
    }
  } catch {
    // Legacy posts intentionally fall back to their existing HTML.
  }

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: false }),
      LegacyCompatibleHeading.configure({ levels: [2, 3, 4] }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ allowBase64: false }),
    ],
    content: initialContent,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML(), JSON.stringify(currentEditor.getJSON()));
    },
    editorProps: {
      attributes: {
        class:
          "blog-editor-content blog-richtext min-h-[22rem] max-w-none px-5 py-4 focus:outline-none",
        "aria-label": "Article content",
      },
    },
  });

  const addLink = () => {
    if (!editor) return;
    const current = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Link URL", current ?? "https://");
    if (href === null) return;
    if (!href.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
  };

  const uploadInlineImage = async (file: File) => {
    if (!editor) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await onUploadImage(file);
      const alt = window.prompt("Describe this image for accessibility", file.name) ?? file.name;
      editor.chain().focus().setImage({ src: url, alt }).run();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Unable to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-[#D8D2C8] bg-white">
      <div className="flex border-b border-[#D8D2C8] bg-[#F8F5F1] p-1">
        {(["edit", "preview"] as const).map((item) => (
          <button
            key={item}
            type="button"
            aria-label={item === "edit" ? "Edit" : "Preview"}
            onClick={() => setMode(item)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.12em] ${mode === item ? "bg-[#20281B] text-white" : "text-[#20281B]"}`}
          >
            {item === "edit" ? "Edit" : "Preview"}
          </button>
        ))}
      </div>

      {mode === "edit" ? (
        <>
          <div className="flex flex-wrap gap-1 border-b border-[#D8D2C8] p-2">
            <button type="button" className={toolbarButton} onClick={() => editor?.chain().focus().setParagraph().run()}>Text</button>
            <button type="button" className={toolbarButton} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
            <button type="button" className={toolbarButton} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
            <button type="button" className={toolbarButton} onClick={() => editor?.chain().focus().toggleBold().run()}>Bold</button>
            <button type="button" className={toolbarButton} onClick={() => editor?.chain().focus().toggleItalic().run()}>Italic</button>
            <button type="button" className={toolbarButton} onClick={() => editor?.chain().focus().toggleBulletList().run()}>Bullets</button>
            <button type="button" className={toolbarButton} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>Numbered</button>
            <button type="button" className={toolbarButton} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>Quote</button>
            <button type="button" className={toolbarButton} onClick={addLink}>Link</button>
            <label className={`${toolbarButton} cursor-pointer`}>
              {uploading ? "Uploading…" : "Image"}
              <input
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadInlineImage(file);
                  event.target.value = "";
                }}
              />
            </label>
            <button type="button" className={toolbarButton} disabled={!editor?.can().undo()} onClick={() => editor?.chain().focus().undo().run()}>Undo</button>
            <button type="button" className={toolbarButton} disabled={!editor?.can().redo()} onClick={() => editor?.chain().focus().redo().run()}>Redo</button>
          </div>
          {uploadError ? (
            <p
              role="alert"
              className="border-b border-[#D8D2C8] bg-red-50 px-4 py-2 text-sm text-red-700"
            >
              {uploadError}
            </p>
          ) : null}
          <EditorContent editor={editor} />
        </>
      ) : (
        <div className="min-h-[22rem] bg-[#FBF9F6] px-5 py-6">
          <div
            className="blog-richtext"
            dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(editor?.getHTML() ?? html) }}
          />
        </div>
      )}
    </div>
  );
}
