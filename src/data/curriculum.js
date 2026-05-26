// ============================================================================
//  Java + DSA Bootcamp — Bilingual Curriculum (English / Tiếng Việt)
//  Triết lý: KHÔNG copy-paste. Hiểu sâu trước, viết code sau.
// ============================================================================

import { phase0 } from './phases/phase0.js'
import { phase1 } from './phases/phase1.js'
import { phase2 } from './phases/phase2.js'
import { phase3 } from './phases/phase3.js'
import { phase4 } from './phases/phase4.js'
import { phase5 } from './phases/phase5.js'

export const curriculum = {
  meta: {
    title: 'Java + DSA Bootcamp — Hiểu sâu, không copy-paste',
    tagline: 'Warm-up syntax → OOP + memory model → 17 LeetCode patterns → Docker + Spring Boot → Capstones → AI mentor.',
    durationWeeks: 20,
    philosophy: {
      en: 'Master the mental model first. Code is the artifact, not the goal.',
      vi: 'Hiểu mô hình tư duy trước, code chỉ là sản phẩm cuối. Mọi khái niệm phải tự diễn giải được bằng lời trước khi viết bất kỳ dòng code nào. <strong>BẮT BUỘC làm Phase 0 trước nếu bạn ít luyện code.</strong>'
    }
  },

  phases: [phase0, phase1, phase2, phase3, phase4, phase5]
}

export const LC = (slug) => `https://leetcode.com/problems/${slug}/`
