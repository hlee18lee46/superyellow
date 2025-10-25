// app/lobby/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ADDR } from "@/lib/addresses";
import { streamRegistryAbi } from "@/types/registryAbi";
import { publicClient } from "@/lib/viem"; // used only for event watcher (optional)

type Stream = {
  streamer: `0x${string}`;
  name: string;
  url: string;
  active: boolean;
};

export default function LobbyPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/streams", { cache: "no-store" });
      const json = await res.json();
      setStreams(json.streams ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Optional live updates: watch events + polling fallback
  useEffect(() => {
    const unwatch = publicClient.watchContractEvent({
      address: ADDR.REGISTRY,
      abi: streamRegistryAbi,
      eventName: undefined, // all events; filter in callback
      onLogs: (logs) => {
        const changed = logs.some((l: any) =>
          l.eventName === "StreamStarted" || l.eventName === "StreamStopped"
        );
        if (changed) load();
      },
      onError: (err) => console.warn("watchContractEvent error:", err),
    });

    const poll = setInterval(load, 10_000);
    return () => {
      unwatch?.();
      clearInterval(poll);
    };
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Only SuperFans — Lobby</h1>
        <Button variant="outline" onClick={load} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold">Active Streams</h2>
        {streams.length === 0 && (
          <p className="text-sm opacity-70">No live streams yet.</p>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          {streams.map((s) => (
            <div key={s.streamer} className="border rounded-lg p-4 space-y-2">
              <div className="text-sm font-medium">{s.name || "Untitled Stream"}</div>
              <div className="text-xs break-all opacity-70">{s.streamer}</div>
              {s.url && (
                <a href={s.url} target="_blank" className="text-xs underline">
                  Open player URL
                </a>
              )}
              <div>
                <Link href={`/stream/${s.streamer}`} className="inline-block">
                  <Button className="mt-2">Watch</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}