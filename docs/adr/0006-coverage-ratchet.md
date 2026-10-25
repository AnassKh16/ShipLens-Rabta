# ADR 0006: Coverage ratchet

Status: accepted as an interim engineering target.

Enforce 50% coverage for lines, functions, branches and statements now.
Measure all backend src TypeScript files, including startup and migration code.
The earlier database-free run reported about 52% lines; this is not a CI baseline.
CI must supply a real PostgreSQL 16 database and run the entire test suite.
Missing TEST_DATABASE_URL fails the suite instead of silently skipping integration tests.
Raise all four thresholds to 80% by Day 7 as feature tests land.
Do not lower thresholds or exclude difficult files to make CI pass.
Confirm the real handbook threshold with the team; 80% is a planned ratchet,
not a verified quotation from the handbook.
Unit probes exercise HTTP failures and static routing; integration tests prove SQL behavior.
Coverage alone does not establish correct authorisation or production readiness.
Report actual coverage, failures and unavailable infrastructure in each handoff.
