// ============================================================================
//  PHASE 3 — Spring Boot + PostgreSQL + Docker (Production Stack)
//  Trọng tâm: Docker setup, JPA mechanics, Security + JWT, Email + @Scheduled
//  Mỗi module 1 file dưới ./phase3/ — dễ tinker, tránh token limit.
// ============================================================================

import sqlFoundation      from './phase3/00-sql-foundation.js'
import dockerPostgres     from './phase3/01-docker-postgres.js'
import springFoundations  from './phase3/02-spring-foundations.js'
import springDataJPA      from './phase3/03-spring-data-jpa.js'
import springSecurityJWT  from './phase3/04-spring-security-jwt.js'
import emailNotifications from './phase3/05-email-notifications.js'
import redisRabbitMQ      from './phase3/06-redis-rabbitmq.js'
import testingDeployment  from './phase3/07-testing-deployment.js'
import umlAnalysis        from './phase3/08-uml-analysis.js'

export const phase3 = {
  id: 'phase-3',
  title: 'Phase 3 — Spring Boot + PostgreSQL + Docker',
  tagline: 'SQL foundation → containerize Postgres → JPA → JWT → email/cron → Redis/RabbitMQ → testing → UML.',
  intro: {
    vi: 'Phase này 9 module: (0) <strong>SQL Foundation</strong> (JOIN, subquery, GROUP BY, window function), (1) Docker + Postgres, (2) Spring Boot IoC + REST, (3) JPA/Hibernate sâu, (4) Spring Security + JWT, (5) Email Notification + @Scheduled, (6) <strong>Redis + RabbitMQ</strong> (caching + messaging), (7) Testing + containerize, (8) <strong>UML & Project Analysis</strong> (use case, sequence, class diagram). Mỗi module có First Principles, The Why, Junior Pitfalls.'
  },
  modules: [
    sqlFoundation,
    dockerPostgres,
    springFoundations,
    springDataJPA,
    springSecurityJWT,
    emailNotifications,
    redisRabbitMQ,
    testingDeployment,
    umlAnalysis
  ]
}
