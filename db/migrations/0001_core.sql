CREATE TYPE user_role AS ENUM ('super_admin', 'finance_reviewer', 'content_editor', 'branch_lead', 'hr_lead');
CREATE TYPE branch_status AS ENUM ('forming', 'active', 'paused', 'closed');
CREATE TYPE application_status AS ENUM ('applied', 'accepted', 'declined');
CREATE TYPE report_status AS ENUM ('draft', 'submitted', 'returned', 'approved');
CREATE TYPE content_status AS ENUM ('draft', 'published');

CREATE SEQUENCE branch_code_seq AS bigint NO CYCLE;
CREATE SEQUENCE member_no_seq AS bigint NO CYCLE;
-- Pad to at least six digits without truncating larger sequence values.
CREATE FUNCTION next_branch_code() RETURNS text LANGUAGE sql AS $$
  SELECT 'BR-' || lpad(n, greatest(6, length(n)), '0')
  FROM (SELECT nextval('branch_code_seq')::text AS n) value;
$$;
CREATE FUNCTION next_member_no() RETURNS text LANGUAGE sql AS $$
  SELECT 'MEM-' || lpad(n, greatest(6, length(n)), '0')
  FROM (SELECT nextval('member_no_seq')::text AS n) value;
$$;

CREATE TABLE branches (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code text NOT NULL UNIQUE DEFAULT next_branch_code(),
  name text NOT NULL,
  city text NOT NULL,
  status branch_status NOT NULL DEFAULT 'forming',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL,
  branch_id bigint REFERENCES branches(id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE applications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  preferred_branch_id bigint REFERENCES branches(id),
  motivation text NOT NULL,
  status application_status NOT NULL DEFAULT 'applied',
  reviewed_by bigint REFERENCES users(id),
  reviewed_at timestamptz,
  member_id bigint UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- Historical decisions may share an email; only pending applications are unique.
CREATE UNIQUE INDEX applications_pending_email_unique ON applications (lower(email)) WHERE status = 'applied';
CREATE TABLE members (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_no text NOT NULL UNIQUE DEFAULT next_member_no(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  branch_id bigint NOT NULL REFERENCES branches(id),
  team text NOT NULL,
  member_role text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  application_id bigint UNIQUE REFERENCES applications(id),
  joined_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE applications ADD CONSTRAINT applications_member_fk FOREIGN KEY (member_id) REFERENCES members(id);
CREATE INDEX members_branch_idx ON members(branch_id);
CREATE INDEX members_status_idx ON members(status);
CREATE INDEX members_team_idx ON members(team);
CREATE INDEX members_name_idx ON members(lower(full_name));
CREATE INDEX members_email_idx ON members(email);

CREATE TABLE weekly_reports (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  branch_id bigint NOT NULL REFERENCES branches(id),
  week_start date NOT NULL,
  week_end date NOT NULL,
  status report_status NOT NULL DEFAULT 'draft',
  frozen_totals jsonb,
  version int NOT NULL DEFAULT 1 CHECK (version > 0),
  submitted_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (branch_id, week_start),
  CHECK (week_end > week_start)
);
CREATE TABLE collections (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  branch_id bigint NOT NULL REFERENCES branches(id),
  amount_paisa bigint NOT NULL CHECK (amount_paisa > 0),
  collected_on date NOT NULL,
  source text NOT NULL,
  notes text,
  logged_at timestamptz NOT NULL DEFAULT now(),
  logged_by bigint NOT NULL REFERENCES users(id),
  sent_to_main boolean NOT NULL DEFAULT false,
  sent_at timestamptz,
  report_id bigint REFERENCES weekly_reports(id)
);
CREATE INDEX collections_branch_idx ON collections(branch_id);
CREATE INDEX collections_collected_on_idx ON collections(collected_on);
CREATE INDEX collections_sent_idx ON collections(sent_to_main);
CREATE TABLE report_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  report_id bigint NOT NULL REFERENCES weekly_reports(id),
  from_status report_status,
  to_status report_status NOT NULL,
  actor_id bigint NOT NULL REFERENCES users(id),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);
