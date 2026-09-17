"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/**
 * Wraps card content with a subtle mouse-tracking 3D tilt — pointer position
 * over the card maps to a small rotateX/rotateY, springing back to flat on
 * leave. Skipped entirely for prefers-reduced-motion and on touch (pointer
 * type "touch" has no hover position that means anything).
 */
export function TiltCard({
  children,
  className = "",
  max = 8,
}: {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springConfig = { stiffness: 250, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), springConfig);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), springConfig);
  const scale = useSpring(1, springConfig);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }

  function handlePointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType === "touch") return;
    scale.set(1.02);
  }

  function handlePointerLeave() {
    px.set(0.5);
    py.set(0.5);
    scale.set(1);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={
        reducedMotion
          ? undefined
          : { rotateX, rotateY, scale, transformPerspective: 900 }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
