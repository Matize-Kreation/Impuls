// D:\Matize\Matize-Kreation\Impuls\Impuls-local\components\RoomPage.tsx
"use client"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import KICompanion from "./KICompanion"
import ImpulseButton from "./ImpulseButton"
import GalaxyBackground from "./GalaxyBackground"
import EnhancedWaves from "./EnhancedWaves"
import type { RoomType } from "./types"
import { useMastersphere } from "./MastersphereContext"
import ImpulseOverview from "./ImpulseOverview"
import FocusRecommendation from "./FocusRecommendation"   // <-- FEHLTE

interface RoomPageProps {
    room: RoomType
}

const ALL_ROOMS: RoomType[] = ["impuls", "erde", "wasser", "feuer", "wind", "aether"]

export default function RoomPage({ room }: RoomPageProps) {
    const router = useRouter()
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [companionVisible, setCompanionVisible] = useState(false)
    const { registerImpulse } = useMastersphere()

    const handleImpulseClick = async () => {
        // 1. Mastersphäre-Impuls registrieren
        registerImpulse(room)

        // 2. Audio abspielen
        if (audioRef.current) {
            try {
                audioRef.current.currentTime = 0
                const playPromise = audioRef.current.play()
                if (playPromise !== undefined) await playPromise
            } catch (err) {
                console.warn("Audio konnte nicht abgespielt werden:", err)
            }
        }

        // 3. Raum-Event dispatchen (für andere Listener, falls vorhanden)
        window.dispatchEvent(new Event(`${room}-activated`))

        // 4. KI-Companion sichtbar machen
        setCompanionVisible(true)
    }

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

    return (
        <main className="relative w-full h-screen overflow-hidden bg-black text-white">
            {/* Hintergrund */}
            <GalaxyBackground room={room} />

            {/* Enhanced Waves */}
            <EnhancedWaves room={room} />

            {/* KI Companion: oben mittig */}
            <div
                className="absolute left-1/2 top-6 transform -translate-x-1/2 z-40 pointer-events-auto"
                style={{ width: "min(720px, 90%)" }}
            >
                <KICompanion mode={room} isVisible={companionVisible} onToggle={setCompanionVisible} />
            </div>

            {/* Fokuszonen-Übersicht: oben rechts */}
            <ImpulseOverview />

            {/* Impuls-Button mittig */}
            <section
                aria-label="Impuls Button Bereich"
                className="absolute z-20 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            >
                <ImpulseButton room={room} onClick={handleImpulseClick} size={70} />
            </section>
            {/* Focus-Evaluator Output */}
            <FocusRecommendation />


            {/* Untere Elementenleiste */}
            <nav
                aria-label="Raum Navigation"
                className="absolute z-30 bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4"
            >
                <style>{`
          .elem-btn {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            transition: transform 200ms ease, box-shadow 200ms ease, opacity 180ms ease;
            will-change: transform, opacity;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            cursor: pointer;
          }
          .elem-btn img { width: 28px; height: 28px; object-fit: contain; display:block; }
          .elem-btn:hover { transform: translateY(-6%) scale(1.06); box-shadow: 0 6px 18px rgba(0,0,0,0.45); }
          .elem-active {
            animation: pulse-elem 2000ms ease-in-out infinite;
            box-shadow: 0 8px 26px rgba(0,0,0,0.48);
            transform: translateY(-4%) scale(1.03);
            opacity: 1;
          }
          .elem-inactive { opacity: 0.68; }
          @keyframes pulse-elem {
            0% { transform: translateY(-4%) scale(1.03); }
            50% { transform: translateY(-6%) scale(1.05); }
            100% { transform: translateY(-4%) scale(1.03); }
          }
        `}</style>

                {ALL_ROOMS.map((r) => {
                    const isActive = r === room
                    const iconSrc = r === "impuls" ? "/impuls-raum.png" : `/element-${r}.png`
                    return (
                        <button
                            key={r}
                            title={r}
                            aria-current={isActive ? "true" : "false"}
                            onClick={() => router.push(r === "impuls" ? "/" : `/${r}`)}
                            className={`elem-btn ${isActive ? "elem-active" : "elem-inactive"}`}
                        >
                            <img src={iconSrc} alt={`${r} Icon`} />
                        </button>
                    )
                })}
            </nav>

            {/* Raum Audio */}
            <audio
                ref={audioRef}
                src={`/assets/rooms/${room}/${capitalize(room)}.mp3`}
                preload="auto"
                className="hidden"
            />
        </main>
    )
}
