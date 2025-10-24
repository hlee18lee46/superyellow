// lib/viemWallet.ts
import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";

export function makeWalletClient(account: `0x${string}`) {
  if (!window.ethereum) throw new Error("No injected provider");
  return createWalletClient({
    chain: sepolia,
    transport: custom((window as any).ethereum),
    account, // ✅ include the connected address
  });
}
