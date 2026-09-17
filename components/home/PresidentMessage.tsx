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
 */
export function PresidentMessage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const poster = images["team-lineup"];

  function handlePlay() {
    setPlaying(true);
    videoRef.current?.play();
  }

  return (
    <section className="bg-navy-950 py-20 lg:py-24 text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
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
              src="/images/Video-with-the-president-talking-about-uptech.mp4"
              poster={poster.src}
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
                <span className="absolute inset-0 bg-navy-950/30 group-hover:bg-navy-950/20 transition-colors" />
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
