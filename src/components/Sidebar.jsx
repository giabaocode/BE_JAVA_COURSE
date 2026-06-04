import React, { useState, useMemo, useDeferredValue, useCallback } from 'react'
import {
  ChevronRight, ChevronDown, BookOpen, Code2, Server, Briefcase, Bot,
  CheckCircle2, Circle, Search, X
} from 'lucide-react'
import ProgressBar from './ProgressBar.jsx'

const ICONS = {
  'phase-1': BookOpen,
  'phase-2': Code2,
  'phase-3': Server,
  'phase-4': Briefcase,
  'phase-5': Bot
}

// Walk curriculum ONCE per completedMap change, build O(1) lookup maps.
// Previously phasePct/modulePct/lessonProgress ran on EVERY render — for a 125-lesson
// tree with 200 problems, that's ~thousands of operations per keystroke / nav click.
function buildProgressMap(curriculum, completedMap) {
  const phaseStats = {}
  const moduleStats = {}
  const lessonStats = {}

  curriculum.phases.forEach(phase => {
    let phaseD = 0, phaseT = 0
    phase.modules.forEach(mod => {
      let modD = 0, modT = 0
      mod.lessons.forEach(lesson => {
        let done = 0, total
        if (lesson.problems) {
          total = lesson.problems.length
          for (const p of lesson.problems) {
            if (completedMap[`${lesson.id}::${p.id}`]) done++
          }
        } else if (lesson.steps) {
          total = lesson.steps.length
          for (const s of lesson.steps) {
            if (completedMap[`${lesson.id}::${s.id}`]) done++
          }
        } else {
          total = 1
          if (completedMap[`${lesson.id}::__lesson__`]) done = 1
        }
        lessonStats[lesson.id] = {
          done,
          total,
          fullyDone: total > 0 && done === total
        }
        modD += done; modT += total
      })
      moduleStats[mod.id] = {
        d: modD,
        t: modT,
        pct: modT === 0 ? 0 : Math.round((modD / modT) * 100)
      }
      phaseD += modD; phaseT += modT
    })
    phaseStats[phase.id] = {
      d: phaseD,
      t: phaseT,
      pct: phaseT === 0 ? 0 : Math.round((phaseD / phaseT) * 100)
    }
  })

  return { phaseStats, moduleStats, lessonStats }
}

// Memoized leaf — re-renders ONLY when its specific lesson's progress or active state changes.
const LessonItem = React.memo(function LessonItem({ lesson, stats, isActive, onSelect }) {
  return (
    <li>
      <button
        onClick={() => onSelect(lesson.id)}
        className={`w-full flex items-start gap-1.5 px-2 py-1.5 rounded text-left text-xs leading-tight transition-colors border-l-2
          ${isActive
            ? 'bg-brand-50 text-brand-700 font-semibold border-brand-600 shadow-glow-sm'
            : 'text-ink-600 border-transparent hover:bg-ink-100 hover:text-ink-800'}
        `}
      >
        {stats.fullyDone
          ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
          : <Circle className="w-3.5 h-3.5 text-ink-300 mt-0.5 flex-shrink-0" />}
        <span className="flex-1">{lesson.title}</span>
        {lesson.problems && (
          <span className="text-[10px] text-ink-400 tabular-nums">{stats.done}/{stats.total}</span>
        )}
      </button>
    </li>
  )
})

