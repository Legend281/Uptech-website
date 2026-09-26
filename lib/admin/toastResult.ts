import { toast } from "sonner";
import type { ActionResult } from "./types";

/**
 * Waits for a database-backed action, then says what happened: the success
 * message only once it has actually saved, otherwise the first reason it
 * was refused. Returns whether it worked.
 */
export async function toastResult(
  action: Promise<ActionResult>,
  success: string | { title: string; description?: string },
  failureTitle = "Not saved",
): Promise<boolean> {
  const result = await action;
  if (result.ok) {
    if (typeof success === "string") toast.success(success);
    else toast.success(success.title, { description: success.description });
    return true;
  }
  toast.error(failureTitle, { description: result.reasons[0] });
  return false;
}
