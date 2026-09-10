import Link from "next/link";

const serviceLinks = [
  { label: "IT Consulting & Outsourcing", href: "/services/it-consulting-outsourcing" },
  { label: "Business Formalisation & Compliance", href: "/services/business-formalisation-compliance" },
  { label: "Career Marketing & Placement", href: "/services/career-marketing-placement" },
];

const companyLinks = [
  { label: "Who We Are", href: "/who-we-are" },
  { label: "Our Philosophy", href: "/who-we-are" },
  { label: "Core Values", href: "/who-we-are#core-values" },
  { label: "Careers", href: "/careers" },
];

const engageLinks = [
  { label: "Book a Consultation", href: "/contact" },
  { label: "For Individuals", href: "/who-we-serve/individuals" },
  { label: "For Businesses", href: "/who-we-serve/businesses" },
  { label: "Partnerships", href: "/contact" },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "#",
    path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.738-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
  },
  {
    label: "Facebook",
    href: "#",
    path: "M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.597 0 9 1.582 9 4.615V8z",
  },
  {
    label: "TikTok",
    href: "#",
    path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01v8.83c0 1.25-.26 2.5-.81 3.61-.92 1.83-2.6 3.19-4.57 3.69-1.04.26-2.13.3-3.19.12-2.18-.37-4.08-1.7-5.1-3.66-.54-1.04-.8-2.2-.77-3.37.03-1.67.65-3.28 1.77-4.52 1.26-1.4 3.09-2.22 4.96-2.29v4.06c-.63.07-1.25.29-1.76.69-.64.51-1.03 1.28-1.06 2.09-.03.74.25 1.48.74 2.03.54.6 1.34.93 2.13.91.85-.02 1.65-.43 2.14-1.12.33-.48.49-1.06.49-1.64V.02h-.03z",
  },
  {
    label: "X",
    href: "#",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
];

export function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-slate-800/80">
          {/* Brand & contact */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl border border-teal-400/40 flex items-center justify-center bg-navy-900 text-teal-400 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 19V5m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-sm tracking-wider uppercase leading-none">
                  UPTECH
                </span>
                <span className="text-[8px] font-semibold text-teal-400 tracking-wider uppercase mt-1">
                  CONSULTING &amp; OUTSOURCING
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              A technology-driven consulting, outsourcing and business support organisation bridging the gap
              between strategy and execution.
            </p>
            <div className="space-y-2 pt-2 text-xs">
              <p className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>infos@uptechconsulting.com</span>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Buea, Cameroon · Stafford, Texas</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold tracking-wider uppercase text-white mb-4">COMPANY</h4>
            <ul className="space-y-2.5 text-xs">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-white mb-4">SERVICES</h4>
            <ul className="space-y-2.5 text-xs">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-white mb-4">ENGAGE US</h4>
            <ul className="space-y-2.5 text-xs">
              {engageLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Uptech Consulting &amp; Outsourcing. Cameroon S.A. · USA S-Corp. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">English &amp; Français</span>
            <div className="flex items-center gap-4 text-slate-400">
              {socialLinks.map((social) => (
                <a key={social.label} aria-label={social.label} href={social.href} className="hover:text-teal-400 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
