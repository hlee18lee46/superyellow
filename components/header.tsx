"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";

async function ensureSepolia() {
  if (!window?.ethereum) return;
  const desired = "0xaa36a7"; // 11155111
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: desired }],
    });
  } catch (e: any) {
    if (e?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: desired,
            chainName: "Sepolia",
            nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
            rpcUrls: [
              process.env.NEXT_PUBLIC_SEPOLIA_RPC ??
                "https://sepolia.infura.io/v3/",
            ],
            blockExplorerUrls: ["https://sepolia.etherscan.io/"],
          },
        ],
      });
    } else {
      console.warn(e);
    }
  }
}

export function Header() {
  const { address, connect, chainId } = useWallet();
  const fmt = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        {/* Left: logo + name | Right: network + wallet */}
        <div className="flex items-center justify-between gap-4">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* Replace /logo.svg with your asset in /public */}
            <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-primary/10">
              <Image
                src="/super.png"
                alt="Only SuperFans logo"
                fill
                className="object-contain p-1.5"
                priority
              />
            </div>
            <div className="leading-tight">
              <h1 className="text-xl font-bold text-foreground">
                Only SuperFans
              </h1>
              <p className="text-xs text-muted-foreground">
                Superchat tipping with PYUSD
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {chainId !== null && chainId !== 11155111 && (
              <Button variant="secondary" onClick={ensureSepolia}>
                Switch to Sepolia
              </Button>
            )}
            <Button onClick={connect} disabled={!!address} className="min-w-[150px]">
              {address ? fmt(address) : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}