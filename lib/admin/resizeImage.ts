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
