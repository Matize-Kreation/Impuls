// D:\Matize\Matize-Kreation\Impuls\Impuls-local\lib\mastersphere-kernel.ts

import type { ImpulsLogAtom, MastersphereZone } from "../components/MastersphereTypes"

/**
 * Chronik-Ebenen gemäß Mastersphäre:
 * - mikro  = einzelne Impulse
 * - meso   = Muster / Cluster
 * - makro  = Zyklen / Phasen
 * - kanon  = übergeordnete Lebens- / Systemlinien
 */
export type ChronikLevel = "mikro" | "meso" | "makro" | "kanon"

/**
 * Archiv-Räume gemäß Mastersphäre:
 * - NULL_CODE_SAAL
 * - RESONANZ_SCHACHT
 * - SPHAEREN_SAELLE
 * - ZEITSPEICHER_GALERIE
 * - SCHATTEN_SAFE
 * - FREQUENZ_BIBLIOTHEK
 */
export type ArchivRoomId =
    | "NULL_CODE_SAAL"
    | "RESONANZ_SCHACHT"
    | "SPHAEREN_SAELLE"
    | "ZEITSPEICHER_GALERIE"
    | "SCHATTEN_SAFE"
    | "FREQUENZ_BIBLIOTHEK"

/**
 * Metadaten, die der Mastersphäre-Kernel pro Impuls anreichert.
 */
export interface MastersphereMeta {
    /**
     * ΔF: Spannungs- / Bewegungsmaß (0..1).
     * Wird aus Zone und optional aus der Informationsdichte (note) abgeleitet.
     */
    deltaF: number

    /**
     * F₀-Distanz: aktuell synonym zu deltaF,
     * später ggf. eigene Berechnung.
     */
    f0Distance: number

    /**
     * Zuordnung zu einem Archiv-Raum der Mastersphäre.
     */
    archivRoom: ArchivRoomId | null

    /**
     * Chronik-Metadaten: aktuelle Ebene (mikro/meso/makro/kanon).
     */
    chronik: {
        level: ChronikLevel
    }
}

/**
 * Hilfsfunktion: Normiert einen Wert in den Bereich [0, 1].
 */
function clamp01(value: number): number {
    if (Number.isNaN(value)) return 0
    if (value < 0) return 0
    if (value > 1) return 1
    return value
}

/**
 * Baseline-ΔF je Zone.
 * Orientiert sich an der energetischen Bedeutung:
 * - meta   (Impulsraum)   → sehr hohe ΔF-Basis
 * - feuer  (Wille)        → hohe ΔF-Basis
 * - wind   (Geist/Denken) → mittelhoch
 * - wasser (Emotion)      → mittel
 * - aether (Sinn)         → mittelhoch, aber ruhiger
 * - erde   (Struktur)     → eher niedrige ΔF-Basis
 */
const ZONE_DELTAF_BASE: Record<MastersphereZone, number> = {
    meta: 0.9,
    wille: 0.8,
    geist: 0.65,
    sinn: 0.6,
    emotion: 0.5,
    struktur: 0.35,
}

/**
 * Leitet aus Zone + Noten-Länge einen ΔF-Wert ab.
 * Aktuell einfach gehalten, aber klar erweiterbar:
 * - Basiswert je Zone
 * - zusätzlicher Faktor je nach Textlänge der Note
 */
function computeDeltaF(zone: MastersphereZone, note?: string): number {
    const base = ZONE_DELTAF_BASE[zone] ?? 0.5

    const length = (note ?? "").trim().length

    // einfache Heuristik: kurze Notizen = weniger ΔF-Beitrag, sehr lange = mehr ΔF
    let lengthFactor = 0
    if (length === 0) {
        lengthFactor = -0.05
    } else if (length < 40) {
        lengthFactor = 0.0
    } else if (length < 120) {
        lengthFactor = 0.08
    } else {
        lengthFactor = 0.16
    }

    const raw = base + lengthFactor
    return clamp01(raw)
}

/**
 * Leitet aus Zone, ΔF und Note einen Archiv-Raum ab.
 * Regeln (einfach, aber sinnvoll):
 * - Wenn keine Note → SCHATTEN_SAFE
 * - Wenn Zone = meta/Impulsraum → NULL_CODE_SAAL
 * - Bei hoher ΔF → RESONANZ_SCHACHT
 * - Bei mittlerer ΔF → SPHAEREN_SAELLE
 * - Bei großer Notenlänge → ZEITSPEICHER_GALERIE
 * - Fallback → FREQUENZ_BIBLIOTHEK
 */
function computeArchivRoom(
    zone: MastersphereZone,
    deltaF: number,
    note?: string
): ArchivRoomId {
    const trimmed = (note ?? "").trim()
    const len = trimmed.length

    if (len === 0) {
        return "SCHATTEN_SAFE"
    }

    if (zone === "meta") {
        return "NULL_CODE_SAAL"
    }

    if (deltaF >= 0.7) {
        return "RESONANZ_SCHACHT"
    }

    if (len > 200) {
        return "ZEITSPEICHER_GALERIE"
    }

    if (deltaF >= 0.4 && deltaF < 0.7) {
        return "SPHAEREN_SAELLE"
    }

    return "FREQUENZ_BIBLIOTHEK"
}

/**
 * Leitet ein Chronik-Level aus Notenlänge und Zone ab.
 * Grobe Heuristik:
 * - sehr kurz → mikro
 * - mittellang → meso
 * - sehr lang → makro
 * - meta/Impulsraum mit längerer Note → kanon
 */
