import { NextResponse } from "next/server";
import { getPublishedPartnerLogos } from "@/lib/partners";

export const revalidate = 60;

export async function GET() {
  const partners = await getPublishedPartnerLogos();
  return NextResponse.json(partners);
}
