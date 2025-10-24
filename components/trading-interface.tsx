"use client"

import { VoiceControl } from "@/components/voice-control"
import { OrderBook } from "@/components/order-book"
import { SessionStatus } from "@/components/session-status"
import { BalanceDisplay } from "@/components/balance-display"

export function TradingInterface() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Voice Control - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <VoiceControl />
        </div>

        {/* Sidebar - Balance and Session */}
        <div className="space-y-6">
          <BalanceDisplay />
          <SessionStatus />
        </div>

        {/* Order Book - Full width */}
        <div className="lg:col-span-3">
          <OrderBook />
        </div>
      </div>
    </div>
  )
}
