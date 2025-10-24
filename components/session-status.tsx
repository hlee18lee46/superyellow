"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Activity, Clock, CheckCircle2, XCircle } from "lucide-react"

type SessionState = "inactive" | "active" | "expired"

export function SessionStatus() {
  const [sessionState, setSessionState] = useState<SessionState>("inactive")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [expiresIn, setExpiresIn] = useState<string>("--:--")

  const startSession = async () => {
    try {
      const response = await fetch("/api/session/start", {
        method: "POST",
      })
      const data = await response.json()
      setSessionState("active")
      setSessionId(data.sessionId)
      setExpiresIn("29:59")
    } catch (error) {
      console.error("Failed to start session:", error)
    }
  }

  const endSession = async () => {
    try {
      await fetch("/api/session/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
      setSessionState("inactive")
      setSessionId(null)
      setExpiresIn("--:--")
    } catch (error) {
      console.error("Failed to end session:", error)
    }
  }

  const getStatusIcon = () => {
    switch (sessionState) {
      case "active":
        return <CheckCircle2 className="h-5 w-5 text-chart-2" />
      case "expired":
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusText = () => {
    switch (sessionState) {
      case "active":
        return "Active"
      case "expired":
        return "Expired"
      default:
        return "Inactive"
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Trading Session</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium text-foreground">{getStatusText()}</span>
          </div>
          {sessionState === "active" && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {expiresIn}
            </div>
          )}
        </div>

        {sessionId && (
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground mb-1">Session ID</p>
            <p className="font-mono text-xs text-foreground break-all">{sessionId}</p>
          </div>
        )}

        <Button
          onClick={sessionState === "active" ? endSession : startSession}
          className="w-full"
          variant={sessionState === "active" ? "destructive" : "default"}
        >
          {sessionState === "active" ? "End Session" : "Start New Session"}
        </Button>

        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">
            Sessions last 30 minutes. Start a session to begin trading with voice commands.
          </p>
        </div>
      </div>
    </Card>
  )
}
