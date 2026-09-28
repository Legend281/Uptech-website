import Image from "next/image";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { TiltCard } from "@/components/TiltCard";

export type TeamMember = {
  name: string;
  /** Job title as the person themselves would give it. */
  role: string;
  /**
   * A path under /public, or a URL (Supabase Storage, or a data URL in the
   * admin preview). Optional: a member can be listed before a portrait exists.
   */
  photo?: string;
  bio?: string;
  linkedinUrl?: string;
};

/**
 * One team card — shared by the Who We Are grid and the admin dashboard's
 * Team Members preview (Admin_Content_Pages_Spec.md 2.2), so what staff
 * preview is exactly what visitors see. Carries the same TiltCard, top
 * accent, and elevated shadow as every other card-like element on the Who
 * We Are page (the "supports" pillars, the two-restaurant panels) — this
 * used to be a plain bordered rectangle that matched nothing else on the
 * page it lives on. The admin preview renders it at max-w-[260px]
 * (TeamMemberFormDialog.tsx); the tilt and shadow read fine at that size,
 * they just won't get pointer movement to react to in that context.
 */
export function TeamMemberCard({ member }: { member: TeamMember }) {
  const isLocal = member.photo?.startsWith("/");

  return (
    <TiltCard
      max={4}
      className="flex flex-col overflow-hidden rounded-b-lg border-x border-b border-slate-200 bg-white shadow-[0_20px_30px_-10px_rgba(11,25,44,0.14),0_10px_15px_-5px_rgba(11,25,44,0.06)]"
    >
      <span aria-hidden="true" className="h-1.5 w-full bg-teal-400" />
      <div className="relative aspect-[4/5] w-full bg-slate-100">
        {member.photo && isLocal ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : member.photo ? (
          // Uploaded portraits are already resized to 480x600 on upload, so
          // the optimizer has nothing to add, and reaching Supabase Storage
          // through it would need remotePatterns plus a GitHub Pages loader
          // special case.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.photo} alt={member.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-slate-300">
            <MaterialIcon name="person" className="text-[48px]" />
          </span>
        )}
      </div>

      <div className="flex flex-col bg-gradient-to-b from-teal-50/40 to-white p-6">
        <h3 className="text-[20px] font-bold leading-[28px] tracking-[-0.015em] text-navy-950">{member.name}</h3>
        <p className="mt-0.5 text-[14px] font-semibold leading-[20px] text-teal-700">{member.role}</p>
        {member.bio ? <p className="mt-3.5 text-[14px] leading-[21px] text-slate-600">{member.bio}</p> : null}
        {member.linkedinUrl ? (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-fit items-center gap-1 border-t border-slate-100 pt-3.5 text-[13px] font-semibold text-slate-500 transition-colors hover:text-teal-700"
          >
            LinkedIn
            <MaterialIcon name="arrow_outward" className="text-[13px]" />
          </a>
        ) : null}
      </div>
    </TiltCard>
  );
}

/**
 * Ships empty on purpose. No real team names, roles or portraits have been
 * supplied yet, and CLAUDE.md Section 6.4 forbids inventing them or filling
 * the grid with stock photography.
 *
 * Pass a populated `members` array and the grid renders itself — the empty
 * state is a branch, not a separate hand-built section, so no layout work is
 * needed when the real profiles arrive. Members come from the admin
 * dashboard's Team Members module (lib/team.ts).
 */
export function TeamGrid({ members }: { members: TeamMember[] }) {
  if (members.length === 0) {
    return (
      /* A dashed rectangle around a short sentence reads as a hole in the page.
         Stated plainly instead, left-aligned with everything else and sized
         like a normal line of copy — an absence that looks deliberate rather
         than one that looks broken. */
      <div className="border-t border-slate-200 pt-8">
        <p className="max-w-xl text-[20px] leading-[30px] tracking-[-0.01em] text-slate-600">
          The people behind Uptech Consulting — profiles coming soon.
        </p>
      </div>
    );
  }

  return (
    // items-start: without it, CSS Grid's default stretch forces every card
    // to the row's tallest neighbor's height, leaving a large empty gap
    // under a member's name for anyone with a shorter (or no) bio — the
    // exact same stretch bug fixed on the admin dashboard's register grid.
    <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {members.map((member, index) => (
        // Index in the key: two staff can share a name (spec 2.3).
        <TeamMemberCard key={`${member.name}-${index}`} member={member} />
      ))}
    </div>
  );
}
