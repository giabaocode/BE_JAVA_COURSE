// ============================================================================
//  Streak tracker — counts consecutive days the user marked at least one item.
//  Pure localStorage; no network. Call recordActivity() on every "Mark Complete".
// ============================================================================

const KEY = 'java-bootcamp-streak-v1'

function today() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function daysBetween(aStr, bStr) {
  const a = new Date(aStr + 'T00:00:00')
  const b = new Date(bStr + 'T00:00:00')
  return Math.round((b - a) / (24 * 3600 * 1000))
}

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { streak: 0, lastDate: null }
    const parsed = JSON.parse(raw)
    return { streak: parsed.streak || 0, lastDate: parsed.lastDate || null }
  } catch {
    return { streak: 0, lastDate: null }
  }
}

function write(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ }
}

/** Returns the live streak. If lastDate is older than yesterday, streak is dead. */
export function getStreak() {
  const { streak, lastDate } = read()
  if (!lastDate) return 0
  const gap = daysBetween(lastDate, today())
  if (gap <= 1) return streak
  return 0   // missed at least one full day → broken
}

/**
 * Record activity for today. Returns the new streak value.
 *  - Same day as lastDate → streak unchanged.
 *  - Exactly +1 day → streak + 1.
 *  - More than 1 day gap → streak resets to 1.
 *  - First activity ever → streak = 1.
 */
export function recordActivity() {
  const { streak, lastDate } = read()
  const t = today()
  let newStreak
  if (!lastDate) {
    newStreak = 1
  } else if (lastDate === t) {
    return streak   // already counted today
  } else {
    const gap = daysBetween(lastDate, t)
    newStreak = gap === 1 ? streak + 1 : 1
  }
  write({ streak: newStreak, lastDate: t })
  return newStreak
}
