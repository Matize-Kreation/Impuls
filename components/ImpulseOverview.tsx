// D:\Matize\Matize-Kreation\Impuls\Impuls-local\components\ImpulseOverview.tsx
"use client"

import React, { useMemo } from "react"
import { useMastersphere } from "./MastersphereContext"
import type { RoomType } from "./types"

const ROOM_LABEL: Record<RoomType, string> = {
    impuls: "Impulsraum (Meta)",
    erde: "Erde – Struktur",
    wasser: "Wasser – Emotion",
    feuer: "Feuer – Wille",
    wind: "Wind – Geist",
    aether: "Äther – Sinn",
}

export default function ImpulseOverview() {
    const { logs, currentRoom, currentZone } = useMastersphere()

    const { total, counts, dominantRoom } = useMemo(() => {
        const base: Record<RoomType, number> = {
            impuls: 0,
            erde: 0,
            wasser: 0,
            feuer: 0,
            wind: 0,
            aether: 0,
        }

        const result = { ...base }

        for (const log of logs) {
            result[log.room] = (result[log.room] ?? 0) + 1
        }

        const entries = Object.entries(result) as [RoomType, number][]
        const totalCount = entries.reduce((sum, [, n]) => sum + n, 0)

        let dominant: RoomType | null = null
        let max = 0
        for (const [room, n] of entries) {
            if (n > max) {
                max = n
                dominant = room
            }
        }

        return {
            total: totalCount,
            counts: result,
            dominantRoom: max > 0 ? dominant : null,
        }
    }, [logs])

    const dominantLabel =
        dominantRoom != null ? ROOM_LABEL[dominantRoom] : "Noch kein dominantes Element"

    return (
        <aside
            className="absolute right-4 top-4 z-40 max-w-xs rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md px-4 py-3 text-xs text-white/85 shadow-lg"
            aria-label="Impuls-Fokusübersicht"
        >
            <div className="flex flex-col gap-1.5">
                <div className="text-[0.7rem] uppercase tracking-[0.18em] text-white/60">
                    Fokuszone · Überblick
                </div>

                <div className="text-sm font-semibold">
                    {total === 0 ? "Noch keine Impulse registriert" : `Impulse gesamt: ${total}`}
                </div>

                {total > 0 && (
                    <>
                        <div className="text-[0.75rem] text-white/75">
                            Dominantes Element:
                            <br />
                            <span className="font-semibold text-white">
                                {dominantLabel}
                            </span>
                        </div>

                        {currentRoom && currentZone && (
                            <div className="text-[0.75rem] text-white/70">
                                Aktiver Kontext:
                                <br />
                                <span className="font-semibold">
                                    Raum: {ROOM_LABEL[currentRoom]}
                                </span>
                                <br />
                                <span className="text-white/80">Zone: {currentZone.toUpperCase()}</span>
                            </div>
                        )}

                        <div className="mt-1.5 grid grid-cols-3 gap-x-3 gap-y-1.5 text-[0.7rem] text-white/60">
                            {(Object.keys(counts) as RoomType[]).map((room) => (
                                <div key={room} className="flex flex-col">
                                    <span className="truncate">{ROOM_LABEL[room]}</span>
                                    <span className="text-white/85">
                                        {counts[room]}×
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </aside>
    )
}
