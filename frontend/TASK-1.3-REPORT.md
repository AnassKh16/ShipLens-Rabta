# RABTA Task 1.3 — L1 handoff

## Done
Fresh archive extraction, local `main` baseline, then branch `feat/fe-primitives`. Commit identity is `L1 <noreply@example.com>`. Only frontend/ and the typography decision in docs/DESIGN.md changed. No push, pull, backend changes or history rewriting.

The four Part A changes each have a separate commit: Urdu sans Latin fallback; LTR isolation for token names/ratios; a muted language separator; and a flat linked-node favicon. The existing style scan covers src, so the public SVG needs no scanner exemption. Its primary-green literal is explicitly allowed by this task.

Added Button, Field (password toggle, blur/native-invalid handling), Select, Checkbox, responsive sortable/paginated Table, all twelve StatusLabel values, SectionHeader, EmptyState, ErrorState, static Skeleton, focus-trapped Dialog, Toast, Wordmark, EchoText (original + four decorative layers), and Ltr. No generic Card, UI kit or chart package. Dialog makes the background inert, traps focus, restores it and supports Escape. Latin echo layers are disabled for Urdu and non-Latin text.

/dev/components is development-only; the showcase includes default, hover guidance, focus demo, disabled/loading actions, invalid controls, error/retry, empty/content feedback, all statuses and the confirmation dialog. It switches between the complete English/Urdu resources. Demonstration branch rows are synthetic and clearly labelled; no operational statistics or real people are represented.

## Commands and evidence
- `npm run lint`: PASS (ESLint and token/logical style scanner; bad CSS fixture still rejected in tests).
- `npx tsc --noEmit`: PASS (strict application TypeScript).
- `npm test`: PASS, 53 tests in 5 files. Covers button variants/states, field validation/ARIA/password visibility, select/checkbox labels/errors, numeric table sorting/aria-sort/pagination, icons/text for all statuses, dialog forward/reverse focus trap/Escape/restore, Urdu echo suppression, static skeleton CSS, font stack, separator and bidi contracts. Both languages render in the DOM showcase smoke test.
- `npm run build`: PASS. Existing third-party `use client` bundler warnings remain non-fatal.
- `npm run verify:build`: PASS. Both dev route chunks are absent, implementation markers and dev route paths are absent from built JS/CSS, image budgets and manifest pass.
- HTTP dev checks: /dev/components, /dev/tokens, the showcase module and /favicon.svg returned 200; SVG content type was image/svg+xml. The short-lived server emitted a shutdown/top-level-await warning after successful requests; this is not a rendered browser check.
- All five production WOFF2 URLs resolve to files and dist/favicon.svg exists.

Verification runtime: Node 24.22.1. Node 20.19+ remains the project target; this task did not run a separate Node 20 interpreter.

## Production gzip budget
| Asset | Gzip bytes |
| --- | ---: |
| Main JS | 114287 |
| Public lazy JS | 276 |
| Admin lazy JS | 185 |
| All JS combined (conservative upper bound for public initial) | 114748 |
| Styles | approximately 2980 |

Combined JS is 112.06 KiB / 114.75 decimal KB, under both interpretations of the 150 KB limit. Primitives remain reusable production source; only the demonstration route and its preview CSS are excluded.

## DESIGN.md section 12
| Item | Result | Evidence |
| --- | --- | --- |
| 1. Tokens only | PASS | Style lint, no new raw font declarations or physical directional properties. SVG literal explicitly allowed. |
| 2. Screenshots: 360/768/1280, EN/UR | Needs manual check | No actual browser screenshots generated or claimed. |
| 3. 1.3x font scaling | Needs manual check | DOM tests cannot measure clipping. Also check 200% browser zoom. |
| 4. Keyboard-only walkthrough | Needs manual check | Dialog focus transitions tested in jsdom; full browser Tab/Shift+Tab/Escape flow remains unverified. |
| 5. Loading/empty/error/content | PASS at component/DOM level | Showcase and tests include all four; error retry changes demonstration state. |
| 6. Role gating | N/A | No protected data or role-sensitive feature added. |
| 7. Hard bans | PASS, source review | Every section 11 bullet reviewed; no generic cards, colored icon containers, prohibited effects/colors, emoji, invented metrics, badge pills, vague actions, imagery, decorative charts, hover-only controls, tiny body text or animated loaders introduced. No ban-list violations found. Logical backdrop inset and validation-border specificity were corrected during implementation. Visual review remains manual. |
| 8. Lighthouse mobile | Needs manual check | No score claimed; browser unavailable. |
| 9. Contrast | PASS, automated | Ink/paper 16.87; muted/paper 5.70; muted/white 6.39; danger/paper 4.63; ink/white 18.88; primary/white 7.90; paper/primary 7.06. Decorative echo/skeleton and table separators do not encode interactive boundaries. Controls use muted borders; focus uses primary. |
| 10. Translation discipline | PASS | Component/feature JSX literal-text scan passes; both resources updated; native Urdu review flagged in REVIEW.md. |

