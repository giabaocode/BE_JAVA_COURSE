// Trích xuất curriculum -> 6 file Markdown sạch (1/phase) để upload cho ChatGPT chấm.
// Chạy: node scripts/export_md.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { curriculum } from '../src/data/curriculum.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT = path.join(ROOT, 'gpt-export')
fs.mkdirSync(OUT, { recursive: true })

// ---------- HTML -> Markdown/plaintext ----------
function decode(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
          .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
}
function htmlToMd(input) {
  if (input == null) return ''
  let s = String(input)
  // <pre> -> fenced code
  s = s.replace(/<pre>([\s\S]*?)<\/pre>/gi, (_, body) => {
    let b = body.replace(/<br\s*\/?>/gi, '\n').replace(/<\/?[^>]+>/g, '')
    return '\n```\n' + decode(b).trim() + '\n```\n'
  })
  s = s.replace(/<h[1-4][^>]*>/gi, '\n\n**').replace(/<\/h[1-4]>/gi, '**\n')
  s = s.replace(/<br\s*\/?>/gi, '\n')
  s = s.replace(/<\/(p|div|ul|ol)>/gi, '\n')
  s = s.replace(/<li[^>]*>/gi, '\n- ').replace(/<\/li>/gi, '')
  s = s.replace(/<(strong|b)>/gi, '**').replace(/<\/(strong|b)>/gi, '**')
  s = s.replace(/<(em|i)>/gi, '*').replace(/<\/(em|i)>/gi, '*')
  s = s.replace(/<code>/gi, '`').replace(/<\/code>/gi, '`')
  s = s.replace(/<blockquote>/gi, '\n> ').replace(/<\/blockquote>/gi, '\n')
  s = s.replace(/<\/?[^>]+>/g, '')          // bỏ tag còn lại
  s = decode(s)
  s = s.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+\n/g, '\n')
  return s.trim()
}
const pick = (v) => v == null ? '' : (typeof v === 'string' ? v : (v.vi || v.en || ''))
const txt  = (v) => htmlToMd(pick(v))
const t1   = (v) => htmlToMd(pick(v)).replace(/\n+/g, ' ').trim()   // title 1 dòng, sạch tag

// ---------- renderers ----------
let M = []
const w = (s = '') => M.push(s)

function codeBlock(code, lang) {
  if (!code) return
  w('```' + (lang || 'java')); w(String(code).trim()); w('```'); w('')
}
function solution(sol) {
  if (!sol) return
  w('**Lời giải tham khảo:**')
  codeBlock(sol.code, sol.lang)
  if (sol.complexityVi) w('- Độ phức tạp: ' + htmlToMd(sol.complexityVi))
  if (sol.explanationVi) w('- Giải thích: ' + htmlToMd(sol.explanationVi))
  w('')
}
function hintsOf(o) {
  const hs = o.hints || (o.hint ? [o.hint] : [])
  if (hs && hs.length) { w('Gợi ý:'); hs.forEach(h => w('- ' + htmlToMd(h))); w('') }
}

function renderLesson(ls) {
  w(`#### Bài: ${t1(ls.title) || ls.id}  _(loại: ${ls.type || '—'})_`)
  const sub = txt(ls.subtitle); if (sub) w('> ' + sub.replace(/\n/g, ' ')); w('')
  if (ls.mentalModel) { w('**Mental Model**\n'); w(txt(ls.mentalModel)); w('') }
  if (ls.underTheHood) { w('**Under the Hood / First Principles**\n'); w(txt(ls.underTheHood)); w('') }
  if (ls.theory) { w('**Theory / The Why / Pitfalls**\n'); w(txt(ls.theory)); w('') }
  if (ls.codeExamples) {
    w('**Code mẫu:**\n')
    ls.codeExamples.forEach(ce => { if (ce.title) w('_' + ce.title + '_'); codeBlock(ce.code, ce.lang); if (ce.description) w(htmlToMd(ce.description) + '\n') })
  }
  if (ls.problems) {
    w('**Problem set:**\n')
    ls.problems.forEach(p => {
      w(`##### ${t1(p.title)}  ${p.difficulty ? '['+p.difficulty+']' : ''} ${p.url || ''}`.trim())
      hintsOf(p); solution(p.solution)
    })
  }
  if (ls.exercises) {
    w('**Bài tập:**\n')
    ls.exercises.forEach(ex => { w(`##### ${t1(ex.title)}`); if (ex.prompt) w(htmlToMd(ex.prompt) + '\n'); hintsOf(ex); solution(ex.solution) })
  }
  if (ls.steps) {
    w('**Các bước (project):**\n')
    ls.steps.forEach(st => {
      w(`##### ${t1(st.title)}`)
      if (st.description) w(txt(st.description) + '\n')
      if (st.mentalModel) w(txt(st.mentalModel) + '\n')
      hintsOf(st)
      if (st.socraticPrompts) st.socraticPrompts.forEach(sp => w('- Socratic — ' + (sp.title||'') + ': ' + htmlToMd(sp.prompt)))
      if (st.deliverable) w('- Deliverable: ' + txt(st.deliverable))
      w('')
    })
  }
  const prompts = ls.socraticPrompts || ls.prompts
  if (prompts && prompts.length) {
    w('**Socratic prompts:**\n')
    prompts.forEach(p => { w('- **' + (p.title || '') + '**: ' + htmlToMd(p.prompt)) }); w('')
  }
  if (ls.keyTakeaways && ls.keyTakeaways.vi) {
    w('**Key takeaways:**\n'); ls.keyTakeaways.vi.forEach(k => w('- ' + htmlToMd(k))); w('')
  }
  w('\n---\n')
}

