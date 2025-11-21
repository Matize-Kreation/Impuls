// components/MastersphereKiDiagnosePanel.tsx

"use client"

import React, { useState, useMemo } from "react"
import { useMastersphere } from "./MastersphereContext"
import type { ImpulsLogAtom, MastersphereZone } from "./MastersphereTypes"

type ChronikLevel = "mikro" | "meso" | "makro" | "kanon"

type ArchivRoomId =
    | "NULL_CODE_SAAL"
    | "RESONANZ_SCHACHT"
    | "SPHAEREN_SAELLE"
    | "ZEITSPEICHER_GALERIE"
    | "SCHATTEN_SAFE"
    | "FREQUENZ_BIBLIOTHEK"

type ExtendedImpulsLog = ImpulsLogAtom & {
    meta?: {
        deltaF?: number
        f0Distance?: number
        archivRoom?: ArchivRoomId | null
        chronik?: {
            level?: ChronikLevel
        }
    }
}

interface MastersphereSummary {
    total: number
    deltaF: {
        avg: number
        min: number
        max: number
        count: number
    }
    zones: Record<MastersphereZone, number>
    archiv: Record<string, number>
    chronik: Record<string, number>
    lastImpuls?: {
        timestamp: string
        room: string
        zone: MastersphereZone
        deltaF?: number | null
        archivRoom?: ArchivRoomId | null
        chronikLevel?: ChronikLevel | null
    }
}

export const MastersphereKiDiagnosePanel: React.FC = () => {
    const { logs } = useMastersphere()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<string | null>(null)

    const summary = useMemo<MastersphereSummary | null>(() => {
        if (!logs || logs.length === 0) return null

        const zoneCounts: Record<MastersphereZone, number> = {
            struktur: 0,
            emotion: 0,
            wille: 0,
            geist: 0,
            sinn: 0,
            meta: 0,
        }

        const archivCounts: Record<string, number> = {}
        const chronikCounts: Record<string, number> = {}

        let sumDeltaF = 0
        let minDeltaF = Number.POSITIVE_INFINITY
        let maxDeltaF = Number.NEGATIVE_INFINITY
        let countedDelta = 0

        for (const raw of logs) {
            const log = raw as ExtendedImpulsLog

            // Zonen-Verteilung
            if (log.zone) {
                zoneCounts[log.zone] = (zoneCounts[log.zone] ?? 0) + 1
            }

            // ΔF / Archiv / Chronik nur, wenn Meta existiert
            const df = log.meta?.deltaF
            if (typeof df === "number") {
                sumDeltaF += df
                countedDelta++
                if (df < minDeltaF) minDeltaF = df
                if (df > maxDeltaF) maxDeltaF = df

                const ar = log.meta?.archivRoom ?? "UNGESETZT"
                archivCounts[ar] = (archivCounts[ar] ?? 0) + 1

                const lvl = log.meta?.chronik?.level ?? "UNGESETZT"
                chronikCounts[lvl] = (chronikCounts[lvl] ?? 0) + 1
            }
        }

        const avgDeltaF = countedDelta > 0 ? sumDeltaF / countedDelta : 0

        const lastRaw = logs[logs.length - 1] as ExtendedImpulsLog
        const lastImpuls = lastRaw
            ? {
                timestamp: lastRaw.timestamp,
                room: lastRaw.room,
                zone: lastRaw.zone,
                deltaF: lastRaw.meta?.deltaF ?? null,
                archivRoom: lastRaw.meta?.archivRoom ?? null,
                chronikLevel: lastRaw.meta?.chronik?.level ?? null,
            }
            : undefined

        return {
            total: logs.length,
            deltaF: {
                avg: avgDeltaF,
                min: countedDelta > 0 ? minDeltaF : 0,
                max: countedDelta > 0 ? maxDeltaF : 0,
                count: countedDelta,
            },
            zones: zoneCounts,
            archiv: archivCounts,
            chronik: chronikCounts,
            lastImpuls,
        }
    }, [logs])

    const handleDiagnose = async () => {
        try {
            setLoading(true)
            setError(null)
            setResult(null)

            if (!summary) {
                setError("Keine Impulse vorhanden – die KI kann nichts analysieren.")
                return
            }

            const res = await fetch("/api/impuls-diagnose", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ summary }),
            })

            const json = await res.json()

            if (!json.ok) {
                setError(json.error ?? "Unbekannter Fehler der Diagnose-API.")
                return
            }

            setResult(json.diagnosis ?? "(Keine Diagnose erhalten)")
        } catch (e: any) {
            setError(e?.message ?? "Fehler beim Abruf der KI-Diagnose.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-2 rounded-2xl border border-white/10 bg-black/80 p-4 text-xs text-white/85">
            <div className="flex items-center justify-between gap-2">
                <div>
                    <div className="text-[0.7rem] uppercase tracking-[0.18em] text-white/50">
                        Mastersphäre · KI-Diagnose
                    </div>
                    <div className="text-[0.8rem] text-white/75">
                        Sende den aktuellen Zustand an den V5.0-Kern (ChatGPT).
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleDiagnose}
                    disabled={loading}
                    className="rounded-full border border-white/25 px-3 py-1 text-[0.75rem] font-semibold text-white hover:border-white hover:bg-white/10 disabled:opacity-50"
                >
                    {loading ? "Analysiere…" : "KI-Diagnose starten"}
                </button>
            </div>

            {error && (
                <div className="mt-1 text-[0.7rem] text-red-400">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-2 rounded-lg bg-white/5 p-3 text-[0.75rem] whitespace-pre-wrap text-white/90">
                    {result}
                </div>
            )}
        </div>
    )
}
