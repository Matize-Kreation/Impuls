// components/ImpulseButton.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { RoomType } from './types'

interface ImpulseButtonProps {
  room: RoomType
  onClick: () => void
  size?: number // px
  ariaLabel?: string
}

const roomStyles: Record<
  RoomType,
  { gradient: string; hover: string; glow: string; text: string }
> = {
  impuls: {
    gradient: 'from-blue-500/80 via-blue-600/80 to-purple-600/80',
    hover: 'hover:from-blue-400/90 hover:to-purple-500/90',
    glow: 'shadow-[0_0_20px_2px_rgba(74,144,226,0.4)] hover:shadow-[0_0_30px_6px_rgba(74,144,226,0.6)]',
    text: 'IMPULS',
  },
  erde: {
    gradient: 'from-green-500/80 via-green-600/80 to-emerald-600/80',
    hover: 'hover:from-green-400/90 hover:to-emerald-500/90',
    glow: 'shadow-[0_0_20px_2px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_6px_rgba(34,197,94,0.6)]',
    text: 'ERDE',
  },
  wasser: {
    gradient: 'from-cyan-500/80 via-blue-500/80 to-blue-600/80',
    hover: 'hover:from-cyan-400/90 hover:to-blue-500/90',
    glow: 'shadow-[0_0_20px_2px_rgba(14,165,233,0.4)] hover:shadow-[0_0_30px_6px_rgba(14,165,233,0.6)]',
    text: 'WASSER',
  },
  feuer: {
    gradient: 'from-red-500/80 via-orange-500/80 to-yellow-500/80',
    hover: 'hover:from-red-400/90 hover:to-orange-400/90',
    glow: 'shadow-[0_0_20px_2px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_6px_rgba(239,68,68,0.6)]',
    text: 'FEUER',
  },
  wind: {
    gradient: 'from-sky-500/80 via-indigo-500/80 to-purple-500/80',
    hover: 'hover:from-sky-400/90 hover:to-indigo-400/90',
    glow: 'shadow-[0_0_20px_2px_rgba(96,165,250,0.4)] hover:shadow-[0_0_30px_6px_rgba(96,165,250,0.6)]',
    text: 'WIND',
  },
  aether: {
    gradient: 'from-purple-500/80 via-pink-500/80 to-pink-600/80',
    hover: 'hover:from-purple-400/90 hover:to-pink-500/90',
    glow: 'shadow-[0_0_20px_2px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_6px_rgba(168,85,247,0.6)]',
    text: 'ÄTHER',
  },
}

export default function ImpulseButton({
  room,
  onClick,
  size = 70,
  ariaLabel,
}: ImpulseButtonProps) {
  const styles = roomStyles[room]
  const [isPressed, setIsPressed] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      // cleanup timeout on unmount
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleActivate = () => {
    setIsPressed(true)
    try {
      onClick()
    } finally {
      // keep the press state for a short animation and cleanup later
      timeoutRef.current = window.setTimeout(() => {
        setIsPressed(false)
        timeoutRef.current = null
      }, 600)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleActivate()
    }
  }

  return (
    <button
      type="button"
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      aria-pressed={isPressed}
      aria-label={ariaLabel ?? styles.text}
      className={`
        relative flex items-center justify-center
        text-white font-bold tracking-wider text-sm
        bg-gradient-to-tr ${styles.gradient} ${styles.hover}
        ${styles.glow} border border-white/20
        backdrop-blur-md overflow-hidden
        transition-all duration-300 ease-out
        active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/20
        ${isPressed ? 'scale-105' : 'scale-100'}
      `}
      style={
        {
          width: size,
          height: size,
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
        } as React.CSSProperties
      }
    >
      <span style={{ pointerEvents: 'none' }}>{styles.text}</span>

      <span
        aria-hidden
        className={`
          absolute inset-0 rounded-full pointer-events-none
          transition-all duration-300
          ${isPressed ? 'ring-4 ring-white/50 scale-110 bg-white/10' : ''}
        `}
      />
    </button>
  )
}
