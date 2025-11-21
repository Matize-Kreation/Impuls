// D:\Matize\Matize-Kreation\Impuls\Impuls-local\lib\mastersphere-spec.ts

import type { RoomType } from "../components/types"
import type {
    ImpulsLogAtom,
    MastersphereZone,
} from "../components/MastersphereTypes"

/**
 * Chronik-Ebenen der Mastersphäre
 */
export type ChronikLevel = "MIKRO" | "MESO" | "MAKRO" | "KANON"

/**
 * Archiv-Räume nach Mastersphäre-Konzept
 */
export type ArchivRoom =
    | "NULL_CODE_SAAL"
    | "RESONANZ_SCHACHT"
    | "SPHAEREN_SAELE"
    | "ZEITSPEICHER_GALERIE"
    | "SCHATTEN_SAFE"
    | "FREQUENZ_BIBLIOTHEK"

/**
 * Chronikkoordinate C(t, ΔF, r)
 * t  = Zeit (ms seit Epoch)
 * ΔF = Frequenzabweichung von F0
 * r  = Sphärenrelevanz [0..1]
 */
export interface ChronikCoordinate {
    t: number
    deltaF: number
    relevance: number
    level: ChronikLevel
}

/**
 * Metadaten der Mastersphäre für einen Impuls.
 */
export interface MastersphereMeta {
    zone: MastersphereZone
    deltaF: number
    archivRoom: ArchivRoom | null
    chronik: ChronikCoordinate
    isKanonCandidate: boolean
}

/**
 * Erweiterter Log-Typ: ImpulsLogAtom + Mastersphären-Metadaten.
 * (Structural Typing → kompatibel mit ImpulsLogAtom)
 */
export type ProcessedImpulsLogAtom = ImpulsLogAtom & {
    meta: MastersphereMeta
}

/**
 * Basisgewichte der Räume für die ΔF-Berechnung.
 * Später über UI/Config erweiterbar.
 */
export const ROOM_BASE_WEIGHTS: Record<RoomType, number> = {
    impuls: 0.9, // Meta: Fokus-Knoten
    erde: 0.4,   // Struktur
    wasser: 0.5, // Emotion
    feuer: 0.7,  // Wille
    wind: 0.6,   // Geist
    aether: 0.6, // Sinn
}

/**
 * Globale Nullfrequenz F0.
 * Kann später user-/kontextabhängig werden.
 */
export const F0 = 1.0

/**
 * Hilfsfunktion: normiert eine Zahl in einen Bereich [min, max].
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}