## Untested / known issues
jsdom cannot prove rendered fonts, glyph fallback, bidi appearance, visual hit area sizes, sticky/stacked table layout, actual zoom/scaling, contrast after platform-native control rendering, browser focus-visible behavior, screen-reader announcements or Lighthouse performance. Source and DOM checks establish contracts, not rendering. The completion checklist is not fully visually verified.

No usable browser is installed in this environment. Do not interpret HTTP 200 or DOM rendering as screenshot approval. Native Urdu review is still required, including the supplied font subset and any fallback glyphs. Native select/checkbox styling should be checked on the target laptop/browser. The showcase is not connected to backend workflows and does not implement authorisation.

## Manual check on laptop
1. In frontend/, run npm ci then npm run dev; open /dev/components and /dev/tokens at 360, 768 and 1280px in both languages.
2. Inspect Elements > Computed > Rendered Fonts for Urdu body/headings/controls; expect Noto Naskh Arabic with Satoshi fallback for Latin. EN and isolated identifiers should use Satoshi. Inspect --paper and 17.58:1 ordering and the separator's muted computed color.
3. Tab through every action/control. Open the dialog, cycle forward/backward, close with Escape and confirm focus returns to the opener. Test show/hide password without form submission.
4. Sort the table both ways, change page size, page forward/back, then inspect key/value stacking below 768px and internal overflow on long data. Test 1.3x default font sizing and 200% zoom.
5. Inspect error icons/text and announcements; trigger retry and toast. Confirm no loading animation and no echo layers in Urdu. Confirm favicon returns 200 on the built preview too. Run mobile Lighthouse on the public root.

## Requests for L2
No L2 changes are needed for these primitives. At feature integration, supply authoritative permissions/status transitions and translated validation/error contracts. Backend must continue to enforce permissions, locks and confirmations' business effects.

## Dependencies
Only lucide-react was added (^1.61.0). Imports name individual icons; no namespace/icon registry import or UI/chart package was added.

## Files changed
- `docs/DESIGN.md`
- `frontend/TASK-1.3-REPORT.md`
- `frontend/index.html`
- `frontend/package-lock.json`
- `frontend/package.json`
- `frontend/public/favicon.svg`
- `frontend/scripts/contrast.test.ts`
- `frontend/scripts/primitives.test.tsx`
- `frontend/scripts/verify-build.mjs`
- `frontend/src/app/App.tsx`
- `frontend/src/components/Button.tsx`
- `frontend/src/components/Checkbox.tsx`
- `frontend/src/components/Dialog.tsx`
- `frontend/src/components/EchoText.tsx`
- `frontend/src/components/EmptyState.tsx`
- `frontend/src/components/ErrorState.tsx`
- `frontend/src/components/Field.tsx`
- `frontend/src/components/LanguageSwitch.tsx`
- `frontend/src/components/Ltr.tsx`
- `frontend/src/components/SectionHeader.tsx`
- `frontend/src/components/Select.tsx`
- `frontend/src/components/Skeleton.tsx`
- `frontend/src/components/StatusLabel.tsx`
- `frontend/src/components/Table.tsx`
- `frontend/src/components/Toast.tsx`
- `frontend/src/components/Wordmark.tsx`
- `frontend/src/features/dev/ComponentsPage.tsx`
- `frontend/src/features/dev/TokenPage.tsx`
- `frontend/src/features/dev/components-preview.css`
- `frontend/src/i18n/REVIEW.md`
- `frontend/src/i18n/en.json`
- `frontend/src/i18n/ur.json`
- `frontend/src/main.tsx`
- `frontend/src/styles/base.css`
- `frontend/src/styles/primitives.css`
- `frontend/src/styles/tokens.css`
