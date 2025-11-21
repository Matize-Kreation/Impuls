// D:\Matize\Matize-Kreation\Impuls\Impuls-local\components\MastersphereContext.tsx
"use client"

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"

import type { RoomType } from "./types"
import type { ImpulsLogAtom, MastersphereZone } from "./MastersphereTypes"
import { ELEMENT_TO_ZONE } from "./MastersphereTypes"
import { processImpulsAtom } from "../lib/mastersphere-kernel"

interface MastersphereContextValue {
    currentRoom: RoomType | null
    currentZone: MastersphereZone | null
    logs: ImpulsLogAtom[]
    registerImpulse: (room: RoomType, note?: string) => void
}

const MastersphereContext = createContext<MastersphereContextValue | null>(null)

export const MastersphereProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentRoom, setCurrentRoom] = useState<RoomType | null>(null)
    const [currentZone, setCurrentZone] = useState<MastersphereZone | null>(null)
    const [logs, setLogs] = useState<ImpulsLogAtom[]>([])

    // Beim ersten Laden: vorhandene Logs aus localStorage einlesen
    useEffect(() => {
        try {
            const existingRaw = window.localStorage.getItem("impuls_log_atoms")
            if (!existingRaw) return

            const existing = JSON.parse(existingRaw)
            if (!Array.isArray(existing) || existing.length === 0) return

            setLogs(existing as ImpulsLogAtom[])

            // Letztes Atom als aktueller Kontext
            const last = existing[existing.length - 1] as ImpulsLogAtom
            setCurrentRoom(last.room)
            setCurrentZone(last.zone)
        } catch (error) {
            console.error("[Mastersphäre] Fehler beim Laden der Impuls-Logs:", error)
        }
    }, [])

    const registerImpulse = useCallback(
        (room: RoomType, note?: string) => {
            const zone = ELEMENT_TO_ZONE[room]
            const timestamp = new Date().toISOString()

            const baseAtom: ImpulsLogAtom = {
                id: `${timestamp}-${room}`,
                timestamp,
                room,
                zone,
                note: note ?? "",
            }

            // Mastersphären-Prozessor anwenden
            const processed = processImpulsAtom(baseAtom)

            // Debug-Feedback in der Konsole
            console.log("[Mastersphäre] Neuer Impuls (processed):", processed)

            // Aktiven Zustand setzen
            setCurrentRoom(room)
            setCurrentZone(zone)

            // In-Memory-Logs ergänzen (processed hat zusätzlich meta)
            setLogs((prev) => [...prev, processed])

            // Persistenz in localStorage
            try {
                const existingRaw = window.localStorage.getItem("impuls_log_atoms")
                const existing: ImpulsLogAtom[] = existingRaw ? JSON.parse(existingRaw) : []
                existing.push(processed as ImpulsLogAtom)
                window.localStorage.setItem(
                    "impuls_log_atoms",
                    JSON.stringify(existing)
                )
            } catch (error) {
                console.error("[Mastersphäre] Archiv-Persist-Error:", error)
            }
        },
        []
    )

    const value = useMemo<MastersphereContextValue>(
        () => ({
            currentRoom,
            currentZone,
            logs,
            registerImpulse,
        }),
        [currentRoom, currentZone, logs, registerImpulse]
    )

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
