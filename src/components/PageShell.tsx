"use client";

import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Breadcrumbs />
      {children}
    </>
  );
}
