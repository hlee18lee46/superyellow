// lib/yellow.ts
import { NitroliteClient } from "@erc7824/nitrolite";

export const yellowClient = new NitroliteClient({
  url: "wss://clearnet.yellow.com/ws",
  protocol: "NitroRPC/0.4",
});