export default function Sidebar({
  curriculum,
  activeLessonId,
  onSelectLesson,
  completedMap,
  totalPct,
  totalDone,
  totalAll,
  mobileOpen,
  onClose
}) {
  const [openPhases, setOpenPhases] = useState(() => {
    const s = {}
    curriculum.phases.forEach((p, i) => { s[p.id] = i === 0 })
    return s
  })
  const [openModules, setOpenModules] = useState({})
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const togglePhase = useCallback((id) => {
    setOpenPhases(s => ({ ...s, [id]: !s[id] }))
  }, [])
  const toggleModule = useCallback((id) => {
    setOpenModules(s => ({ ...s, [id]: !s[id] }))
  }, [])

  // Walk curriculum ONCE per completedMap change → O(1) lookups below.
  const progress = useMemo(
    () => buildProgressMap(curriculum, completedMap),
    [curriculum, completedMap]
  )

  // Filter uses DEFERRED query → typing stays smooth; filter computation can lag a frame.
  const filteredPhases = useMemo(() => {
    if (!deferredQuery.trim()) return curriculum.phases
    const q = deferredQuery.toLowerCase()
    return curriculum.phases.map(phase => {
      const modules = phase.modules.map(mod => {
        const lessons = mod.lessons.filter(l =>
          l.title.toLowerCase().includes(q) ||
          (l.problems || []).some(p => p.title.toLowerCase().includes(q))
        )
        return { ...mod, lessons }
      }).filter(m => m.lessons.length > 0)
      return { ...phase, modules }
    }).filter(p => p.modules.length > 0)
  }, [deferredQuery, curriculum])

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-ink-900/40 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-[320px] bg-ink-50/70 backdrop-blur-xl border-r border-brand-600/20
        shadow-[8px_0_40px_-24px_rgba(0,229,255,0.6)]
        z-40 transform transition-transform duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-5 border-b border-ink-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-brand-600 text-ink-50 flex items-center justify-center font-display font-bold shadow-glow">JB</div>
              <div>
                <div className="font-display font-bold grad-text leading-tight tracking-wide">JAVA + DSA</div>
                <div className="text-xs text-ink-500">Zero to Hero Bootcamp</div>
              </div>
            </div>
            <button className="lg:hidden text-ink-500" onClick={onClose} aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4">
            <ProgressBar value={totalDone} max={totalAll} label="Overall Progress" tone="brand" />
          </div>
        </div>

        <div className="px-4 py-3 border-b border-ink-200">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search lessons or problems..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-ink-100 text-ink-800 border border-ink-200 focus:bg-ink-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-600/30 outline-none placeholder:text-ink-400"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3 space-y-1">
          {filteredPhases.map(phase => {
            const Icon = ICONS[phase.id] || BookOpen
            const isOpen = openPhases[phase.id]
            const ps = progress.phaseStats[phase.id] || { d: 0, t: 0, pct: 0 }
            return (
              <div key={phase.id} className="mb-1">
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ink-100 text-left"
                >
                  {isOpen
                    ? <ChevronDown className="w-4 h-4 text-ink-400 flex-shrink-0" />
                    : <ChevronRight className="w-4 h-4 text-ink-400 flex-shrink-0" />}
                  <Icon className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-ink-900 truncate">{phase.title}</div>
                    <div className="mt-1">
                      <ProgressBar value={ps.d} max={ps.t} size="sm" tone="brand" />
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-ink-500 tabular-nums">{ps.pct}%</span>
                </button>
                {isOpen && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-ink-200 pl-2">
                    {phase.modules.map(mod => {
                      const mOpen = openModules[mod.id] ?? true
                      const mr = progress.moduleStats[mod.id] || { d: 0, t: 0, pct: 0 }
                      return (
                        <div key={mod.id}>
                          <button
                            onClick={() => toggleModule(mod.id)}
                            className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-ink-100 text-left"
                          >
                            {mOpen
                              ? <ChevronDown className="w-3.5 h-3.5 text-ink-400 flex-shrink-0" />
                              : <ChevronRight className="w-3.5 h-3.5 text-ink-400 flex-shrink-0" />}
                            <span className="flex-1 text-xs font-medium text-ink-700 truncate">{mod.title}</span>
                            <span className="text-[10px] text-ink-400 tabular-nums">{mr.d}/{mr.t}</span>
                          </button>
                          {mOpen && (
                            <ul className="ml-4 space-y-0.5 mt-0.5">
                              {mod.lessons.map(lesson => (
                                <LessonItem
                                  key={lesson.id}
                                  lesson={lesson}
                                  stats={progress.lessonStats[lesson.id] || { done: 0, total: 1, fullyDone: false }}
                                  isActive={activeLessonId === lesson.id}
                                  onSelect={onSelectLesson}
                                />
                              ))}
                            </ul>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
          {filteredPhases.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-ink-400">No matches</div>
          )}
        </nav>

        <div className="p-4 border-t border-ink-200 text-[11px] text-ink-500">
          Progress saved locally · {totalPct}% complete
        </div>
      </aside>
    </>
  )
}
