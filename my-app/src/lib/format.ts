/**
 * Indonesian short-scale money label: M = miliar (billion), jt = juta (million).
 */
export function formatRupiah(amount: number): string {
  if (amount >= 1_000_000_000) {
    const v = amount / 1_000_000_000;
    return `Rp ${v.toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`;
  }
  const v = amount / 1_000_000;
  return `Rp ${v.toLocaleString("id-ID", { maximumFractionDigits: 0 })} jt`;
}

/** Full-precision Rupiah — for the accounting dashboard, where exact ledger figures matter and "Rp 0 jt" would hide anything under a million. */
export function formatRupiahExact(amount: number): string {
  return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Keep digits only — the raw value behind a thousand-separated money input. */
export function parseDigits(input: string): string {
  return input.replace(/\D/g, "");
}

/** "1000000" → "1.000.000" (id-ID), for display inside money inputs. */
export function formatDigits(digits: string): string {
  return digits === "" ? "" : Number(digits).toLocaleString("id-ID");
}
