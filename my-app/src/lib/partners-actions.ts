"use server";

/** Partner writes (accounting.manual-entry role) — lets forms add a lender/vendor inline. */
import { revalidatePath } from "next/cache";
import { authedFetch } from "./authed-fetch";
import { APP_ROUTES } from "./routes";

export async function createPartner(input: {
  name: string;
  role: "lender" | "vendor";
}): Promise<{ id: string | null; error: string | null }> {
  const res = await authedFetch("/api/partners", {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      isLender: input.role === "lender",
      isVendor: input.role === "vendor",
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { id: null, error: body?.error ?? `Failed to add ${input.role}.` };
  }
  const { id } = await res.json();
  revalidatePath(input.role === "lender" ? APP_ROUTES.newLoan : APP_ROUTES.newExpense);
  return { id, error: null };
}
