// ============================================================================
//  PHASE 5 — AI as Mentor & Interview Strategy
//  Trọng tâm: dùng AI để HỌC, không để code thuê. Mock interview bằng AI.
// ============================================================================

import teamSkills          from './phase5/00-team-skills.js'
import socraticAI          from './phase5/01-socratic-ai.js'
import architectureReview  from './phase5/02-architecture-review.js'
import mockInterviews      from './phase5/03-mock-interviews.js'

export const phase5 = {
  id: 'phase-5',
  title: 'Phase 5 — Team Skills, AI Mentor & Interview Prep',
  tagline: 'Git/Agile teamwork → AI gia sư Socratic → mock interview + job search.',
  intro: {
    vi: 'Phase này dạy 3 nhóm kỹ năng tách biệt mà công ty thực tế đều cần: (0) <strong>Team Skills</strong> — Git workflow, Jira/Agile, code review etiquette (mọi công ty đều dùng nhưng bootcamp ít dạy); (1) dùng AI như gia sư Socratic; (2) tự luyện interview với AI. Hiểu cách LLM hoạt động bên dưới → biết tại sao prompt template work hay fail.'
  },
  modules: [
    teamSkills,
    socraticAI,
    architectureReview,
    mockInterviews
  ]
}
