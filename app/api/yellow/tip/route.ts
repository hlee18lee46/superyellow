// app/api/yellow/tip/route.ts
import { NitroliteClient } from "@erc7824/nitrolite";

const client = new NitroliteClient({
  url: process.env.NEXT_PUBLIC_YELLOW_CLEARNODE!,
  protocol: "NitroRPC/0.4",
  privateKey: process.env.YELLOW_APP_PRIVATE_KEY!,
});

export async function POST(req: Request) {
  try {
    const { channelId, viewer, treasury, token, amount, badge, message } = await req.json();

    // Fetch the previous (latest) channel state
    const prevState = await client.getLatestState(channelId);

    // Create new off-chain state
    const newState = {
      intent: "OPERATE",
      version: prevState.version + 1,
      data: JSON.stringify({
        type: "tip",
        badge,
        message,
        timestamp: Date.now(),
      }),
      allocations: [
        {
          destination: viewer,
          token,
          amount: (
            BigInt(prevState.allocations[0].amount) - BigInt(amount)
          ).toString(),
        },
        {
          destination: treasury,
          token,
          amount: (
            BigInt(prevState.allocations[1].amount) + BigInt(amount)
          ).toString(),
        },
      ],
    };

    await client.updateState(channelId, newState);

    return Response.json({
      ok: true,
      channelId,
      version: newState.version,
      allocations: newState.allocations,
    });
  } catch (err: any) {
    console.error("❌ Yellow tip error:", err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
