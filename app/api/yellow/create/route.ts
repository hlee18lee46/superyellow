// app/api/yellow/create/route.ts
import { NitroliteClient } from "@erc7824/nitrolite";

const client = new NitroliteClient({ url: "wss://clearnet.yellow.com/ws" });

export async function POST(req: Request) {
  const { viewer, treasury, token, deposit } = await req.json();

  const channel = {
    participants: [viewer, treasury],
    adjudicator: "0x0000000000000000000000000000000000000000",
    challenge: 3600,
    nonce: Date.now(),
  };

  const state = {
    intent: "INITIALIZE",
    version: 0,
    data: "",
    allocations: [
      { destination: viewer, token, amount: deposit },
      { destination: treasury, token, amount: "0" },
    ],
  };

  const channelId = await client.createChannel(channel, state);
  return Response.json({ channelId });
}
