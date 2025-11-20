'use client'

import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import ImpulseButton from './ImpulseButton'
import { RoomType } from './types'

interface ElementBarProps {
  currentRoom: RoomType
  onSelect?: (room: RoomType) => void
}

const elements: { mode: RoomType; icon: string }[] = [
  { mode: 'erde', icon: '🌱' },
  { mode: 'wasser', icon: '💧' },
  { mode: 'feuer', icon: '🔥' },
  { mode: 'wind', icon: '🌬️' },
  { mode: 'aether', icon: '✨' },
]

export default function ElementBar({ currentRoom, onSelect }: ElementBarProps) {
  const [hovered, setHovered] = useState<RoomType | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleImpulseClick = () => {
    window.location.href = '/' // springt in den Impuls-Raum
  }

  return (
    <>
      {/* ---------- ELEMENT SYMBOLREIHE ---------- */}
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
                transition-transform duration-200
                ${isActive ? 'bg-white/20' : 'bg-white/10'}
                ${hovered === el.mode ? 'scale-110 shadow-lg' : 'scale-100'}
              `}
            >
              {el.icon}
            </button>
          )
        })}
      </div>

      {/* ---------- IMPULS BUTTON SEPARAT ---------- */}
      {mounted &&
        ReactDOM.createPortal(
          <div
            style={{
              position: 'fixed',
              bottom: 128,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              pointerEvents: 'auto',
            }}
          >
            <ImpulseButton room="impuls" onClick={handleImpulseClick} size={88} />
          </div>,
          document.body
        )}
    </>
  )
}
