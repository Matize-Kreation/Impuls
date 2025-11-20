// D:\Matize\Matize-Kreation\Impuls\Impuls-local\components\MastersphereContext.tsx
"use client"

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react"
import type { RoomType } from "./types"
import type { ImpulsLogAtom, MastersphereZone } from "./MastersphereTypes"
import { ELEMENT_TO_ZONE } from "./MastersphereTypes"

interface MastersphereContextValue {
    currentRoom: RoomType | null
    currentZone: MastersphereZone | null
    logs: ImpulsLogAtom[]
    registerImpulse: (room: RoomType, note?: string) => void
}

const MastersphereContext = createContext<MastersphereContextValue | null>(null)

export const MastersphereProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [currentRoom, setCurrentRoom] = useState<RoomType | null>(null)
    const [currentZone, setCurrentZone] = useState<MastersphereZone | null>(null)
    const [logs, setLogs] = useState<ImpulsLogAtom[]>([])

    // Beim ersten Laden: vorhandene Logs aus localStorage einlesen
    useEffect(() => {
        try {
            const existingRaw = window.localStorage.getItem("impuls_log_atoms")
            if (!existingRaw) return

            const existing: ImpulsLogAtom[] = JSON.parse(existingRaw)

            if (Array.isArray(existing) && existing.length > 0) {
                setLogs(existing)

                // Letztes Atom als aktueller Kontext
                const last = existing[existing.length - 1]
                setCurrentRoom(last.room)
                setCurrentZone(last.zone)
            }
        } catch (error) {
            console.error("Fehler beim Laden der Impuls-Logs:", error)
        }
    }, [])

    const registerImpulse = useCallback((room: RoomType, note?: string) => {
        const zone = ELEMENT_TO_ZONE[room]
        const timestamp = new Date().toISOString()

        const atom: ImpulsLogAtom = {
            id: `${timestamp}-${room}`,
            timestamp,
            room,
            zone,
            note: note ?? "",
        }

        // Debug-Feedback in der Konsole
        console.log("[Mastersphäre] Neuer Impuls:", atom)

        // Aktiven Zustand setzen
        setCurrentRoom(room)
        setCurrentZone(zone)

        // In-Memory-Logs ergänzen
        setLogs((prev) => [...prev, atom])

        // Persistenz in localStorage (später Archiv-Sphäre / Export)
        try {
            const existingRaw = window.localStorage.getItem("impuls_log_atoms")
            const existing: ImpulsLogAtom[] = existingRaw ? JSON.parse(existingRaw) : []
            existing.push(atom)
            window.localStorage.setItem("impuls_log_atoms", JSON.stringify(existing))
        } catch (error) {
            console.error("Archiv-Persist-Error:", error)
        }
    }, [])

    const value: MastersphereContextValue = {
        currentRoom,
        currentZone,
        logs,
        registerImpulse,
    }

    return (
        <MastersphereContext.Provider value={value}>
            {children}
        </MastersphereContext.Provider>
    )
}

export const useMastersphere = (): MastersphereContextValue => {
    const ctx = useContext(MastersphereContext)
    if (!ctx) {
        throw new Error("useMastersphere must be used within a MastersphereProvider")
    }
    return ctx
}
