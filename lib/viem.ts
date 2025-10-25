// lib/viem.ts
"use client";

import { createPublicClient, createWalletClient, custom, http } from "viem";
import { sepolia } from "viem/chains";

// Optional: type for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] | Record<string, any> }) => Promise<any>;
      on?: (event: string, handler: (...args: any[]) => void) => void;
      removeListener?: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

export const CHAIN = sepolia;

// Prefer a clearly named env var
const RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC || process.env.NEXT_PUBLIC_RPC;
if (!RPC_URL) {
  console.warn("Missing NEXT_PUBLIC_SEPOLIA_RPC (or NEXT_PUBLIC_RPC) in .env.local");
}

export const publicClient = createPublicClient({
  chain: CHAIN,
  transport: http(RPC_URL ?? "https://sepolia.infura.io/v3/"),
});

/**
 * Returns a wallet client *with* an account and the EOA address.
 * Use this for any write (approve/tip/etc).
 *
 * Example:
 *   const { client, address } = await getWallet();
 *   await client.writeContract({ ... });
 */
export async function getWallet() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No injected wallet found");
  }

  // Request accounts (prompts connect if not already)
  const accounts: `0x${string}`[] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const address = accounts?.[0];
  if (!address) throw new Error("No account returned by wallet");

  // Ensure on Sepolia (11155111)
  const desiredHex = `0x${CHAIN.id.toString(16)}`;
  try {
    const currentChainId: `0x${string}` = await window.ethereum.request({
      method: "eth_chainId",
    });
    if (currentChainId !== desiredHex) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: desiredHex }],
        });
      } catch (e: any) {
        // If Sepolia isn't added
        if (e?.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: desiredHex,
                chainName: "Sepolia",
                nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
                rpcUrls: [RPC_URL ?? "https://sepolia.infura.io/v3/"],
                blockExplorerUrls: ["https://sepolia.etherscan.io/"],
              },
            ],
          });
        } else {
          console.warn("Network switch failed:", e);
        }
      }
    }
  } catch (err) {
    console.warn("Failed to validate/switch chain:", err);
  }

  const client = createWalletClient({
    chain: CHAIN,
    transport: custom(window.ethereum),
    // Bind account so viem writes don’t error with “walletClient.account missing”
    account: address,
  });

  return { client, address };
}