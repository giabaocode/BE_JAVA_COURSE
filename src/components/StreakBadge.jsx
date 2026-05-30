import React from 'react'
import { Flame } from 'lucide-react'

export default function StreakBadge({ streak }) {
  const lit = streak > 0
  const big = streak >= 7   // weeklong → more dramatic flicker
  return (
    <div
      title={
        lit
          ? `${streak} ngày liên tiếp! Duy trì để giữ streak.`
          : 'Chưa có streak. Hoàn thành 1 lesson hôm nay để bắt đầu.'
      }
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-display font-bold tracking-wider transition-all duration-300 ${
        lit
          ? 'bg-amber-500/10 ring-1 ring-amber-500/40 text-amber-500'
          : 'bg-ink-100/60 ring-1 ring-ink-300/30 text-ink-500'
      }`}
    >
      <Flame
        className={`w-3.5 h-3.5 ${
          lit ? (big ? 'animate-fire-flicker text-orange-500' : 'text-amber-500') : 'text-ink-400'
        }`}
        fill={lit ? 'currentColor' : 'none'}
      />
      <span className="tabular-nums">{streak}d</span>
    </div>
  )
}
