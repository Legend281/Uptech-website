"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { images as imageLibrary, type ImageKey } from "@/lib/images";

const DEFAULT_INTERVAL_MS = 6000;

/**
 * Stacked, auto-crossfading, scroll-parallaxed hero background. Renders
 * every image in `keys` absolutely positioned on top of each other and
 * fades between them on a timer — the section's own gradient overlay
 * (rendered by the caller, on top of this) does not need to change per
 * image. As the reader scrolls past the hero, the whole image stack drifts
 * and scales slightly for depth (classic parallax) — self-contained here,
 * so every page using this component gets it automatically.
 *
 * Freezes on the first image, and skips the parallax drift entirely, for
 * anyone who has asked the OS to reduce motion. Only the first image gets
 * `priority` (it's the one visible on first paint); the rest load lazily
 * since they're not seen immediately.
 */
export function HeroImageCarousel({
  keys,
  intervalMs = DEFAULT_INTERVAL_MS,
  imageClassName = "object-cover object-center",
}: {
  keys: ImageKey[];
  intervalMs?: number;
  imageClassName?: string;
}) {
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 110]);
  const parallaxScale = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [1, 1] : [1, 1.12]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion || keys.length < 2) return;
    const id = window.setInterval(
      () => setActive((current) => (current + 1) % keys.length),
      intervalMs
    );
    return () => window.clearInterval(id);
  }, [reducedMotion, keys.length, intervalMs]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: parallaxY, scale: parallaxScale }}>
        {keys.map((key, index) => {
          const image = imageLibrary[key];
          const isActive = index === active;
          return (
            <Image
              key={key}
              src={image.src}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              placeholder="blur"
              blurDataURL={image.blurDataURL}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100" : "opacity-0"
              } ${imageClassName}`}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
