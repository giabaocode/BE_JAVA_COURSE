import React, { useEffect, useRef } from 'react'

/**
 * Lightweight animated background — floating glowing particles drifting upward,
 * connected by faint lines when close. Theme-aware: reads --glow-color CSS var
 * every ~30 frames so it follows the light/dark toggle.
 *
 * Perf-tuned (2026-06-03):
 * - NO per-particle shadowBlur (was the dominant cost; ~3-5× speedup).
 * - Lines drawn every other frame, batched into a single stroke path.
 * - Bbox pre-check before sqrt-distance for line draws.
 * - Honors prefers-reduced-motion → animation skipped entirely.
 * - Default density reduced 60 → 35; scales with viewport width.
 */
export default function ParticleBackground({ density = 35 }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width = 0, height = 0, dpr = 1

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width  = width * dpr
      canvas.height = height * dpr
      canvas.style.width  = width  + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const init = () => {
      const count = Math.min(density, Math.floor(window.innerWidth / 32))
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -Math.random() * 0.3 - 0.05,
        r: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.5 + 0.35,
        twinklePhase: Math.random() * Math.PI * 2,
      }))
    }

    const readGlowColor = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue('--glow-color').trim()
      return v || '0 229 255'
    }

    let glow = readGlowColor()
    let frameCount = 0
    let running = true

    const onMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }
    const onLeave = () => {
      mouseRef.current.x = -9999
      mouseRef.current.y = -9999
    }
    const onResize = () => { resize(); init() }

    const tick = () => {
      if (!running) return
      frameCount++
      if (frameCount % 30 === 0) glow = readGlowColor()

      ctx.clearRect(0, 0, width, height)
      const parts = particlesRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Connecting lines — every other frame, batched single path
      if (frameCount % 2 === 0) {
        ctx.strokeStyle = `rgb(${glow} / 0.12)`
        ctx.lineWidth = 0.6
        ctx.beginPath()
        for (let i = 0; i < parts.length; i++) {
          const a = parts[i]
          for (let j = i + 1; j < parts.length; j++) {
            const b = parts[j]
            const dx = a.x - b.x
            if (dx > 118 || dx < -118) continue
            const dy = a.y - b.y
            if (dy > 118 || dy < -118) continue
            if (dx * dx + dy * dy < 14000) {
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
            }
          }
        }
        ctx.stroke()
      }

      // Particles — no shadowBlur (kills perf); compensate with slightly larger r
      for (const p of parts) {
        p.x += p.vx
        p.y += p.vy
        p.twinklePhase += 0.04

        const dxm = p.x - mx
        const dym = p.y - my
        const dm2 = dxm * dxm + dym * dym
        if (dm2 < 14400 && dm2 > 0.01) {
          const dist = Math.sqrt(dm2)
          const push = (1 - dist / 120) * 0.6
          p.x += (dxm / dist) * push
          p.y += (dym / dist) * push
        }

        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        const twinkle = 0.7 + Math.sin(p.twinklePhase) * 0.3
        const a = p.alpha * twinkle
        ctx.fillStyle = `rgb(${glow} / ${a})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(rafRef.current)
      } else if (!running) {
        running = true
        tick()
      }
    }

    resize()
    init()
    tick()

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.55 }}
    />
  )
}
