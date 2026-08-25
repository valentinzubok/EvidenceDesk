"use client";

import { useCallback } from "react";
import { useLocale } from "./LocaleProvider";
import { useToast } from "./ToastProvider";
import { classifyError, errorKindIcon, errorKindLabel } from "@/lib/errorKind";
import { formatReadError, formatWalletError, formatWriteError } from "@/lib/errors";

type ErrorContext = "read" | "write" | "wallet";

function formatForContext(error: unknown, context: ErrorContext, locale: "en" | "ua"): string {
  switch (context) {
    case "read":
      return formatReadError(error, locale);
    case "wallet":
      return formatWalletError(error, locale);
    default:
      return formatWriteError(error, locale);
  }
}

export function useErrorToast() {
  const { push } = useToast();
  const { locale } = useLocale();

  return useCallback(
    (error: unknown, context: ErrorContext = "write") => {
      const kind = classifyError(error);
      const message = formatForContext(error, context, locale);
      const icon = errorKindIcon(kind);
      const label = errorKindLabel(kind, locale);
      push(`${icon} ${label}: ${message}`, "warn");
    },
    [locale, push],
  );
}
