// D:\Matize\Matize-Kreation\Impuls\Impuls-local\lib\focus-evaluator.ts

import type { RoomType } from "../components/types"
import type {
    ImpulsLogAtom,
    MastersphereZone,
} from "../components/MastersphereTypes"

export interface FocusSummary {
    total: number
    dominantRoom: RoomType | null
    dominantCount: number
    currentRoom: RoomType | null
    currentZone: MastersphereZone | null
    counts: Record<RoomType, number>
    recommendation: string
}

const ROOM_LABEL: Record<RoomType, string> = {
    impuls: "Impulsraum (Meta)",
    erde: "Erde – Struktur",
    wasser: "Wasser – Emotion",
    feuer: "Feuer – Wille",
    wind: "Wind – Geist",
    aether: "Äther – Sinn",
}

export function evaluateFocus(
    logs: ImpulsLogAtom[],
    currentRoom: RoomType | null,
    currentZone: MastersphereZone | null
): FocusSummary {
    // Basiszählung initialisieren
    const baseCounts: Record<RoomType, number> = {
        impuls: 0,
        erde: 0,
        wasser: 0,
        feuer: 0,
        wind: 0,
        aether: 0,
    }

    const counts: Record<RoomType, number> = { ...baseCounts }

    for (const log of logs) {
        counts[log.room] = (counts[log.room] ?? 0) + 1
    }

    const entries = Object.entries(counts) as [RoomType, number][]
    const total = entries.reduce((sum, [, n]) => sum + n, 0)

    let dominantRoom: RoomType | null = null
    let dominantCount = 0

    for (const [room, n] of entries) {
        if (n > dominantCount) {
            dominantCount = n
            dominantRoom = room
        }
    }

    if (dominantCount === 0) {
        dominantRoom = null
    }

    const recommendation = buildRecommendation({
        total,
        dominantRoom,
        dominantCount,
        currentRoom,
        currentZone,
        counts,
    })

    return {
        total,
        dominantRoom,
        dominantCount,
        currentRoom,
        currentZone,
        counts,
        recommendation,
    }
}

interface RecommendationInput {
    total: number
    dominantRoom: RoomType | null
    dominantCount: number
    currentRoom: RoomType | null
    currentZone: MastersphereZone | null
    counts: Record<RoomType, number>
}

function buildRecommendation(input: RecommendationInput): string {
    const {
        total,
        dominantRoom,
        dominantCount,
        currentRoom,
        currentZone,
    } = input

    // Fall 1: Noch keine Impulse
    if (total === 0 || !dominantRoom) {
        return (
            "Noch keine klare Tendenz. " +
            "Beginne mit einem Element, das dich spontan ruft – Erde für Struktur, Wasser für Gefühl, Feuer für Drive, Wind für Klarheit oder Äther für Sinn."
        )
    }

    const dominantLabel = ROOM_LABEL[dominantRoom]
    const currentInfo =
        currentRoom && currentZone
            ? `Du befindest dich aktuell im Raum „${ROOM_LABEL[currentRoom]}“ (Zone: ${currentZone.toUpperCase()}). `
            : ""

    // Element-spezifische Empfehlungen
    switch (dominantRoom) {
        case "erde":
            return (
                `${currentInfo}` +
                `Es dominiert: ${dominantLabel} (${dominantCount} Impulse). ` +
                "Empfehlung: Heute 1–2 konkrete Dinge strukturieren, sortieren oder ordnen – Systeme stabilisieren, statt neue Baustellen zu öffnen."
            )
        case "wasser":
            return (
                `${currentInfo}` +
                `Es dominiert: ${dominantLabel} (${dominantCount} Impulse). ` +
                "Empfehlung: Emotional ehrlich einchecken – wie fühlt sich dein System an? Raum für Gefühl, Verarbeitung und sanfte Bewegung lassen."
            )
        case "feuer":
            return (
                `${currentInfo}` +
                `Es dominiert: ${dominantLabel} (${dominantCount} Impulse). ` +
                "Empfehlung: Nutze den Drive für eine klare Aktion – etwas anfangen, abschließen oder transformieren, das schon länger ruft."
            )
        case "wind":
            return (
                `${currentInfo}` +
                `Es dominiert: ${dominantLabel} (${dominantCount} Impulse). ` +
                "Empfehlung: Analyse, Planung, Klarheit – heute ist ein guter Tag für Denken, Konzepte, Entscheidungen und KI-Arbeit."
            )
        case "aether":
            return (
                `${currentInfo}` +
                `Es dominiert: ${dominantLabel} (${dominantCount} Impulse). ` +
                "Empfehlung: Sinn, Vision und Mythos in den Vordergrund stellen – warum machst du das alles, und welches Bild von dir entsteht daraus?"
            )
        case "impuls":
            return (
                `${currentInfo}` +
                `Es dominiert: ${dominantLabel} (${dominantCount} Impulse). ` +
                "Empfehlung: Meta-Reflexion – beobachte erst die Muster deiner Impulse, bevor du aktiv in ein Element gehst. Heute ist ein guter Tag für Übersicht."
            )
        default:
            return (
                `${currentInfo}` +
                "Die Muster sind gemischt – kleine Schritte in Struktur, Gefühl, Handlung, Klarheit und Sinn sind möglich. Halte es leicht und beobachte, was sich wiederholt."
            )
    }
}
