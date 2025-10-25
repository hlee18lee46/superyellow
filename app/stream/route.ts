// app/api/streams/route.ts
import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { streamRegistryAbi } from "@/types/registryAbi";
import { ADDR } from "@/lib/addresses";

const RPC =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC ||
  process.env.NEXT_PUBLIC_RPC ||
  "https://sepolia.infura.io/v3/<YOUR_KEY>";

export async function GET() {
  try {
    const pc = createPublicClient({ chain: sepolia, transport: http(RPC) });

    const data = (await pc.readContract({
      address: ADDR.REGISTRY,
      abi: streamRegistryAbi,
      functionName: "getActiveStreams",
      args: [],
    })) as any[];

    const streams = data.map((s: any) => ({
      streamer: s.streamer as `0x${string}`,
      name: s.name as string,
      url: s.url as string,
      active: s.active as boolean,
    }));

    return NextResponse.json({ streams });
  } catch (e) {
    console.error("GET /api/streams error:", e);
    return NextResponse.json({ streams: [] });
  }
}