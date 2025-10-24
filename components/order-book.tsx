"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { TrendingUp, TrendingDown, X } from "lucide-react"

interface Order {
  id: string
  type: "buy" | "sell"
  pair: string
  amount: string
  price: string
  status: "pending" | "filled" | "cancelled"
  timestamp: string
}

export function OrderBook() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      type: "buy",
      pair: "ETH/USDC",
      amount: "0.5",
      price: "3,500.00",
      status: "filled",
      timestamp: "2 min ago",
    },
    {
      id: "ORD-002",
      type: "sell",
      pair: "BTC/USDC",
      amount: "0.05",
      price: "43,000.00",
      status: "pending",
      timestamp: "5 min ago",
    },
  ])

  const cancelOrder = (orderId: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "cancelled" as const } : order)))
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Order History</h2>
        <Badge variant="secondary" className="font-mono">
          {orders.length} orders
        </Badge>
      </div>

      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No orders yet. Use voice commands to start trading.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    order.type === "buy" ? "bg-chart-2/20" : "bg-destructive/20"
                  }`}
                >
                  {order.type === "buy" ? (
                    <TrendingUp className="h-5 w-5 text-chart-2" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground">{order.pair}</p>
                    <Badge
                      variant={
                        order.status === "filled" ? "default" : order.status === "pending" ? "secondary" : "destructive"
                      }
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {order.type.toUpperCase()} {order.amount} @ ${order.price}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-mono text-xs text-muted-foreground mb-1">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.timestamp}</p>
                </div>

                {order.status === "pending" && (
                  <Button size="sm" variant="ghost" onClick={() => cancelOrder(order.id)} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
