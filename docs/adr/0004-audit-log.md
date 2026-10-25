# ADR 0004: Append-only audit log

Status: accepted for database guardrails; write wrapper planned.

Audit entries record actor, action, entity, before/after, time, IP and request ID.
Statement triggers reject UPDATE, DELETE and TRUNCATE, even on empty tables.
Inserts remain allowed; ordinary application operations cannot rewrite history.
The database owner can remove triggers, so runtime credentials must not own the schema.
Role grants and production credential separation are not implemented in this task.
Indexes support time, actor and entity lookups.
A planned withAudit wrapper will acquire one client and begin a transaction.
It will perform the business write and audit insert on that same client.
Only then may it commit; either failure must roll back both writes.
No business mutation endpoints or withAudit wrapper exist in this skeleton.
The triggers alone do not guarantee that every business write has an audit entry.
Tests attempt all three forbidden mutation operations against real PostgreSQL.
