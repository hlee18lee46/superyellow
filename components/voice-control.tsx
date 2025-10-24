"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Volume2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type VoiceState = "idle" | "listening" | "processing" | "speaking"

export function VoiceControl() {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle")
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        await processAudio(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setVoiceState("listening")
    } catch (error) {
      console.error("Failed to start recording:", error)
      alert("Please allow microphone access to use voice commands")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setVoiceState("processing")
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Send audio to backend for processing
      const formData = new FormData()
      formData.append("audio", audioBlob)

      const response = await fetch("/api/voice/process", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setTranscript(data.transcript)
      setResponse(data.response)

      // Play response audio if available
      if (data.audioUrl) {
        setVoiceState("speaking")
        const audio = new Audio(data.audioUrl)
        audio.onended = () => setVoiceState("idle")
        await audio.play()
      } else {
        setVoiceState("idle")
      }
    } catch (error) {
      console.error("Failed to process audio:", error)
      setVoiceState("idle")
      setResponse("Failed to process voice command. Please try again.")
    }
  }

  const getStateColor = () => {
    switch (voiceState) {
      case "listening":
        return "border-primary"
      case "processing":
        return "border-chart-2"
      case "speaking":
        return "border-chart-3"
      default:
        return "border-border"
    }
  }

  const getStateText = () => {
    switch (voiceState) {
      case "listening":
        return "Listening..."
      case "processing":
        return "Processing command..."
      case "speaking":
        return "Speaking response..."
      default:
        return "Ready for voice command"
    }
  }

  return (
    <Card className={cn("p-8 transition-colors", getStateColor())}>
      <div className="space-y-6">
        {/* Voice Status */}
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div
              className={cn(
                "relative flex h-32 w-32 items-center justify-center rounded-full transition-all",
                voiceState === "listening" && "animate-pulse bg-primary/20",
                voiceState === "processing" && "animate-spin bg-chart-2/20",
                voiceState === "speaking" && "animate-pulse bg-chart-3/20",
                voiceState === "idle" && "bg-muted",
              )}
            >
              {voiceState === "listening" && <Mic className="h-12 w-12 text-primary" />}
              {voiceState === "processing" && <Loader2 className="h-12 w-12 text-chart-2" />}
              {voiceState === "speaking" && <Volume2 className="h-12 w-12 text-chart-3" />}
              {voiceState === "idle" && <MicOff className="h-12 w-12 text-muted-foreground" />}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">Voice Trading</h2>
          <p className="text-sm text-muted-foreground">{getStateText()}</p>
        </div>

        {/* Control Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={voiceState === "processing" || voiceState === "speaking"}
            className={cn("gap-2 px-8", isRecording && "bg-destructive hover:bg-destructive/90")}
          >
            {isRecording ? (
              <>
                <MicOff className="h-5 w-5" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                Start Voice Command
              </>
            )}
          </Button>
        </div>

        {/* Transcript and Response */}
        {(transcript || response) && (
          <div className="space-y-4 rounded-lg bg-secondary p-4">
            {transcript && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">You said:</p>
                <p className="text-sm text-foreground">{transcript}</p>
              </div>
            )}
            {response && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">VoxNitro:</p>
                <p className="text-sm text-foreground">{response}</p>
              </div>
            )}
          </div>
        )}

        {/* Example Commands */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Example Commands:</h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>{"Buy 0.5 ETH at market price"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>{"Sell 100 USDC for BTC at 45000"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>{"What's my current balance?"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>{"Show my open orders"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>{"Cancel order 12345"}</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
