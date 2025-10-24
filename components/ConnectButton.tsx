"use client";
import { walletClient } from "@/lib/viem";
import { useState } from "react";

export default function ConnectButton({ onConnected }: { onConnected: (addr: `0x${string}`)=>void }) {
  const [addr, setAddr] = useState<`0x${string}` | null>(null);
  const [busy, setBusy] = useState(false);

  async function connect() {
    setBusy(true);
    try {
      const wc = walletClient();
      const [a] = await wc.requestAddresses();
      setAddr(a);
      onConnected(a);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={connect}
      disabled={busy || !!addr}
      className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
    >
      {addr ? `${addr.slice(0,6)}...${addr.slice(-4)}` : busy ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
