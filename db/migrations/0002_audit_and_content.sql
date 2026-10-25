CREATE TABLE audit_log (
  id bigserial PRIMARY KEY,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  actor_id bigint REFERENCES users(id),
  actor_role user_role,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id bigint NOT NULL,
  "before" jsonb,
  "after" jsonb,
  ip inet,
  request_id text
);
CREATE INDEX audit_log_occurred_at_idx ON audit_log(occurred_at);
CREATE INDEX audit_log_actor_idx ON audit_log(actor_id);
CREATE INDEX audit_log_entity_idx ON audit_log(entity);
CREATE FUNCTION reject_audit_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only' USING ERRCODE = '55000';
END;
$$;
-- Statement triggers reject these operations even when the table is empty.
CREATE TRIGGER audit_log_no_update_delete BEFORE UPDATE OR DELETE ON audit_log
  FOR EACH STATEMENT EXECUTE FUNCTION reject_audit_mutation();
CREATE TRIGGER audit_log_no_truncate BEFORE TRUNCATE ON audit_log
  FOR EACH STATEMENT EXECUTE FUNCTION reject_audit_mutation();

CREATE TABLE programs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title_en text NOT NULL,
  title_ur text NOT NULL,
  summary_en text NOT NULL,
  summary_ur text NOT NULL,
  is_published boolean NOT NULL DEFAULT false
);
CREATE TABLE events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title_en text NOT NULL,
  title_ur text NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  branch_id bigint REFERENCES branches(id),
  city text NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  CHECK (ends_at > starts_at)
);
CREATE TABLE content_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title_en text NOT NULL,
  title_ur text NOT NULL,
  body_en text NOT NULL,
  body_ur text NOT NULL,
  status content_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  updated_by bigint NOT NULL REFERENCES users(id),
  updated_at timestamptz NOT NULL DEFAULT now()
);
