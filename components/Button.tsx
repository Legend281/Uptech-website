import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "whatsapp";
type ButtonSize = "md" | "sm";

type ButtonProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  icon?: ReactNode;
  external?: boolean;
  className?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "gradient-teal-blue text-white shadow-lg shadow-teal-950/40 hover:brightness-105 active:scale-[0.98]",
  secondary:
    "bg-navy-900/90 border border-slate-700/80 hover:border-slate-500 text-white backdrop-blur-sm",
  whatsapp:
    "bg-uco-green text-white hover:bg-uco-green-hover shadow-sm",
};

// py-3.5 ≈ 48px desktop / py-3 ≈ 44px mobile, per DESIGN.md button height spec.
const sizeClasses: Record<ButtonSize, string> = {
  md: "px-6 py-3.5",
  sm: "px-6 py-3",
};

/** Primary / Secondary / WhatsApp CTA. Height and radius are locked per DESIGN.md. */
export function Button({
  href,
  variant = "primary",
  size = "md",
  children,
  icon,
  external = false,
  className = "",
}: ButtonProps) {
  const classes = `inline-flex items-center gap-2 rounded-lg text-sm font-semibold transition-all ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        <span>{children}</span>
        {icon}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      <span>{children}</span>
      {icon}
    </Link>
  );
}
