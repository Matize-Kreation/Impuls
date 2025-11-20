'use client'

import Link from 'next/link'
import Image from 'next/image'
import ImpulsRoom from './ImpulsRoom'
import { RoomType } from './types'

interface NavigationProps {
  currentRoom: RoomType
}

const rooms: { id: RoomType; path: string; image: string }[] = [
  { id: 'impuls', path: '/', image: '/impuls-raum.png' },
  { id: 'erde', path: '/erde', image: '/element-erde.png' },
  { id: 'wasser', path: '/wasser', image: '/element-wasser.png' },
  { id: 'feuer', path: '/feuer', image: '/element-feuer.png' },
  { id: 'wind', path: '/wind', image: '/element-wind.png' },
  { id: 'aether', path: '/aether', image: '/element-aether.png' },
]

export default function Navigation({ currentRoom }: NavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full flex flex-col items-center pointer-events-none z-50">
      {/* ---------- Separiertes Impuls-Symbol (nicht im Impulsraum) ---------- */}
      {currentRoom !== 'impuls' && (
        <div className="absolute -top-16 z-50 pointer-events-auto">
          <Link href="/">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md shadow-xl transition-transform duration-300 hover:scale-105 active:scale-95"
              role="button"
              aria-label="Impuls"
            >
              <Image
                src="/impuls-raum.png"
                alt="Impuls"
                width={56}
                height={56}
                className="select-none pointer-events-none"
              />
            </div>
          </Link>
        </div>
      )}

      {/* ---------- Einheitliche Elementenleiste ---------- */}
      <nav
        aria-label="Element navigation"
        className="pointer-events-auto w-full max-w-md mx-auto bg-black/30 backdrop-blur-sm rounded-t-2xl px-6 py-3 flex justify-center gap-6 relative"
      >
        {rooms
          .filter(r => r.id !== 'impuls') // Impuls-Symbol ist separat
          .map(room => {
            const isActive = currentRoom === room.id
            return (
              <Link key={room.path} href={room.path} className="no-underline">
                <div
                  className={`relative w-12 h-12 flex items-center justify-center rounded-full transition-transform duration-300
                    ${isActive ? 'active-room' : 'inactive-room group'}
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Image
                    src={room.image}
                    alt={room.id}
                    width={48}
                    height={48}
                    className="w-10 h-10 select-none pointer-events-none"
                  />
                  <span
                    aria-hidden
                    className={`absolute inset-0 rounded-full pointer-events-none
                      ${isActive ? 'holo-ring holo-anim' : 'group-hover:holo-ring-hover'}
                    `}
                  />
                </div>
              </Link>
            )
          })}
      </nav>

      {/* ---------- Impuls-Raum Canvas ---------- */}
      {currentRoom === 'impuls' && <ImpulsRoom />}

      <style jsx>{`
        @keyframes breathe {
          0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
          50% { transform: scale(1.08); filter: drop-shadow(0 6px 18px rgba(99,102,241,0.25)); }
          100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
        }

        @keyframes holoPulse {
          0% { box-shadow: 0 0 0 0 rgba(139,92,246,0.18), 0 0 12px rgba(139,92,246,0.12); }
          70% { box-shadow: 0 0 26px 8px rgba(139,92,246,0.06), 0 0 32px rgba(139,92,246,0.08); }
          100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.00), 0 0 12px rgba(139,92,246,0.12); }
        }

        .active-room {
          animation: breathe 2200ms ease-in-out infinite;
          transform-origin: center;
        }

        .inactive-room:hover {
          transform: translateY(-6px) scale(1.03);
        }

        .holo-ring {
          box-shadow: 0 6px 20px rgba(139,92,246,0.16), inset 0 0 18px rgba(255,255,255,0.02);
          transition: box-shadow 300ms ease, transform 300ms ease;
          transform: translateY(-2px);
        }

        .holo-anim {
          animation: holoPulse 2800ms ease-in-out infinite;
        }

        .group:hover .holo-ring-hover {
          box-shadow: 0 10px 30px rgba(99,102,241,0.12);
          transform: translateY(-2px) scale(1.03);
        }

        @media (max-width: 420px) {
          .w-20.h-20 {
            width: 72px;
            height: 72px;
          }
        }
      `}</style>
    </div>
  )
}
