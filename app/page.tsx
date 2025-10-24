"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";

type ActiveStream = { address: `0x${string}`; name: string; startedAt: number };

function getActiveStreams(): ActiveStream[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("vn_active_streams");
  return raw ? JSON.parse(raw) : [];
}
function setActiveStreams(list: ActiveStream[]) {
  localStorage.setItem("vn_active_streams", JSON.stringify(list));
}

export default function Lobby() {
  const router = useRouter();
  const { address } = useWallet(); // 🔹 use global wallet
  const [name, setName] = useState("");
  const [viewerInput, setViewerInput] = useState("");
  const [streams, setStreams] = useState<ActiveStream[]>([]);

  useEffect(() => setStreams(getActiveStreams()), []);

  const defaultEnvStream = useMemo(() => {
    const s = process.env.NEXT_PUBLIC_STREAMER as `0x${string}` | undefined;
    return s ? [{ address: s, name: "Demo Stream", startedAt: 0 }] : [];
  }, []);

  const allStreams = useMemo(
    () =>
      [
        ...defaultEnvStream,
        ...streams.filter(
          (s) => !defaultEnvStream.find((d) => d.address.toLowerCase() === s.address.toLowerCase())
        ),
      ],
    [defaultEnvStream, streams]
  );

  const startStream = () => {
    if (!address) return alert("Connect your wallet in the header first.");
    const entry: ActiveStream = {
      address,
      name: name || "Untitled Stream",
      startedAt: Date.now(),
    };
    const list = getActiveStreams().filter(
      (x) => x.address.toLowerCase() !== address.toLowerCase()
    );
    setActiveStreams([entry, ...list]);
    router.push(`/stream/${address}`);
  };

  const joinStream = () => {
    const a = viewerInput.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(a)) return alert("Enter a valid streamer address.");
    router.push(`/stream/${a}`);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">VoxNitro Lobby</h1>
        <div className="text-sm opacity-70">
          {address ? `Connected: ${address.slice(0,6)}...${address.slice(-4)}` : "Connect in header"}
        </div>
      </div>

      {/* START STREAM */}
      <section className="border rounded-lg p-5 space-y-4">
        <h2 className="text-lg font-semibold">Start Streaming</h2>
        <p className="text-sm opacity-70">Your connected wallet will be your streamer address.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="border rounded px-3 py-2"
            placeholder="Display name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={startStream} disabled={!address}>
            {address ? "Start Stream" : "Connect in header"}
          </Button>
        </div>
        {address && <div className="text-xs opacity-70 break-all">Streamer: {address}</div>}
      </section>

      {/* JOIN STREAM */}
      <section className="border rounded-lg p-5 space-y-4">
        <h2 className="text-lg font-semibold">Join a Stream</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            className="border rounded px-3 py-2 col-span-2"
            placeholder="Paste streamer address (0x...)"
            value={viewerInput}
            onChange={(e) => setViewerInput(e.target.value)}
          />
          <Button onClick={joinStream}>Join</Button>
        </div>

        <div className="mt-3">
          <div className="text-sm font-medium mb-2">Active Streams</div>
          {allStreams.length === 0 ? (
            <div className="text-sm opacity-70">No streams yet. Start one above or paste an address.</div>
          ) : (
            <ul className="space-y-2">
              {allStreams.map((s) => (
                <li key={s.address} className="flex items-center justify-between border rounded px-3 py-2">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs opacity-70 break-all">{s.address}</div>
                  </div>
                  <Button onClick={() => router.push(`/stream/${s.address}`)}>Watch</Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
