// lib/viem.ts
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { sepolia } from "viem/chains";

export const RPC = process.env.NEXT_PUBLIC_RPC!;
export const publicClient = createPublicClient({ chain: sepolia, transport: http(RPC) });

export function walletClient() {
  if (typeof window === "undefined" || !window.ethereum) throw new Error("No wallet found");
  return createWalletClient({ chain: sepolia, transport: custom(window.ethereum) });
}
