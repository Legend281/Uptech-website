import type { Metadata } from "next";

import { PersonaLanding } from "@/components/who-we-serve/PersonaLanding";
import { individuals } from "@/lib/who-we-serve/individuals";

export const metadata: Metadata = {
  title: "For Individuals",
  description:
    "How Uptech Consulting helps individuals: IT career placement with a dedicated worker on your account, personal tax compliance in Cameroon, and registering a business of your own — from Buea or from abroad.",
};

export default function IndividualsPage() {
  return <PersonaLanding content={individuals} />;
}
