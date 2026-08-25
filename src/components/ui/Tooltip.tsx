"use client";

import { useId, useState, type ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom";
};

export function Tooltip({ label, children, side = "top" }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={open ? id : undefined}>{children}</span>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className={`pointer-events-none absolute z-50 w-max max-w-[240px] rounded-lg border border-white/10 bg-zinc-900/95 px-2.5 py-1.5 text-[11px] leading-snug text-zinc-200 shadow-xl backdrop-blur-md ${
            side === "top" ? "bottom-full mb-1.5 left-1/2 -translate-x-1/2" : "top-full mt-1.5 left-1/2 -translate-x-1/2"
          }`}
        >
          {label}
        </span>
      ) : null}
    </span>
  );
}
