import React, { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'

/**
 * Compact XP bar shown in the header.
 *  - XP = totalDone * 10 (1 lesson/problem/step completed = +10 XP)
 *  - Level boundary every 100 XP (level = floor(xp / 100) + 1).
 *  - Animates fill on change with a smooth transition + shimmer overlay.
 */
export default function XPBar({ totalDone }) {
  const xp = totalDone * 10
  const level = Math.floor(xp / 100) + 1
  const inLevel = xp % 100   // 0..99
  const pct = inLevel  // already a percentage

  // Smooth count-up for the XP number when it changes (e.g. mark complete)
  const [displayedXp, setDisplayedXp] = useState(xp)
  useEffect(() => {
    if (displayedXp === xp) return
    const diff = xp - displayedXp
    const start = displayedXp
    const t0 = performance.now()
    const dur = 600
    let raf = 0
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayedXp(Math.round(start + diff * eased))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [xp]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="hidden md:flex items-center gap-2.5">
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-brand-600/10 ring-1 ring-brand-600/30 text-brand-700 text-[11px] font-display font-bold tracking-wider">
        <Zap className="w-3 h-3" />
        LV {level}
      </div>
      <div className="relative w-32 h-2.5 rounded-full bg-ink-200/60 overflow-hidden ring-1 ring-ink-300/30">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out shimmer-overlay"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, rgb(var(--brand-500)), rgb(var(--brand-700)))',
            boxShadow: '0 0 12px -2px rgb(var(--brand-600) / 0.7)'
          }}
        />
      </div>
      <div className="text-[11px] text-ink-600 tabular-nums font-mono">
        <span className="text-ink-800 font-semibold">{displayedXp}</span>
        <span className="text-ink-400"> xp</span>
      </div>
    </div>
  )
}
