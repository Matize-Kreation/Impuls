'use client'

import { useState } from 'react'
import { RoomType } from './types'

interface ElementBarProps {
    currentRoom: RoomType
    onSelect?: (room: RoomType) => void
}

const elements: { mode: RoomType; icon: string }[] = [
    { mode: 'impuls', icon: '⚡' },
    { mode: 'erde', icon: '🌱' },
    { mode: 'wasser', icon: '💧' },
    { mode: 'feuer', icon: '🔥' },
    { mode: 'wind', icon: '🌬️' },
    { mode: 'aether', icon: '✨' },
]

export default function ElementBar({ currentRoom, onSelect }: ElementBarProps) {
    const [hovered, setHovered] = useState<RoomType | null>(null)

    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex space-x-4 pointer-events-auto">
            {elements.map((el) => {
                const isActive = el.mode === currentRoom
                return (
                    <button
                        key={el.mode}
                        onClick={() => onSelect?.(el.mode)}
                        onMouseEnter={() => setHovered(el.mode)}
                        onMouseLeave={() => setHovered(null)}
                        className={`
              flex items-center justify-center
              w-14 h-14 md:w-16 md:h-16
              text-2xl md:text-3xl
              rounded-full
              transition-transform duration-300
              ${isActive ? 'bg-white/20 animate-breathe' : 'bg-white/10'}
              ${hovered === el.mode ? 'scale-110 shadow-lg' : 'scale-100'}
            `}
                    >
                        {el.icon}
                        {/* Optional: Halo-Ring für aktives Symbol */}
                        {isActive && (
                            <span className="absolute inset-0 rounded-full border-2 border-purple-400/50 animate-pulse" />
                        )}
                    </button>
                )
            })}
        </div>
    )
}
