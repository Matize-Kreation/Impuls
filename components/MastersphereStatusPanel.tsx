// components/MastersphereStatusPanel.tsx
"use client"

import React, { useMemo } from "react"
import { useMastersphere } from "./MastersphereContext"
import {
    computeMastersphereStats,
    type MastersphereStats,
} from "../lib/mastersphere-stats"
import { LOG_IMPULSAPP_MASTERSPHAERE_V5_SIDEBARUPGRADE_FUSION_211125 } from "../lib/mastersphere-kernel"

export const MastersphereStatusPanel: React.FC = () => {
    const { logs } = useMastersphere()

    const { stats } = useMemo(() => {
        if (!logs || logs.length === 0) {
            const empty: MastersphereStats = {
                totalImpulses: 0,
                deltaFAvg: null,
                deltaFMin: null,
                deltaFMax: null,
                dominantZone: null,
                dominantArchivRoom: null,
                dominantChronikLevel: null,
                zoneCounts: {},
                archivCounts: {
                    NULL_CODE_SAAL: 0,
                    RESONANZ_SCHACHT: 0,
                    SPHAEREN_SAELLE: 0,
                    ZEITSPEICHER_GALERIE: 0,
                    SCHATTEN_SAFE: 0,
                    FREQUENZ_BIBLIOTHEK: 0,
                },
                chronikCounts: {
                    mikro: 0,
                    meso: 0,
                    makro: 0,
                    kanon: 0,
                },
                lastImpuls: null,
            }

            return { stats: empty }
        }

        return computeMastersphereStats(logs as any[])
    }, [logs])

    const {
        totalImpulses,
        deltaFAvg,
        deltaFMin,
        deltaFMax,
        dominantZone,
        dominantArchivRoom,
        dominantChronikLevel,
        zoneCounts,
        archivCounts,
        chronikCounts,
        lastImpuls,
    } = stats

    const log = LOG_IMPULSAPP_MASTERSPHAERE_V5_SIDEBARUPGRADE_FUSION_211125

    // Kein einziger Log → neutraler Hinweis
    if (totalImpulses === 0) {
        return (
            <div className="rounded-lg border border-neutral-800 bg-neutral-950/80 p-3 text-xs text-neutral-300">
                <div className="font-semibold text-neutral-100">
                    Mastersphäre · Status
                </div>
                <div className="mt-1 text-neutral-400">
                    Noch keine Impulse erfasst.
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-950/80 p-3 text-xs text-neutral-200">
            {/* Header */}
            <div className="mb-1 flex items-baseline justify-between gap-2 border-b border-neutral-800 pb-1.5">
                <div>
                    <div className="text-[0.6rem] uppercase tracking-[0.25em] text-neutral-500">
                        Mastersphäre · V5.0
                    </div>
                    <div className="text-[0.8rem] font-semibold text-neutral-100">
                        Systemstatus · Impuls-App
                    </div>
                </div>
                <div className="text-[0.6rem] font-mono text-neutral-500">
                    {log.id}
                </div>
            </div>

            {/* Kernwerte */}
            <div className="grid gap-2 md:grid-cols-4">
                <StatCard
                    label="Impulse gesamt"
                    value={totalImpulses}
                    subtitle="analysierte Log-Atome"
                />
                <StatCard
                    label="Ø ΔF"
                    value={deltaFAvg != null ? deltaFAvg.toFixed(3) : "–"}
                    subtitle={
                        deltaFMin != null && deltaFMax != null
                            ? `Spanne: ${deltaFMin.toFixed(3)} – ${deltaFMax.toFixed(3)}`
                            : "Spanne: –"
                    }
                />
                <StatCard
                    label="Dominante Zone"
                    value={dominantZone ?? "–"}
                    subtitle="Fokus-Feld"
                />
                <StatCard
                    label="Dominanter Archiv-Raum"
                    value={dominantArchivRoom ?? "–"}
                    subtitle="Speicherschwerpunkt"
                />
            </div>

            {/* Verteilungen */}
            <div className="grid gap-2 md:grid-cols-3">
                <DistributionCard
                    title="Zonen-Verteilung"
                    data={zoneCounts}
                    hint="Erde · Wasser · Feuer · Wind · Äther · Impulsraum"
                />
                <DistributionCard
                    title="Archiv-Räume"
                    data={archivCounts as any}
                    hint="Null-Code · Resonanz · Sphären · Zeitspeicher · Schatten · Frequenz"
                />
                <DistributionCard
                    title="Chronik-Ebenen"
                    data={chronikCounts as any}
                    hint="mikro · meso · makro · kanon"
                />
            </div>

            {/* Letzter Impuls */}
            <div className="mt-1 rounded-md border border-neutral-800 bg-neutral-950/90 p-2">
                <div className="mb-1 flex items-baseline justify-between">
                    <div className="text-[0.7rem] font-semibold text-neutral-100">
                        Letzter Impuls
                    </div>
                    <div className="text-[0.55rem] uppercase tracking-[0.2em] text-neutral-500">
                        Room · Zone · ΔF · Archiv · Chronik
                    </div>
                </div>
                {lastImpuls ? (
                    <div className="space-y-0.5 text-[0.7rem]">
                        <div className="flex flex-wrap gap-1">
                            <Badge label={`Room: ${lastImpuls.room ?? "–"}`} />
                            <Badge label={`Zone: ${lastImpuls.zone}`} />
                            <Badge
                                label={`ΔF: ${lastImpuls.meta.deltaF.toFixed(3)}`}
                            />
                            <Badge
                                label={`Archiv: ${lastImpuls.meta.archivRoom}`}
                            />
                            <Badge
                                label={`Chronik: ${lastImpuls.meta.chronik.level}`}
                            />
                        </div>
                        {lastImpuls.note && (
                            <p className="mt-0.5 line-clamp-3 text-[0.7rem] text-neutral-300">
                                {lastImpuls.note}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="text-[0.7rem] text-neutral-500">
                        Kein letzter Impuls verfügbar.
                    </div>
                )}
            </div>

            {/* LOG-Refresher */}
            <div className="mt-1 rounded-md border border-amber-700/40 bg-amber-900/10 p-2">
                <div className="mb-0.5 flex items-baseline justify-between">
                    <div className="text-[0.7rem] font-semibold text-amber-100">
                        LOG-Status · Refresher
                    </div>
                    <div className="text-[0.55rem] uppercase tracking-[0.2em] text-amber-200/80">
                        Diagnose-Strom
                    </div>
                </div>
                <ul className="ml-4 list-disc space-y-0.5 text-[0.7rem] text-amber-100/90">
                    {log.VII.value.map((line: string) => (
                        <li key={line}>{line}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

interface StatCardProps {
    label: string
    value: string | number | null
    subtitle?: string
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subtitle }) => (
    <div className="rounded-md border border-neutral-800 bg-neutral-950/90 p-2">
        <div className="text-[0.6rem] uppercase tracking-[0.18em] text-neutral-500">
            {label}
        </div>
        <div className="mt-0.5 text-base font-semibold text-neutral-50">
            {value ?? "–"}
        </div>
        {subtitle && (
            <div className="mt-0.5 text-[0.65rem] text-neutral-500">
                {subtitle}
            </div>
        )}
    </div>
)

interface DistributionCardProps {
    title: string
    data: Record<string, number>
    hint?: string
}

const DistributionCard: React.FC<DistributionCardProps> = ({
    title,
    data,
    hint,
}) => {
    const entries = Object.entries(data ?? {}).filter(
        ([, count]) => count > 0
    )

    return (
        <div className="rounded-md border border-neutral-800 bg-neutral-950/90 p-2">
            <div className="mb-0.5 flex items-baseline justify-between">
                <div className="text-[0.7rem] font-semibold text-neutral-100">
                    {title}
                </div>
                {hint && (
                    <span className="text-[0.55rem] text-neutral-500">
                        {hint}
                    </span>
                )}
            </div>
            {entries.length === 0 ? (
                <p className="mt-1 text-[0.65rem] text-neutral-500">
                    Keine Daten vorhanden.
                </p>
            ) : (
                <div className="mt-1 space-y-0.5">
                    {entries.map(([key, count]) => (
                        <div
                            key={key}
                            className="flex items-center justify-between text-[0.65rem] text-neutral-200"
                        >
                            <span className="truncate">{key}</span>
                            <span className="font-mono text-[0.65rem] text-neutral-400">
                                {count}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const Badge: React.FC<{ label: string }> = ({ label }) => (
    <span className="rounded-full border border-neutral-700 bg-neutral-900 px-2 py-[2px] text-[0.6rem] text-neutral-100">
        {label}
    </span>
)
