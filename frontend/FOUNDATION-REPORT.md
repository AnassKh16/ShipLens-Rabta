# Frontend foundation handoff

Branch: `feat/fe-foundation`.

## Done
- Verbatim design authority in `../docs/DESIGN.md`.
- Strict React/TypeScript/Vite foundation with separate lazy public/admin route trees, React Router and TanStack Query provider.
- Shared colors, type, spacing and radius tokens; logical CSS, focus styles and reduced-motion reset.
- Five supplied WOFF2 fonts and three supplied licenses. Only Clash Display Bold is preloaded.
- Eight graded AVIF/WebP images, a measured manifest, reproducible sharp pipeline and art-directed HeroPicture stub. All outputs <=150 KiB; originals remain outside Git.
- English/Urdu translation resources, document language/direction/title updates, language-only storage and text language switch.
- Dev-only token inspector showing all colors and composited contrast ratios, both writing systems and all spacing steps. Production chunk and code absence verified.
- Reusable loading, empty, error with retry, and content states.

## Section 12 checklist
| Item | Result | Evidence |
| --- | --- | --- |
| 1. Tokens/style lint | PASS | ESLint and real style scanner pass; bad fixture rejected by CLI in tests. |
| 2. Screenshots 360/768/1280 EN/UR | FAIL: unavailable | No installed browser; Chromium download repeatedly returned invalid/truncated ZIP. No screenshots claimed. |
| 3. 1.3x font scaling | FAIL: unverified | Needs actual browser layout inspection. |
| 4. Keyboard walkthrough | FAIL: unverified | Language-switch interaction tested in DOM; this does not prove a keyboard browser walkthrough. |
| 5. Four request states | PASS: components | Loading, empty, error/retry and content tested. API-specific flows are not in this task. |
| 6. Role gating | N/A | No protected records, role actions, or authentication implemented. Admin is an explanatory scaffold only. |
| 7. Section 11 bans | PASS: source review | Reviewed every ban against current scaffold. No prohibited cards/icons/effects/colors/statistics/copy/controls/charts/images/loading patterns found. Visual review remains outstanding. |
| 8. Lighthouse mobile | FAIL: unavailable | Browser unavailable; no scores claimed. |
| 9. Contrast | PASS | ink/paper 16.87:1; muted/paper 5.70:1; paper/primary 7.06:1; white/danger 5.18:1; ink/mint 11.21:1; mint/dark 11.68:1. Primary focus on paper exceeds 3:1. |
| 10. Translations | PASS | No literal user-facing JSX text/label attributes in components/features; Urdu updated; native review flagged. Token identifiers/numbers are diagnostic data. |

The overall completion checklist is NOT fully passed until the browser checks are completed.

## Commands and results
From `frontend/`:
- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm test`: 12 tests passed across 3 files.
- `npm run build`: passed; third-party `use client` directives emitted warnings, no build failures.
- `npm run verify:build`: passed; no TokenPage/tokens-preview chunk or implementation in production; all image manifest sizes match files.
- `node scripts/optimize-images.mjs /path/to/rabta-assets/hero`: ran successfully with the supplied external originals.
- `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173`: started successfully; `/dev/tokens` HTML and module returned successfully via HTTP. This is not a rendered browser inspection.
- Playwright browser launch: failed because Chromium is absent; browser install failed because downloaded archives were invalid. No project Playwright dependency added.

Runtime used for these checks: Node 24.22.1. Tool versions selected for Node 20 compatibility; `.nvmrc` targets 20.19.0, but this environment did not run Node 20 itself.

## Bundle sizes
- Main JS: 111,951 gzip bytes.
- Public lazy chunk: 275 gzip bytes.
- Admin lazy chunk: 185 gzip bytes.
- Conservative combined JS total: 112,411 gzip bytes (109.78 KiB), below 150 KiB.
- Styles: approximately 1.52 KB gzip.
- Hero AVIF/WebP outputs: 25,750–143,807 bytes each; about outputs: 93,828 and 150,349 bytes.
- Font files: 15,428 / 27,260 / 26,728 / 52,668 / 53,024 bytes.

## Mocked / deferred
The public and admin landing screens describe the foundation; they are not the finished seven-page public website or an authenticated admin shell. No API metrics, people, reports, permissions or fake trends are mocked. HeroPicture is a component stub, not the animated portal hero. The 100px scroll measurement is N/A for this foundation task.

## Known issues and boundaries
- Browser screenshots, zoom/font scaling, keyboard walkthrough and Lighthouse are outstanding.
- Native Urdu review and visual font coverage verification are outstanding.
- Confirm the supplied font license terms before publication; originals and licenses are preserved as supplied.
- `docs/assets.md` was requested but conflicts with the instruction to touch only frontend/ and docs/DESIGN.md. Original paths and optimization instructions are recorded in `src/assets/README.md` instead.
- No backend files changed; no git push or git pull ran.

## Requests for L2
Provide the session/current-user and permission contracts, public branches/programs/events and live aggregate endpoints, and bilingual validation/error codes. Configure immutable caching for hashed assets and the SPA route fallback when serving the frontend from Express. These are handoff requests only; no external messages were sent.

## Next step
Run the browser checklist locally on Node 20.19+; inspect `/`, `/admin`, `/dev/tokens` and the not-found route at 360/768/1280 in English and Urdu, including 1.3x font scaling and keyboard use. Run mobile Lighthouse on the public scaffold. Then implement the public navigation and portal hero against approved API contracts.

## Dependencies added

### dependencies

- `@tanstack/react-query`: `^5.104.5`
- `i18next`: `^26.5.10`
- `react`: `^19.3.1`
- `react-dom`: `^19.3.1`
- `react-i18next`: `^17.1.8`
- `react-router-dom`: `^7.18.4`

### devDependencies

- `@testing-library/jest-dom`: `^6.9.1`
- `@testing-library/react`: `^16.3.3`
- `@types/react`: `^19.3.0`
- `@types/react-dom`: `^19.3.0`
- `eslint`: `^9.39.5`
- `jsdom`: `^26.1.0`
- `sharp`: `^0.35.5`
- `typescript`: `^6.0.3`
- `typescript-eslint`: `^8.72.0`
- `vite`: `^6.4.5`
- `vitest`: `^3.2.7`
