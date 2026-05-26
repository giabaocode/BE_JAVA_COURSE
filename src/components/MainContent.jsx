import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  CheckCircle2, Circle, ExternalLink, Lightbulb, BookOpen,
  Code2, Target, Wrench, Sparkles, ArrowRight, ArrowLeft, ListChecks,
  Brain, Cog, MessageSquareQuote, Copy, Check, Languages, Rocket,
  Timer, BookMarked, Bug, Calendar, Settings, Pause, Play, RotateCcw,
  ChevronDown, ChevronUp, Mail, Bell, EyeOff, Eye, AlertCircle, Loader2, Save
} from 'lucide-react'
import ProgressBar from './ProgressBar.jsx'
import { FeynmanModal } from './FeynmanModal.jsx'
import { SyntaxVaultDrawer } from './SyntaxVaultDrawer.jsx'
import { ConsistencyHeatmap } from './ConsistencyHeatmap.jsx'
import { BugJournal } from './BugJournal.jsx'
import {
  fetchSettings, saveSettings, isSupabaseEnabled, logActivity
} from '../lib/supabase.js'

// ============================================================================
// Constants & helpers
// ============================================================================
const DIFF_CLASS = {
  Easy: 'chip-easy',
  Medium: 'chip-medium',
  Hard: 'chip-hard'
}

const TYPE_META = {
  theory:   { icon: BookOpen, label: 'Theory · Lý thuyết',          color: 'bg-brand-50 text-brand-700' },
  practice: { icon: Code2,    label: 'Practice · Thực hành',        color: 'bg-emerald-50 text-emerald-700' },
  problems: { icon: Target,   label: 'Problem Set · Bài tập',       color: 'bg-amber-50 text-amber-700' },
  project:  { icon: Wrench,   label: 'Project · Dự án',             color: 'bg-rose-50 text-rose-700' },
  ai:       { icon: Sparkles, label: 'AI Workflow · Quy trình AI',  color: 'bg-purple-50 text-purple-700' }
}

const isBilingual = (v) => v && typeof v === 'object' && !Array.isArray(v) && ('en' in v || 'vi' in v)
const toHtml = (v) => !v ? null : (typeof v === 'string' ? v : (isBilingual(v) ? (v.vi || v.en) : null))
const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

// ============================================================================
// Small UI primitives
// ============================================================================
function CopyButton({ text, label = 'Copy' }) {
  const [done, setDone] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500) }}
      className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/20 transition-colors"
    >
      {done ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {done ? 'Copied!' : label}
    </button>
  )
}

const Block = ({ children, className = '' }) => <div className={`card p-6 mb-5 ${className}`}>{children}</div>

function BilingualText({ value }) {
  if (!value) return null
  if (typeof value === 'string') {
    return <div className="prose-md max-w-none" dangerouslySetInnerHTML={{ __html: value }} />
  }
  return (
    <div className="space-y-4">
      {value.en && (
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-500 mb-1.5 inline-flex items-center gap-1">
            <Languages className="w-3 h-3" /> English
          </div>
          <div className="prose-md max-w-none text-ink-700" dangerouslySetInnerHTML={{ __html: value.en }} />
        </div>
      )}
      {value.vi && (
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700 mb-1.5 inline-flex items-center gap-1">
            <Languages className="w-3 h-3" /> Tiếng Việt
          </div>
          <div className="prose-md max-w-none text-ink-800 [&_code]:bg-ink-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[13px] [&_code]:font-mono [&_code]:text-brand-700 [&_strong]:text-ink-900 [&_h3]:font-semibold [&_h3]:text-ink-900 [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_p]:mb-3 [&_p]:leading-relaxed [&_pre]:bg-ink-900 [&_pre]:text-ink-100 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-[12px] [&_pre]:font-mono [&_pre]:my-3" dangerouslySetInnerHTML={{ __html: value.vi }} />
        </div>
      )}
    </div>
  )
}

function MentalModelCard({ value }) {
  if (!value) return null
  return (
    <div className="mb-5 rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 overflow-hidden shadow-soft">
      <div className="px-5 py-3 bg-indigo-100/60 border-b border-indigo-200 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-indigo-900 leading-tight">Mental Model</div>
          <div className="text-[11px] text-indigo-700">Luồng tư duy — hình dung trước khi code</div>
        </div>
      </div>
      <div className="px-5 py-4"><BilingualText value={value} /></div>
    </div>
  )
}

function UnderTheHoodCard({ value }) {
  if (!value) return null
  return (
    <div className="mb-5 rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden shadow-soft">
      <div className="px-5 py-3 bg-amber-100/60 border-b border-amber-200 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
          <Cog className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-amber-900 leading-tight">Under the Hood</div>
          <div className="text-[11px] text-amber-700">Cơ chế bên dưới — hiểu sâu, không hiểu vẹt</div>
        </div>
      </div>
      <div className="px-5 py-4"><BilingualText value={value} /></div>
    </div>
  )
}

