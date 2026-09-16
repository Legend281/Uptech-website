"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { images as imageLibrary, type ImageKey } from "@/lib/images";

const DEFAULT_INTERVAL_MS = 6000;

/**
 * Stacked, auto-crossfading hero background. Renders every image in `keys`
 * absolutely positioned on top of each other and fades between them on a
 * timer — the section's own gradient overlay (rendered by the caller, on
 * top of this) does not need to change per image.
 *
 * Freezes on the first image for anyone who has asked the OS to reduce
 * motion. Only the first image gets `priority` (it's the one visible on
 * first paint); the rest load lazily since they're not seen immediately.
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
    <>
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
    </>
  );
}
