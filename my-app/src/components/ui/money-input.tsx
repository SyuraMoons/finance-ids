"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { formatDigits, parseDigits } from "@/lib/format";

type Props = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "type" | "min" | "max" | "step"
> & {
  /** Controlled raw digits, e.g. "1000000". Omit for an uncontrolled field. */
  value?: string;
  onValueChange?: (digits: string) => void;
};

/** Money field that shows thousand separators (1.000.000) while typing; the value it reports is plain digits. */
export function MoneyInput({ value, onValueChange, name, ...rest }: Props) {
  const [inner, setInner] = useState("");
  const digits = value ?? inner;
  const ref = useRef<HTMLInputElement>(null);
  const caretDigits = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || caretDigits.current === null) return;
    let seen = 0;
    let pos = 0;
    while (pos < el.value.length && seen < caretDigits.current) {
      if (/\d/.test(el.value[pos])) seen++;
      pos++;
    }
    el.setSelectionRange(pos, pos);
    caretDigits.current = null;
  }, [digits]);

  return (
    <>
      <input
        {...rest}
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={formatDigits(digits)}
        onChange={(e) => {
          const raw = e.target.value;
          caretDigits.current = parseDigits(raw.slice(0, e.target.selectionStart ?? raw.length)).length;
          const next = parseDigits(raw).replace(/^0+(?=\d)/, "");
          setInner(next);
          onValueChange?.(next);
        }}
      />
      {name && <input type="hidden" name={name} value={digits} />}
    </>
  );
}
