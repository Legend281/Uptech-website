"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

/*
 * The blog's rich text editor (Tiptap/ProseMirror) — the one place in this
 * dashboard where staff write long-form HTML rather than filling in short
 * fields. Output is plain HTML via editor.getHTML(), stored as-is in
 * blog_posts.content and rendered on the public post page inside a
 * `.prose`-styled container (app/blog/[slug]/page.tsx).
 *
 * Inline images are inserted by URL (a prompt), not a second upload flow —
 * the cover image already has real upload+resize (BlogPostFormDialog); a
 * full in-editor upload pipeline for body images is a real feature on its
 * own, not built here. Staff can paste a URL to an already-hosted image
 * (e.g. one already uploaded elsewhere) until that's built.
 */

const TOOLBAR_BUTTON =
  "flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30";
const TOOLBAR_BUTTON_ACTIVE = "bg-navy-950 text-white hover:bg-navy-900";

function ToolbarButton({
  icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`${TOOLBAR_BUTTON} ${active ? TOOLBAR_BUTTON_ACTIVE : ""}`}
    >
      <MaterialIcon name={icon} className="text-[18px]" />
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  function setLink() {
    const previous = editor.getAttributes("link").href as string | undefined;
    // eslint-disable-next-line no-alert
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  function insertImage() {
    // eslint-disable-next-line no-alert
    const url = window.prompt("Image URL");
    if (!url?.trim()) return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50/60 px-2 py-1.5">
      <ToolbarButton icon="format_bold" label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
      <ToolbarButton icon="format_italic" label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
      <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />
      <ToolbarButton
        icon="format_h2"
        label="Heading"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        icon="format_h3"
        label="Subheading"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />
      <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />
      <ToolbarButton
        icon="format_list_bulleted"
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        icon="format_list_numbered"
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        icon="format_quote"
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />
      <ToolbarButton icon="link" label="Link" active={editor.isActive("link")} onClick={setLink} />
      <ToolbarButton icon="image" label="Insert image by URL" onClick={insertImage} />
      <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />
      <ToolbarButton icon="undo" label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} />
      <ToolbarButton icon="redo" label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} />
    </div>
  );
}

export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    // Next.js SSRs the initial render; Tiptap's own DOM diverges from that
    // until it mounts, which throws a hydration warning without this.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: false,
      }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder: "Write the post…" }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base max-w-none min-h-[280px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) {
    return <div className="min-h-[280px] animate-pulse rounded-lg border border-slate-300 bg-slate-50" />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/40">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
