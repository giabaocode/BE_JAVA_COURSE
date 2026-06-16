// ============================================================================
//  PHASE 4 — Capstone Projects (Anti-Copy-Paste, Production-Shape)
//  Mỗi step: Mental Model + First Principles + Junior Pitfalls + Socratic Prompts
//  Mỗi capstone 1 file dưới ./phase4/
// ============================================================================

import devlog            from './phase4/01-devlog.js'
import shopcore          from './phase4/02-shopcore.js'
import taskflow          from './phase4/03-taskflow.js'
import repairInventory   from './phase4/04-repair-inventory.js'
import automationToolkit from './phase4/05-automation-toolkit.js'

export const phase4 = {
  id: 'phase-4',
  title: 'Phase 4 — Capstone Projects (Anti-Copy-Paste)',
  tagline: '3 dự án backend production-shape. Mỗi bước: TƯ DUY trước, code sau.',
  intro: {
    vi: 'TUYỆT ĐỐI KHÔNG mở AI và bảo "viết hộ project". Quy trình bắt buộc mỗi step: (1) đọc Mental Model — hiểu luồng dữ liệu; (2) copy Socratic Prompt — bắt AI hỏi ngược; (3) đọc Junior Pitfalls — biết trước bug; (4) chỉ khi trả lời được mới viết code. AI là gia sư, không phải tay code thuê.'
  },
  modules: [
    devlog,
    shopcore,
    taskflow,
    repairInventory,
    automationToolkit
  ]
}
