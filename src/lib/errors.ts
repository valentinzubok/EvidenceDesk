import type { Locale } from "./i18n/messages";

type EthereumRpcError = {
  code?: number;
  message?: string;
  data?: { message?: string };
};

export function formatWalletError(error: unknown, locale: Locale = "en"): string {
  if (!error || typeof error !== "object") {
    return locale === "uk"
      ? "Не вдалося підключити гаманець. Спробуйте ще раз."
      : "Wallet connection failed. Try again.";
  }

  const err = error as EthereumRpcError;
  const message = err.data?.message ?? err.message ?? String(error);

  if (err.code === 4001 || /user rejected/i.test(message)) {
    return locale === "uk"
      ? "Транзакцію відхилено в MetaMask."
      : "Transaction rejected in MetaMask.";
  }
  if (/metamask|wallet/i.test(message) && /not found|install/i.test(message)) {
    return locale === "uk"
      ? "MetaMask не знайдено. Встановіть розширення та оновіть сторінку."
      : "MetaMask not found. Install the extension and refresh.";
  }
  if (/insufficient funds/i.test(message)) {
    return locale === "uk" ? "Недостатньо коштів для gas." : "Insufficient funds for transaction gas.";
  }
  if (/network/i.test(message)) {
    return locale === "uk"
      ? "Невідповідна мережа. genlayer-js підключить Studionet автоматично."
      : "Network mismatch. genlayer-js will connect Studionet automatically.";
  }

  return message.slice(0, 280);
}

export function formatReadError(error: unknown, locale: Locale = "en"): string {
  console.error("[EvidenceDesk] read error:", error);
  if (locale === "uk") {
    return "Не вдалося отримати дані. Перевірте Studionet і спробуйте знову.";
  }
  return "Could not load data. Check Studionet connectivity and try again.";
}

export function formatWriteError(error: unknown, locale: Locale = "en"): string {
  console.error("[EvidenceDesk] write error:", error);
  const walletMsg = formatWalletError(error, locale);
  const raw = error instanceof Error ? error.message : String(error);
  if (walletMsg !== raw && !walletMsg.includes(raw.slice(0, 20))) return walletMsg;
  if (locale === "uk") {
    return "Транзакцію не надіслано. Перевірте гаманець і спробуйте ще раз.";
  }
  return "Transaction failed. Check your wallet and try again.";
}
