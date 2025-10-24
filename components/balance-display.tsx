"use client"

import { Card } from "@/components/ui/card"
import { useState } from "react"

interface Balance {
  token: string
  amount: string
  usdValue: string
}

export function BalanceDisplay() {
  const [balances, setBalances] = useState<Balance[]>([
    { token: "ETH", amount: "2.5", usdValue: "8,750.00" },
    { token: "BTC", amount: "0.15", usdValue: "6,450.00" },
    { token: "USDC", amount: "5,000", usdValue: "5,000.00" },
  ])

  const totalValue = balances.reduce((sum, b) => sum + Number.parseFloat(b.usdValue.replace(",", "")), 0)

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Portfolio Balance</h2>

      <div className="mb-6 rounded-lg bg-secondary p-4">
        <p className="text-xs text-muted-foreground mb-1">Total Value</p>
        <p className="text-3xl font-bold text-primary">
          ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="space-y-3">
        {balances.map((balance) => (
          <div
            key={balance.token}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
          >
            <div>
              <p className="font-semibold text-foreground">{balance.token}</p>
              <p className="text-xs text-muted-foreground">{balance.amount}</p>
            </div>
            <p className="text-sm font-medium text-foreground">${balance.usdValue}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
