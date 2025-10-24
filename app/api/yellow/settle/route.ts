// app/api/yellow/settle/route.ts
import { NitroliteClient } from "@erc7824/nitrolite";

const client = new NitroliteClient({
  url: process.env.NEXT_PUBLIC_YELLOW_CLEARNODE!,
  protocol: "NitroRPC/0.4",
  privateKey: process.env.YELLOW_APP_PRIVATE_KEY!,
});

export async function POST(req: Request) {
  try {
    const { channelId } = await req.json();

    const latest = await client.getLatestState(channelId);
    latest.intent = "FINALIZE";

    // 1️⃣ Close channel cooperatively
    await client.closeChannel(channelId, latest);

    // 2️⃣ Withdraw funds on-chain to treasury
    const treasuryDest = latest.allocations[1];
    await client.withdraw({
      channelId,
      destination: treasuryDest.destination,
      token: treasuryDest.token,
      amount: treasuryDest.amount,
    });

    return Response.json({ ok: true, channelId });
  } catch (err: any) {
    console.error("❌ Yellow settle error:", err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
