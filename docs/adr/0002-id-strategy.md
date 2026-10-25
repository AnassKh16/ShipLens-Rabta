# ADR 0002: Bigint identifiers

Status: accepted.

Use bigint identity primary keys consistently; audit_log uses bigserial as requested.
Foreign keys and audit entity_id use bigint too.
Branch codes and member numbers use separate PostgreSQL NO CYCLE sequences.
Database default functions format BR- and MEM- values with at least six digits.
Formatting preserves values beyond six digits without truncation.
Sequences are concurrency-safe and consume numbers even on rollback.
Gaps are expected; application code must never reset or reuse these sequences.
Public codes are labels, not proof of authorisation.
Keep pg's bigint values as strings in JavaScript to avoid precision loss.
Store money only as bigint paisa; never convert it to floating-point currency.
Timestamps use timestamptz; connection sessions use UTC.
Pakistan display dates and Monday–Sunday reporting require later service logic.
