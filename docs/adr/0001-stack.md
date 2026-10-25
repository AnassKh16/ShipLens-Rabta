# ADR 0001: Backend stack

Status: accepted for the skeleton.

Use Node 20, strict TypeScript, Express 5, and PostgreSQL 16.
Express separates app construction from the listening process for tests.
Routes call controllers, services apply rules, repositories execute SQL.
Use pg directly so transaction boundaries remain easy to explain.
Use Zod for environment validation and future request validation.
Helmet supplies security headers; CORS stays disabled for same-origin hosting.
Pino logs generated request IDs, methods and status codes, not payloads.
Vitest and supertest cover HTTP behavior and database integration.
ESLint, Prettier and TypeScript provide separate static checks.
This skeleton does not implement sessions, authorisation, CSRF or rate limits.
Node 20 is the challenge's specified target; lifecycle upgrades need a separate decision.
