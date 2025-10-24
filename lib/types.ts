export interface VoiceCommand {
  action: "buy" | "sell" | "cancel" | "query"
  token?: string
  amount?: string
  price?: string
  orderId?: string
}

export interface TradingSession {
  sessionId: string
  status: "active" | "expired" | "closed"
  expiresAt: string
  createdAt: string
}

export interface Order {
  id: string
  sessionId: string
  type: "buy" | "sell"
  pair: string
  amount: string
  price: string
  status: "pending" | "filled" | "cancelled"
  timestamp: string
}

export interface Balance {
  token: string
  amount: string
  locked: string
  available: string
}
