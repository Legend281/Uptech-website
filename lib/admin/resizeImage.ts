/*
 * Resize-on-upload (Admin_Dashboard_Requirements.md Section 8), done in the
 * browser: a staff member picking a 6MB phone photo should never put 6MB on
 * a page that Cameroon mobile visitors load. Output is a centre-cropped JPEG
 * at the target aspect ratio, no larger than the target size.
 */
const MAX_INPUT_BYTES = 10 * 1024 * 1024;

type ResizeOptions = { width: number; height: number; quality?: number };

/** Testimonial avatars: 320px square — plenty for a 44px circle at 3x density. */
export const AVATAR_SIZE: ResizeOptions = { width: 320, height: 320 };
/** Team portraits: 4:5, matching TeamMemberCard's frame, sized for a 4-column desktop grid. */
export const PORTRAIT_SIZE: ResizeOptions = { width: 480, height: 600 };
/** Additional-service cards: 4:3, matching the existing 5 services' hub-page card image. */
export const SERVICE_CARD_SIZE: ResizeOptions = { width: 800, height: 600 };
/** Blog cover images: 1200x630 — the same 1.91:1 ratio as app/opengraph-image.tsx, so a post's own cover doubles as a sane social-share image. */
export const BLOG_COVER_SIZE: ResizeOptions = { width: 1200, height: 630 };

export async function resizeImageToDataUrl(file: File, { width, height, quality = 0.82 }: ResizeOptions = AVATAR_SIZE): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("That file isn't an image.");
  if (file.size > MAX_INPUT_BYTES) throw new Error("That image is over 10MB. Please choose a smaller one.");

  const bitmap = await createImageBitmap(file);
  try {
    // Largest centred crop at the target aspect ratio.
    const targetRatio = width / height;
    let cropW = bitmap.width;
    let cropH = cropW / targetRatio;
    if (cropH > bitmap.height) {
      cropH = bitmap.height;
      cropW = cropH * targetRatio;
    }
    // Never upscale a small source.
    const scale = Math.min(1, width / cropW);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(cropW * scale);
    canvas.height = Math.round(cropH * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("This browser couldn't process the image.");
    ctx.drawImage(bitmap, (bitmap.width - cropW) / 2, (bitmap.height - cropH) / 2, cropW, cropH, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    bitmap.close();
  }
}

/**
 * Brand/partner logos: preserves original aspect ratio and transparent background (PNG/WebP),
 * scaling down cleanly so it fits within maxWidth x maxHeight without clipping the logo.
 */
export async function resizeLogoToDataUrl(file: File, maxW = 400, maxH = 160): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("That file isn't an image.");
  if (file.size > MAX_INPUT_BYTES) throw new Error("That image is over 10MB. Please choose a smaller one.");

  if (file.type === "image/svg+xml") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read SVG file."));
      reader.readAsDataURL(file);
    });
  }

  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, maxW / bitmap.width, maxH / bitmap.height);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("This browser couldn't process the image.");
    ctx.drawImage(bitmap, 0, 0, width, height);

    const isPng = file.type.includes("png");
    const isWebp = file.type.includes("webp");
    const mime = isPng ? "image/png" : isWebp ? "image/webp" : "image/jpeg";
    return canvas.toDataURL(mime, 0.9);
  } finally {
    bitmap.close();
  }
}
