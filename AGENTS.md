# RABTA — ShipLens Challenge #01 shared brief
Branch-to-Head-Office Management Platform for a volunteer organisation, plus its public website. Judged on a live Render URL, green CI on main, tests, security, docs and a live defense. Submit by Nov 1 evening; hard limit Nov 2 (exact time to be confirmed).

## Acceptance criteria (pass/fail)
1. With the official sample data loaded via a single documented seed command, the head office dashboard shows the correct expected values.
2. A weekly report goes Draft -> Submitted -> Returned -> Resubmitted -> Approved -> Locked, every step in the audit trail.
3. Permissions proven by automated tests: no role may access data or actions outside its permissions; the SERVER refuses, not just the UI.
4. Live Render link works and CI is green on main.

## Roles
super_admin, finance_reviewer, content_editor, branch_lead, hr_lead. Deny by default. branch_lead is scoped to their own branch; changing an ID in a URL must never expose another branch's data.

## Workflows
- Weekly report: auto-drafted; branch_lead submits; finance_reviewer returns or approves; approved = locked, figures frozen.
- Application: applied -> accepted | declined. Accepting creates a member with an auto ID in ONE database transaction.
- Branch lifecycle: forming, active, paused, closed (allowed transitions documented and enforced).
- Collection: logged -> editable 7 days -> locked. Offline collections only. NO online payments anywhere.

## Data rules
Money = integer paisa (bigint). Time = UTC stored, Asia/Karachi displayed. Week = Monday–Sunday Pakistan time. Branch codes and member IDs come from DB sequences, never reused. Audit log: who, what, when, entity, record id, before/after, IP; written in the same transaction as the change; append-only via DB trigger.

## Stack
Node 20 + Express (TypeScript), PostgreSQL 16 (pg, SQL migrations), React + Vite + TypeScript, react-i18next (en/ur with RTL), one Docker image (Express serves the built frontend), GitHub Actions, Render.

## Security (OWASP Top 10)
Authorisation on every endpoint; bcrypt or Argon2; HttpOnly + Secure + SameSite cookies with expiry; CSRF protection; rate limits on login and the public application form; server-side validation everywhere; parameterised queries only; escaped output and sanitised rich text; security headers (CSP, HSTS, nosniff); secrets only in env, never committed; npm audit in CI; no stack traces in production; log failed logins and permission denials.

## Bilingual
No hard-coded strings. Translation files from the first screen. lang and dir set per language. CSS logical properties only. Urdu tested on forms, tables and dashboard.

## Fake data only
No real names, CNICs, phone numbers or addresses anywhere.

## Design direction (authoritative; details in docs/DESIGN.md once added)
Public site: dark portal hero that parts to reveal a full-bleed image, then light Swiss-style sections (paper #F2F2F2, ink #111111) with echo-stack headlines (Latin only). Admin: calm sidebar and chart panels.
Tokens live only in frontend/src/styles/tokens.css: paper #F2F2F2, white #FFFFFF, ink #111111, ground-dark #0B0B0B, footer #1E1E1E, muted #5F5F5F, hairline rgba(17,17,17,.12), echo #BFBFBF #C9C9C9 #D1D1D1 #D9D9D9, primary #0F5C4D, accent-mint #7DD9B5 (dark grounds only), chart-2 #BFE5D3, chart-3 #3F6C8C, danger #C2410C (burnt orange). No yellow, red or purple.
Fonts (self-hosted woff2): Clash Display 700 (headlines, big numbers), Satoshi 500/700 (body, UI), Noto Naskh Arabic (Urdu). Urdu: letter-spacing 0, line-height ~1.7, no uppercase, no echo effect.
No gradients, glows, shadows, emoji icons, generic identical card grids or generic marketing copy. Status = icon + text. Logical CSS properties only.

## Ownership
L1 owns frontend/. L2 owns backend/, db/, Dockerfile, docker-compose.yml, render.yaml, .github/, docs/api.md, docs/permissions.md. Contract files change only via pull request reviewed by the other laptop.

## Working rules for AI agents
- Work only inside your ownership area. Request cross-area changes in docs/requests.md instead of making them.
- Commit small and often with conventional messages on a feature branch. Never commit to main (except the bootstrap), never force-push, never rewrite history, never run git push or git pull; the human does that.
- Never commit secrets. Keep .env.example current.
- Every task ends with a report: done / mocked / untested / known issues / requests for the other laptop / commands run with results / suggested next step. Never claim tests pass or a deploy works unless you ran it.
- The team must explain every line in a live defense: prefer simple, clear code and comment non-obvious rules (locks, transactions, state machines).
- Earlier team projects may inspire patterns (central policy matrix, ADRs, transactional writes), but write all code fresh.
