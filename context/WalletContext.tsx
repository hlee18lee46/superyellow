"use client";

import { createContext, useContext, useState } from "react";
import { walletClient } from "@/lib/viem";

type WalletContextType = {
  address: `0x${string}` | null;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextType>({
  address: null,
  connect: async () => {},
  disconnect: () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<`0x${string}` | null>(null);

  async function connect() {
    try {
      const wc = walletClient();
      const [a] = await wc.requestAddresses();
      setAddress(a);
    } catch (err) {
      console.error("Wallet connect failed", err);
    }
  }

  function disconnect() {
    setAddress(null);
  }

  return (
    <WalletContext.Provider value={{ address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
