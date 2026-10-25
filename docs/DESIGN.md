# RABTA Design Specification

## 1. Intent
RABTA is a trusted operations system for a volunteer organisation, with a public face. Two registers, one system. Public site: confident, editorial, Swiss-minimal; big type, whitespace, one dramatic hero, real photography. Admin: calm, dense, precise; a branch lead on a phone and a finance reviewer on a laptop must trust it in five seconds. Same palette, type system and components in both. It should look designed by a person who understands the organisation, not generated from a template.

## 2. Tokens (frontend/src/styles/tokens.css only; never hard-code values elsewhere)
Colors: paper #F2F2F2, white #FFFFFF, ink #111111, ground-dark #0B0B0B, footer #1E1E1E, muted #5F5F5F, hairline rgba(17,17,17,.12), hairline-on-dark rgba(242,242,242,.14), echo #BFBFBF #C9C9C9 #D1D1D1 #D9D9D9, primary #0F5C4D, primary-hover #0B4A3E, accent-mint #7DD9B5 (dark grounds only), chart-2 #BFE5D3, chart-3 #3F6C8C, danger #C2410C (burnt orange, never red), danger-tint #FBE9DF.
Text on primary is paper/white; on mint is ink; on danger is white. Verify pairings: >= 4.5:1 body text, >= 3:1 large text and UI borders.
Spacing (px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Radii: 4, 8, 9999 (pill: buttons and image masks only). Borders 1px. No shadows, gradients, glow or glassmorphism. The only blur allowed is the sticky nav at 90% opacity.

## 3. Typography
Clash Display 700 (headlines, big numbers), Satoshi 500/700 (everything else), Noto Naskh Arabic 400/700 (Urdu). Self-hosted woff2, font-display: swap, preload the hero weight only.
Scale (clamp, as tokens): display 56-180px (public hero only, about 11vw), h1 40-64, h2 28-40, h3 20-24, body 16-17 (never below 16 on public), UI/table 14-15 (never below 14), label 12-13 uppercase +0.08em (max two per screen, public only; admin labels are sentence case).
Headlines: tracking -0.03em, word-spacing 0.14em (tokens --tracking-headline and --heading-word-spacing), leading 0.95-1.0, Latin only. Numbers in tables/KPIs: font-variant-numeric tabular-nums.
Urdu ([lang="ur"]): Noto Naskh Arabic, letter-spacing 0, word-spacing normal, line-height 1.7, no uppercase, no negative tracking, no echo effect, headlines slightly smaller than English. Test every screen in Urdu before reporting done.

## 4. Layout
12-column grid, 24px gutters desktop, 16px mobile, max content 1280px; admin fluid to 1440px. Breakpoints 360 (minimum), 768, 1024, 1280. Compose asymmetrically, not everything centered or equal. Vary rhythm: a full-bleed moment, a text-led moment, a table or list moment. Use ONLY logical CSS properties (margin-inline, padding-inline, inset-inline, text-align start/end, border-inline).

## 5. Public site
5.1 Navigation: sticky 72-80px, paper at 90% opacity with 12px backdrop blur, bottom hairline. Left Wordmark; 7 links 14px uppercase Satoshi (normal-case Urdu), 120ms hover to muted, current page 2px underline AND aria-current. Right: language switch (EN | اردو as text, no flags) and one pill button "Volunteer" that inverts on hover. Mobile: full-screen menu with large type.
5.2 Home portal hero: tall section (~250vh) with a sticky 100vh stage on #0B0B0B. Layers back to front: full-bleed photograph (starts scale 1.12, settles to 1), two solid #0B0B0B panels each just over 50% width pinned to the edges so the hero begins CLOSED, two small mint dots at center, the wordmark on top split into two spans "RAB" and "TA" in Clash Display about 16-18vw in paper color, and Urdu رابطہ as a small static label (never split). On scroll (position-driven, reversible): panels translate outward past their own width; photo settles to 1; wordmark scales up modestly while tracking tightens simultaneously, halves travel to opposite edges by about half their own width; dots drift toward opposite corners. transform/opacity only. Verify in a browser that something moves >100px across the first 700px of scroll and report the measured value. Reduced motion or no JS: render the opened state statically. Corner micro-labels (12px): top-left "Volunteer network · Pakistan"; top-right and bottom labels use values from the API/seed data, never hard-coded numbers. Mobile: same mechanic, test at 360px.
5.3 Statement section (light): vertical hairline leading in. One large Clash Display statement (clamp 28-56px, max about 22ch) with ONE keyword in italic serif (Latin only; bold in Urdu). Below, a 3-column text-only grid (32px gaps), bold h3 plus two lines of body each, NO icons, NO boxes, hairline separated. Copy must be specific, not generic.
5.4 Numbers and programs: live numbers (branches, active volunteers, programs) from the API set huge in Clash Display with a small label, hairline separated, not tiles. Programs are RULED EDITORIAL ROWS: number (01, 02...) in light type, name in Clash Display, one-line description, branch count at the end; whole row is a link with an arrow that mirrors in RTL. Do not build icon cards.
5.5 Branches and events: asymmetric 12-col image layout (8+4, then 5+7) with mixed shapes: one rounded-sm rectangle, one tall pill mask, one circle. Images start 20% grayscale; hover full color + scale 1.05 over 700ms cubic-bezier(0.77,0,0.175,1); first-view reveal with clip-path inset (once, never un-reveals). Captions under images. Events: hairline-ruled list (date, title, branch, city) collapsing to two-line rows on mobile.
5.6 Other pages: About (editorial long-form, sticky section index on desktop, timeline as ruled list); Programs (ruled rows expandable inline); Branches (searchable by city, rows show code, city, status icon+text; detail page; no map embed); Events (upcoming/past text tabs with 2px primary underline); Get Involved (volunteer form: single column max 560px, labels above, inline errors in danger with icon AND text, "what happens next" three-step line under submit, success state replaces form with the application reference, hidden honeypot, specific messages for 429 and duplicates in both languages); Contact (form plus address/hours as plain text, no fake map); Footer (#1E1E1E, paper text at 60% opacity, 4 columns, Lucide-style line icons only for contact items, 5% white top border, language switch repeated).

## 6. Admin
6.1 Shell: left sidebar 248px (mirrors right in RTL): Wordmark, compact search, nav with 20px Lucide line icons + text, selected = 3px primary bar on the inline-start edge + bold + primary text (not a filled pill). Groups separated by hairlines. Role-filtered from config. Under 1024px it becomes a slide-in drawer with a visible menu button. Top bar: page title in Clash Display (h2), breadcrumb as plain text, language switch, user menu (name, role in text, logout). One primary action per page at the inline-end of the top bar.
6.2 Head office dashboard (modeled on the reference image minus its shadows and gradients): KPI strip of 4 numbers in Clash Display (approved collections total, reports awaiting review, unrouted amount, active members) separated by vertical hairlines; no tiles, no made-up trend arrows, no decorative sparklines. Each KPI says APPROVED or PENDING in text; pending uses a dashed underline plus the word "Pending". Below, a two-column layout of DIFFERENT sized panels: wide bar chart "Approved collections by month" (primary bars, latest emphasized, PKR with grouped thousands), narrower line chart "This week vs last week" (primary vs chart-2, direct labels), donut "Sent to main account vs not yet sent" (amounts and text labels, amount in center), area chart "Reports submitted vs approved" (flat tint). Panels are white, 1px hairline, 8px radius on the dashboard only; each has a title, plain subtitle with data source and period, and export where useful. Under the charts: the "Unrouted collections" table (branch code, branch, amount, logged date, days waiting, action), never hidden behind a tab. Charts are hand-rolled SVG, flat fills, hairline gridlines, 12px muted axis text, plain rectangle tooltips, keyboard-focusable points, a "View as table" toggle. Colors never carry meaning alone.
6.3 Tables: dense but legible, 14-15px, 48px rows, sticky header, hairline dividers (no zebra, no boxed cells), numeric columns aligned to the logical end, sortable headers with arrow and aria-sort, pagination and page size at the bottom, one filter row above, active filters as removable text chips, row actions via an explicit button (never hover-only). Empty state: one plain sentence saying why and the next action. Mobile: rows become stacked key/value blocks; wide data scrolls inside its own container.
6.4 Forms: single column, labels above, helper text under the label (not placeholders), inline errors on blur and submit, 2px primary focus ring with 2px offset, required fields marked with the text "(required)", irreversible actions (approve report, accept applicant, close branch) use a confirmation dialog that states the consequence in plain words, with the confirm button named for the action, never "OK".
6.5 Weekly report screen (judged flow): header with branch code, week range (Mon-Sun), StatusLabel; horizontal step indicator Draft, Submitted, Returned/Approved, Locked (current step by text and shape, completed with check icon); figures table with collections and totals in Clash Display; a History ruled list (who, when, comment); action area shows only actions this role may take (Submit / Return with required reason / Approve); approved shows a locked banner: icon + "Approved and locked on <date> by <name>".
6.6 Collections: table plus "Log collection" form (PKR with live formatting stored as paisa, date, source, notes). Each row shows state text: Editable (n days left) or Locked; locked rows have no edit action and explain why on focus. "Sent to main account" shows date or "Not yet sent".
6.7 Other: Applications (status tabs, detail drawer, Accept/Decline with confirmation; accepting shows the new member ID), Members (debounced search, filters branch/team/role/status, pagination), Branches (list, create/edit, lifecycle control showing only allowed next states with explanation), Content manager (EN and UR fields side by side, stacked on mobile, RTL input for Urdu, draft/publish toggle with confirmation, sanitized preview), Audit log (Super Admin: filter row actor/entity/action/date range, expandable rows with readable before/after diff), Users (table plus role assignment).

## 7. Motion
Reveals: clip-path inset 700ms cubic-bezier(0.77,0,0.175,1), once per element, never un-reveal. Hover: images grayscale 20% to 0 and scale 1.05; links 120ms color; buttons invert. Portal hero: scroll-driven and reversible. Admin: no decorative animation; only drawer slide (200ms), dialog fade (150ms), and static muted blocks for loading (no shimmer gradient). prefers-reduced-motion: reduce disables all of it and shows finished states.

## 8. Imagery and copy
Real photography only, no stock illustrations, no AI-generated art, no decorative blobs or patterns. Copy is specific, plain, in the organisation's voice; every string in en.json/ur.json; Urdu is genuine Urdu flagged "needs native review" in frontend/src/i18n/REVIEW.md. All sample data is fake: no real people, CNICs, phones or addresses.

## 9. Accessibility
Contrast per section 2, visible focus everywhere, skip-to-content link, landmarks, labels on every input, aria-labels on icon-only buttons, status never by color alone, dialogs trap and restore focus, tables have captions and scope attributes, errors announced via aria-live, hit targets >= 44px, works at 200% zoom and 1.3x font scaling, full keyboard operation including chart table toggles.

## 10. Performance (Lighthouse mobile >= 90 on public pages)
Public and admin are separate lazy route trees. Only the hero font weight is preloaded. No UI library, no charting library, import individual Lucide icons only. Images AVIF/WebP with srcset and explicit dimensions; lazy-load below the fold. Public JS <= 150 KB gzipped initial. Hashed immutable assets.

## 11. HARD BANS (AI-generated UI patterns). If any appear, the task is not done.
- Repeated identical rounded cards in a grid (icon + title + blurb x3 or x6). Use ruled rows, text columns or asymmetric layouts.
- Icon in a colored circle or rounded square above a heading.
- Gradients of any kind, gradient text, glow, glassmorphism, neumorphism, drop shadows.
- Emoji anywhere in UI, copy or user-facing strings.
- Purple, indigo, blue-to-purple, default Material blue, any yellow or red (danger is burnt orange #C2410C).
- Fake dashboard chrome: made-up percentage deltas, green up-arrows, "vs last month" claims without data, decorative sparklines, meaningless progress rings.
- Pill badges on everything; status only via StatusLabel (icon + text) where status exists.
- Centered-everything layouts, uniform 24px padding everywhere, every section the same height and structure.
- Generic copy: "Welcome back!", "Empower your community", "Seamless", "Revolutionize", "Unlock", "All-in-one", "Powerful", "Get started today", lorem ipsum, "John Doe", placeholder testimonials, invented press quotes or statistics.
- "Learn more" links with no object; vague buttons ("Submit", "OK", "Click here"). Buttons state the action ("Submit weekly report", "Accept applicant").
- Hero with a gradient blob, floating abstract shapes, 3D illustrations, mesh backgrounds.
- Radii above 8px (except pills/masks), thick colored left borders on alerts, colored top bars on cards.
- Decorative charts; every chart answers a stated question with real data.
- Hover-only essential actions; tooltips as the only place a label exists.
- Text in images; text under 14px in admin or 16px on public body.
- Shimmer gradients and spinner-only loading states.

## 12. Completion checklist (answer pass/fail with evidence before every report)
1. Tokens only: lint passes for hex, raw font-family and physical CSS properties.
2. Screenshots at 360, 768 and 1280px in English AND Urdu (RTL) for every screen in the task.
3. 1.3x font scaling: no clipping.
4. Keyboard-only walkthrough of the primary flow succeeded.
5. All four states exist (loading, empty, error with retry, content).
6. Role gating verified for each relevant role.
7. Section 11 ban list reviewed line by line; list violations found and fixed.
8. Lighthouse mobile run for any public page touched (report scores).
9. Contrast check of any new color pairing.
10. No hard-coded strings; ur.json updated and flagged for native review.
