'use client'

import { useEffect, useRef, useState } from "react"

export default function ImpulsRoom() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let pulseRadius = 50
    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      time += 0.016

      const breathingCycle = Math.sin(time * 0.1) * 0.5 + 0.5
      pulseRadius = 30 + breathingCycle * 50

      for (let i = 0; i < 3; i++) {
        const radius = pulseRadius + i * 20
        const opacity = (0.4 - i * 0.1) * (isActive ? 1.5 : 1)

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
        gradient.addColorStop(0, `rgba(74, 144, 226, ${opacity})`)
        gradient.addColorStop(0.7, `rgba(100, 200, 255, ${opacity * 0.5})`)
        gradient.addColorStop(1, "rgba(74, 144, 226, 0)")

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      for (let i = 0; i < 8; i++) {
        const angle = time * 0.5 + (i * Math.PI) / 4
        const distance = pulseRadius + 30
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance

        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time + i) * 0.2})`
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleImpulsActivation = () => {
      setIsActive(true)
      setTimeout(() => setIsActive(false), 2000)
    }

    window.addEventListener("impuls-activated", handleImpulsActivation)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("impuls-activated", handleImpulsActivation)
    }
  }, [isActive])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
}
