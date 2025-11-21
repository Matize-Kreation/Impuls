// lib/mastersphere-stats.ts

import type { ImpulsLogAtom } from "../components/MastersphereTypes"
import {
    type MastersphereMeta,
    type ArchivRoomId,
    type ChronikLevel,
    processImpulsAtom,
} from "./mastersphere-kernel"

export type ImpulsWithMeta = ImpulsLogAtom & { meta: MastersphereMeta }

export interface MastersphereStats {
    totalImpulses: number
    deltaFAvg: number | null
    deltaFMin: number | null
    deltaFMax: number | null

    dominantZone: string | null
    dominantArchivRoom: ArchivRoomId | null
    dominantChronikLevel: ChronikLevel | null

    zoneCounts: Record<string, number>
    archivCounts: Record<ArchivRoomId, number>
    chronikCounts: Record<ChronikLevel, number>

    lastImpuls: ImpulsWithMeta | null
}

/**
 * intern: zählt Vorkommen in einem Array.
 */
function countBy<T extends string | number | null | undefined>(
    values: T[]
): Record<string, number> {
    const counts: Record<string, number> = {}
    for (const v of values) {
        const key = v == null ? "null" : String(v)
        counts[key] = (counts[key] ?? 0) + 1
    }
    return counts
}

/**
 * intern: findet den Key mit dem höchsten Count.
 */
function findDominantKey(counts: Record<string, number>): string | null {
    let maxKey: string | null = null
    let maxVal = -Infinity

    for (const [key, val] of Object.entries(counts)) {
        if (val > maxVal) {
            maxVal = val
            maxKey = key
        }
    }

    if (maxVal <= 0) return null
    return maxKey
}

/**
 * Normalisiert einen Log-Eintrag: falls bereits meta vorhanden → verwenden,
 * sonst durch den Mastersphäre-Kernel schicken.
 */
function normalizeImpuls(atom: any): ImpulsWithMeta {
    if (
        atom.meta &&
        typeof atom.meta.deltaF === "number" &&
        atom.meta.archivRoom &&
        atom.meta.chronik &&
        atom.meta.chronik.level
    ) {
        return atom as ImpulsWithMeta
    }

    // Fallback: Kernel berechnet meta
    return processImpulsAtom(atom as ImpulsLogAtom) as ImpulsWithMeta
}

/**
 * Hauptfunktion: Statistik aus einer Liste von Impuls-Atomen erzeugen.
 */
export function computeMastersphereStats(
    atoms: ImpulsLogAtom[] | any[]
): { stats: MastersphereStats; enriched: ImpulsWithMeta[] } {
    if (!atoms || atoms.length === 0) {
        const emptyStats: MastersphereStats = {
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

        return { stats: emptyStats, enriched: [] }
    }

    const enriched: ImpulsWithMeta[] = atoms.map((atom) =>
        normalizeImpuls(atom)
    )

    const totalImpulses = enriched.length
    const deltaFs = enriched.map((a) => a.meta.deltaF)

    const deltaFMin = Math.min(...deltaFs)
    const deltaFMax = Math.max(...deltaFs)
    const deltaFAvg =
        deltaFs.reduce((sum, v) => sum + v, 0) / (deltaFs.length || 1)

    const zoneCounts = countBy(enriched.map((a) => a.zone))
    const archivCountsRaw = countBy(
        enriched.map((a) => a.meta.archivRoom)
    ) as Record<ArchivRoomId, number>
    const chronikCountsRaw = countBy(
        enriched.map((a) => a.meta.chronik.level)
    ) as Record<ChronikLevel, number>

    const dominantZone = findDominantKey(zoneCounts)
    const dominantArchivRoom = findDominantKey(
        archivCountsRaw
    ) as ArchivRoomId | null
    const dominantChronikLevel = findDominantKey(
        chronikCountsRaw
    ) as ChronikLevel | null

    const lastImpuls = enriched[enriched.length - 1] ?? null

    const stats: MastersphereStats = {
        totalImpulses,
        deltaFAvg,
        deltaFMin,
        deltaFMax,
        dominantZone,
        dominantArchivRoom,
        dominantChronikLevel,
        zoneCounts,
        archivCounts: {
            NULL_CODE_SAAL: archivCountsRaw.NULL_CODE_SAAL ?? 0,
            RESONANZ_SCHACHT: archivCountsRaw.RESONANZ_SCHACHT ?? 0,
            SPHAEREN_SAELLE: archivCountsRaw.SPHAEREN_SAELLE ?? 0,
            ZEITSPEICHER_GALERIE: archivCountsRaw.ZEITSPEICHER_GALERIE ?? 0,
            SCHATTEN_SAFE: archivCountsRaw.SCHATTEN_SAFE ?? 0,
            FREQUENZ_BIBLIOTHEK: archivCountsRaw.FREQUENZ_BIBLIOTHEK ?? 0,
        },
        chronikCounts: {
            mikro: chronikCountsRaw.mikro ?? 0,
            meso: chronikCountsRaw.meso ?? 0,
            makro: chronikCountsRaw.makro ?? 0,
            kanon: chronikCountsRaw.kanon ?? 0,
        },
        lastImpuls,
    }

    return { stats, enriched }
}
