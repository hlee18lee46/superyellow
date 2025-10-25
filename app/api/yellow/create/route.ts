// app/api/yellow/create/route.ts
import { NextResponse } from "next/server";

type CreateBody = {
  viewer: `0x${string}`;
  treasury: `0x${string}`;
  token: `0x${string}`;
  deposit?: string; // off-chain allowance demo
};

// simple in-memory store (per dev server)
const store = (globalThis as any).__VN_YELLOW__ ?? { tips: new Map<string, any[]>() };
(globalThis as any).__VN_YELLOW__ = store;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateBody;

    if (!body?.viewer || !body?.treasury || !body?.token) {
      return NextResponse.json({ ok: false, error: "Missing params" }, { status: 400 });
    }

    // Derive a stable “channel id” per viewer for the demo
    const channelId = `vn-${body.viewer.toLowerCase()}`;

    if (!store.tips.has(channelId)) store.tips.set(channelId, []);

    return NextResponse.json({ ok: true, channelId });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}