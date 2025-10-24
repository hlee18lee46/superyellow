"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/context/WalletContext";

export default function LobbyPage() {
  const router = useRouter();
  const { address } = useWallet();

  const [displayName, setDisplayName] = useState("");
  const [joinAddress, setJoinAddress] = useState("");

  const startStreaming = () => {
    if (!address) {
      alert("Connect your wallet in the header first.");
      return;
    }
    // Optional: persist displayName to query, or to your backend if you want.
    router.push(`/stream/${address}`);
  };

  const joinStream = () => {
    const a = joinAddress.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(a)) {
      alert("Please paste a valid streamer address (0x...)");
      return;
    }
    router.push(`/stream/${a}`);
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-10">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">VoxNitro Lobby</h1>
        <p className="text-sm text-muted-foreground">
          Tip streamers instantly with PYUSD using LOVE / SMILE / WINK / SUPER — settled via Yellow off-chain channels.
        </p>
      </section>

      {/* Start Streaming */}
      <section className="rounded-lg border p-4 space-y-4">
        <h2 className="text-lg font-semibold">Start Streaming</h2>
        <p className="text-sm text-muted-foreground">
          Use your connected wallet as your streamer address.
        </p>

        <div className="grid gap-2">
          <label className="text-sm">Display name (optional)</label>
          <input
            className="border rounded px-3 py-2"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Streamer name"
          />
        </div>

        <button
          onClick={startStreaming}
          className="inline-flex items-center justify-center rounded bg-primary text-primary-foreground px-4 py-2 disabled:opacity-50"
          disabled={!address}
          title={!address ? "Connect wallet in the header" : "Start"}
        >
          {address ? "Start Streaming" : "Connect wallet to start"}
        </button>

        {address && (
          <div className="text-xs text-muted-foreground">
            Your streamer address: <span className="font-mono">{address}</span>
          </div>
        )}
      </section>

      {/* Join a Stream */}
      <section className="rounded-lg border p-4 space-y-4">
        <h2 className="text-lg font-semibold">Join a Stream</h2>
        <div className="grid gap-2">
          <label className="text-sm">Paste streamer address (0x…)</label>
          <input
            className="border rounded px-3 py-2"
            value={joinAddress}
            onChange={(e) => setJoinAddress(e.target.value)}
            placeholder="0x..."
          />
        </div>

        <button
          onClick={joinStream}
          className="inline-flex items-center justify-center rounded bg-secondary text-secondary-foreground px-4 py-2"
        >
          Join
        </button>
      </section>

      {/* Active Streams (demo card) */}
      <section className="rounded-lg border p-4 space-y-3">
        <h2 className="text-lg font-semibold">Active Streams</h2>

        <div className="grid gap-3">
          <div className="rounded border p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Demo Stream</div>
                <div className="text-xs text-muted-foreground break-all">
                  0x3cC096aE91703a82DC213C349f609671DB4914a9
                </div>
              </div>
              <button
                onClick={() =>
                  router.push(
                    "/stream/0x3cC096aE91703a82DC213C349f609671DB4914a9"
                  )
                }
                className="inline-flex items-center justify-center rounded bg-accent text-accent-foreground px-3 py-2"
              >
                Watch
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