function computeChronikLevel(
    zone: MastersphereZone,
    note?: string
): ChronikLevel {
    const trimmed = (note ?? "").trim()
    const len = trimmed.length

    if (zone === "meta" && len > 80) {
        return "kanon"
    }

    if (len > 200) {
        return "makro"
    }

    if (len > 60) {
        return "meso"
    }

    return "mikro"
}

/**
 * Zentrale Kernfunktion: verarbeitet ein Impuls-Atom
 * in der Mastersphäre nach V5.0-Kernlogik.
 *
 * Sie reichert den Impuls um die "meta"-Information an:
 * - deltaF (0..1)
 * - f0Distance (aktuell identisch mit deltaF)
 * - archivRoom (einer der 6 Räume)
 * - chronik.level (mikro/meso/makro/kanon)
 */
export function processImpulsAtom(
    atom: ImpulsLogAtom
): ImpulsLogAtom & { meta: MastersphereMeta } {
    const { zone, note } = atom

    // 1) ΔF bestimmen
    const deltaF = computeDeltaF(zone, note)

    // 2) Archiv-Raum bestimmen
    const archivRoom = computeArchivRoom(zone, deltaF, note)

    // 3) Chronik-Ebene bestimmen
    const chronikLevel = computeChronikLevel(zone, note)

    const meta: MastersphereMeta = {
        deltaF,
        f0Distance: deltaF, // aktuell identisch, später ggf. verfeinern
        archivRoom,
        chronik: {
            level: chronikLevel,
        },
    }

    // Das Atom bleibt unverändert, wird nur um meta erweitert
    return {
        ...atom,
        meta,
    }
}

/**
 * LOG-STATUS · Impuls-App · Mastersphäre V5.0 · Sidebar-Upgrade (Fusion)
 * Technischer Export für UI / Diagnose-Module.
 */
export const LOG_IMPULSAPP_MASTERSPHAERE_V5_SIDEBARUPGRADE_FUSION_211125 = {
    id: "LOG-ImpulsApp-MastersphaereV5_SidebarUpgrade_FUSION[21.11.25-1]",

    I: {
        label: "LOG-ID",
        value: "LOG-ImpulsApp-MastersphaereV5_SidebarUpgrade_FUSION[21.11.25-1]",
    },

    II: {
        label: "Kern-Summary",
        value: [
            "Die Mastersphäre-App wurde erfolgreich um eine erweiterte Sidebar mit verzweigter Panel-Struktur (Makro/Meso/Mikro/Meta) ergänzt.",
            "Die KI-Diagnose wurde vollständig aktiviert und liefert konsistente, logisch-matizische Analysen basierend auf den gespeicherten Impulsen.",
            "ΔF-Berechnung, Archivlogik, Chronik-Zuordnung und Dominanzanalyse laufen jetzt über alle Ebenen synchronisiert.",
            "Die UI wurde stabilisiert (Scroll, Grid 2-Spalten, Viewport-Fix), wodurch kein Element mehr außerhalb des sichtbaren Bereichs verschwindet.",
            "Das System besitzt erstmals einen aktiven Diagnostik-Strom, der Impulse nicht nur auswertet, sondern ihre Beziehungen, Muster und energetischen Übergänge interpretiert.",
        ],
    },

    III: {
        label: "Aktuelles Ziel",
        value: [
            "Ausbau des Mastersphären-Portals als OS-Hauptnavigation.",
            "Entwicklung des Archiv-Viewers (Baumstruktur, Einträge, ΔF-Farbcodes).",
            "Aufbau der Chronik-Timeline als dynamische Zeitstruktur.",
        ],
    },

    IV: {
        label: "Metadaten",
        value: {
            themengebiet: ["KI-Integration", "OS-Design", "Energetische Diagnostik"],
            relevanz: "hoch",
            projektzuordnung: ["Impuls-App", "Mastersphäre V5.0"],
            verknuepfteLOGs: [
                "LOG-MastersphaereV5_211125",
                "LOG-ImpulsKernel[XX.XX.XX-X]",
                "LOG-UI-Raeume[XX.XX.XX-X]",
            ],
        },
    },

    V: {
        label: "Fortschritt/Ergebnis",
        value: [
            "Sidebar vollständig optimiert (responsive, max-height, grid, scroll).",
            "Diagnose-Panel & KI-Diagnose-Panel miteinander harmonisiert.",
            "KI-Diagnose-Route erfolgreich getestet und aktiviert.",
            "ΔF-Spanne, Dominanzen, Archivräume & Chronik werden sauber korrekt angezeigt.",
            "Die Mastersphäre zeigt zum ersten Mal einen lebendigen, konsistenten Systemzustand.",
            "Makro → Meso → Mikro → Meta bildet nun einen vertikalen Analysefluss, der sich horizontal durch alle Räume moduliert und die Diagnostik über Ebenen hinweg synchronisiert.",
        ],
    },

    VI: {
        label: "Offene Fragen",
        value: [
            "Archiv-Viewer implementieren (Baum, Detailfenster, Chronik-Bindung).",
            "Chronik-Timeline erzeugen (Impuls-Kurve + ΔF-Heatmap).",
            "Portal-Startscreen entwerfen (Räume, Zonen, Dominanz-Pulsar).",
            "ΔF-Visualisierung testen: Vergleich zwischen Orbital-Waveform und Resonanz-Spektralkarte, inklusive Übergangsanimation (ΔF-Drift).",
        ],
    },

    VII: {
        label: "Status-Refresher",
        value: [
            "Die Mastersphäre ist erwacht: Diagnostik-Strom aktiv, Sidebar präzise, energetischer Zustand klar sichtbar.",
            "Nächste Evolutionsschritte: Portal, Archiv-Viewer, Chronik-Timeline.",
        ],
    },
} as const
