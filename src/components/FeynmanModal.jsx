import React, { useEffect, useState } from 'react'
import { X, Brain, Star, Check, Loader2, Info } from 'lucide-react'
import { fetchFeynmanNote, saveFeynmanNote, isSupabaseEnabled } from '../lib/supabase.js'

const MIN_CHARS = 80

export function FeynmanModal({ open, lessonId, lessonTitle, onClose, onConfirm }) {
  const [explanation, setExplanation] = useState('')
  const [rating, setRating] = useState(3)
  const [saving, setSaving] = useState(false)
  const [existing, setExisting] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('write') // 'write' | 'history'

  useEffect(() => {
    if (!open || !lessonId) return
    setExplanation('')
    setRating(3)
    setExisting(null)
    setTab('write')
    setLoading(true)
    fetchFeynmanNote(lessonId).then(n => {
      if (n) {
        setExisting(n)
        setExplanation(n.explanation || '')
        setRating(n.self_rating || 3)
      }
      setLoading(false)
    })
  }, [open, lessonId])

  if (!open) return null

  const charCount = explanation.trim().length
  const canSave = charCount >= MIN_CHARS && !saving

  const handleSave = async () => {
    setSaving(true)
    if (isSupabaseEnabled()) {
      await saveFeynmanNote({ lessonId, explanation: explanation.trim(), selfRating: rating })
    }
    setSaving(false)
    onConfirm?.()
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-ink-200 max-h-[90vh] flex flex-col">

        <div className="flex items-start gap-3 px-6 py-5 border-b border-ink-200">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-ink-900 text-lg leading-tight">Feynman Check</div>
            <div className="text-xs text-ink-500 mt-0.5">
              Giải thích <span className="font-semibold text-indigo-700">{lessonTitle}</span> bằng lời của bạn — như thể bạn đang dạy cho một người mới.
            </div>
          </div>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSupabaseEnabled() && (
          <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span>Supabase chưa cấu hình — note vẫn được dùng để xác nhận hoàn thành nhưng KHÔNG được lưu DB. Set <code className="font-mono">VITE_SUPABASE_URL</code> + <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> để bật.</span>
          </div>
        )}

        <div className="px-6 pt-3 border-b border-ink-200">
          <div className="flex gap-1">
            <button
              onClick={() => setTab('write')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-t-md border-b-2 transition-colors ${tab === 'write' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-ink-500 hover:text-ink-700'}`}
            >
              Write · Viết
            </button>
            {existing && (
              <button
                onClick={() => setTab('history')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-t-md border-b-2 transition-colors ${tab === 'history' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-ink-500 hover:text-ink-700'}`}
              >
                Previous Note · Note cũ
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-ink-400">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : tab === 'write' ? (
            <>
              <div className="mb-3 text-sm text-ink-700 leading-relaxed">
                <strong className="text-ink-900">3 câu hỏi bắt buộc</strong> trong giải thích của bạn:
                <ol className="list-decimal pl-5 mt-1 space-y-0.5 text-ink-600">
                  <li>Khái niệm này GIẢI QUYẾT vấn đề gì?</li>
                  <li>Cơ chế cốt lõi hoạt động RA SAO (mental model)?</li>
                  <li>Bạn sẽ áp dụng nó khi nào, KHÔNG dùng khi nào?</li>
                </ol>
              </div>

              <textarea
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
                placeholder="Bắt đầu gõ — KHÔNG copy-paste từ AI. Nếu bí, đóng modal và đọc lại Mental Model trước."
                className="w-full h-56 p-3 rounded-lg border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-y text-sm leading-relaxed font-sans"
              />

              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={charCount < MIN_CHARS ? 'text-rose-600' : 'text-emerald-600 font-semibold'}>
                  {charCount} / {MIN_CHARS} ký tự tối thiểu
                </span>
                <span className="text-ink-400">{Math.max(0, MIN_CHARS - charCount)} còn lại</span>
              </div>

              <div className="mt-5">
                <label className="text-xs font-semibold uppercase tracking-wider text-ink-600 mb-2 block">
                  Tự đánh giá mức độ hiểu
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      className={`p-1.5 transition-colors ${n <= rating ? 'text-amber-500' : 'text-ink-300 hover:text-ink-400'}`}
                      aria-label={`Rate ${n}`}
                    >
                      <Star className={`w-6 h-6 ${n <= rating ? 'fill-amber-500' : ''}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-xs text-ink-500">
                    {['Còn mơ hồ', 'Hiểu sơ', 'Hiểu cơ bản', 'Tự tin', 'Có thể dạy lại'][rating - 1]}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div>
              <div className="text-xs text-ink-500 mb-2">
                Saved {existing && new Date(existing.updated_at || existing.created_at).toLocaleString()}
              </div>
              <div className="rounded-lg bg-ink-50 border border-ink-200 p-3 text-sm text-ink-800 whitespace-pre-wrap leading-relaxed">
                {existing?.explanation}
              </div>
              <div className="mt-2 text-xs text-ink-500 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {existing?.self_rating}/5
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-ink-200 flex items-center justify-end gap-2">
          <button onClick={onClose} className="btn-ghost text-sm">Hủy</button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`btn text-sm ${canSave ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-ink-200 text-ink-500 cursor-not-allowed'}`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {existing ? 'Cập nhật & Hoàn thành' : 'Lưu & Đánh dấu hoàn thành'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeynmanModal
