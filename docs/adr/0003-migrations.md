# ADR 0003: Plain SQL migrations

Status: accepted.

Keep ordered NNNN_name.sql files in db/migrations.
Run npm run migrate from backend after supplying the root .env configuration.
The runner records each filename and completion time in schema_migrations.
A session advisory lock serializes migration runners.
Each migration and its ledger insertion share one transaction.
A failure rolls back that file; earlier successful files remain applied.
Running again skips recorded files and retries unapplied files.
Applied SQL files are immutable by convention; add a new file for changes.
There is no automatic down migration or checksum validation in this first version.
Migration SQL is trusted repository code; runtime values use query parameters.
Keep db/migrations alongside backend when packaging the built server.
Tests use a fresh random schema and drop only that schema after the suite.
Production should use a dedicated migration role rather than runtime DDL privileges.
