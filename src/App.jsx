import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Menu, RotateCcw } from 'lucide-react'
import { curriculum } from './data/curriculum.js'
import Sidebar from './components/Sidebar.jsx'
import MainContent from './components/MainContent.jsx'

const STORAGE_KEY = 'java-bootcamp-progress-v1'
const ACTIVE_KEY  = 'java-bootcamp-active-lesson-v1'

function buildLessonIndex(curriculum) {
  const flat = []
  curriculum.phases.forEach(phase => {
    phase.modules.forEach(mod => {
      mod.lessons.forEach(lesson => {
        flat.push({ lesson, module: mod, phase })
      })
    })
  })
  return flat
}

function totalItems(curriculum) {
  let count = 0
  curriculum.phases.forEach(p => p.modules.forEach(m => m.lessons.forEach(l => {
    if (l.problems) count += l.problems.length
    else if (l.steps) count += l.steps.length
    else count += 1
  })))
  return count
}

export default function App() {
  const [completedMap, setCompletedMap] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch { return {} }
  })

  const flatLessons = useMemo(() => buildLessonIndex(curriculum), [])

  const [activeLessonId, setActiveLessonId] = useState(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_KEY)
      if (saved && flatLessons.some(fl => fl.lesson.id === saved)) return saved
    } catch { /* ignore */ }
    return flatLessons[0]?.lesson.id
  })

  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(completedMap)) } catch { /* ignore */ }
  }, [completedMap])

  useEffect(() => {
    if (activeLessonId) {
      try { localStorage.setItem(ACTIVE_KEY, activeLessonId) } catch { /* ignore */ }
    }
  }, [activeLessonId])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeLessonId])

  const onToggleItem = useCallback((lessonId, itemId) => {
    const key = `${lessonId}::${itemId}`
    setCompletedMap(prev => {
      const next = { ...prev }
      if (next[key]) delete next[key]
      else next[key] = true
      return next
    })
  }, [])

  const onToggleLesson = useCallback((lessonId) => {
    onToggleItem(lessonId, '__lesson__')
  }, [onToggleItem])

  const onSelectLesson = useCallback((id) => {
    setActiveLessonId(id)
    setMobileOpen(false)
  }, [])

  const current = flatLessons.find(fl => fl.lesson.id === activeLessonId) || flatLessons[0]
  const currentIdx = flatLessons.findIndex(fl => fl.lesson.id === activeLessonId)
  const hasPrev = currentIdx > 0
  const hasNext = currentIdx < flatLessons.length - 1

  const onPrev = () => hasPrev && setActiveLessonId(flatLessons[currentIdx - 1].lesson.id)
  const onNext = () => hasNext && setActiveLessonId(flatLessons[currentIdx + 1].lesson.id)

  const totalAll = useMemo(() => totalItems(curriculum), [])
  const totalDone = useMemo(() => {
    let count = 0
    curriculum.phases.forEach(p => p.modules.forEach(m => m.lessons.forEach(l => {
      if (l.problems) {
        l.problems.forEach(prob => { if (completedMap[`${l.id}::${prob.id}`]) count++ })
      } else if (l.steps) {
        l.steps.forEach(s => { if (completedMap[`${l.id}::${s.id}`]) count++ })
      } else {
        if (completedMap[`${l.id}::__lesson__`]) count++
      }
    })))
    return count
  }, [completedMap])
  const totalPct = totalAll === 0 ? 0 : Math.round((totalDone / totalAll) * 100)

  const handleReset = () => {
    if (confirm('Reset ALL progress? This cannot be undone.')) {
      setCompletedMap({})
    }
  }

  return (
    <div className="min-h-screen flex bg-ink-50">
      <Sidebar
        curriculum={curriculum}
        activeLessonId={activeLessonId}
        onSelectLesson={onSelectLesson}
        completedMap={completedMap}
        totalPct={totalPct}
        totalDone={totalDone}
        totalAll={totalAll}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-ink-200">
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden btn-ghost p-2"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Bootcamp</div>
                <div className="text-sm font-bold text-ink-900">{current?.phase.title}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-xs text-ink-500 tabular-nums">
                <span className="font-semibold text-ink-800">{totalDone}</span>
                <span className="text-ink-400"> / {totalAll}</span>
                <span className="ml-1.5">· {totalPct}%</span>
              </div>
              <button
                onClick={handleReset}
                className="btn-ghost text-xs"
                title="Reset all progress"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>
        </header>

        <MainContent
          lesson={current?.lesson}
          phase={current?.phase}
          module={current?.module}
          completedMap={completedMap}
          onToggleItem={onToggleItem}
          onToggleLesson={onToggleLesson}
          onPrev={onPrev}
          onNext={onNext}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      </main>
    </div>
  )
}
