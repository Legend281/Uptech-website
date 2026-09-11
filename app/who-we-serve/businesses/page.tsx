import type { Metadata } from "next";

import { PersonaLanding } from "@/components/who-we-serve/PersonaLanding";
import { businesses } from "@/lib/who-we-serve/businesses";

export const metadata: Metadata = {
  title: "For Businesses & Institutions",
  description:
    "How Uptech Consulting helps organisations: managed IT and technology advisory, company registration and compliance in Cameroon and the United States, with a written scope before anything is quoted.",
};

export default function BusinessesPage() {
  return <PersonaLanding content={businesses} />;
}
