"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { TeamMemberCard } from "@/components/TeamGrid";
import { DialogShell, Field, ReadinessList, Section, buttonClasses, hintClasses, inputClasses, labelClasses } from "@/components/admin/FormParts";
import { useCurrentUser } from "@/components/admin/providers/CurrentUserProvider";
import { useTeamMembers } from "@/components/admin/providers/TeamMembersProvider";
import { PORTRAIT_SIZE, resizeImageToDataUrl } from "@/lib/admin/resizeImage";
import {
  BIO_SOFT_LIMIT,
  getTeamSaveErrors,
  getTeamWarnings,
  normalizeTeamInput,
  teamDepartmentLabels,
  teamEntityLabels,
  type TeamMemberInput,
} from "@/lib/admin/team";
import type { TeamDepartment, TeamEntity, TeamMemberRecord, TeamMemberStatus } from "@/lib/admin/types";

type Props = { onClose: () => void; nextOrder: number } & ({ mode: "create" } | { mode: "edit"; member: TeamMemberRecord });

/** Shared by "Add Team Member" and "Edit". Sections run Identity → Bio → Visibility (spec 2.2). */
export function TeamMemberFormDialog(props: Props) {
  const { onClose } = props;
  const formId = useId();
  const currentUser = useCurrentUser();
  const { addMember, updateMember } = useTeamMembers();
  const [photoBusy, setPhotoBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [input, setInput] = useState<TeamMemberInput>(() =>
    props.mode === "edit"
      ? {
          name: props.member.name,
          title: props.member.title,
          department: props.member.department,
          entity: props.member.entity,
          photo: props.member.photo,
          bio: props.member.bio ?? "",
          linkedinUrl: props.member.linkedinUrl ?? "",
          displayOrder: props.member.displayOrder,
          status: props.member.status,
        }
      : {
          name: "",
          title: "",
          department: "career-services",
          entity: "cameroon",
          photo: undefined,
          bio: "",
          linkedinUrl: "",
          displayOrder: props.nextOrder,
          // New people start hidden: nobody appears on the public site by accident.
          status: "hidden",
        },
  );

  function set<K extends keyof TeamMemberInput>(key: K, value: TeamMemberInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePhoto(file: File | undefined) {
    if (!file) return;
    setPhotoBusy(true);
    try {
      set("photo", await resizeImageToDataUrl(file, PORTRAIT_SIZE));
    } catch (error) {
      toast.error("Couldn't use that photo", { description: error instanceof Error ? error.message : undefined });
    } finally {
      setPhotoBusy(false);
    }
  }

  const normalized = normalizeTeamInput(input);
  const errors = getTeamSaveErrors(normalized);
  const warnings = getTeamWarnings(normalized);
  const bioLength = input.bio?.trim().length ?? 0;
  const wasVisible = props.mode === "edit" && props.member.everVisible;

  async function submit() {
    if (saving) return;
    setSaving(true);
    const result = props.mode === "edit" ? await updateMember(props.member.id, input, currentUser) : await addMember(input, currentUser);
    setSaving(false);
    if (!result.ok) {
      toast.error("Not saved", { description: result.reasons[0] });
      return;
    }
    toast.success(props.mode === "edit" ? "Profile updated" : input.status === "visible" ? "Added to the team page" : "Saved (hidden)");
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
    <DialogShell titleId={`${formId}-title`} title={props.mode === "edit" ? "Edit Team Member" : "Add a Team Member"} onClose={onClose} footer={footer}>
      <div className="min-h-0 flex-1 overflow-y-auto lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:overflow-hidden">
        <form
          id={formId}
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
          className="space-y-6 px-5 py-5 lg:overflow-y-auto"
        >
          <Section step={1} title="Identity" description="Who they are, as they'd introduce themselves.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <input type="text" value={input.name} onChange={(e) => set("name", e.target.value)} className={inputClasses} />
              </Field>
              <Field label="Job title" required>
                <input type="text" value={input.title} onChange={(e) => set("title", e.target.value)} className={inputClasses} />
              </Field>
              <Field label="Department">
                <select value={input.department} onChange={(e) => set("department", e.target.value as TeamDepartment)} className={`${inputClasses} bg-white`}>
                  {(Object.keys(teamDepartmentLabels) as TeamDepartment[]).map((d) => (
                    <option key={d} value={d}>
                      {teamDepartmentLabels[d]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Entity" hint="Which of the two companies they work for.">
                <select value={input.entity} onChange={(e) => set("entity", e.target.value as TeamEntity)} className={`${inputClasses} bg-white`}>
                  {(Object.keys(teamEntityLabels) as TeamEntity[]).map((e) => (
                    <option key={e} value={e}>
                      {teamEntityLabels[e]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="flex items-center gap-3">
              {input.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={input.photo} alt="" className="h-16 w-[52px] rounded-md object-cover" />
              ) : (
                <span className="flex h-16 w-[52px] items-center justify-center rounded-md bg-slate-100 text-slate-400">
                  <MaterialIcon name="person" className="text-[22px]" />
                </span>
              )}
              <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">
                {photoBusy ? "Resizing…" : input.photo ? "Replace photo" : "Add photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={photoBusy}
                  onChange={(e) => {
                    void handlePhoto(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
              {input.photo && (
                <button type="button" onClick={() => set("photo", undefined)} className="text-xs font-semibold text-rose-600 hover:underline">
                  Remove
                </button>
              )}
            </div>
            <p className={hintClasses}>A real photo of them, with their agreement. Cropped to a 4:5 portrait and shrunk automatically.</p>
          </Section>

          <Section step={2} title="Bio" description="A few sentences in their own words, or approved by them. Never written for them by AI.">
            <div className="flex flex-col gap-1.5">
              <span className={labelClasses}>Short bio</span>
              <textarea
                aria-label="Short bio"
                value={input.bio ?? ""}
                onChange={(e) => set("bio", e.target.value)}
                rows={4}
                className={`${inputClasses} resize-y leading-relaxed`}
              />
              <span className={`text-right text-xs tabular-nums ${bioLength > BIO_SOFT_LIMIT ? "font-semibold text-amber-700" : "text-slate-400"}`}>
                {bioLength} / {BIO_SOFT_LIMIT}
              </span>
            </div>
            <Field label="LinkedIn or other profile link" hint="Optional. A full https:// address.">
              <input
                type="url"
                value={input.linkedinUrl ?? ""}
                onChange={(e) => set("linkedinUrl", e.target.value)}
                className={inputClasses}
                placeholder="https://www.linkedin.com/in/…"
              />
            </Field>
          </Section>

          <Section step={3} title="Visibility" description="Whether they appear on the Who We Are page, and where in the grid.">
            <fieldset className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <legend className="sr-only">Visibility</legend>
              {(
                [
                  { value: "visible", label: "Visible", hint: "Shown on the Who We Are page" },
                  { value: "hidden", label: "Hidden", hint: wasVisible ? "Kept on record, off the site" : "Saved here only" },
                ] as { value: TeamMemberStatus; label: string; hint: string }[]
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
            <Field label="Position in the grid" hint="1 comes first. You can also move people from the list.">
              <input
                type="number"
                min={1}
                value={input.displayOrder}
                onChange={(e) => set("displayOrder", Number(e.target.value) || 1)}
                className={`${inputClasses} max-w-[120px]`}
              />
            </Field>
          </Section>
        </form>

        <aside className="space-y-4 border-t border-slate-100 bg-slate-50/70 px-5 py-5 lg:overflow-y-auto lg:border-l lg:border-t-0">
          <div>
            <span className={labelClasses}>Preview</span>
            <div className="mt-2 max-w-[260px]">
              <TeamMemberCard
                member={{
                  name: normalized.name || "Their name",
                  role: normalized.title || "Their job title",
                  photo: normalized.photo,
                  bio: normalized.bio,
                  linkedinUrl: normalized.linkedinUrl && errors.length === 0 ? normalized.linkedinUrl : undefined,
                }}
              />
            </div>
          </div>
          <ReadinessList heading="Before saving" blockers={errors} warnings={warnings} readyLabel="Ready to save" />
        </aside>
      </div>
    </DialogShell>
  );
}
