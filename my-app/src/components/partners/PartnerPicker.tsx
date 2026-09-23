"use client";

import { useState, useTransition } from "react";
import { createPartner } from "@/lib/partners-actions";
import type { PartnerOption } from "@/lib/types";

const NEW = "__new__";
const fieldClass =
  "w-full rounded-lg border border-card-border bg-card px-3 py-2 text-title outline-none focus:border-primary-300 disabled:bg-soft disabled:text-ink-muted";

/** A partner dropdown that can also add a new lender/vendor on the spot. */
export default function PartnerPicker({
  role,
  options,
  value,
  onChange,
  disabled,
}: {
  role: "lender" | "vendor";
  options: PartnerOption[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) {
  const [list, setList] = useState(options);
  const [adding, setAdding] = useState(options.length === 0 && !disabled);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError(`Enter the ${role}'s name.`);
      return;
    }
    startTransition(async () => {
      const result = await createPartner({ name: trimmed, role });
      if (result.error || !result.id) {
        setError(result.error ?? `Failed to add ${role}.`);
        return;
      }
      setList((prev) => [
        ...prev,
        {
          id: result.id!,
          name: trimmed,
          clientType: null,
          isCustomer: false,
          isVendor: role === "vendor",
          isEmployee: false,
          isLender: role === "lender",
          isActive: true,
          taxId: null,
        },
      ]);
      onChange(result.id);
      setName("");
      setAdding(false);
    });
  }

  return (
    <div className="space-y-2">
      <select
        value={adding ? NEW : value}
        disabled={disabled}
        onChange={(e) => {
          if (e.target.value === NEW) {
            setAdding(true);
            onChange("");
          } else {
            setAdding(false);
            onChange(e.target.value);
          }
        }}
        className={fieldClass}
      >
        <option value="">Choose a {role}…</option>
        {list.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
        {!disabled && <option value={NEW}>+ Add new {role}…</option>}
      </select>

      {adding && (
        <div className="space-y-2 rounded-lg border border-card-border bg-soft p-3">
          {list.length === 0 && (
            <p className="text-sm text-ink-secondary">No {role}s yet. Add the first one.</p>
          )}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`${role === "lender" ? "Lender" : "Vendor"} name`}
            className={fieldClass}
          />
          {error && <p className="text-sm text-chip-error-text">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={handleAdd}
              className="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
            >
              Add
            </button>
            {list.length > 0 && (
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  setAdding(false);
                  setError(null);
                }}
                className="rounded-lg border border-card-border px-3 py-1.5 text-sm text-ink-secondary hover:text-title"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
