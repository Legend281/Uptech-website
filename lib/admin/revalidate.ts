/**
 * Asks the server to rebuild public pages after a publish-affecting change
 * (app/api/admin/revalidate). Best-effort: the change is already saved, so a
 * failure here only delays when visitors see it (until the next deploy or
 * rebuild) — it never undoes or blocks the save. On the GitHub Pages static
 * preview there is no server, and this quietly does nothing.
 */
export async function revalidatePublicPages(paths: string[], accessToken: string): Promise<void> {
  if (paths.length === 0) return;
  try {
    await fetch("/api/admin/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ paths: [...new Set(paths)] }),
    });
  } catch {
    // See above: the save stands either way.
  }
}
