// lib/addresses.ts
export const ADDR = {
  YUSD:  process.env.NEXT_PUBLIC_YUSD as `0x${string}`,
  LOVE:  process.env.NEXT_PUBLIC_LOVE as `0x${string}`,
  SMILE: process.env.NEXT_PUBLIC_SMILE as `0x${string}`,
  WINK:  process.env.NEXT_PUBLIC_WINK as `0x${string}`,
  SUPER: process.env.NEXT_PUBLIC_SUPER as `0x${string}`,
  ROUTER: process.env.NEXT_PUBLIC_TIP_ROUTER as `0x${string}`,
  STREAMER: process.env.NEXT_PUBLIC_STREAMER as `0x${string}`,
};

export const BADGES: { label: string; addr: `0x${string}`; price: number }[] = [
  { label: "❤️ LOVE",  addr: ADDR.LOVE,  price: 1 },
  { label: "😄 SMILE", addr: ADDR.SMILE, price: 2 },
  { label: "😉 WINK",  addr: ADDR.WINK,  price: 3 },
  { label: "💎 SUPER", addr: ADDR.SUPER, price: 5 },
];

export const TIERS = ["1", "2", "3", "5"]; // PYUSD prices

