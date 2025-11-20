// D:\Matize\Matize-Kreation\Impuls\Impuls-local\components\MastersphereTypes.ts

import type { RoomType } from "./types"

/**
 * Mastersphäre-Zonen:
 * - struktur = ERDE
 * - emotion  = WASSER
 * - wille    = FEUER
 * - geist    = WIND
 * - sinn     = ÄTHER
 * - meta     = IMPULSRAUM (Fokus-Metaknoten)
 */
export type MastersphereZone =
    | "struktur"
    | "emotion"
    | "wille"
    | "geist"
    | "sinn"
    | "meta"

/**
 * Kleinste Einheit der Impuls-Fokuszone,
 * erzeugt bei jedem Impuls-Klick.
 */
export interface ImpulsLogAtom {
    id: string          // z.B. timestamp-room
    timestamp: string   // ISO-String
    room: RoomType
    zone: MastersphereZone
    note?: string       // optionaler Kurztext
}

/**
 * Eindeutige Zuordnung der Elemente zu den Mastersphäre-Zonen.
 */
export const ELEMENT_TO_ZONE: Record<RoomType, MastersphereZone> = {
    impuls: "meta",
    erde: "struktur",
    wasser: "emotion",
    feuer: "wille",
    wind: "geist",
    aether: "sinn",
}
