import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { DEFAULT_PARTNERS, type PublicPartner } from "@/lib/partners";

type Props = {
  partners?: PublicPartner[];
};

/**
 * Two back-to-back copies of the same logo row inside one `marquee-track`
 * (app/globals.css) — animating the track left by exactly 50% loops the
 * second copy in seamlessly, so the strip reads as one continuous ribbon of
 * logos rather than a row that snaps back. Full colour, no dimming.
 */
function LogoRow({ items, ariaHidden }: { items: PublicPartner[]; ariaHidden?: boolean }) {
  // If fewer than 6 items, repeat to guarantee continuous flow across wide monitors
  const displayItems = items.length > 0 && items.length < 6 ? [...items, ...items] : items;

  return (
    <div className="flex shrink-0 items-center gap-16 sm:gap-20" aria-hidden={ariaHidden}>
      {displayItems.map((partner, index) => {
        const isExternal = partner.src.startsWith("http://") || partner.src.startsWith("https://") || partner.src.startsWith("data:");
        const img = (
          <Image
            src={partner.src}
            alt={partner.name}
            width={partner.width ?? 200}
            height={partner.height ?? 70}
            unoptimized={isExternal}
            className="h-9 w-auto shrink-0 object-contain sm:h-11 transition-transform duration-200 hover:scale-105"
          />
        );

        if (partner.websiteUrl) {
          return (
            <a
              key={`${partner.name}-${index}`}
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={partner.name}
              className="inline-flex shrink-0 items-center focus:outline-none focus:ring-2 focus:ring-teal-500 rounded transition-opacity hover:opacity-85"
            >
              {img}
            </a>
          );
        }

        return (
          <div key={`${partner.name}-${index}`} className="inline-flex shrink-0 items-center" title={partner.name}>
            {img}
          </div>
        );
      })}
    </div>
  );
}

export function PartnersStrip({ partners }: Props) {
  const activePartners = partners && partners.length > 0 ? partners : DEFAULT_PARTNERS;

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
            <LogoRow items={activePartners} />
            <LogoRow items={activePartners} ariaHidden />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