function SocraticPromptsCard({ prompts }) {
  if (!prompts || prompts.length === 0) return null
  return (
    <div className="mb-5 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-fuchsia-50 overflow-hidden shadow-soft">
      <div className="px-5 py-3 bg-purple-100/60 border-b border-purple-200 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
          <MessageSquareQuote className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-purple-900 leading-tight">Socratic AI Prompts</div>
          <div className="text-[11px] text-purple-700">Copy-paste vào AI — bắt AI hỏi ngược bạn, KHÔNG cho đáp án</div>
        </div>
      </div>
      <div className="px-5 py-4 space-y-3">
        {prompts.map((p, i) => (
          <div key={i} className="rounded-lg bg-white border border-purple-200 overflow-hidden">
            <div className="px-3 py-2 bg-purple-50 border-b border-purple-200 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-purple-900">{p.title}</span>
              <button
                onClick={() => navigator.clipboard?.writeText(p.prompt)}
                className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md text-purple-700 hover:bg-purple-100"
              >
                <Copy className="w-3.5 h-3.5" /> Copy prompt
              </button>
            </div>
            <pre className="p-3 text-[12.5px] leading-6 text-ink-700 whitespace-pre-wrap font-mono bg-white max-h-72 overflow-y-auto scrollbar-thin">{p.prompt}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}

function KeyTakeawaysCard({ value }) {
  if (!value) return null
  const items = Array.isArray(value) ? value : (value.vi || value.en || [])
  if (items.length === 0) return null
  return (
    <Block>
      <h3 className="font-semibold text-ink-900 mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-brand-600" /> Key Takeaways · Điểm cốt lõi
      </h3>
      <ul className="space-y-2">
        {items.map((t, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-ink-800">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: t }} />
          </li>
        ))}
      </ul>
    </Block>
  )
}

function CodeBlock({ example }) {
  const lang = example.lang || 'java'
  return (
    <div className="mt-4">
      {example.title && <div className="text-sm font-semibold text-ink-800 mb-1">{example.title}</div>}
      {example.description && <p className="text-sm text-ink-600 mb-1">{example.description}</p>}
      <div className="flex items-center justify-between px-3 py-1.5 bg-ink-800 text-ink-300 text-[11px] font-mono rounded-t-lg border-b border-ink-700">
        <span>{lang}</span>
        <CopyButton text={example.code} />
      </div>
      <pre className="code-block rounded-t-none whitespace-pre"><code>{example.code}</code></pre>
    </div>
  )
}

// ============================================================================
// Accordion — for hints & solution (collapsed by default)
// ============================================================================
function Accordion({ icon: Icon, title, tone = 'amber', defaultOpen = false, children, locked, lockMessage }) {
  const [open, setOpen] = useState(defaultOpen)
  const tones = {
    amber:   { wrap: 'border-amber-300 bg-amber-50/40',     head: 'bg-amber-100/60 text-amber-900', body: 'text-amber-950' },
    emerald: { wrap: 'border-emerald-300 bg-emerald-50/40', head: 'bg-emerald-100/60 text-emerald-900', body: 'text-emerald-950' },
    brand:   { wrap: 'border-brand-300 bg-brand-50/40',     head: 'bg-brand-100/60 text-brand-900',   body: 'text-brand-950' }
  }
  const t = tones[tone]
  return (
    <div className={`rounded-xl border-2 mb-3 overflow-hidden ${t.wrap}`}>
      <button
        onClick={() => !locked && setOpen(o => !o)}
        className={`w-full px-4 py-2.5 flex items-center gap-2 ${t.head} text-left`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="font-semibold text-sm flex-1">{title}</span>
        {locked
          ? <span className="text-[11px] inline-flex items-center gap-1 opacity-70"><EyeOff className="w-3.5 h-3.5" /> mở khóa khi tự thử</span>
          : (open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
      </button>
      {open && !locked && (
        <div className={`px-4 py-3 text-sm leading-relaxed ${t.body}`}>{children}</div>
      )}
      {open && locked && (
        <div className="px-4 py-3 text-sm text-ink-500 italic">{lockMessage}</div>
      )}
    </div>
  )
}

// Helpers to render hints/solution that may be string, array, or { en, vi }
function renderHintsContent(hints) {
  if (!hints) return null
  if (Array.isArray(hints)) {
    return <ul className="list-disc pl-5 space-y-1">{hints.map((h, i) => <li key={i} dangerouslySetInnerHTML={{ __html: h }} />)}</ul>
  }
  if (typeof hints === 'string') return <div dangerouslySetInnerHTML={{ __html: hints }} />
  return <BilingualText value={hints} />
}

function renderSolutionContent(solution) {
  if (!solution) return null
  if (typeof solution === 'string') return <div dangerouslySetInnerHTML={{ __html: solution }} />
  if (Array.isArray(solution)) {
    return <div className="space-y-3">{solution.map((s, i) => <CodeBlock key={i} example={s} />)}</div>
  }
  if (solution.code) return <CodeBlock example={solution} />
  return <BilingualText value={solution} />
}

// ============================================================================
// Mock Interview timer card (sticky)
// ============================================================================
function MockTimerCard({ seconds, running, onStart, onPause, onReset, onAddFive }) {
  const low = seconds <= 60
  const done = seconds === 0
  return (
    <div className={`sticky top-16 z-10 mb-5 rounded-xl border-2 overflow-hidden shadow-card ${done ? 'border-rose-400 bg-rose-50' : low ? 'border-rose-300 bg-rose-50 animate-pulse' : 'border-ink-900 bg-ink-900 text-white'}`}>
      <div className="px-4 py-3 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${done || low ? 'bg-rose-600 text-white' : 'bg-white text-ink-900'}`}>
          <Timer className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className={`text-[10px] uppercase tracking-wider font-bold ${done || low ? 'text-rose-700' : 'text-ink-400'}`}>
            Mock Interview Mode
          </div>
          <div className={`text-3xl font-bold tabular-nums leading-none mt-0.5 ${done || low ? 'text-rose-700' : 'text-white'}`}>
            {fmtTime(seconds)}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {!running
            ? <button onClick={onStart} disabled={done} className={`btn text-xs ${done ? 'bg-ink-300 text-ink-500 cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}><Play className="w-3.5 h-3.5" /> Start</button>
            : <button onClick={onPause} className="btn text-xs bg-amber-500 text-white hover:bg-amber-600"><Pause className="w-3.5 h-3.5" /> Pause</button>}
          <button onClick={onAddFive} className="btn-ghost text-xs text-white hover:bg-white/10">+5m</button>
          <button onClick={onReset} className="btn-ghost text-xs text-white hover:bg-white/10"><RotateCcw className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      {done && (
        <div className="px-4 py-2 bg-rose-100 text-rose-900 text-xs font-semibold flex items-center gap-2 border-t border-rose-200">
          <AlertCircle className="w-4 h-4" /> Hết giờ! Stop. Bây giờ review: bạn đã giải được đến đâu, miss edge case gì?
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Settings popover (email reminder)
// ============================================================================
function SettingsPopover({ open, onClose, anchorBtnRef }) {
  const [settings, setSettings] = useState({ email: '', reminder_enabled: false, reminder_time: '08:00' })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetchSettings().then(s => {
      if (s) setSettings({
        email: s.email || '',
        reminder_enabled: !!s.reminder_enabled,
        reminder_time: s.reminder_time?.slice(0, 5) || '08:00'
      })
      setLoading(false)
    })
  }, [open])

  const save = async () => {
    setSaving(true)
    const ok = await saveSettings({
      email: settings.email.trim() || null,
      reminder_enabled: settings.reminder_enabled,
      reminder_time: settings.reminder_time
    })
    setSaving(false)
    setSavedMsg(ok ? 'Đã lưu ✓' : 'Lỗi — kiểm tra Supabase config')
    setTimeout(() => setSavedMsg(''), 2500)
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-[340px] z-40 bg-white rounded-xl shadow-2xl border border-ink-200 overflow-hidden">
        <div className="px-4 py-3 bg-ink-50 border-b border-ink-200 flex items-center gap-2">
          <Settings className="w-4 h-4 text-ink-600" />
          <span className="font-semibold text-sm text-ink-900">Settings · Cài đặt</span>
        </div>
        <div className="p-4 space-y-3">
          {!isSupabaseEnabled() && (
            <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded p-2">
              Cần cấu hình Supabase env để lưu settings.
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center py-6 text-ink-400">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : (
            <>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.reminder_enabled}
                  onChange={e => setSettings(s => ({ ...s, reminder_enabled: e.target.checked }))}
                  className="mt-0.5"
                />
                <div className="flex-1 text-sm">
                  <div className="font-semibold text-ink-900 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-500" />
                    🔔 Nhận nhắc nhở học tập qua Email
                  </div>
                  <div className="text-xs text-ink-500 mt-0.5">
                    Gửi reminder mỗi ngày để giữ streak.
                  </div>
                </div>
              </label>

              <div className={settings.reminder_enabled ? '' : 'opacity-40 pointer-events-none'}>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> Email
                </div>
                <input
                  type="email"
                  value={settings.email}
                  onChange={e => setSettings(s => ({ ...s, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full px-3 py-1.5 text-sm rounded-md border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none"
                />

                <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-1 mt-3">Reminder time</div>
                <input
                  type="time"
                  value={settings.reminder_time}
                  onChange={e => setSettings(s => ({ ...s, reminder_time: e.target.value }))}
                  className="w-full px-3 py-1.5 text-sm rounded-md border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none"
                />
                <div className="text-[10px] text-ink-400 mt-1">
                  Lịch chạy thực tế phụ thuộc Supabase Edge Function / cron của bạn.
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-ink-100">
                <span className="text-xs text-emerald-600 font-semibold">{savedMsg}</span>
                <button
                  onClick={save}
                  disabled={saving}
                  className="btn bg-brand-600 text-white hover:bg-brand-700 text-xs"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Lưu
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

// ============================================================================
// Project step card (bilingual)
// ============================================================================
function StepCard({ step, idx, done, onToggle }) {
  return (
    <div className={`border-2 rounded-xl overflow-hidden transition-colors ${done ? 'bg-emerald-50/40 border-emerald-300' : 'bg-white border-ink-200'}`}>
      <div className="p-4 flex items-start gap-3">
        <button onClick={onToggle} className="flex-shrink-0 mt-1" aria-label="Toggle">
          {done ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6 text-ink-300 hover:text-ink-400" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">Step {idx + 1}</span>
            <h4 className={`font-semibold text-ink-900 ${done ? 'line-through text-ink-400' : ''}`}>{step.title}</h4>
          </div>
          {step.description && (
            <div className="text-sm leading-relaxed text-ink-700 mb-3"><BilingualText value={step.description} /></div>
          )}
          {step.mentalModel && (
            <div className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50/60 overflow-hidden">
              <div className="px-3 py-1.5 bg-indigo-100/70 border-b border-indigo-200 text-[11px] font-semibold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" /> Mental Model · Luồng tư duy
              </div>
              <div className="p-3 text-sm text-ink-800 [&_code]:bg-white [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[12px] [&_code]:font-mono [&_code]:text-indigo-700 [&_strong]:text-ink-900 [&_pre]:bg-ink-900 [&_pre]:text-ink-100 [&_pre]:p-3 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre]:text-[12px] [&_pre]:font-mono [&_pre]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_p]:mb-2">
                <BilingualText value={step.mentalModel} />
              </div>
            </div>
          )}
          {step.socraticPrompts && step.socraticPrompts.length > 0 && (
            <div className="mt-3 rounded-lg border border-purple-200 bg-purple-50/60 overflow-hidden">
              <div className="px-3 py-1.5 bg-purple-100/70 border-b border-purple-200 text-[11px] font-semibold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                <MessageSquareQuote className="w-3.5 h-3.5" /> Socratic Prompts · Hỏi AI trước khi code
              </div>
              <div className="p-3 space-y-2">
                {step.socraticPrompts.map((p, i) => (
                  <div key={i} className="rounded-md bg-white border border-purple-200 overflow-hidden">
                    <div className="px-2.5 py-1.5 bg-purple-50 border-b border-purple-100 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-purple-900">{p.title}</span>
                      <button onClick={() => navigator.clipboard?.writeText(p.prompt)} className="text-[11px] inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-purple-700 hover:bg-purple-100">
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                    <pre className="p-2.5 text-[12px] leading-5 text-ink-700 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto scrollbar-thin">{p.prompt}</pre>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step.hints && step.hints.length > 0 && (
            <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 mb-1.5 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> Technical Hints · Gợi ý kỹ thuật
              </div>
              <ul className="text-sm text-amber-900 list-disc pl-5 space-y-1">
                {step.hints.map((h, i) => <li key={i} dangerouslySetInnerHTML={{ __html: h }} />)}
              </ul>
            </div>
          )}
          {step.deliverable && (
            <div className="mt-3 text-xs flex items-start gap-1.5 text-ink-600">
              <ListChecks className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-ink-500" />
              <span><strong className="text-ink-800">Deliverable:</strong>{' '}
                <span dangerouslySetInnerHTML={{ __html: toHtml(step.deliverable) }} />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Reusable: per-item Hints + Solution reveal (used by exercises AND problems)
// ============================================================================
function HintsReveal({ hints }) {
  const [open, setOpen] = useState(false)
  if (!hints || (Array.isArray(hints) && hints.length === 0)) return null
  const list = Array.isArray(hints) ? hints : [hints]
  return (
    <div className="mt-2 rounded-md border border-amber-200 bg-amber-50/60 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-2.5 py-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 hover:bg-amber-100/60 text-left"
      >
        <Lightbulb className="w-3.5 h-3.5" />
        💡 Gợi ý Socratic ({list.length})
        {open ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
      </button>
      {open && (
        <ul className="px-3 py-2 text-xs text-amber-900 list-disc pl-7 space-y-1.5 border-t border-amber-200 bg-white">
          {list.map((h, i) => <li key={i} dangerouslySetInnerHTML={{ __html: h }} />)}
        </ul>
      )}
    </div>
  )
}

function SolutionReveal({ solution, locked, lockMessage }) {
  const [open, setOpen] = useState(false)
  if (!solution) return null
  const isLocked = !!locked
  return (
    <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50/60 overflow-hidden">
      <button
        onClick={() => !isLocked && setOpen(o => !o)}
        className={`w-full px-2.5 py-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 text-left ${isLocked ? 'cursor-not-allowed opacity-70' : 'hover:bg-emerald-100/60'}`}
      >
        <Check className="w-3.5 h-3.5" />
        ✅ Lời giải tham khảo
        {isLocked
          ? <span className="ml-auto inline-flex items-center gap-1 text-[10px]"><EyeOff className="w-3 h-3" /> khóa khi timer chạy</span>
          : (open ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />)}
      </button>
      {open && !isLocked && (
        <div className="border-t border-emerald-200 bg-white">
          {solution.explanationVi && (
            <div className="px-3 py-2 text-xs text-ink-700 leading-relaxed border-b border-emerald-100"
                 dangerouslySetInnerHTML={{ __html: solution.explanationVi }} />
          )}
          {solution.code && <CodeBlock example={{ code: solution.code, lang: solution.lang || 'java' }} />}
          {solution.complexityVi && (
            <div className="px-3 py-2 text-xs text-emerald-900 bg-emerald-50 border-t border-emerald-200 flex items-start gap-1.5">
              <Cog className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span><strong>Complexity:</strong> <span dangerouslySetInnerHTML={{ __html: solution.complexityVi }} /></span>
            </div>
          )}
        </div>
      )}
      {open && isLocked && (
        <div className="px-3 py-2 text-xs text-ink-500 italic border-t border-emerald-200 bg-white">
          {lockMessage || 'Pause timer hoặc tắt Mock Mode để xem lời giải.'}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Problem row
// ============================================================================
function ProblemRow({ problem, done, onToggle, solutionLocked }) {
  return (
    <li className="group flex items-start gap-3 p-3 rounded-lg hover:bg-ink-50 transition-colors">
      <button onClick={onToggle} className="mt-0.5 flex-shrink-0" aria-label="Toggle">
        {done ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-ink-300 group-hover:text-ink-400" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-2">
          <a href={problem.url} target="_blank" rel="noopener noreferrer"
             className={`font-medium text-sm hover:text-brand-600 hover:underline ${done ? 'line-through text-ink-400' : 'text-ink-800'}`}>
            {problem.title}
          </a>
          <span className={DIFF_CLASS[problem.difficulty] || 'chip'}>{problem.difficulty}</span>
          {problem.tag && <span className="chip bg-ink-100 text-ink-600">{problem.tag}</span>}
          <a href={problem.url} target="_blank" rel="noopener noreferrer" className="text-ink-400 hover:text-brand-600">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        {problem.hint && !problem.hints && (
          <p className="mt-1 text-xs text-ink-600 flex items-start gap-1.5 [&_code]:bg-ink-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-[11px] [&_code]:font-mono">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span dangerouslySetInnerHTML={{ __html: problem.hint }} />
          </p>
        )}
        <HintsReveal hints={problem.hints} />
        <SolutionReveal solution={problem.solution} locked={solutionLocked} />
      </div>
    </li>
  )
}

// ============================================================================
// Main
// ============================================================================
export default function MainContent({
  lesson, phase, module, completedMap, onToggleItem, onToggleLesson,
  onPrev, onNext, hasPrev, hasNext
}) {
  // ----- Advanced feature state -----
  const [mockMode, setMockMode] = useState(false)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [heatmapRefresh, setHeatmapRefresh] = useState(0)
  const [vaultOpen, setVaultOpen] = useState(false)
  const [journalOpen, setJournalOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [feynmanOpen, setFeynmanOpen] = useState(false)

  // Timer (Mock Interview Mode)
  const DEFAULT_SECS = 25 * 60
  const [timerSecs, setTimerSecs] = useState(DEFAULT_SECS)
  const [timerRunning, setTimerRunning] = useState(false)

  useEffect(() => {
    if (!timerRunning) return
    const id = setInterval(() => setTimerSecs(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [timerRunning])

  useEffect(() => { if (timerSecs === 0) setTimerRunning(false) }, [timerSecs])

  // Reset timer when lesson changes
  useEffect(() => {
    setTimerSecs(DEFAULT_SECS); setTimerRunning(false)
  }, [lesson?.id])

  // Reload heatmap when feature panel opens
  useEffect(() => { if (showHeatmap) setHeatmapRefresh(k => k + 1) }, [showHeatmap])

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-full p-12 text-center">
        <div>
          <BookOpen className="w-12 h-12 text-ink-300 mx-auto mb-3" />
          <p className="text-ink-500">Pick a lesson from the sidebar to begin.</p>
        </div>
      </div>
    )
  }

  const meta = TYPE_META[lesson.type] || TYPE_META.theory
  const Icon = meta.icon
  const totalItems = lesson.problems?.length || lesson.steps?.length || 1
  const doneItems = (() => {
    if (lesson.problems) return lesson.problems.filter(p => completedMap[`${lesson.id}::${p.id}`]).length
    if (lesson.steps)    return lesson.steps.filter(s => completedMap[`${lesson.id}::${s.id}`]).length
    return completedMap[`${lesson.id}::__lesson__`] ? 1 : 0
  })()
  const lessonMarked = completedMap[`${lesson.id}::__lesson__`]

  // ----- Feynman intercept on Mark Complete -----
  const requestMarkComplete = () => setFeynmanOpen(true)

  const handleFeynmanConfirm = async () => {
    onToggleLesson(lesson.id)
    await logActivity('lesson_complete')
  }

  // ----- Wrap problem/step toggle with activity log -----
  const handleToggleItem = async (lessonId, itemId) => {
    onToggleItem(lessonId, itemId)
    const wasDone = !!completedMap[`${lessonId}::${itemId}`]
    if (!wasDone) {
      // Just marked done → log
      if (lesson.problems?.find(p => p.id === itemId)) await logActivity('problem_solve')
      else if (lesson.steps?.find(s => s.id === itemId)) await logActivity('project_step')
    }
  }

  // ----- Mock Mode visibility helpers -----
  const showTheorySections = !mockMode
  const showProblemBlock = !!lesson.problems
  const showStepsBlock = !!lesson.steps

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-6">

      {/* ===== Feature Toolbar ===== */}
      <div className="mb-5 rounded-xl border border-ink-200 bg-white p-2 flex items-center gap-1.5 flex-wrap shadow-soft">
        <ToolbarToggle
          active={mockMode}
          onClick={() => setMockMode(m => !m)}
          icon={Timer}
          label="Mock Interview Mode"
          activeTone="rose"
        />
        <ToolbarToggle
          active={showHeatmap}
          onClick={() => setShowHeatmap(s => !s)}
          icon={Calendar}
          label="Heatmap"
          activeTone="emerald"
        />
        <ToolbarToggle
          active={vaultOpen}
          onClick={() => setVaultOpen(true)}
          icon={BookMarked}
          label="Syntax Vault"
          activeTone="indigo"
        />
        <ToolbarToggle
          active={journalOpen}
          onClick={() => setJournalOpen(true)}
          icon={Bug}
          label="Bug Journal"
          activeTone="rose"
        />
        <div className="flex-1" />
        <div className="relative">
          <button
            onClick={() => setSettingsOpen(o => !o)}
            className={`btn text-xs ${settingsOpen ? 'bg-ink-900 text-white' : 'btn-ghost'}`}
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
          <SettingsPopover open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </div>
      </div>

      {/* ===== Heatmap inline (when toggled) ===== */}
      {showHeatmap && (
        <div className="mb-5">
          <ConsistencyHeatmap refreshKey={heatmapRefresh} />
        </div>
      )}

      {/* ===== Breadcrumb + Title ===== */}
      <div className="flex items-center gap-2 text-xs text-ink-500 mb-3 flex-wrap">
        <span className="font-medium text-brand-700">{phase.title}</span>
        <span className="text-ink-300">/</span>
        <span>{module.title}</span>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">{lesson.title}</h1>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${meta.color}`}>
          <Icon className="w-3.5 h-3.5" /> {meta.label}
        </span>
      </div>

      {lesson.subtitle && !mockMode && (
        <div className="text-ink-600 text-base mb-4">
          {typeof lesson.subtitle === 'string'
            ? <span dangerouslySetInnerHTML={{ __html: lesson.subtitle }} />
            : (
              <div className="space-y-1">
                {lesson.subtitle.en && <div className="text-ink-500 italic" dangerouslySetInnerHTML={{ __html: lesson.subtitle.en }} />}
                {lesson.subtitle.vi && <div className="text-emerald-700" dangerouslySetInnerHTML={{ __html: lesson.subtitle.vi }} />}
              </div>
            )}
        </div>
      )}

      {(lesson.problems || lesson.steps) && (
        <div className="mb-6">
          <ProgressBar value={doneItems} max={totalItems} label="Lesson Progress · Tiến độ" tone="emerald" />
        </div>
      )}

      {/* ===== Mock Mode timer (sticky) ===== */}
      {mockMode && (
        <MockTimerCard
          seconds={timerSecs}
          running={timerRunning}
          onStart={() => setTimerRunning(true)}
          onPause={() => setTimerRunning(false)}
          onReset={() => { setTimerSecs(DEFAULT_SECS); setTimerRunning(false) }}
          onAddFive={() => setTimerSecs(s => s + 300)}
        />
      )}

      {/* ===== Mock Mode notice ===== */}
      {mockMode && (
        <div className="mb-5 rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-900 flex items-start gap-2">
          <EyeOff className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span><strong>Mock Mode đang BẬT.</strong> Lý thuyết, mental model, socratic prompts đã ẩn. Tập trung giải. Bật lại khi cần.</span>
        </div>
      )}

      {/* ===== Phase 0 Anti-Copy-Paste Banner ===== */}
      {phase.id === 'phase-0' && !mockMode && (
        <div className="mb-5 rounded-xl border-2 border-rose-300 bg-gradient-to-r from-rose-50 to-amber-50 p-4 shadow-soft">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 text-sm">
              <div className="font-bold text-rose-900 mb-1">🚫 PHASE 0 — Anti-Copy-Paste Rules</div>
              <ul className="text-rose-900 list-disc pl-5 space-y-0.5">
                <li>⛔ <strong>KHÔNG paste AI</strong> bất kỳ exercise nào. Phát hiện = restart Phase 0.</li>
                <li>✅ Mỗi exercise <strong>gõ tay 3 lần</strong>. Lần 3 mắt nhắm (gần đúng).</li>
                <li>✅ Mỗi LeetCode <strong>thử 20 phút KHÔNG nhìn solution</strong>.</li>
                <li>✅ Sau khi mở solution → đóng lại → tự gõ lại từ đầu. KHÔNG copy.</li>
                <li>✅ Viết <strong>Feynman note tiếng Việt</strong> trước khi mark complete.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ===== Hints / Solution Accordions (always available) ===== */}
      {(lesson.hints || lesson.solution) && (
        <div className="mb-5">
          {lesson.hints && (
            <Accordion
              icon={Lightbulb}
              tone="amber"
              title="💡 Xem Gợi ý · Show hints"
              locked={false}
            >
              {renderHintsContent(lesson.hints)}
            </Accordion>
          )}
          {lesson.solution && (
            <Accordion
              icon={Check}
              tone="emerald"
              title="✅ Xem Lời Giải · Show solution"
              locked={!mockMode && timerRunning}
              lockMessage="Solution bị khóa khi timer đang chạy. Pause hoặc tắt Mock Mode để mở."
            >
              {renderSolutionContent(lesson.solution)}
            </Accordion>
          )}
        </div>
      )}

      {/* ===== Theory sections (hidden in Mock Mode) ===== */}
      {showTheorySections && <MentalModelCard value={lesson.mentalModel} />}
      {showTheorySections && <UnderTheHoodCard value={lesson.underTheHood} />}

      {showTheorySections && (lesson.theory || (lesson.codeExamples && lesson.codeExamples.length > 0)) && (
        <Block>
          {lesson.theory && <BilingualText value={lesson.theory} />}
          {lesson.codeExamples?.map((ex, i) => <CodeBlock key={i} example={ex} />)}
        </Block>
      )}

      {showTheorySections && <SocraticPromptsCard prompts={lesson.socraticPrompts} />}
      {showTheorySections && <KeyTakeawaysCard value={lesson.keyTakeaways} />}

      {showTheorySections && lesson.exercises && lesson.exercises.length > 0 && (
        <Block>
          <h3 className="font-semibold text-ink-900 mb-3 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-600" /> Coding Exercises · Bài tập gõ tay
          </h3>
          <ol className="space-y-3">
            {lesson.exercises.map((ex, i) => (
              <li key={i} className="border border-ink-200 rounded-lg p-3 bg-ink-50/40">
                <div className="text-sm font-semibold text-ink-800">
                  Exercise {i + 1}: <span dangerouslySetInnerHTML={{ __html: ex.title }} />
                </div>
                <p className="text-sm text-ink-700 mt-1 [&_code]:bg-ink-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[12px] [&_code]:font-mono [&_code]:text-brand-700"
                   dangerouslySetInnerHTML={{ __html: ex.prompt }} />
                {ex.hint && !ex.hints && (
                  <p className="text-xs text-ink-500 mt-2 flex items-start gap-1.5 [&_code]:bg-ink-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-[11px] [&_code]:font-mono">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Hint:</strong> <span dangerouslySetInnerHTML={{ __html: ex.hint }} /></span>
                  </p>
                )}
                <HintsReveal hints={ex.hints} />
                <SolutionReveal
                  solution={ex.solution}
                  locked={mockMode && timerRunning}
                  lockMessage="Pause timer hoặc tắt Mock Mode để xem lời giải."
                />
              </li>
            ))}
          </ol>
        </Block>
      )}

      {/* ===== Problems block (visible in both modes) ===== */}
      {showProblemBlock && (
        <Block>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="font-semibold text-ink-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-600" /> LeetCode Practice ({lesson.problems.length})
            </h3>
            <div className="text-xs text-ink-500">
              {mockMode ? '🔥 Time pressure — KHÔNG xem hint trừ khi pause timer.' : 'Tick khi bạn TỰ giải được.'}
            </div>
          </div>
          <ul className="divide-y divide-ink-100">
            {lesson.problems.map(p => (
              <ProblemRow
                key={p.id}
                problem={mockMode ? { ...p, hint: null, hints: null } : p}
                done={!!completedMap[`${lesson.id}::${p.id}`]}
                onToggle={() => handleToggleItem(lesson.id, p.id)}
                solutionLocked={mockMode && timerRunning}
              />
            ))}
          </ul>
        </Block>
      )}

      {/* ===== Project steps (visible in both modes — mock mode hides mental/socratic in step) ===== */}
      {showStepsBlock && (
        <Block>
          <h3 className="font-semibold text-ink-900 mb-3 flex items-center gap-2">
            <Rocket className="w-4 h-4 text-rose-600" /> Execution Blueprint · Lộ trình ({lesson.steps.length} bước)
          </h3>
          <div className="space-y-4">
            {lesson.steps.map((step, i) => (
              <StepCard
                key={step.id}
                step={mockMode ? { ...step, mentalModel: null, socraticPrompts: null, hints: null } : step}
                idx={i}
                done={!!completedMap[`${lesson.id}::${step.id}`]}
                onToggle={() => handleToggleItem(lesson.id, step.id)}
              />
            ))}
          </div>
          {!mockMode && lesson.stretchGoals && lesson.stretchGoals.length > 0 && (
            <div className="mt-5 rounded-lg bg-brand-50 border border-brand-200 p-4">
              <div className="text-sm font-semibold text-brand-800 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Stretch Goals · Mục tiêu mở rộng
              </div>
              <ul className="text-sm text-brand-900 list-disc pl-5 space-y-1">
                {lesson.stretchGoals.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </div>
          )}
        </Block>
      )}

      {/* ===== Prompt templates (hidden in mock) ===== */}
      {showTheorySections && lesson.prompts && lesson.prompts.length > 0 && (
        <Block>
          <h3 className="font-semibold text-ink-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" /> Prompt Templates · Mẫu prompt
          </h3>
          <div className="space-y-4">
            {lesson.prompts.map((p, i) => (
              <div key={i} className="border border-ink-200 rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-ink-50 border-b border-ink-200 text-sm font-semibold text-ink-800 flex items-center justify-between">
                  <span>{p.title}</span>
                  <button onClick={() => navigator.clipboard?.writeText(p.prompt)} className="text-xs text-brand-600 hover:underline inline-flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <pre className="p-4 text-[13px] leading-6 text-ink-800 whitespace-pre-wrap font-mono bg-white max-h-96 overflow-y-auto scrollbar-thin">{p.prompt}</pre>
              </div>
            ))}
          </div>
        </Block>
      )}

      {/* ===== Mark complete with Feynman intercept ===== */}
      {!lesson.problems && !lesson.steps && (
        <div className="card p-4 flex items-center justify-between mb-5 flex-wrap gap-2">
          <div className="text-sm text-ink-700">
            <strong>Hoàn thành lesson này?</strong>{' '}
            <span className="text-ink-500">Bạn phải viết Feynman Note (giải thích bằng lời của mình) trước khi đánh dấu xong.</span>
          </div>
          <button
            onClick={requestMarkComplete}
            className={`btn ${lessonMarked ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            <Brain className="w-4 h-4" />
            {lessonMarked ? 'Đã hoàn thành · Sửa Note' : 'Viết Feynman Note & hoàn thành'}
          </button>
        </div>
      )}

      {/* For lessons with items, offer a Feynman note option separately when all done */}
      {(lesson.problems || lesson.steps) && doneItems === totalItems && (
        <div className="card p-4 flex items-center justify-between mb-5 flex-wrap gap-2 bg-indigo-50/50 border-indigo-200">
          <div className="text-sm text-ink-700">
            <strong className="text-indigo-900">🎉 Hoàn thành tất cả!</strong> Khoá học hết ý nghĩa nếu bạn không tự đúc kết.
          </div>
          <button onClick={requestMarkComplete} className="btn bg-indigo-600 text-white hover:bg-indigo-700">
            <Brain className="w-4 h-4" /> Viết Feynman Note
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-ink-200">
        <button onClick={onPrev} disabled={!hasPrev}
          className={`btn ${hasPrev ? 'btn-ghost' : 'opacity-40 cursor-not-allowed text-ink-400'}`}>
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        <button onClick={onNext} disabled={!hasNext}
          className={`btn ${hasNext ? 'btn-primary' : 'opacity-40 cursor-not-allowed bg-ink-200 text-ink-500'}`}>
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ===== Mounted modals / drawers ===== */}
      <FeynmanModal
        open={feynmanOpen}
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        onClose={() => setFeynmanOpen(false)}
        onConfirm={handleFeynmanConfirm}
      />
      <SyntaxVaultDrawer open={vaultOpen} onClose={() => setVaultOpen(false)} />
      <BugJournal open={journalOpen} onClose={() => setJournalOpen(false)} />
    </div>
  )
}

// ============================================================================
// Toolbar toggle button (factored out)
// ============================================================================
function ToolbarToggle({ active, onClick, icon: Icon, label, activeTone = 'brand' }) {
  const tones = {
    brand:   'bg-brand-600 text-white hover:bg-brand-700',
    emerald: 'bg-emerald-600 text-white hover:bg-emerald-700',
    indigo:  'bg-indigo-600 text-white hover:bg-indigo-700',
    rose:    'bg-rose-600 text-white hover:bg-rose-700'
  }
  return (
    <button
      onClick={onClick}
      className={`btn text-xs ${active ? tones[activeTone] : 'btn-ghost'}`}
    >
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  )
}
