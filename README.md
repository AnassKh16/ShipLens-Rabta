# RABTA

Branch-to-head-office management platform for a volunteer organisation.

Status: under construction

## Run locally with Docker

1. Install Docker with Compose, then copy `.env.example` to `.env` at the repository root.
2. Replace `POSTGRES_PASSWORD` and both URL password placeholders with the same random URL-safe password. Set `SESSION_SECRET` to a separate random value of at least 32 characters (do not leave the `replace-` placeholder). Keep `.env` uncommitted.
3. Run `docker compose up --build` from the repository root. The app waits for PostgreSQL, runs compiled migrations, then serves the frontend and API on port 8080.
4. Open `http://localhost:8080` and check `http://localhost:8080/health`. Visit `/dev/tokens` directly to check SPA fallback; the token preview itself is development-only and is removed from production builds.
5. Stop with `docker compose down`. The named database volume is retained. `db/init/001-test-database.sql` creates `rabta_test` only on first initialization. For an existing volume missing it, run `docker compose exec db createdb -U rabta rabta_test` once.

For host testing, use an accessible PostgreSQL 16 database named `rabta_test`,
set `TEST_DATABASE_URL` to its connection URL (the Compose hostname `db` is only
resolvable inside its network), then run `npm ci`, `npm test` and
`npm run test:coverage` from `backend/`. Missing database configuration fails tests.
For a host production run, build both projects and run `npm run start:prod` in
`backend/`; no TypeScript tooling is required after building.

## Deploy to Render

1. Have a human review, merge and push this branch to GitHub `main` after CI passes.
2. In Render, choose **New → Blueprint**, connect the repository and select `main` with `render.yaml` at the root.
3. Review the Singapore region and free plans for both services before creating the Blueprint. See [Render's Blueprint reference](https://render.com/docs/blueprint-spec) and [free-instance limits](https://render.com/docs/free).
4. Let Render supply the database connection and generate `SESSION_SECRET`; do not paste credentials into source files. The image accepts Render's `PORT` environment variable.
5. Wait for the database and web service to start. Check logs for completed migrations and verify `/health` reports `db: "up"` on the generated HTTPS URL.
6. Open `/` and `/admin` directly and inspect the browser console for CSP violations. Automatic deployments track commits on `main`; GitHub CI and Render deployment status must both be verified.
