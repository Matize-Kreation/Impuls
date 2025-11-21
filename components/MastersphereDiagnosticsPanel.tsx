// components/MastersphereDiagnosticsPanel.tsx

"use client"

import React, { useMemo } from "react"
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

const ZONE_LABEL: Record<MastersphereZone, string> = {
    struktur: "Erde · Struktur",
    emotion: "Wasser · Emotion",
    wille: "Feuer · Wille",
    geist: "Wind · Geist",
    sinn: "Äther · Sinn",
    meta: "Impulsraum · Meta",
}

const ARCHIV_LABEL: Record<ArchivRoomId, string> = {
    NULL_CODE_SAAL: "Null-Code-Saal",
    RESONANZ_SCHACHT: "Resonanz-Schacht",
    SPHAEREN_SAELLE: "Sphären-Säle",
    ZEITSPEICHER_GALERIE: "Zeitspeicher-Galerie",
    SCHATTEN_SAFE: "Schatten-Safe",
    FREQUENZ_BIBLIOTHEK: "Frequenz-Bibliothek",
}

const CHRONIK_LABEL: Record<ChronikLevel, string> = {
    mikro: "Mikro",
    meso: "Meso",
    makro: "Makro",
    kanon: "Kanon",
}

export const MastersphereDiagnosticsPanel: React.FC = () => {
    const { logs } = useMastersphere()

    const stats = useMemo(() => {
        if (!logs || logs.length === 0) {
            return {
                total: 0,
                deltaF: {
                    avg: 0,
                    min: 0,
                    max: 0,
                    count: 0,
                },
                zones: {} as Record<MastersphereZone, number>,
                archiv: {} as Record<string, number>,
                chronik: {} as Record<string, number>,
                dominantZone: null as MastersphereZone | null,
                dominantArchiv: "-",
                dominantChronik: "-",
            }
        }

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

            // Zonen-Statistik
            if (log.zone) {
                zoneCounts[log.zone] = (zoneCounts[log.zone] ?? 0) + 1
            }

            // ΔF-Statistik
            const df = log.meta?.deltaF
            if (typeof df === "number") {
                sumDeltaF += df
                countedDelta++
                if (df < minDeltaF) minDeltaF = df
                if (df > maxDeltaF) maxDeltaF = df

                // Archivraum
                const ar = log.meta?.archivRoom ?? "UNGESETZT"
                archivCounts[ar] = (archivCounts[ar] ?? 0) + 1

                // Chronik
                const lvl = log.meta?.chronik?.level ?? "UNGESETZT"
                chronikCounts[lvl] = (chronikCounts[lvl] ?? 0) + 1
            }
        }

        const avgDeltaF = countedDelta > 0 ? sumDeltaF / countedDelta : 0

        // dominante Zone
        let dominantZone: MastersphereZone | null = null
        let maxZoneCount = 0
        for (const [z, c] of Object.entries(zoneCounts) as [MastersphereZone, number][]) {
            if (c > maxZoneCount) {
                maxZoneCount = c
                dominantZone = z
            }
        }

        // dominanter Archivraum
        let dominantArchiv = "-"
        let maxArchiv = 0
        for (const [key, val] of Object.entries(archivCounts)) {
            if (val > maxArchiv) {
                maxArchiv = val
                dominantArchiv = key
            }
        }

        // dominantes Chronik-Level
        let dominantChronik = "-"
        let maxChronik = 0
        for (const [key, val] of Object.entries(chronikCounts)) {
            if (val > maxChronik) {
                maxChronik = val
                dominantChronik = key
            }
        }

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
            dominantZone,
            dominantArchiv,
            dominantChronik,
        }
    }, [logs])

    if (stats.total === 0) {
        return (
            <div className="rounded-xl border border-neutral-800 bg-black/70 p-3 text-xs text-neutral-300">
                <div className="mb-1 text-[0.7rem] uppercase tracking-[0.16em] text-neutral-500">
                    Mastersphäre · Diagnose
                </div>
                <div>Noch keine Impulse für eine Diagnose vorhanden.</div>
            </div>
        )
    }

    const {
        total,
        deltaF,
        zones,
        archiv,
        chronik,
        dominantZone,
        dominantArchiv,
        dominantChronik,
    } = stats

    const dominantZoneLabel =
        dominantZone != null ? ZONE_LABEL[dominantZone] : "–"

    const dominantArchivLabel =
        dominantArchiv in ARCHIV_LABEL
            ? ARCHIV_LABEL[dominantArchiv as ArchivRoomId]
            : dominantArchiv

    const dominantChronikLabel =
        dominantChronik in CHRONIK_LABEL
            ? CHRONIK_LABEL[dominantChronik as ChronikLevel]
            : dominantChronik

    // Einfacher qualitativer Spannungsindikator
    let spannungsLabel = "neutral"
    const avg = deltaF.avg
    if (avg < 0.3) spannungsLabel = "sehr ruhig"
    else if (avg < 0.5) spannungsLabel = "ruhig"
    else if (avg < 0.7) spannungsLabel = "aktiv"
    else spannungsLabel = "hochdynamisch"

    return (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-black/70 p-4 text-xs text-white/85">
            <div className="flex items-center justify-between gap-2">
                <div>
                    <div className="text-[0.7rem] uppercase tracking-[0.18em] text-white/50">
                        Mastersphäre · Diagnose
                    </div>
                    <div className="text-sm font-semibold text-white">
                        {total} Impulse analysiert
                    </div>
                </div>
                <div className="text-right text-[0.7rem] text-white/60">
                    ΔF-Ø:{" "}
                    <span className="font-semibold text-white">
                        {deltaF.avg.toFixed(3)}
                    </span>
                    <br />
                    <span className="text-white/70">{spannungsLabel}</span>
                </div>
            </div>

            {/* ΔF-Range */}
            <div className="text-[0.7rem] text-white/65">
                ΔF-Spanne:{" "}
                <span className="font-mono text-white">
                    {deltaF.min.toFixed(3)} – {deltaF.max.toFixed(3)}
                </span>{" "}
                ({deltaF.count}× mit ΔF-Wert)
            </div>

            {/* Dominanzen */}
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                <div className="rounded-lg bg-white/5 px-3 py-2">
                    <div className="text-[0.65rem] uppercase tracking-[0.14em] text-white/50">
                        Dominante Zone
                    </div>
                    <div className="mt-0.5 text-[0.8rem] font-semibold text-white">
                        {dominantZoneLabel}
                    </div>
                </div>
                <div className="rounded-lg bg-white/5 px-3 py-2">
                    <div className="text-[0.65rem] uppercase tracking-[0.14em] text-white/50">
                        Dominanter Archiv-Raum
                    </div>
                    <div className="mt-0.5 text-[0.8rem] font-semibold text-white">
                        {dominantArchivLabel}
                    </div>
                </div>
                <div className="rounded-lg bg-white/5 px-3 py-2">
                    <div className="text-[0.65rem] uppercase tracking-[0.14em] text-white/50">
                        Dominantes Chronik-Level
                    </div>
                    <div className="mt-0.5 text-[0.8rem] font-semibold text-white">
                        {dominantChronikLabel}
                    </div>
                </div>
            </div>

            {/* Verteilungen */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                    <div className="mb-1 text-[0.7rem] uppercase tracking-[0.16em] text-white/50">
                        Zonen-Verteilung
                    </div>
                    <div className="space-y-0.5">
                        {(Object.keys(zones) as MastersphereZone[]).map((z) => (
                            <div key={z} className="flex justify-between text-[0.7rem]">
                                <span className="truncate">{ZONE_LABEL[z]}</span>
                                <span className="font-mono text-white/85">
                                    {zones[z]}×
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="mb-1 text-[0.7rem] uppercase tracking-[0.16em] text-white/50">
                        Archiv-Räume
                    </div>
                    <div className="space-y-0.5">
                        {Object.entries(archiv).map(([key, count]) => (
                            <div
                                key={key}
                                className="flex justify-between text-[0.7rem]"
                            >
                                <span className="truncate">
                                    {key in ARCHIV_LABEL
                                        ? ARCHIV_LABEL[key as ArchivRoomId]
                                        : key}
                                </span>
                                <span className="font-mono text-white/85">
                                    {count}×
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="mb-1 text-[0.7rem] uppercase tracking-[0.16em] text-white/50">
                        Chronik-Ebenen
                    </div>
                    <div className="space-y-0.5">
                        {Object.entries(chronik).map(([key, count]) => (
                            <div
                                key={key}
                                className="flex justify-between text-[0.7rem]"
                            >
                                <span className="truncate">
                                    {key in CHRONIK_LABEL
                                        ? CHRONIK_LABEL[key as ChronikLevel]
                                        : key}
                                </span>
                                <span className="font-mono text-white/85">
                                    {count}×
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
