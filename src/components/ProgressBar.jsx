import React from 'react'

export default function ProgressBar({ value = 0, max = 100, label, size = 'md', tone = 'brand' }) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100))
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' }
  const tones = {
    brand:   'bg-brand-600 shadow-[0_0_10px_rgba(0,229,255,0.7)]',
    emerald: 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]',
    amber:   'bg-amber-400 shadow-[0_0_10px_rgba(255,176,0,0.7)]',
    rose:    'bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.7)]'
  }
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5 text-xs font-medium text-ink-600">
          <span>{label}</span>
          <span className="tabular-nums">{value}/{max} <span className="text-ink-400">· {pct}%</span></span>
        </div>
      )}
      <div className={`w-full ${heights[size]} bg-ink-200/80 rounded-full overflow-hidden ring-1 ring-inset ring-white/5`}>
        <div
          className={`${heights[size]} ${tones[tone]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
