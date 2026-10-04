"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { DialogShell, Field, ReadinessList, Section, buttonClasses, hintClasses, inputClasses, labelClasses } from "@/components/admin/FormParts";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useBlogPosts } from "@/components/admin/providers/BlogPostsProvider";
import { BLOG_COVER_SIZE, resizeImageToDataUrl } from "@/lib/admin/resizeImage";
import { getBlogSaveErrors, getBlogWarnings, normalizeBlogInput, slugify, type BlogPostInput } from "@/lib/admin/blog";
import type { BlogPost, BlogPostStatus } from "@/lib/admin/types";

type Props = { onClose: () => void } & ({ mode: "create" } | { mode: "edit"; post: BlogPost });

/** Shared by "New Post" and "Edit". Sections run Content → Details → Visibility, same order every other content-module dialog in this dashboard uses. */
export function BlogPostFormDialog(props: Props) {
  const { onClose } = props;
  const formId = useId();
  const currentUser = useCurrentUser();
  const { addPost, updatePost } = useBlogPosts();
  const [coverBusy, setCoverBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  // Once the slug has been hand-edited, title changes stop auto-updating it
  // — the usual CMS convention (WordPress, Ghost): auto-fill is a
  // convenience for a fresh post, not something that should silently
  // rewrite a URL someone already deliberately set or shared.
  const [slugTouched, setSlugTouched] = useState(props.mode === "edit");
  const [input, setInput] = useState<BlogPostInput>(() =>
    props.mode === "edit"
      ? {
          title: props.post.title,
          slug: props.post.slug,
          excerpt: props.post.excerpt,
          content: props.post.content,
          coverImage: props.post.coverImage,
          authorName: props.post.authorName,
          authorBio: props.post.authorBio ?? "",
          category: props.post.category ?? "",
          status: props.post.status,
        }
      : {
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          coverImage: undefined,
          authorName: currentUser.name,
          authorBio: "",
          category: "",
          // New posts always start as Draft — publishing is a deliberate,
          // separate choice made in this same form, not an accident of
          // whatever the last-used value happened to be.
          status: "draft",
        },
  );

  function set<K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  function setTitle(title: string) {
    setInput((prev) => ({ ...prev, title, slug: slugTouched ? prev.slug : slugify(title) }));
  }

  async function handleCoverImage(file: File | undefined) {
    if (!file) return;
    setCoverBusy(true);
    try {
      set("coverImage", await resizeImageToDataUrl(file, BLOG_COVER_SIZE));
    } catch (error) {
      toast.error("Couldn't use that image", { description: error instanceof Error ? error.message : undefined });
    } finally {
      setCoverBusy(false);
    }
  }

  const normalized = normalizeBlogInput(input);
  const errors = getBlogSaveErrors(normalized);
  const warnings = getBlogWarnings(normalized);

  async function submit() {
    if (saving) return;
    setSaving(true);
    const result = props.mode === "edit" ? await updatePost(props.post.id, input, currentUser) : await addPost(input, currentUser);
    setSaving(false);
    if (!result.ok) {
      toast.error("Not saved", { description: result.reasons[0] });
      return;
    }
    toast.success(props.mode === "edit" ? "Post updated" : input.status === "published" ? "Published to the blog" : "Draft saved");
    onClose();
  }

  const footer = (
    <>
      <button type="button" onClick={onClose} className={buttonClasses.ghost}>
        Cancel
      </button>
      <button type="submit" form={formId} disabled={saving || errors.length > 0} title={errors[0]} className={buttonClasses.primary}>
        {props.mode === "edit" ? "Save changes" : "Save"}
      </button>
    </>
  );

  return (
    <DialogShell titleId={`${formId}-title`} title={props.mode === "edit" ? "Edit Post" : "New Post"} onClose={onClose} footer={footer}>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden">
        <form
          id={formId}
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
          className="space-y-6 px-5 py-5 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain"
        >
          <Section step={1} title="Content" description="The post itself.">
            <Field label="Title" required>
              <input type="text" value={input.title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} />
            </Field>
            <Field label="URL slug" required hint={`uptechoutsourcing.com/blog/${normalized.slug || "…"}`}>
              <input
                type="text"
                value={input.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
                className={`${inputClasses} font-mono`}
              />
            </Field>
            <Field label="Excerpt" hint="A short summary shown on the blog listing and used as the social-share/search description.">
              <textarea value={input.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} className={`${inputClasses} resize-y leading-relaxed`} />
            </Field>
            <div className="flex flex-col gap-1.5">
              <span className={labelClasses}>Post body</span>
              <RichTextEditor value={input.content} onChange={(html) => set("content", html)} />
            </div>
          </Section>

          <Section step={2} title="Details" description="Attribution and the cover image.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Author" required>
                <input type="text" value={input.authorName} onChange={(e) => set("authorName", e.target.value)} className={inputClasses} />
              </Field>
              <Field label="Category" hint="Optional.">
                <input type="text" value={input.category ?? ""} onChange={(e) => set("category", e.target.value)} className={inputClasses} />
              </Field>
            </div>
            <Field label="Author bio" hint="Optional — shown at the end of the published post. Leave blank to show no bio block at all.">
              <textarea value={input.authorBio ?? ""} onChange={(e) => set("authorBio", e.target.value)} rows={2} className={`${inputClasses} resize-y leading-relaxed`} />
            </Field>
            <div className="flex items-center gap-3">
              {input.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={input.coverImage} alt="" className="h-16 w-28 rounded-md object-cover" />
              ) : (
                <span className="flex h-16 w-28 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                  <MaterialIcon name="image" className="text-[22px]" />
                </span>
              )}
              <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">
                {coverBusy ? "Resizing…" : input.coverImage ? "Replace cover" : "Add cover image"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={coverBusy}
                  onChange={(e) => {
                    void handleCoverImage(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
              {input.coverImage && (
                <button type="button" onClick={() => set("coverImage", undefined)} className="text-xs font-semibold text-rose-600 hover:underline">
                  Remove
                </button>
              )}
            </div>
            <p className={hintClasses}>Cropped to 1200×630 and shrunk automatically — the same shape used for social-share previews.</p>
          </Section>

          <Section step={3} title="Visibility" description="Whether this post is live on /blog.">
            <fieldset className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <legend className="sr-only">Status</legend>
              {(
                [
                  { value: "draft", label: "Draft", hint: "Saved here only" },
                  { value: "published", label: "Published", hint: "Live on the public blog" },
                ] as { value: BlogPostStatus; label: string; hint: string }[]
              ).map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-lg border px-3 py-2.5 transition-colors ${
                    input.status === option.value ? "border-teal-500 bg-teal-50" : "border-slate-300 hover:border-slate-400"
                  }`}
                >
                  <input
                    type="radio"
                    name={`${formId}-status`}
                    checked={input.status === option.value}
                    onChange={() => set("status", option.value)}
                    className="sr-only"
                  />
                  <span className={`block text-sm font-semibold ${input.status === option.value ? "text-teal-800" : "text-slate-700"}`}>{option.label}</span>
                  <span className="block text-[11px] text-slate-500">{option.hint}</span>
                </label>
              ))}
            </fieldset>
            <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 px-3 py-2.5 hover:border-slate-300">
              <input type="checkbox" checked={input.isFeatured ?? false} onChange={(e) => set("isFeatured", e.target.checked)} className="mt-0.5" />
              <span>
                <span className="block text-sm font-semibold text-slate-700">Feature this post</span>
                <span className="block text-[11px] text-slate-500">Shows in the hero slot on the public blog, in place of whatever&apos;s most recently published. Only one post can be featured — marking this one un-features any other.</span>
              </span>
            </label>
          </Section>
        </form>

        <aside className="space-y-4 border-t border-slate-100 bg-slate-50/70 px-5 py-5 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:border-l lg:border-t-0">
          <div>
            <span className={labelClasses}>Preview</span>
            <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="relative aspect-[1200/630] w-full bg-slate-100">
                {normalized.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={normalized.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-slate-300">
                    <MaterialIcon name="image" className="text-[28px]" />
                  </span>
                )}
                {normalized.isFeatured && (
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-navy-950/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300 backdrop-blur-md">
                    <MaterialIcon name="star" className="text-[11px]" />
                    Featured
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-bold text-navy-950">{normalized.title || "Post title"}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{normalized.excerpt || "A short excerpt will show here."}</p>
              </div>
            </div>
          </div>
          <ReadinessList heading="Before saving" blockers={errors} warnings={warnings} readyLabel="Ready to save" />
        </aside>
      </div>
    </DialogShell>
  );
}
