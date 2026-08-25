type EthereumRpcError = {
  code?: number;
  message?: string;
  data?: { message?: string };
};

export type ErrorKind = "metamask" | "network" | "generic";

export function classifyError(error: unknown): ErrorKind {
  if (!error || typeof error !== "object") return "generic";

  const err = error as EthereumRpcError;
  const message = err.data?.message ?? err.message ?? String(error);

  if (err.code === 4001 || /user rejected/i.test(message)) return "metamask";
  if (/metamask|wallet/i.test(message) && /not found|install/i.test(message)) return "metamask";
  if (/network|chain/i.test(message)) return "network";

  return "generic";
}

export function errorKindIcon(kind: ErrorKind): string {
  switch (kind) {
    case "metamask":
      return "🦊";
    case "network":
      return "⚡";
    default:
      return "❌";
  }
}

export function errorKindLabel(kind: ErrorKind, locale: "en" | "ua"): string {
  if (locale === "ua") {
    switch (kind) {
      case "metamask":
        return "MetaMask";
      case "network":
        return "Мережа";
      default:
        return "Помилка";
    }
  }
  switch (kind) {
    case "metamask":
      return "MetaMask";
    case "network":
      return "Network";
    default:
      return "Error";
  }
}
