/** Visual variety across rows, independent of status — same idea as a person's avatar color, not a semantic signal. */
const AVATAR_TINTS = [
  "bg-blue-accent/10 text-blue-accent",
  "bg-emerald-50 text-emerald-700",
  "bg-purple-50 text-purple-700",
  "bg-amber-50 text-amber-700",
  "bg-teal-50 text-teal-700",
  "bg-rose-50 text-rose-700",
];

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function avatarTint(seed: string): string {
  const code = seed.charCodeAt(0) + (seed.charCodeAt(1) ?? 0);
  return AVATAR_TINTS[code % AVATAR_TINTS.length];
}
