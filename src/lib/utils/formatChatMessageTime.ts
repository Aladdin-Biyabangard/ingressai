/** ISO tarix üçün qısa relative və ya lokal tarix/saat. */
export function formatChatMessageTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  const now = Date.now();
  const diffMs = d.getTime() - now;
  const absSec = Math.abs(diffMs) / 1000;

  try {
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    if (absSec < 60) return rtf.format(Math.round(diffMs / 1000), "second");
    if (absSec < 3600) return rtf.format(Math.round(diffMs / 60000), "minute");
    if (absSec < 86400) return rtf.format(Math.round(diffMs / 3600000), "hour");
    if (absSec < 604800) return rtf.format(Math.round(diffMs / 86400000), "day");
    if (absSec < 2592000) return rtf.format(Math.round(diffMs / 604800000), "week");
  } catch {
    /* Intl fallback */
  }

  return d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
}
