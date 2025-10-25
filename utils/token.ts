// utils/token.ts
import { publicClient } from "@/lib/viem";
import { erc20Abi } from "@/types/abi";

export async function getTokenDecimals(token: `0x${string}`): Promise<number> {
  try {
    return (await publicClient.readContract({
      address: token,
      abi: erc20Abi,
      functionName: "decimals",
    })) as number;
  } catch {
    // Fallback for stablecoins like PYUSD/USDC if decimals() is non-standard on a mock
    return 6;
  }
}