function renderPhase(ph, idx) {
  M = []
  w(`# ${ph.title}`)
  if (ph.tagline) w('> ' + htmlToMd(ph.tagline))
  w('')
  if (ph.intro) { w('## Giới thiệu phase\n'); w(txt(ph.intro)); w('') }
  let nLessons = 0
  ;(ph.modules || []).forEach(mod => {
    w(`## Module: ${mod.title || mod.id}`)
    if (mod.prerequisites) w('_Tiền điều kiện: ' + txt(mod.prerequisites) + '_\n')
    ;(mod.lessons || []).forEach(ls => { renderLesson(ls); nLessons++ })
    if (mod.references && mod.references.length) {
      w('**Tham khảo (references):**\n')
      mod.references.forEach(r => w('- ' + (r.title || '') + ' — ' + (r.url || ''))); w('')
    }
  })
  const file = path.join(OUT, `phase${idx}.md`)
  fs.writeFileSync(file, M.join('\n'), 'utf8')
  return { file, modules: (ph.modules || []).length, lessons: nLessons, kb: Math.round(Buffer.byteLength(M.join('\n')) / 1024) }
}

// ---------- run ----------
const results = curriculum.phases.map((ph, i) => renderPhase(ph, i))

// copy rubric
const rubricSrc = path.join(ROOT, 'RUBRIC_DANH_GIA_NOI_DUNG.md')
if (fs.existsSync(rubricSrc)) fs.copyFileSync(rubricSrc, path.join(OUT, 'RUBRIC_DANH_GIA_NOI_DUNG.md'))

// hướng dẫn + prompt
const guide = `# Bộ công cụ nhờ ChatGPT đánh giá khóa học

## File trong thư mục này
- \`phase0.md\` … \`phase5.md\` — nội dung 6 phase (đã làm sạch HTML, giữ code + bài tập + lời giải).
- \`RUBRIC_DANH_GIA_NOI_DUNG.md\` — bộ tiêu chí chấm (21 tiêu chí, 5 nhóm).

## Quy trình (làm 6 lần, mỗi phase 1 lần)
1. Mở MỘT chat ChatGPT MỚI cho mỗi phase (để rubric luôn "tươi", tránh tràn context).
2. Trong 1 tin nhắn: dán PROMPT dưới đây → đính kèm \`RUBRIC_DANH_GIA_NOI_DUNG.md\` → đính kèm \`phaseX.md\`.
3. GPT trả về: điểm từng tiêu chí + lỗi chặn + cần sửa + điểm tốt + PASS/FAIL.
4. Copy câu trả lời, lưu vào 1 file \`danhgia-gpt.md\`.
5. Sau 6 phase: mở chat mới, dán 6 bản tóm tắt → hỏi "Tổng hợp: khóa đủ cho Backend Java junior chưa? Thiếu gì? Ưu tiên sửa gì?"
6. Đối chiếu với đánh giá của Claude: chỗ cả hai cùng chỉ ra = ưu tiên cao.

> Mẹo: file phase nên ĐÍNH KÈM (kéo-thả) thay vì dán text. Phase 2 & 3 lớn — nếu GPT tràn, báo để tách nhỏ theo module.

## PROMPT dán vào ChatGPT
\`\`\`
Bạn là chuyên viên QA nội dung giáo dục lập trình, chuyên sâu Backend Java/Spring.
Tôi gửi kèm: (1) bộ tiêu chí RUBRIC, (2) nội dung MỘT phase của khóa học.

Bối cảnh người học: bắt đầu từ con số 0, mục tiêu đi làm Backend Java junior,
stack chuẩn Java 17/21 LTS + Spring Boot 3.x + Spring Data JPA + SQL.

Hãy chấm phase này theo ĐÚNG rubric:
- Mỗi tiêu chí cho điểm 0–2, TRÍCH DẪN câu/đoạn làm bằng chứng.
- Nhóm A (Tính chính xác) có tiêu chí 0 điểm = LỖI CHẶN, liệt kê riêng.
- Liệt kê: 🔴 lỗi chặn · 🟡 cần cải thiện (kèm đề xuất sửa) · 🟢 điểm tốt.
- Soi kỹ: code có chạy được/đúng API Spring Boot 3 (jakarta.*, Security 6) không,
  có dạy thói quen sai về bảo mật không, có "nhảy cóc" kiến thức không.
Kết luận PASS/FAIL + tổng điểm %. Đừng khen chung chung — phải có trích dẫn bằng chứng.
\`\`\`
`
fs.writeFileSync(path.join(OUT, '_HUONG-DAN.md'), guide, 'utf8')

console.log('Xuất xong vào', OUT)
results.forEach((r, i) => console.log(`  phase${i}.md — ${r.modules} module, ${r.lessons} lesson, ${r.kb} KB`))
