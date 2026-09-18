"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { TextReveal } from "@/components/TextReveal";
import { images } from "@/lib/images";

/*
 * `preload="none"` is deliberate: this file is ~20MB, and CLAUDE.md Section
 * 6.9 treats mobile/low-bandwidth performance as a hard constraint, not a
 * preference. Nothing about this video downloads until a visitor actually
 * clicks play — no autoplay, no background loop, no preloading "just in
 * case." Worth compressing this file for web delivery (H.264, a more
 * moderate bitrate) if there's ever a chance to re-export it — no video
 * transcoding tool was available in this environment to do that here.
 *
 * `BASE_PATH` fixes a real bug found on the live GitHub Pages preview: every
 * photo on the site goes through next/image, which runs the custom loader in
 * lib/pagesImageLoader.js to prepend the repo subpath
 * (github.io/Uptech-website/...) — but this is a raw HTML <video> element,
 * which next/image never touches, so its hardcoded src/poster 404'd on that
 * subpath even though they resolve fine locally at the root. Same fix
 * next.config.mjs and app/layout.tsx already apply for the same reason.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function PresidentMessage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const poster = images["team-lineup"];

  function handlePlay() {
    setPlaying(true);
    videoRef.current?.play();
  }

  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-24 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="float-a absolute -left-16 top-0 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="float-b absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal effect="rise" className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 justify-center">
            <span className="w-7 h-[2px] bg-teal-400 inline-block" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              A MESSAGE FROM OUR PRESIDENT
            </span>
            <span className="w-7 h-[2px] bg-teal-400 inline-block" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            <TextReveal text="Hear it directly from our president." />
          </h2>
        </Reveal>

        <Reveal effect="rise" delay={120}>
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-navy-900">
            <video
              ref={videoRef}
              src={`${BASE_PATH}/images/Video-with-the-president-talking-about-uptech.mp4`}
              poster={`${BASE_PATH}${poster.src}`}
              controls={playing}
              preload="none"
              playsInline
              className="w-full h-full object-cover"
            />
            {!playing && (
              <button
                type="button"
                onClick={handlePlay}
                aria-label="Play the message from our president"
                className="absolute inset-0 flex items-center justify-center group"
              >
                {/* Color-grades the poster photo's plain wall into the site's
                    navy palette (multiply darkens the pale background far
                    more than the already-dark suits, so it reads as a
                    deliberate grade rather than a flat dim-down), then a
                    radial vignette pulls focus to the centre and grounds the
                    edges — the source photo can't be re-cropped or re-shot
                    here, so the grade is doing the work a crop normally
                    would. */}
                <span className="absolute inset-0 bg-navy-900/60 mix-blend-multiply" />
                <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(7,14,27,0.6)_100%)]" />
                <span className="absolute inset-0 bg-navy-950/15 transition-colors group-hover:bg-navy-950/5" />
                <motion.span
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-white/95 shadow-xl"
                >
                  <svg className="w-7 h-7 text-navy-950 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.span>
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
