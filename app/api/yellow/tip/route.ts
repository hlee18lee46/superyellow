// app/api/yellow/tip/route.ts
import { NextResponse } from "next/server";

type TipBody = {
  channelId: string;
  viewer: `0x${string}`;
  streamer: `0x${string}`;
  treasury: `0x${string}`;
  token: `0x${string}`;
  amount: string;          // "1" | "2" | "3" | "5"
  badge: `0x${string}`;    // LOVE/SMILE/WINK/SUPER address
  message?: string;
};

const store = (globalThis as any).__VN_YELLOW__ ?? { tips: new Map<string, any[]>() };
(globalThis as any).__VN_YELLOW__ = store;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TipBody;
    const { channelId, viewer, streamer, treasury, token, amount, badge, message } = body || {};

    if (!channelId || !viewer || !streamer || !treasury || !token || !amount || !badge) {
      return NextResponse.json({ ok: false, error: "Missing params" }, { status: 400 });
    }

    const tipsArr: any[] = store.tips.get(channelId) ?? [];
    const tip = {
      id: `${channelId}:${Date.now()}`,
      viewer: viewer.toLowerCase(),
      streamer: streamer.toLowerCase(),
      treasury: treasury.toLowerCase(),
      token: token.toLowerCase(),
      amount,                 // PYUSD units (human, e.g. "1")
      badge: badge.toLowerCase(),
      message: message ?? "",
      ts: Date.now(),
      status: "offchain",     // instant UX
    };
    tipsArr.push(tip);
    store.tips.set(channelId, tipsArr);

    return NextResponse.json({ ok: true, tip });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}