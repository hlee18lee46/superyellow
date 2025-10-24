// components/BadgeCard.tsx
"use client";
type Props = {
  label: string;
  addressKey: `0x${string}`;
  rate?: string;                  // e.g. "1", "2", "3", "5" as PYUSD
  tiers: string[];                // ["1","2","3","5"] etc
  loadingKey: string | null;
  onClickTier: (tier: string) => void;
  currencyLabel?: string;         // <-- NEW
};

export default function BadgeCard({
  label,
  addressKey,
  rate,
  tiers,
  loadingKey,
  onClickTier,
  currencyLabel = "PYUSD",        // default to PYUSD
}: Props) {
  const isLoading = (t: string) => loadingKey === `${addressKey}:${t}`;

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="text-lg font-semibold">{label}</div>
      {rate && (
        <div className="text-xs opacity-70">
          Rate: {rate} {currencyLabel} → ... {label}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {tiers.map((t) => (
          <button
            key={t}
            onClick={() => onClickTier(t)}
            disabled={isLoading(t)}
            className="border rounded px-3 py-2 text-sm hover:bg-accent disabled:opacity-60"
          >
            {isLoading(t) ? "Sending..." : `${t} ${currencyLabel}`}
          </button>
        ))}
      </div>
    </div>
  );
}
