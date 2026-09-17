import Image from "next/image";
import { Reveal } from "@/components/Reveal";

/** Real Uptech Consulting partners, confirmed by the team. */
const partners = [
  { name: "Capital One", src: "/images/s1.webp", width: 199, height: 74 },
  { name: "CenturyLink", src: "/images/s2.webp", width: 156, height: 78 },
  { name: "HMS", src: "/images/s3.webp", width: 182, height: 64 },
  { name: "Accenture", src: "/images/s4.webp", width: 223, height: 62 },
  { name: "GVEC", src: "/images/s5.webp", width: 165, height: 62 },
];

/**
 * Two back-to-back copies of the same logo row inside one `marquee-track`
 * (app/globals.css) — animating the track left by exactly 50% loops the
 * second copy in seamlessly, so the strip reads as one continuous ribbon of
 * logos rather than a row that snaps back. Full colour, no dimming: an
 * earlier grayscale/opacity treatment was exactly why these stopped
 * reading as the partners' real logos.
 */
function LogoRow({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-16 sm:gap-20" aria-hidden={ariaHidden}>
      {partners.map((partner) => (
        <Image
          key={partner.name}
          src={partner.src}
          alt={partner.name}
          width={partner.width}
          height={partner.height}
          className="h-9 w-auto shrink-0 object-contain sm:h-11"
        />
      ))}
    </div>
  );
}

export function PartnersStrip() {
  return (
    <section className="border-y border-slate-200/80 bg-slate-50/60 py-14">
      <Reveal effect="fade">
        <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2.5">
            <span className="h-[2px] w-6 bg-teal-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Our Partners
            </span>
            <span className="h-[2px] w-6 bg-teal-500" />
          </div>
        </div>

        {/* Edges fade to the section background via a mask, so the ribbon
            appears to emerge from and dissolve into the page rather than
            being cropped by a hard edge. */}
        <div
          className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          <div className="marquee-track flex w-max items-center gap-16 sm:gap-20">
            <LogoRow />
            <LogoRow ariaHidden />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
