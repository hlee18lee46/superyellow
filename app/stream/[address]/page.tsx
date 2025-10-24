"use client";

import { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { useParams } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import BadgeCard from "@/components/BadgeCard";
import { ADDR, BADGES, TIERS } from "@/lib/addresses";
import { publicClient, walletClient } from "@/lib/viem";
import { erc20Abi, tipRouterAbi } from "@/types/abi";

export default function StreamPage() {
  const params = useParams<{ address: `0x${string}` }>();
  const STREAMER = params.address as `0x${string}`;
  const { address } = useWallet(); // 🔹 global wallet

  const [yusdBal, setYusdBal] = useState<string>("0");
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);
  const [msg, setMsg] = useState("🔥 Superchat!");

  useEffect(() => {
    if (!address) return;
    (async () => {
      const bal = (await publicClient.readContract({
        address: ADDR.PYUSD,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      })) as bigint;
      setYusdBal(formatUnits(bal, 18));

      const ps: Record<string, string> = {};
      for (const b of BADGES) {
        const p = (await publicClient.readContract({
          address: ADDR.ROUTER,
          abi: tipRouterAbi,
          functionName: "price",
          args: [b.addr],
        })) as bigint;
        ps[b.addr] = formatUnits(p, 18);
      }
      setPrices(ps);
    })();
  }, [address]);

  async function ensureAllowance(needed: bigint) {
    if (!address) return;
    const allowance = (await publicClient.readContract({
      address: ADDR.PYUSD,
      abi: erc20Abi,
      functionName: "allowance",
      args: [address, ADDR.ROUTER],
    })) as bigint;
    if (allowance >= needed) return;
    const wc = walletClient();
    const tx = await wc.writeContract({
      address: ADDR.PYUSD,
      abi: erc20Abi,
      functionName: "approve",
      args: [ADDR.ROUTER, needed],
    });
    await publicClient.waitForTransactionReceipt({ hash: tx });
  }

  async function sendTip(badgeAddr: `0x${string}`, tierYusd: string) {
    if (!address) return alert("Connect your wallet in the header first.");
    const amount = parseUnits(tierYusd, 18);
    setSending(`${badgeAddr}:${tierYusd}`);
    try {
      await ensureAllowance(amount);
      const wc = walletClient();
      const tx = await wc.writeContract({
        address: ADDR.ROUTER,
        abi: tipRouterAbi,
        functionName: "tip",
        args: [badgeAddr, STREAMER, amount, msg],
      });
      await publicClient.waitForTransactionReceipt({ hash: tx });
      // refresh balance
      const bal = (await publicClient.readContract({
        address: ADDR.PYUSD,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      })) as bigint;
      setYusdBal(formatUnits(bal, 18));
    } finally {
      setSending(null);
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Live Stream</h1>
        <div className="text-sm opacity-70 break-all">Streamer: {STREAMER}</div>
      </div>

      <div className="w-full aspect-video bg-black/80 rounded-lg grid place-items-center text-white">
        Stream Video
      </div>

      <label className="block text-sm">Message to streamer</label>
      <input
        className="border rounded w-full px-3 py-2"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Say something nice ✨"
      />

      <div className="flex items-center justify-between">
        <div className="rounded p-2 bg-zinc-900 text-white">
          {address ? `Your YUSD: ${yusdBal}` : "Connect wallet in header to tip"}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {BADGES.map((b) => (
          <BadgeCard
            key={b.addr}
            label={b.label}
            addressKey={b.addr}
            rate={prices[b.addr]}
            loadingKey={sending}
            onClickTier={(tier) => sendTip(b.addr, tier)}
            tiers={TIERS}
          />
        ))}
      </div>
    </main>
  );
}
