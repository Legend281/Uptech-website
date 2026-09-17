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

export function PartnersStrip() {
  return (
    <section className="border-y border-slate-200/80 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal effect="fade">
          <p className="mb-8 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
            Our Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16">
            {partners.map((partner) => (
              <Image
                key={partner.name}
                src={partner.src}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className="h-8 w-auto object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:h-9"
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
