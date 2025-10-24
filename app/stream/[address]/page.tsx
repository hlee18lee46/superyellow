"use client";

import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useParams } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import BadgeCard from "@/components/BadgeCard";
import { ADDR, BADGES, TIERS } from "@/lib/addresses";
import { erc20Abi } from "@/types/abi";
import { publicClient } from "@/lib/viem";

export default function StreamPage() {
  const params = useParams<{ address: `0x${string}` }>();
  const STREAMER = params.address;
  const { address } = useWallet();

  const [pyusdBal, setPyusdBal] = useState("0");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [msg, setMsg] = useState("🔥 Superchat!");

  // 🔹 1. Create or join Yellow off-chain session via API
  useEffect(() => {
    if (!address || sessionId) return;

    (async () => {
      try {
        const res = await fetch("/api/yellow/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            viewer: address,
            treasury: process.env.NEXT_PUBLIC_TREASURY!,
            token: ADDR.PYUSD,
            deposit: "10", // off-chain allowance for demo
          }),
        });

        const { channelId } = await res.json();
        setSessionId(channelId);
        console.log("✅ Yellow session created:", channelId);
      } catch (err) {
        console.error("❌ Yellow init error:", err);
      }
    })();
  }, [address, sessionId]);

  // 🔹 2. Fetch PYUSD balance
  useEffect(() => {
    if (!address) return;
    (async () => {
      const bal = (await publicClient.readContract({
        address: ADDR.PYUSD,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      })) as bigint;
      setPyusdBal(formatUnits(bal, 18));
    })();
  }, [address]);

  // 🔹 3. Send off-chain Yellow tip (fast, gasless)
  async function sendOffchainTip(badgeAddr: `0x${string}`, tierYusd: string) {
    if (!address || !sessionId) return alert("Connect your wallet first.");
    setSending(`${badgeAddr}:${tierYusd}`);

    try {
      const res = await fetch("/api/yellow/tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId: sessionId,
          viewer: address,
          streamer: STREAMER,
          treasury: process.env.NEXT_PUBLIC_TREASURY!,
          token: ADDR.PYUSD,
          amount: tierYusd,
          badge: badgeAddr,
          message: msg,
        }),
      });

      const r = await res.json();
      console.log("💬 Off-chain tip sent:", r);
    } catch (err) {
      console.error("❌ Off-chain tip error:", err);
    } finally {
      setSending(null);
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Live Stream</h1>

      <div className="w-full aspect-video bg-black/80 rounded-lg grid place-items-center text-white">
        Stream Video
      </div>

      <input
        className="border rounded w-full px-3 py-2"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Say something nice ✨"
      />

      <div className="rounded p-2 bg-zinc-900 text-white">
        {address ? `Your PYUSD: ${pyusdBal}` : "Connect wallet in header"}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {BADGES.map((b) => (
          <BadgeCard
            key={b.addr}
            label={b.label}
            addressKey={b.addr}
            rate={b.price.toString()}
            loadingKey={sending}
            onClickTier={(tier) => sendOffchainTip(b.addr, tier)}
            tiers={TIERS}
          />
        ))}
      </div>
    </main>
  );
}
