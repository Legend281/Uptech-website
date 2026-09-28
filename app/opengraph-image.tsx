import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Uptech Consulting & Outsourcing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
 * Generated from code rather than a designed asset file — there's no
 * marketing OG image on hand yet, only the real supplied logo (CLAUDE.md
 * Section 1). Built from the same navy/teal tokens as the rest of the
 * site (DESIGN.md / CLAUDE.md Section 3), not invented colors. Swap this
 * for a real designed image later if one gets made — this is a working
 * default, not a placeholder that fakes being finished (it's genuinely
 * real brand assets and real copy, just simply arranged).
 */
export default async function OpengraphImage() {
  const logoData = await readFile(join(process.cwd(), "public", "UPTECH_LOG.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B192C",
          backgroundImage: "linear-gradient(135deg, #0B192C 0%, #1E3E62 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={520} height={198} alt="" />
        <div
          style={{
            marginTop: 44,
            fontSize: 30,
            color: "#94a3b8",
            letterSpacing: 1,
          }}
        >
          IT Consulting · Business Compliance · Career Placement
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 22,
            color: "#5eead4",
            letterSpacing: 1,
          }}
        >
          Buea, Cameroon - Stafford, Texas
        </div>
      </div>
    ),
    { ...size },
  );
}
