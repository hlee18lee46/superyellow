"use client";
import { useMemo } from "react";

type Props = {
  label: string;
  rate: string | undefined;             // tokens per 1 YUSD
  onClickTier: (tierYusd: string) => void;
  loadingKey: string | null;
  addressKey: string;                    // unique id (address)
  tiers?: string[];                      // default 1/2/3/5
};

export default function BadgeCard({ label, rate, onClickTier, loadingKey, addressKey, tiers = ["1","2","3","5"] }: Props) {
  const isLoading = (tier: string) => loadingKey === `${addressKey}:${tier}`;
  const title = useMemo(()=>label, [label]);

  return (
    <div className="border rounded p-3 flex flex-col gap-2">
      <div className="font-semibold">{title}</div>
      <div className="text-xs opacity-70">Rate: 1 YUSD → {rate ?? "..."} {label}</div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {tiers.map(tier => (
          <button
            key={tier}
            disabled={isLoading(tier)}
            onClick={()=>onClickTier(tier)}
            className="px-2 py-2 rounded border hover:bg-indigo-50 disabled:opacity-50"
          >
            {isLoading(tier) ? "Sending…" : `${tier} YUSD`}
          </button>
        ))}
      </div>
    </div>
  );
}
