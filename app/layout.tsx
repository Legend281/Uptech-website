import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Uptech Consulting & Outsourcing",
    template: "%s — Uptech Consulting & Outsourcing",
  },
  description:
    "IT consulting, business formalisation & compliance, and career marketing & placement — bridging Cameroon and the United States.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Material Symbols powers the icon set used across every mockup-derived component. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- rule predates the App Router; root-layout <link> is the supported pattern here */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
