"use client";

import { useEffect, useState } from "react";

/**
 * Current wall-clock time in a given IANA zone. Renders empty on the server and
 * on first client paint so there is no hydration mismatch, then fills in.
 */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    });
    const update = () => setTime(format.format(new Date()));

    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {time ?? "--:--"}
    </span>
  );
}
