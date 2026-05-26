import React, { useEffect, useMemo, useState } from 'react'
import { Calendar, Loader2, Info, RefreshCcw } from 'lucide-react'
import { fetchActivityCounts, isSupabaseEnabled } from '../lib/supabase.js'

const WEEKS = 53
const DAYS = 7
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function toIso(date) { return date.toISOString().slice(0, 10) }

function intensityClass(count) {
  if (!count)        return 'bg-ink-100 hover:ring-1 hover:ring-ink-300'
  if (count === 1)   return 'bg-emerald-200 hover:ring-1 hover:ring-emerald-400'
  if (count <= 3)    return 'bg-emerald-400 hover:ring-1 hover:ring-emerald-500'
  if (count <= 6)    return 'bg-emerald-600 hover:ring-1 hover:ring-emerald-700'
  return                    'bg-emerald-800 hover:ring-1 hover:ring-emerald-900'
}

function buildGrid(counts) {
  // End on today, walk back WEEKS*DAYS days.
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  // Align grid so rightmost column ends at today.
  const startOffset = (today.getDay() + 1) % 7 // ensure last col fills
  const totalDays = WEEKS * DAYS

  const cells = []
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - (totalDays - 1 - i) + (DAYS - 1 - startOffset))
    if (d > today) { cells.push(null); continue }
    const iso = toIso(d)
    cells.push({ date: d, iso, count: counts[iso] || 0 })
  }
  // Reshape into columns (week) × rows (day-of-week)
  const weeks = []
  for (let w = 0; w < WEEKS; w++) {
    const col = []
    for (let day = 0; day < DAYS; day++) col.push(cells[w * DAYS + day])
    weeks.push(col)
  }
  return weeks
}

export function ConsistencyHeatmap({ refreshKey = 0 }) {
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(false)
  const [hover, setHover] = useState(null)

  const reload = () => {
    if (!isSupabaseEnabled()) return
    setLoading(true)
    fetchActivityCounts(WEEKS * DAYS).then(c => {
      setCounts(c); setLoading(false)
    })
  }

  useEffect(() => { reload() /* eslint-disable-next-line */ }, [refreshKey])

  const weeks = useMemo(() => buildGrid(counts), [counts])

  const totalActivities = useMemo(
    () => Object.values(counts).reduce((s, n) => s + n, 0),
    [counts]
  )
  const activeDays = useMemo(() => Object.keys(counts).length, [counts])

  // Streak calculation (consecutive days ending today)
  const streak = useMemo(() => {
    let s = 0
    const today = new Date(); today.setHours(0, 0, 0, 0)
    for (let i = 0; i < 365; i++) {
      const d = new Date(today); d.setDate(today.getDate() - i)
      if (counts[toIso(d)]) s++
      else break
    }
    return s
  }, [counts])

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <h3 className="font-semibold text-ink-900">Consistency · 365 ngày</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-ink-600">
          <span><strong className="text-ink-900 tabular-nums">{totalActivities}</strong> activities</span>
          <span><strong className="text-ink-900 tabular-nums">{activeDays}</strong> active days</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <strong className="text-emerald-700 tabular-nums">{streak}</strong> day streak
          </span>
          <button onClick={reload} className="text-ink-400 hover:text-ink-700" title="Refresh">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCcw className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!isSupabaseEnabled() && (
        <div className="mb-3 rounded-md bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs text-amber-800 flex items-center gap-2">
          <Info className="w-3.5 h-3.5" />
          Heatmap cần Supabase để load activity. Hiện đang chạy demo (rỗng).
        </div>
      )}

      <div className="relative">
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
          <div className="flex flex-col gap-[3px] pt-4">
            {DAY_LABELS.map((d, i) => (
              <div key={i} className="text-[10px] text-ink-400 h-[12px] leading-[12px]">{d}</div>
            ))}
          </div>
          <div>
            <div className="flex gap-[3px] mb-1 ml-0">
              {/* Month labels above each ~4 weeks */}
              {weeks.map((col, idx) => {
                const first = col.find(c => c)
                if (!first) return <div key={idx} className="w-[12px]" />
                const isFirstOfMonth = first.date.getDate() <= 7 && idx % 4 === 0
                return (
                  <div key={idx} className="w-[12px] text-[10px] text-ink-400">
                    {isFirstOfMonth ? MONTH_SHORT[first.date.getMonth()] : ''}
                  </div>
                )
              })}
            </div>
            <div className="flex gap-[3px]">
              {weeks.map((col, w) => (
                <div key={w} className="flex flex-col gap-[3px]">
                  {col.map((cell, d) => (
                    <div
                      key={d}
                      onMouseEnter={() => setHover(cell)}
                      onMouseLeave={() => setHover(null)}
                      className={`w-[12px] h-[12px] rounded-sm cursor-pointer transition-shadow ${cell ? intensityClass(cell.count) : 'invisible'}`}
                      title={cell ? `${cell.iso}: ${cell.count} activit${cell.count === 1 ? 'y' : 'ies'}` : ''}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {hover && (
          <div className="absolute -top-2 right-0 bg-ink-900 text-white text-[11px] px-2 py-1 rounded shadow-lg">
            <span className="font-semibold">{hover.iso}</span> · {hover.count} activit{hover.count === 1 ? 'y' : 'ies'}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-[10px] text-ink-500">
        <span>Less</span>
        <div className="w-[12px] h-[12px] rounded-sm bg-ink-100" />
        <div className="w-[12px] h-[12px] rounded-sm bg-emerald-200" />
        <div className="w-[12px] h-[12px] rounded-sm bg-emerald-400" />
        <div className="w-[12px] h-[12px] rounded-sm bg-emerald-600" />
        <div className="w-[12px] h-[12px] rounded-sm bg-emerald-800" />
        <span>More</span>
      </div>
    </div>
  )
}

export default ConsistencyHeatmap
