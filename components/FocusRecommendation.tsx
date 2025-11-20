// D:\Matize\Matize-Kreation\Impuls\Impuls-local\components\FocusRecommendation.tsx
"use client"

import React from "react"
import { useMastersphere } from "./MastersphereContext"
import { evaluateFocus } from "../lib/focus-evaluator"

export default function FocusRecommendation() {
    const { logs, currentRoom, currentZone } = useMastersphere()
    const summary = evaluateFocus(logs, currentRoom, currentZone)

    return (
        <section
            aria-label="Fokus-Empfehlung"
            className="absolute left-4 bottom-4 z-40 max-w-sm rounded-2xl border border-white/10 bg-black/55 backdrop-blur-md px-4 py-3 text-xs text-white/85 shadow-lg"
        >
            <div className="flex flex-col gap-1.5">
                <div className="text-[0.7rem] uppercase tracking-[0.18em] text-white/60">
                    Fokuszone · Empfehlung
                </div>

                <div className="text-[0.8rem] text-white/85 leading-relaxed whitespace-pre-line">
                    {summary.recommendation}
                </div>
            </div>
        </section>
    )
}
