import Image from "next/image";

export type TeamMember = {
  name: string;
  /** Job title as the person themselves would give it. */
  role: string;
  /** Path under /public. Optional: a member can be listed before a portrait exists. */
  photo?: string;
  bio?: string;
};

/**
 * Ships empty on purpose. No real team names, roles or portraits have been
 * supplied yet, and CLAUDE.md Section 6.4 forbids inventing them or filling
 * the grid with stock photography.
 *
 * Pass a populated `members` array and the grid renders itself — the empty
 * state is a branch, not a separate hand-built section, so no layout work is
 * needed when the real profiles arrive.
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {members.map((member) => (
        <article
          key={member.name}
          className="flex flex-col overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-[0_1px_3px_0_rgba(11,25,44,0.04),0_1px_2px_-1px_rgba(11,25,44,0.03)]"
        >
          <div className="relative aspect-[4/5] w-full bg-slate-100">
            {member.photo ? (
              <Image
                src={member.photo}
                alt={member.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <h3 className="text-[20px] font-semibold leading-[28px] tracking-[-0.01em] text-navy-950">
              {member.name}
            </h3>
            <p className="mt-1 text-[14px] leading-[20px] text-slate-500">
              {member.role}
            </p>
            {member.bio ? (
              <p className="mt-3.5 text-[14px] leading-[20px] text-slate-600">
                {member.bio}
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
