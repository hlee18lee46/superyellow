"use client";

import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export function Header() {
  const { address, connect, disconnect } = useWallet();

  const formatAddr = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;

  return (
    <header className="fixed top-0 w-full border-b border-border bg-card/80 backdrop-blur-md z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            VN
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">VoxNitro</h1>
            <p className="text-xs text-muted-foreground">Instant Superchat Tipping</p>
          </div>
        </div>

        {address ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled>
              <Wallet className="w-4 h-4 mr-2" />
              {formatAddr(address)}
            </Button>
            <Button onClick={disconnect} variant="destructive">
              Disconnect
            </Button>
          </div>
        ) : (
          <Button onClick={connect} className="gap-2">
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
}
