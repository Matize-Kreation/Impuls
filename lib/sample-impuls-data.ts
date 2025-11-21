// lib/sample-impuls-data.ts

import type { ImpulsLogAtom } from "../components/MastersphereTypes"

// Kleine Beispielmenge – du kannst sie später durch echte Logs ersetzen.
export const SAMPLE_IMPULSE: ImpulsLogAtom[] = [
    {
        id: "impuls-1",
        room: "erde",
        zone: "struktur",
        note: "Kurze Notiz zur Struktur eines Musikprojekts.",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // vor 15 Min
    },
    {
        id: "impuls-2",
        room: "wind",
        zone: "geist",
        note: "Längerer Gedanke zur Mastersphäre-Architektur und deren ΔF-Fluss.",
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // vor 10 Min
    },
    {
        id: "impuls-3",
        room: "wind",
        zone: "geist",
        note: "Noch ein Impuls im Wind – Fokus auf Systemdenken und OS-Struktur.",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // vor 5 Min
    },
    {
        id: "impuls-4",
        room: "wasser",
        zone: "emotion",
        note: "Emotionale Reflexion zur aktuellen Schachpartie und deren Lernkurve.",
        timestamp: new Date().toISOString(), // jetzt
    },
]