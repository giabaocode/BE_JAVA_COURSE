import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  X, BookMarked, Plus, Trash2, Keyboard, Play, RotateCcw, Save, Loader2, Check, Code2, Info
} from 'lucide-react'
import {
  listVaultSnippets, saveVaultSnippet, deleteVaultSnippet,
  recordVaultPractice, isSupabaseEnabled
} from '../lib/supabase.js'

// Default templates ship locally so Practice Mode works even without Supabase.
const SEED_SNIPPETS = [
  {
    id: 'seed-sliding-window',
    title: 'Sliding Window (variable size)',
    language: 'java',
    pattern_tag: 'sliding-window',
    code: `int left = 0, best = 0;
Map<Character, Integer> count = new HashMap<>();
for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    count.merge(c, 1, Integer::sum);
    while (windowInvalid(count)) {
        char l = s.charAt(left++);
        count.merge(l, -1, Integer::sum);
        if (count.get(l) == 0) count.remove(l);
    }
    best = Math.max(best, right - left + 1);
}`
  },
  {
    id: 'seed-two-pointers',
    title: 'Two Pointers (sorted)',
    language: 'java',
    pattern_tag: 'two-pointers',
    code: `int left = 0, right = nums.length - 1;
while (left < right) {
    int sum = nums[left] + nums[right];
    if (sum == target) return new int[]{left, right};
    if (sum < target) left++;
    else right--;
}`
  },
  {
    id: 'seed-fast-slow',
    title: 'Fast & Slow Pointers (cycle detect)',
    language: 'java',
    pattern_tag: 'fast-slow',
    code: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true;
}
return false;`
  },
  {
    id: 'seed-tree-bfs',
    title: 'Tree BFS (level order)',
    language: 'java',
    pattern_tag: 'tree-bfs',
    code: `Deque<TreeNode> q = new ArrayDeque<>();
q.offer(root);
while (!q.isEmpty()) {
    int size = q.size();
    for (int i = 0; i < size; i++) {
        TreeNode n = q.poll();
        if (n.left != null) q.offer(n.left);
        if (n.right != null) q.offer(n.right);
    }
}`
  },
  {
    id: 'seed-reverse-ll',
    title: 'Reverse Linked List (3 pointers)',
    language: 'java',
    pattern_tag: 'reversal',
    code: `ListNode prev = null, curr = head;
while (curr != null) {
    ListNode next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
}
return prev;`
  },
  {
    id: 'seed-binary-search',
    title: 'Modified Binary Search (lower bound)',
    language: 'java',
    pattern_tag: 'binary-search',
    code: `int lo = 0, hi = n;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (predicate(mid)) hi = mid;
    else lo = mid + 1;
}
return lo;`
  },
  {
    id: 'seed-union-find',
    title: 'Union-Find (path compression)',
    language: 'java',
    pattern_tag: 'graph',
    code: `int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}
boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;
    if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
    parent[rb] = ra;
    if (rank[ra] == rank[rb]) rank[ra]++;
    return true;
}`
  },
  {
    id: 'seed-spring-controller',
    title: 'Spring REST Controller boilerplate',
    language: 'java',
    pattern_tag: 'spring',
    code: `@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostDto> create(@Valid @RequestBody CreatePostRequest req) {
        PostDto dto = postService.create(req);
        return ResponseEntity.created(URI.create("/api/v1/posts/" + dto.id())).body(dto);
    }
}`
  }
]

// ============================================================================
// Practice Mode — character-by-character typing test
// ============================================================================
function PracticeMode({ snippet, onExit }) {
  const [typed, setTyped] = useState('')
  const [startedAt, setStartedAt] = useState(null)
  const [finishedAt, setFinishedAt] = useState(null)
  const [errors, setErrors] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [snippet?.id])

  const target = snippet?.code || ''
  const total = target.length

  const handleChange = (e) => {
    const v = e.target.value
    if (!startedAt && v.length > 0) setStartedAt(Date.now())

    // Count incremental mismatches (only when adding chars)
    if (v.length > typed.length) {
      const lastIdx = v.length - 1
      if (v[lastIdx] !== target[lastIdx]) setErrors(prev => prev + 1)
    }

    setTyped(v)
    if (v === target) setFinishedAt(Date.now())
  }

  const reset = () => {
    setTyped(''); setStartedAt(null); setFinishedAt(null); setErrors(0)
    inputRef.current?.focus()
  }

  // Stats
  const correctChars = useMemo(() => {
    let c = 0
    for (let i = 0; i < typed.length && i < target.length; i++) if (typed[i] === target[i]) c++
    return c
  }, [typed, target])

  const elapsedMs = finishedAt ? (finishedAt - startedAt) : (startedAt ? (Date.now() - startedAt) : 0)
  const wpm = startedAt ? Math.round((correctChars / 5) / Math.max(0.001, elapsedMs / 60000)) : 0
  const accuracy = typed.length ? Math.round((correctChars / (correctChars + errors || 1)) * 100) : 100
  const progressPct = total ? Math.round((Math.min(typed.length, total) / total) * 100) : 0

  // Save best on finish
  useEffect(() => {
    if (!finishedAt || !snippet?.id) return
    if (typeof snippet.id === 'number') {
      recordVaultPractice(snippet.id, wpm, accuracy)
    }
  }, [finishedAt])

  // Render colored target
  const colored = []
  for (let i = 0; i < target.length; i++) {
    const ch = target[i]
    let cls = 'text-ink-400'
    if (i < typed.length) {
      cls = typed[i] === ch ? 'text-emerald-400' : 'text-rose-300 bg-rose-500/30'
    } else if (i === typed.length) {
      cls = 'text-ink-900 bg-brand-500/40 animate-pulse'
    }
    const display = ch === '\n' ? '↵\n' : ch
    colored.push(<span key={i} className={cls} style={{ whiteSpace: 'pre-wrap' }}>{display}</span>)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 bg-ink-50 border-b border-ink-200 flex items-center gap-3">
        <Keyboard className="w-4 h-4 text-indigo-600" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-ink-900 truncate">{snippet.title}</div>
          <div className="text-[11px] text-ink-500">{snippet.pattern_tag || snippet.language || 'java'}</div>
        </div>
        <button onClick={reset} className="btn-ghost text-xs"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
        <button onClick={onExit} className="btn-ghost text-xs"><X className="w-3.5 h-3.5" /> Đóng</button>
      </div>

      <div className="px-4 py-2 border-b border-ink-200 grid grid-cols-4 gap-2 text-center">
        <Stat label="WPM" value={wpm} tone="brand" />
        <Stat label="Accuracy" value={`${accuracy}%`} tone={accuracy >= 95 ? 'emerald' : accuracy >= 85 ? 'amber' : 'rose'} />
        <Stat label="Errors" value={errors} tone={errors === 0 ? 'emerald' : 'rose'} />
        <Stat label="Progress" value={`${progressPct}%`} tone="brand" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">Target</div>
        <pre className="font-mono text-[13px] leading-6 bg-[#080b14] border border-brand-600/20 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap">{colored}</pre>

        <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-ink-500">Your input</div>
        <textarea
          ref={inputRef}
          value={typed}
          onChange={handleChange}
          spellCheck={false}
          className="w-full mt-1 h-40 p-3 font-mono text-[13px] leading-6 rounded-lg bg-ink-50 text-ink-800 border border-ink-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-600/30 outline-none resize-y placeholder:text-ink-500"
          placeholder="Bắt đầu gõ — đừng copy. Mục tiêu: hoàn thành 100% accuracy ≥ 95%."
        />

        {finishedAt && (
          <div className="mt-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span><strong>Hoàn thành!</strong> {wpm} WPM · {accuracy}% · {errors} lỗi · {Math.round(elapsedMs / 1000)}s</span>
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, tone = 'brand' }) {
  const tones = {
    brand: 'text-brand-700 bg-brand-600/15',
    emerald: 'text-emerald-300 bg-emerald-500/15',
    amber: 'text-amber-300 bg-amber-500/15',
    rose: 'text-rose-300 bg-rose-500/15'
  }
  return (
    <div className={`rounded-md px-2 py-1.5 ${tones[tone]}`}>
      <div className="text-[10px] uppercase font-semibold tracking-wider opacity-70">{label}</div>
      <div className="font-bold tabular-nums">{value}</div>
    </div>
  )
}

// ============================================================================
// Add / Edit snippet form
// ============================================================================
function SnippetForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [tag, setTag] = useState(initial?.pattern_tag || '')
  const [language, setLanguage] = useState(initial?.language || 'java')
  const [code, setCode] = useState(initial?.code || '')
  const [notes, setNotes] = useState(initial?.notes || '')
  const [saving, setSaving] = useState(false)

  const canSave = title.trim() && code.trim() && !saving
  const handleSubmit = async () => {
    setSaving(true)
    await onSave({
      ...(initial?.id && typeof initial.id === 'number' ? { id: initial.id } : {}),
      title: title.trim(), pattern_tag: tag.trim(), language, code, notes
    })
    setSaving(false)
  }

  return (
    <div className="p-4 space-y-3">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title (e.g., Sliding Window template)"
        className="w-full px-3 py-2 text-sm rounded-md border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
      />
      <div className="grid grid-cols-2 gap-2">
        <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Pattern tag (sliding-window)"
          className="px-3 py-2 text-sm rounded-md border border-ink-200" />
        <select value={language} onChange={e => setLanguage(e.target.value)}
          className="px-3 py-2 text-sm rounded-md border border-ink-200">
          <option value="java">java</option>
          <option value="sql">sql</option>
          <option value="yaml">yaml</option>
          <option value="bash">bash</option>
        </select>
      </div>
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Code…"
        className="w-full h-48 px-3 py-2 font-mono text-[12.5px] leading-5 rounded-md border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-y"
      />
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Notes / when to use…"
        className="w-full h-20 px-3 py-2 text-sm rounded-md border border-ink-200 resize-y"
      />
      <div className="flex items-center justify-end gap-2">
        <button onClick={onCancel} className="btn-ghost text-sm">Hủy</button>
        <button onClick={handleSubmit} disabled={!canSave}
          className={`btn text-sm ${canSave ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-ink-200 text-ink-500 cursor-not-allowed'}`}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Lưu snippet
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// Main drawer
// ============================================================================
export function SyntaxVaultDrawer({ open, onClose }) {
  const [userSnippets, setUserSnippets] = useState([])
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('list')         // 'list' | 'form' | 'practice'
  const [editing, setEditing] = useState(null)
  const [practicing, setPracticing] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!open) return
    if (isSupabaseEnabled()) {
      setLoading(true)
      listVaultSnippets().then(d => { setUserSnippets(d); setLoading(false) })
    }
  }, [open])

  const all = [...userSnippets, ...SEED_SNIPPETS]
  const filtered = search
    ? all.filter(s => (s.title + ' ' + (s.pattern_tag || '')).toLowerCase().includes(search.toLowerCase()))
    : all

  const handleSave = async (snippet) => {
    if (isSupabaseEnabled()) {
      const saved = await saveVaultSnippet(snippet)
      if (saved) {
        setUserSnippets(prev => {
          const idx = prev.findIndex(p => p.id === saved.id)
          if (idx >= 0) { const c = [...prev]; c[idx] = saved; return c }
          return [saved, ...prev]
        })
      }
    }
    setMode('list'); setEditing(null)
  }

  const handleDelete = async (snippet) => {
    if (typeof snippet.id !== 'number') return  // seeds are local
    if (!confirm(`Xóa "${snippet.title}"?`)) return
    if (isSupabaseEnabled()) {
      const ok = await deleteVaultSnippet(snippet.id)
      if (ok) setUserSnippets(prev => prev.filter(p => p.id !== snippet.id))
    }
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-screen w-full sm:w-[560px] z-50 bg-ink-100 shadow-2xl border-l border-brand-600/30 shadow-glow flex flex-col">
        <div className="px-5 py-4 border-b border-ink-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <BookMarked className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-ink-900 leading-tight">Syntax Vault</div>
            <div className="text-xs text-ink-500">Lưu template + luyện gõ để build muscle memory</div>
          </div>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-800"><X className="w-5 h-5" /></button>
        </div>

        {!isSupabaseEnabled() && (
          <div className="px-5 py-2 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span>Đang dùng template mẫu (không lưu DB). Cấu hình Supabase env để lưu snippet riêng.</span>
          </div>
        )}

        {mode === 'practice' && practicing
          ? <PracticeMode snippet={practicing} onExit={() => { setMode('list'); setPracticing(null) }} />
          : mode === 'form'
            ? (
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="px-5 py-3 border-b border-ink-200 flex items-center gap-2">
                  <button onClick={() => { setMode('list'); setEditing(null) }} className="btn-ghost text-xs">
                    ← Quay lại
                  </button>
                  <span className="text-sm font-semibold text-ink-800">{editing ? 'Sửa snippet' : 'Snippet mới'}</span>
                </div>
                <SnippetForm initial={editing} onSave={handleSave} onCancel={() => { setMode('list'); setEditing(null) }} />
              </div>
            )
            : (
              <>
                <div className="px-4 py-3 border-b border-ink-200 flex items-center gap-2">
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm theo title hoặc tag..."
                    className="flex-1 px-3 py-1.5 text-sm rounded-md border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                  <button
                    onClick={() => { setEditing(null); setMode('form') }}
                    className="btn bg-indigo-600 text-white hover:bg-indigo-700 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Mới
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin">
                  {loading && (
                    <div className="flex items-center justify-center py-8 text-ink-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  )}
                  {filtered.length === 0 && !loading && (
                    <div className="text-center text-sm text-ink-400 py-12">Không có snippet nào khớp.</div>
                  )}
                  <ul className="divide-y divide-ink-100">
                    {filtered.map(s => (
                      <li key={s.id} className="px-4 py-3 hover:bg-ink-50">
                        <div className="flex items-start gap-3">
                          <Code2 className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-ink-900 truncate">{s.title}</div>
                            <div className="text-[11px] text-ink-500 flex items-center gap-2 mt-0.5">
                              {s.pattern_tag && <span className="chip bg-indigo-50 text-indigo-700">{s.pattern_tag}</span>}
                              <span>{s.language || 'java'}</span>
                              {s.best_wpm > 0 && <span className="text-emerald-700">Best: {s.best_wpm} WPM · {s.best_accuracy}%</span>}
                              {typeof s.id !== 'number' && <span className="text-ink-400 italic">seed</span>}
                            </div>
                            <pre className="mt-1.5 text-[11px] font-mono text-ink-600 line-clamp-2 whitespace-pre overflow-hidden">{s.code}</pre>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => { setPracticing(s); setMode('practice') }}
                              className="btn bg-indigo-600 text-white hover:bg-indigo-700 text-xs px-2 py-1"
                              title="Practice typing"
                            >
                              <Play className="w-3 h-3" /> Practice
                            </button>
                            {typeof s.id === 'number' && (
                              <>
                                <button onClick={() => { setEditing(s); setMode('form') }} className="text-[11px] text-ink-500 hover:text-ink-800">Sửa</button>
                                <button onClick={() => handleDelete(s)} className="text-[11px] text-rose-500 hover:text-rose-700 flex items-center gap-0.5">
                                  <Trash2 className="w-3 h-3" /> Xóa
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )
        }
      </aside>
    </>
  )
}

export default SyntaxVaultDrawer
