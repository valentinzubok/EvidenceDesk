type EthereumRpcError = {
  code?: number;
  message?: string;
  data?: { message?: string };
};

export function formatWalletError(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Wallet connection failed. Try again.";
  }

  const err = error as EthereumRpcError;
  const message = err.data?.message ?? err.message ?? String(error);

  if (err.code === 4001 || /user rejected/i.test(message)) {
    return "Transaction rejected in MetaMask.";
  }
  if (/metamask|wallet/i.test(message) && /not found|install/i.test(message)) {
    return "MetaMask not found. Install the extension and refresh.";
  }
  if (/insufficient funds/i.test(message)) {
    return "Insufficient funds for transaction gas.";
  }
  if (/network/i.test(message)) {
    return "Network mismatch. Connect MetaMask to Studionet via genlayer-js.";
  }

  return message;
}

export function formatReadError(error: unknown, locale: "en" | "ru" = "en"): string {
  console.error("[EvidenceDesk] read error:", error);
  if (locale === "ru") {
    return "Не удалось получить данные. Проверьте сеть Studionet и попробуйте снова.";
  }
  return "Could not load data. Check Studionet connectivity and try again.";
}

export function formatWriteError(error: unknown, locale: "en" | "ru" = "en"): string {
  console.error("[EvidenceDesk] write error:", error);
  const walletMsg = formatWalletError(error);
  if (walletMsg !== String(error)) return walletMsg;
  if (locale === "ru") {
    return "Транзакция не отправлена. Проверьте кошелёк и попробуйте ещё раз.";
  }
  return "Transaction failed. Check your wallet and try again.";
}
