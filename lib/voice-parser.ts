import type { VoiceCommand } from "./types"

export function parseVoiceCommand(transcript: string): VoiceCommand | null {
  const lowerTranscript = transcript.toLowerCase()

  // Buy command pattern
  const buyMatch = lowerTranscript.match(/buy\s+([\d.]+)\s+(\w+)(?:\s+at\s+([\d.]+))?/)
  if (buyMatch) {
    return {
      action: "buy",
      amount: buyMatch[1],
      token: buyMatch[2].toUpperCase(),
      price: buyMatch[3] || "market",
    }
  }

  // Sell command pattern
  const sellMatch = lowerTranscript.match(/sell\s+([\d.]+)\s+(\w+)(?:\s+(?:at|for)\s+([\d.]+))?/)
  if (sellMatch) {
    return {
      action: "sell",
      amount: sellMatch[1],
      token: sellMatch[2].toUpperCase(),
      price: sellMatch[3] || "market",
    }
  }

  // Cancel command pattern
  const cancelMatch = lowerTranscript.match(/cancel\s+order\s+(\w+-\d+)/)
  if (cancelMatch) {
    return {
      action: "cancel",
      orderId: cancelMatch[1],
    }
  }

  // Query commands
  if (lowerTranscript.includes("balance") || lowerTranscript.includes("portfolio")) {
    return { action: "query" }
  }

  return null
}
