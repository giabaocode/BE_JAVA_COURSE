// ============================================================================
//  PHASE 5 — AI as Mentor & Interview Strategy
//  Trọng tâm: dùng AI để HỌC, không để code thuê. Mock interview bằng AI.
// ============================================================================

import socraticAI          from './phase5/01-socratic-ai.js'
import architectureReview  from './phase5/02-architecture-review.js'
import mockInterviews      from './phase5/03-mock-interviews.js'

export const phase5 = {
  id: 'phase-5',
  title: 'Phase 5 — AI as Mentor & Interview Prep',
  tagline: 'AI là gia sư khó tính, không phải thợ code. Học cách hỏi đúng.',
  intro: {
    vi: 'Phase này dạy 2 kỹ năng quan trọng nhất của kỹ sư hiện đại: (1) dùng AI như gia sư Socratic — bắt AI hỏi ngược thay vì cho đáp án; (2) tự luyện interview với AI đóng vai interviewer. Cả hai dựa vào kỹ năng "viết prompt đúng cách". Hiểu cách LLM hoạt động bên dưới → biết tại sao prompt template work hay fail.'
  },
  modules: [
    socraticAI,
    architectureReview,
    mockInterviews
  ]
}
