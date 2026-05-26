// ============================================================================
//  PHASE 3 — Spring Boot + PostgreSQL + Docker (Production Stack)
//  Trọng tâm: Docker setup, JPA mechanics, Security + JWT, Email + @Scheduled
//  Mỗi module 1 file dưới ./phase3/ — dễ tinker, tránh token limit.
// ============================================================================

import dockerPostgres     from './phase3/01-docker-postgres.js'
import springFoundations  from './phase3/02-spring-foundations.js'
import springDataJPA      from './phase3/03-spring-data-jpa.js'
import springSecurityJWT  from './phase3/04-spring-security-jwt.js'
import emailNotifications from './phase3/05-email-notifications.js'
import testingDeployment  from './phase3/06-testing-deployment.js'

export const phase3 = {
  id: 'phase-3',
  title: 'Phase 3 — Spring Boot + PostgreSQL + Docker',
  tagline: 'Hạ tầng production-grade: containerize Postgres, hiểu JPA tầng dưới, JWT auth, email + cron.',
  intro: {
    vi: 'Phase này 6 module: (1) Docker + Postgres dựng môi trường, (2) Spring Boot IoC + REST, (3) JPA/Hibernate sâu, (4) Spring Security + JWT, (5) <strong>Email Notification + @Scheduled</strong> (cron jobs), (6) Testing + containerize app. Mỗi module có First Principles (cơ chế bên dưới), The Why (vs alternatives), Junior Pitfalls (5 lỗi điển hình).'
  },
  modules: [
    dockerPostgres,
    springFoundations,
    springDataJPA,
    springSecurityJWT,
    emailNotifications,
    testingDeployment
  ]
}
