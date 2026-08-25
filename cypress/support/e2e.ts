import "./commands";

const TEST_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0";

Cypress.on("window:before:load", (win) => {
  const listeners: Record<string, Array<(...args: unknown[]) => void>> = {};

  win.ethereum = {
    isMetaMask: true,
    chainId: "0x1",
    selectedAddress: TEST_ADDRESS,
    request: async ({ method }: { method: string }) => {
      switch (method) {
        case "eth_requestAccounts":
        case "eth_accounts":
          return [TEST_ADDRESS];
        case "eth_chainId":
          return "0x1";
        case "wallet_switchEthereumChain":
        case "wallet_addEthereumChain":
          return null;
        default:
          return null;
      }
    },
    on: (event: string, fn: (...args: unknown[]) => void) => {
      listeners[event] = listeners[event] ?? [];
      listeners[event].push(fn);
    },
    removeListener: (event: string, fn: (...args: unknown[]) => void) => {
      listeners[event] = (listeners[event] ?? []).filter((f) => f !== fn);
    },
  } as unknown as typeof win.ethereum;
});

export {};
