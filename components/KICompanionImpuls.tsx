// D:\Matize\Matize-Kreation\Impuls\Impuls-local\components\KICompanionImpuls.tsx
"use client"

import { useState } from "react"
import { useMastersphere } from "./MastersphereContext"

interface Props {
    isVisible: boolean
    onToggle: (visible: boolean) => void
}

export default function KICompanionImpuls({ isVisible, onToggle }: Props) {
    const [reflection, setReflection] = useState("")
    const { currentRoom, currentZone } = useMastersphere()

    return (
        <div className="absolute top-4 left-4 z-30 flex flex-row space-x-2 max-w-md">
            {isVisible && (
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 animate-in slide-in-from-left duration-300 flex flex-row items-center">
                    <p className="text-white/90 text-sm">
                        {!currentRoom || !currentZone
                            ? "Willkommen im Impulsraum! Welcher Impuls ruft dich?"
                            : `Aktiver Raum: ${currentRoom.toUpperCase()} – Zone: ${currentZone.toUpperCase()}. Beobachte, welche Impulse sich wiederholen.`}
                    </p>
                </div>
            )}
        </div>
    )
}
