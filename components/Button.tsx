"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
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
  primary: "gradient-teal-blue text-white shadow-lg shadow-teal-950/40 hover:brightness-105",
  secondary:
    "bg-navy-900/90 border border-slate-700/80 hover:border-slate-500 text-white backdrop-blur-sm",
  whatsapp: "bg-uco-green text-white hover:bg-uco-green-hover shadow-sm",
};

// py-3.5 ≈ 48px desktop / py-3 ≈ 44px mobile, per DESIGN.md button height spec.
const sizeClasses: Record<ButtonSize, string> = {
  md: "px-6 py-3.5",
  sm: "px-6 py-3",
};

const MotionLink = motion(Link);

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
  const reducedMotion = useReducedMotion();
  const classes = `inline-flex items-center gap-2 rounded-lg text-sm font-semibold transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  // Tap/hover motion replaces the old `active:scale-[0.98]` Tailwind class —
  // framer-motion drives both states now, so that class was removed from
  // variantClasses to avoid two competing scale animations firing at once.
  // Reduced-motion readers get a plain opacity nudge instead of scale/lift.
  const tapHoverProps = reducedMotion
    ? { whileHover: { opacity: 0.9 }, whileTap: { opacity: 0.8 } }
    : {
        whileHover: { scale: 1.03, y: -1 },
        whileTap: { scale: 0.97, y: 0 },
        transition: { type: "spring" as const, stiffness: 400, damping: 25 },
      };

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...tapHoverProps}
      >
        <span>{children}</span>
        {icon}
      </motion.a>
    );
  }

  return (
    <MotionLink href={href} className={classes} {...tapHoverProps}>
      <span>{children}</span>
      {icon}
    </MotionLink>
  );
}
