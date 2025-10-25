// context/WalletContext.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Ctx = {
  address: `0x${string}` | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const WalletCtx = createContext<Ctx>({
  address: null,
  chainId: null,
  connect: async () => {},
  disconnect: () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  const connect = async () => {
    if (!window?.ethereum) {
      alert("Please install MetaMask");
      return;
    }
    // Request accounts
    const accounts: string[] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAddress((accounts[0] ?? null) as `0x${string}` | null);

    // Ensure Sepolia
    const desired = "0xaa36a7"; // 11155111
    const current: string = await window.ethereum.request({ method: "eth_chainId" });
    if (current !== desired) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: desired }],
        });
      } catch (e: any) {
        // Add chain if missing
        if (e?.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: desired,
                chainName: "Sepolia",
                nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
                rpcUrls: [process.env.NEXT_PUBLIC_SEPOLIA_RPC ?? "https://sepolia.infura.io/v3/"],
                blockExplorerUrls: ["https://sepolia.etherscan.io/"],
              },
            ],
          });
        } else {
          console.warn("Switch chain error:", e);
        }
      }
    }
    const cid: string = await window.ethereum.request({ method: "eth_chainId" });
    setChainId(parseInt(cid, 16));
  };

  const disconnect = () => {
    setAddress(null);
    setChainId(null);
  };

  useEffect(() => {
    if (!window?.ethereum) return;

    const onAccountsChanged = (accounts: string[]) => {
      setAddress((accounts[0] ?? null) as `0x${string}` | null);
    };
    const onChainChanged = (cid: string) => {
      setChainId(parseInt(cid, 16));
    };

    window.ethereum.on?.("accountsChanged", onAccountsChanged);
    window.ethereum.on?.("chainChanged", onChainChanged);

    // Initialize if already connected
    (async () => {
      try {
        const accounts: string[] = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length) setAddress(accounts[0] as `0x${string}`);
        const cid: string = await window.ethereum.request({ method: "eth_chainId" });
        setChainId(parseInt(cid, 16));
      } catch {}
    })();

    return () => {
      window.ethereum.removeListener?.("accountsChanged", onAccountsChanged);
      window.ethereum.removeListener?.("chainChanged", onChainChanged);
    };
  }, []);

  const value = useMemo(() => ({ address, chainId, connect, disconnect }), [address, chainId]);
  return <WalletCtx.Provider value={value}>{children}</WalletCtx.Provider>;
}

export const useWallet = () => useContext(WalletCtx);