// D:\Matize\Matize-Kreation\Impuls\Impuls-local\components\KICompanion.tsx
"use client"

import React, { useState, KeyboardEvent } from "react"
import type { RoomType } from "./types"
import { useMastersphere } from "./MastersphereContext"

interface KICompanionProps {
  mode: RoomType
  isVisible?: boolean
  onToggle?: (visible: boolean) => void
}

const prompts: Record<
  RoomType,
  {
    welcome: string
    reflection: string
    impulse: string
    color: string
    hoverColor: string
  }
> = {
  aether: {
    welcome: "Willkommen im Raum Äther. Was verbindet dich?",
    reflection: "Welche Visionen spürst du?",
    impulse: "Welchen Impuls möchtest du manifestieren?",
    color: "from-purple-600/80 to-pink-500/80",
    hoverColor: "hover:from-purple-500/80 hover:to-pink-400/80",
  },
  erde: {
    welcome: "Willkommen im Raum Erde. Was trägt dich heute?",
    reflection: "Welche Wurzeln spürst du gerade?",
    impulse: "Was möchtest du säen?",
    color: "from-green-600/80 to-emerald-700/80",
    hoverColor: "hover:from-green-500/80 hover:to-emerald-600/80",
  },
  wasser: {
    welcome: "Willkommen im Raum Wasser. Welche Strömungen spürst du?",
    reflection: "Was fließt gerade in dir?",
    impulse: "Welchem Impuls möchtest du folgen?",
    color: "from-cyan-600/80 to-blue-500/80",
    hoverColor: "hover:from-cyan-500/80 hover:to-blue-400/80",
  },
  feuer: {
    welcome: "Willkommen im Raum Feuer. Was entflammt dein Herz?",
    reflection: "Welche Leidenschaft spürst du?",
    impulse: "Welches Feuer möchtest du entfachen?",
    color: "from-red-600/80 to-orange-500/80",
    hoverColor: "hover:from-red-500/80 hover:to-orange-400/80",
  },
  wind: {
    welcome: "Willkommen im Raum Wind. Welche Gedanken schweben?",
    reflection: "Wohin trägt dich der Wind?",
    impulse: "Welchem Impuls möchtest du folgen?",
    color: "from-sky-600/80 to-indigo-500/80",
    hoverColor: "hover:from-sky-500/80 hover:to-indigo-400/80",
  },
  impuls: {
    welcome: "Willkommen im Impuls-Raum. Welcher Impuls ruft dich?",
    reflection: "Was bewegt dich in diesem Moment?",
    impulse: "Welchen Raum möchtest du betreten?",
    color: "from-blue-600/80 to-purple-700/80",
    hoverColor: "hover:from-blue-500/80 hover:to-purple-600/80",
  },
}

export default function KICompanion({
  mode,
  isVisible = true,
  onToggle,
}: KICompanionProps) {
  const [localVisible, setLocalVisible] = useState(isVisible)
  const [reflection, setReflection] = useState("")
  const { registerImpulse } = useMastersphere()

  const currentPrompts = prompts[mode]
  const visible = onToggle ? isVisible : localVisible

  const handleToggle = () => {
    const newVisible = !visible
    onToggle ? onToggle(newVisible) : setLocalVisible(newVisible)
  }

  // === Impuls senden: Enter + Button ===
  const sendImpulse = () => {
    const text = reflection.trim()
    if (!text) return

    console.log("[KICompanion] Sende Impuls:", { mode, text })
    registerImpulse(mode, text)
    setReflection("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendImpulse()
    }
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-2 max-w-md w-full px-2">
      {!onToggle && (
        <button
          onClick={handleToggle}
          className="px-4 py-2 bg-white/10 text-white/80 rounded-full backdrop-blur-md"
        >
          {visible ? "Begleiter verbergen" : "Begleiter öffnen"}
        </button>
      )}

      {visible && (
        <div className="w-full bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col space-y-3 animate-in slide-in-from-top duration-300">
          <p className="text-white/90 text-sm">{currentPrompts.welcome}</p>

          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentPrompts.reflection}
            className="w-full h-20 bg-white/5 rounded-lg p-2 text-white/90 resize-none focus:outline-none focus:ring-2 focus:ring-white/30"
          />

          <button
            type="button"
            onClick={sendImpulse}
            className={`w-full py-2 rounded-lg bg-gradient-to-r ${currentPrompts.color} ${currentPrompts.hoverColor} text-white font-semibold`}
          >
            {currentPrompts.impulse}
          </button>
        </div>
      )}
    </div>
  )
}
