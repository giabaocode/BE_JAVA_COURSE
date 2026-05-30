// ============================================================================
//  PHASE 0 — Java Warm-up (BẮT BUỘC làm trước Phase 1)
//  Mục tiêu: build muscle memory + giải easy LeetCode + bỏ thói paste AI
// ============================================================================

import syntaxEssentials   from './phase0/01-syntax-essentials.js'
import builtinCollections from './phase0/02-builtin-collections.js'
import easyLeetcode       from './phase0/03-easy-leetcode.js'
import consoleMiniApps    from './phase0/04-console-miniapps.js'

export const phase0 = {
  id: 'phase-0',
  title: 'Phase 0 — Java Warm-up (Anti-Copy-Paste Foundation)',
  tagline: '3 tuần build muscle memory. Mỗi exercise gõ tay 3 lần. KHÔNG paste AI.',
  intro: {
    vi: '<strong>STOP — đọc trước khi bắt đầu</strong>. Phase này KHÔNG dạy concept khó. Mục tiêu duy nhất: <strong>fingers nhớ syntax + brain nhớ pattern</strong>. Quy tắc bắt buộc:<br/><br/>1. ⛔ <strong>KHÔNG paste AI</strong> bất kỳ exercise nào trong Phase 0. Phát hiện ra bạn paste = restart Phase 0.<br/>2. ✅ Mỗi exercise: <strong>tự gõ tay TÔI TỐI THIỂU 3 LẦN</strong>. Lần 1 với hint. Lần 2 không hint. Lần 3 mắt nhắm (gần đúng).<br/>3. ✅ Mỗi LeetCode easy: thử <strong>20 phút KHÔNG nhìn solution</strong>. Sau 20p mở solution → đọc → đóng → tự gõ lại.<br/>4. ✅ Viết <strong>Feynman note tiếng Việt</strong> mỗi lesson hoàn thành (button "Mark Complete" sẽ ép bạn).<br/><br/>Mục tiêu sau 3 tuần: gõ <code>for (int i = 0; i &lt; n; i++)</code> không cần nhìn bàn phím. Solve Two Sum trong 5 phút. KHÔNG còn nhớ phím Ctrl+V dùng làm gì.'
  },
  modules: [
    syntaxEssentials,
    builtinCollections,
    easyLeetcode,
    consoleMiniApps
  ]
}
