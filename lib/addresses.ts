// lib/addresses.ts
function must<T extends string>(v: T | undefined, name: string): T {
  if (!v || v === ("" as any)) throw new Error(`Missing env var: ${name}`);
  return v as T;
}

export const ADDR = {
  REGISTRY: process.env.NEXT_PUBLIC_STREAM_REGISTRY as `0x${string}`,
  PYUSD: must(process.env.NEXT_PUBLIC_PYUSD as `0x${string}` | undefined, "NEXT_PUBLIC_PYUSD"),
  LOVE:  must(process.env.NEXT_PUBLIC_LOVE  as `0x${string}` | undefined, "NEXT_PUBLIC_LOVE"),
  SMILE: must(process.env.NEXT_PUBLIC_SMILE as `0x${string}` | undefined, "NEXT_PUBLIC_SMILE"),
  WINK:  must(process.env.NEXT_PUBLIC_WINK  as `0x${string}` | undefined, "NEXT_PUBLIC_WINK"),
  SUPER: must(process.env.NEXT_PUBLIC_SUPER as `0x${string}` | undefined, "NEXT_PUBLIC_SUPER"),
  ROUTER: must(process.env.NEXT_PUBLIC_TIP_ROUTER as `0x${string}` | undefined, "NEXT_PUBLIC_TIP_ROUTER"),
  STREAMER: process.env.NEXT_PUBLIC_STREAMER as `0x${string}` | undefined, // optional
};

export const BADGES: { label: string; addr: `0x${string}`; price: number }[] = [
  { label: "❤️ LOVE",  addr: ADDR.LOVE,  price: 1 },
  { label: "😄 SMILE", addr: ADDR.SMILE, price: 2 },
  { label: "😉 WINK",  addr: ADDR.WINK,  price: 3 },
  { label: "💎 SUPER", addr: ADDR.SUPER, price: 5 },
];

export const TIERS = ["1", "2", "3", "5"]; // PYUSD prices
export const CURRENCY_LABEL = "PYUSD";
