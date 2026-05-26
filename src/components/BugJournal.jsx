import React, { useEffect, useState } from 'react'
import {
  Bug, X, Plus, Search, Trash2, Edit3, Check, Loader2,
  AlertCircle, Lightbulb, ShieldCheck, Save, Tag, Info, Eye
} from 'lucide-react'
import { listBugs, saveBug, deleteBug, isSupabaseEnabled } from '../lib/supabase.js'

const EMPTY_BUG = {
  title: '', error_message: '', context: '',
  root_cause: '', solution: '', prevention: '',
  tags: [], resolved: false
}

function BugForm({ initial, onSave, onCancel }) {
  const [bug, setBug] = useState(initial || EMPTY_BUG)
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  const update = (k, v) => setBug(prev => ({ ...prev, [k]: v }))
  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (!t || bug.tags?.includes(t)) return
    update('tags', [...(bug.tags || []), t])
    setTagInput('')
  }
  const removeTag = (t) => update('tags', bug.tags.filter(x => x !== t))

  const canSave = bug.title.trim() && !saving
  const handleSubmit = async () => {
    setSaving(true)
    await onSave(bug)
    setSaving(false)
  }

  return (
    <div className="space-y-3">
      <input
        value={bug.title}
        onChange={e => update('title', e.target.value)}
        placeholder="Title: tóm tắt lỗi 1 dòng (vd: N+1 query khi load post.comments)"
        className="w-full px-3 py-2 text-sm rounded-md border border-ink-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none font-medium"
      />

      <FieldLabel icon={AlertCircle} tone="rose" label="Error message · Thông báo lỗi">
        <textarea
          value={bug.error_message}
          onChange={e => update('error_message', e.target.value)}
          rows={3}
          placeholder="Paste stack trace hoặc exception message..."
          className="w-full px-3 py-2 font-mono text-[12.5px] rounded-md border border-ink-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none resize-y"
        />
      </FieldLabel>

      <FieldLabel icon={Eye} tone="amber" label="Context · Tôi đang làm gì khi bug xảy ra">
        <textarea
          value={bug.context}
          onChange={e => update('context', e.target.value)}
          rows={2}
          placeholder="VD: đang implement endpoint POST /orders, gọi từ Postman với body {...}"
          className="w-full px-3 py-2 text-sm rounded-md border border-ink-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none resize-y"
        />
      </FieldLabel>

      <FieldLabel icon={Lightbulb} tone="indigo" label="Root cause · Nguyên nhân THẬT SỰ (không phải symptom)">
        <textarea
          value={bug.root_cause}
          onChange={e => update('root_cause', e.target.value)}
          rows={3}
          placeholder="VD: @ManyToOne mặc định EAGER → mỗi access trigger lazy load. Hibernate sinh 1 query/post → N+1."
          className="w-full px-3 py-2 text-sm rounded-md border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-y"
        />
      </FieldLabel>

      <FieldLabel icon={Check} tone="emerald" label="Solution · Tôi đã fix thế nào">
        <textarea
          value={bug.solution}
          onChange={e => update('solution', e.target.value)}
          rows={3}
          placeholder="VD: thêm JOIN FETCH trong JPQL repository.findAllWithComments()."
          className="w-full px-3 py-2 text-sm rounded-md border border-ink-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none resize-y"
        />
      </FieldLabel>

      <FieldLabel icon={ShieldCheck} tone="brand" label="Prevention · Lần sau tránh ra sao">
        <textarea
          value={bug.prevention}
          onChange={e => update('prevention', e.target.value)}
          rows={2}
          placeholder="VD: thêm test @DataJpaTest assert query count ≤ 1 cho list operation. Set fetch=LAZY explicit."
          className="w-full px-3 py-2 text-sm rounded-md border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none resize-y"
        />
      </FieldLabel>

      <FieldLabel icon={Tag} tone="purple" label="Tags">
        <div className="flex items-center gap-2 flex-wrap">
          {(bug.tags || []).map(t => (
            <span key={t} className="chip bg-purple-100 text-purple-700 inline-flex items-center gap-1">
              {t}
              <button onClick={() => removeTag(t)} className="hover:text-purple-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            placeholder="thêm tag rồi Enter"
            className="px-2 py-1 text-xs rounded-md border border-ink-200 focus:border-purple-400 outline-none"
          />
        </div>
      </FieldLabel>

      <label className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
        <input type="checkbox" checked={bug.resolved} onChange={e => update('resolved', e.target.checked)} />
        Đánh dấu đã giải quyết
      </label>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink-100">
        <button onClick={onCancel} className="btn-ghost text-sm">Hủy</button>
        <button
          onClick={handleSubmit}
          disabled={!canSave}
          className={`btn text-sm ${canSave ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-ink-200 text-ink-500 cursor-not-allowed'}`}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Lưu bug
        </button>
      </div>
    </div>
  )
}

function FieldLabel({ icon: Icon, tone, label, children }) {
  const tones = {
    rose: 'text-rose-700',
    amber: 'text-amber-700',
    indigo: 'text-indigo-700',
    emerald: 'text-emerald-700',
    brand: 'text-brand-700',
    purple: 'text-purple-700'
  }
  return (
    <div>
      <div className={`text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${tones[tone]}`}>
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      {children}
    </div>
  )
}

function BugCard({ bug, onEdit, onDelete, onToggleResolved }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className={`rounded-lg border-2 p-3 transition-colors ${bug.resolved ? 'border-emerald-200 bg-emerald-50/30' : 'border-rose-200 bg-rose-50/20'}`}>
      <div className="flex items-start gap-2">
        <button
          onClick={() => onToggleResolved(bug)}
          className="flex-shrink-0 mt-0.5"
          title={bug.resolved ? 'Mark unresolved' : 'Mark resolved'}
        >
          {bug.resolved
            ? <Check className="w-5 h-5 text-emerald-500" />
            : <AlertCircle className="w-5 h-5 text-rose-500" />}
        </button>
        <div className="flex-1 min-w-0">
          <button onClick={() => setExpanded(!expanded)} className="text-left w-full">
            <div className={`font-semibold text-sm ${bug.resolved ? 'text-ink-500 line-through' : 'text-ink-900'}`}>
              {bug.title}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {(bug.tags || []).map(t => (
                <span key={t} className="chip bg-purple-100 text-purple-700">{t}</span>
              ))}
              <span className="text-[10px] text-ink-400">
                {new Date(bug.updated_at || bug.created_at).toLocaleDateString()}
              </span>
            </div>
          </button>

          {expanded && (
            <div className="mt-3 space-y-2 text-xs">
              {bug.error_message && (
                <Section title="Error" tone="rose" mono>{bug.error_message}</Section>
              )}
              {bug.context     && <Section title="Context" tone="amber">{bug.context}</Section>}
              {bug.root_cause  && <Section title="Root cause" tone="indigo">{bug.root_cause}</Section>}
              {bug.solution    && <Section title="Solution" tone="emerald">{bug.solution}</Section>}
              {bug.prevention  && <Section title="Prevention" tone="brand">{bug.prevention}</Section>}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <button onClick={() => onEdit(bug)} className="text-ink-500 hover:text-ink-800" title="Edit">
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(bug)} className="text-ink-500 hover:text-rose-600" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, tone, mono, children }) {
  const tones = {
    rose: 'border-rose-300 bg-rose-50 text-rose-900',
    amber: 'border-amber-300 bg-amber-50 text-amber-900',
    indigo: 'border-indigo-300 bg-indigo-50 text-indigo-900',
    emerald: 'border-emerald-300 bg-emerald-50 text-emerald-900',
    brand: 'border-brand-300 bg-brand-50 text-brand-900'
  }
  return (
    <div className={`rounded border-l-4 ${tones[tone]} p-2`}>
      <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5">{title}</div>
      <div className={`${mono ? 'font-mono text-[11.5px]' : 'text-[12.5px]'} whitespace-pre-wrap leading-relaxed`}>{children}</div>
    </div>
  )
}

export function BugJournal({ open, onClose }) {
  const [bugs, setBugs] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [onlyOpen, setOnlyOpen] = useState(false)
  const [mode, setMode] = useState('list')      // 'list' | 'form'
  const [editing, setEditing] = useState(null)

  const reload = async () => {
    if (!isSupabaseEnabled()) return
    setLoading(true)
    const d = await listBugs({ search, onlyOpen })
    setBugs(d)
    setLoading(false)
  }

  useEffect(() => {
    if (open) reload()
    // eslint-disable-next-line
  }, [open, search, onlyOpen])

  const handleSave = async (bug) => {
    if (isSupabaseEnabled()) {
      const saved = await saveBug(bug)
      if (saved) {
        setBugs(prev => {
          const idx = prev.findIndex(p => p.id === saved.id)
          if (idx >= 0) { const c = [...prev]; c[idx] = saved; return c }
          return [saved, ...prev]
        })
      }
    }
    setMode('list'); setEditing(null)
  }

  const handleDelete = async (bug) => {
    if (!confirm(`Xóa bug "${bug.title}"?`)) return
    if (isSupabaseEnabled() && bug.id) {
      const ok = await deleteBug(bug.id)
      if (ok) setBugs(prev => prev.filter(b => b.id !== bug.id))
    }
  }

  const handleToggle = async (bug) => {
    const updated = { ...bug, resolved: !bug.resolved }
    if (isSupabaseEnabled()) {
      const saved = await saveBug(updated)
      if (saved) setBugs(prev => prev.map(b => b.id === saved.id ? saved : b))
    }
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-ink-900/40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-screen w-full sm:w-[640px] z-50 bg-white shadow-2xl border-l border-ink-200 flex flex-col">
        <div className="px-5 py-4 border-b border-ink-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center">
            <Bug className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-ink-900 leading-tight">Bug Journal</div>
            <div className="text-xs text-ink-500">Personal StackOverflow — mỗi bug = một bài học không lặp</div>
          </div>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-800"><X className="w-5 h-5" /></button>
        </div>

        {!isSupabaseEnabled() && (
          <div className="px-5 py-2 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span>Cần Supabase để lưu bug. Hiện đang chạy demo (không persist).</span>
          </div>
        )}

        {mode === 'form' ? (
          <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
            <div className="mb-3 flex items-center gap-2">
              <button onClick={() => { setMode('list'); setEditing(null) }} className="btn-ghost text-xs">← Quay lại</button>
              <span className="text-sm font-semibold text-ink-800">{editing ? 'Sửa bug' : 'Bug mới'}</span>
            </div>
            <BugForm initial={editing} onSave={handleSave} onCancel={() => { setMode('list'); setEditing(null) }} />
          </div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-ink-200 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-ink-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Tìm theo title/error/root cause..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-ink-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
                />
              </div>
              <label className="text-xs text-ink-600 inline-flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked={onlyOpen} onChange={e => setOnlyOpen(e.target.checked)} />
                Chỉ chưa fix
              </label>
              <button
                onClick={() => { setEditing(null); setMode('form') }}
                className="btn bg-rose-600 text-white hover:bg-rose-700 text-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Bug
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
              {loading && (
                <div className="flex items-center justify-center py-8 text-ink-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
              {!loading && bugs.length === 0 && (
                <div className="text-center text-sm text-ink-400 py-12">
                  Chưa có bug nào. Lần debug tiếp theo, viết lại vào đây.
                </div>
              )}
              {bugs.map(b => (
                <BugCard
                  key={b.id}
                  bug={b}
                  onEdit={(x) => { setEditing(x); setMode('form') }}
                  onDelete={handleDelete}
                  onToggleResolved={handleToggle}
                />
              ))}
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export default BugJournal
