import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

type WhatsAppVariant = "muted" | "solid";

type WhatsAppButtonProps = {
  phone: string;
  label?: string;
  variant?: WhatsAppVariant;
  className?: string;
};

/**
 * `muted` (default) matches the approved mockups' hero/final-CTA treatment —
 * navy button + green status dot. `solid` is the literal CLAUDE.md Section 6.6
 * reading ("styled only in WhatsApp Green") and is used where the button sits
 * beside a white primary CTA and needs to hold its own.
 */
export function WhatsAppButton({
  phone,
  label = "Chat on WhatsApp",
  variant = "muted",
  className = "",
}: WhatsAppButtonProps) {
  const variantClasses =
    variant === "solid"
      ? "bg-uco-green hover:bg-uco-green-hover text-white"
      : "bg-navy-900/90 border border-slate-700/80 hover:border-slate-500 backdrop-blur-sm text-white";

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 h-12 px-6 rounded-lg text-sm font-semibold transition-all ${variantClasses} ${className}`}
    >
      {variant === "muted" && (
        <span className="w-2.5 h-2.5 rounded-full bg-uco-green ring-4 ring-uco-green/20" />
      )}
      <WhatsAppIcon
        className={variant === "solid" ? "w-4 h-4" : "w-4 h-4 text-cyan-accent"}
      />
      <span>{label}</span>
    </a>
  );
}
