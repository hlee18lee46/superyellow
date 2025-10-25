// lib/viem.ts
"use client";

import { createPublicClient, createWalletClient, custom, http } from "viem";
import { sepolia } from "viem/chains";

export const CHAIN = sepolia;

// prefer a clearly named env var
const RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC || process.env.NEXT_PUBLIC_RPC;
if (!RPC_URL) {
  // helps during local dev
  console.warn("Missing NEXT_PUBLIC_SEPOLIA_RPC (or NEXT_PUBLIC_RPC) in .env.local");
}

export const publicClient = createPublicClient({
  chain: CHAIN,
  transport: http(RPC_URL ?? "https://sepolia.infura.io/v3/"),
});

/**
 * Returns a wallet client *with* an account and the EOA address.
 * Use this for any write (approve/tip/etc).
 */
export async function getWallet() {
  if (typeof window === "undefined" || !window.ethereum)
    throw new Error("No injected wallet found");

  // Ensure we have permission to read accounts
  const accounts: `0x${string}`[] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const address = accounts[0];
  if (!address) throw new Error("No account returned by wallet");

  const client = createWalletClient({
    chain: CHAIN,
    transport: custom(window.ethereum),
    account: address, // ✅ bind account so writes don't error
  });

  // Optional: ensure we’re on Sepolia
  const currentChainId: `0x${string}` = await window.ethereum.request({ method: "eth_chainId" });
  if (parseInt(currentChainId, 16) !== CHAIN.id) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${CHAIN.id.toString(16)}` }],
      });
    } catch (e: any) {
      if (e?.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: `0x${CHAIN.id.toString(16)}`,
            chainName: "Sepolia",
            nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
            rpcUrls: [RPC_URL ?? "https://sepolia.infura.io/v3/"],
            blockExplorerUrls: ["https://sepolia.etherscan.io/"],
          }],
        });
      } else {
        console.warn("Network switch failed:", e);
      }
    }
  }

  return { client, address };
}