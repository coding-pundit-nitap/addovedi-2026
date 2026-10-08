# CLAUDE.md

Project-specific context for Claude Code sessions in this repo. See [README.md](README.md) for frontend onboarding/setup and [REGISTRATION.md](REGISTRATION.md) for the registration system's design.

## Stack & structure

- `client/`: React + Vite, Three.js (react-three-fiber + drei) for the 3D hero scene, Zustand for state, Tailwind for styling, Framer Motion for 2D animation.
- `server/`: Node.js + Express + MongoDB (Mongoose). `server/controllers`, `server/models`, `server/routes`, `server/middleware`, `server/services`, `server/utils`.
- Client install requires `npm install --legacy-peer-deps` inside `client/` (strict 3D-library peer deps — see README).

## Deploy flow

- **Frontend**: Vercel, auto-deploys on push to `main`.
- **Backend**: Render, **manual trigger only** — pushing to `main` does NOT redeploy it. Any change under `server/` needs an explicit Render redeploy to go live.
- `TURNSTILE_SECRET_KEY` (server) / `VITE_TURNSTILE_SITE_KEY` (client) are set on Render/Vercel for the Cloudflare Turnstile CAPTCHA on signup.

## Key systems

- **Participant accounts**: real server-backed accounts (`GlobalUser` model) with guaranteed-unique Addovedi IDs — not localStorage. Registration status (`PENDING_UNSTOP_VERIFICATION` / `VERIFIED` / `CANCELLED`) is fetched live from `GET /registrations/my/:addovediId` (`server/controllers/registrationController.js` → `getMyRegistrations`), which returns every registration an Addovedi ID is part of as leader OR team member. `client/src/utils/registrations.js` wraps this fetch. Only the team leader can cancel a registration (enforced both client- and server-side via leaderUID+leaderPhone match).
- **Admin dashboard** (`client/src/components/admin/AdminPage.jsx`): sessions expire after 12h; fetch functions must handle non-OK responses explicitly (force logout + "SESSION EXPIRED") rather than silently showing empty lists — this was a real bug (fixed in commit 5c9ac0a).
- Duplicate-registration checks and "all registrations for an Addovedi ID" queries rely on indexes with a case-insensitive collation (`{ locale: 'en', strength: 2 }`) on `Registration` — see `server/models/Registration.js`. Don't add a new cross-event or cross-user lookup without an index to match, it'll silently become an O(n) scan at scale.
- **Timeline scheduling**: the public Timeline page (`client/src/components/timeline/TimelinePage.jsx`) is admin-controlled, not hardcoded. `SubEvent.timeline` (`server/models/SubEvent.js`) holds `{ day: 1|2|3|null, time, end, venue, mode, prize }` per sub-event, edited from Admin's "Timeline Scheduling" section on the sub-event form. `day` is a bucket index (1/2/3), not a literal calendar day-of-month — the calendar dates/labels for those buckets live in one place, `DAY_META` in `client/src/data/events.jsx`, and `buildTimelineDays()` rebuilds the three-day schedule from live DB data (falls back to the static hardcoded schedule only when the DB has zero sub-events). An event with `timeline.day` unset is simply left off the Timeline page — that's the correct "not scheduled yet" state, not a bug. Event LIVE/UPCOMING/COMPLETED status is computed automatically from real time vs. the scheduled time, not admin-set.
- **Event dates**: Day Zero = Oct 28 2026 (starts 5PM) / Day 1 = Oct 29 / Day 2 = Oct 30. These map to `timeline.day` values 1/2/3 respectively via `DAY_META` (see above) — if dates change again, only `DAY_META` needs editing, nothing else.

## Conventions learned

- **Mobile breakpoints**: this codebase tends to default to Tailwind's `lg:` (1024px) for switching from stacked to multi-column/desktop layouts, which leaves a dead zone around 768–1023px (tablet/small-laptop) where content stacks into a narrow column on an otherwise-wide screen. Prefer `md:` (768px) unless there's a specific reason for `lg:`. Also watch for hardcoded pixel `minHeight`/fixed avatar sizes that don't get reduced/removed on mobile, and headings that wrap awkwardly against an adjacent badge instead of stacking.
- The Hero page (`client/src/components/hero/HeroOverlay.jsx` + `client/src/three/Scene/IntroSequence.jsx`) is a timed cinematic intro: navbar/logo/button are hidden (`showNavbar`/`showLogo`/`showButton` in Zustand, all default `false`) until a GSAP timeline reveals them at ~4–6s. A near-blank screen in the first few seconds on `/home` is expected, not a bug.
- `git commit`/push to `main` is done directly (no PR requirement enforced, though GitHub shows a bypassable branch-protection rule); verify uncommitted work actually got pushed rather than trusting a prior session's own summary of what it did — check `git status`/`git log` directly.
- Dev server: `client` uses port 5173; a server may already be running from a terminal the user has open — check with `lsof`/the preview tool's own "port in use" message before starting a duplicate one.
- **Shared CSS across components is fragile here**: several components (`HeroOverlay.jsx`, `CommonSidebar.jsx`, `CommonNav.jsx`) each embed their own `<style>` block with raw CSS classes (`.reg-btn`, `.reg-fill`, etc.) that other components' JSX reuses by class name without defining the rule themselves, assuming whichever component happens to be mounted alongside provides it globally. This breaks silently (missing `position:relative`/`overflow:hidden` etc.) on any page/route where that other component isn't mounted. When adding a styled element, give the component its own copy of the CSS it needs rather than assuming another mounted component provides it.
- **Native `<input type="time">` is unreliable here**: Safari can flag it "invalid" on form submit if the field is still mid-focus when Save is clicked, even with a valid value typed. Prefer plain `<input type="text">` with a placeholder hint (e.g. "24h, e.g. 13:00") for time fields — matches how times are stored everywhere in this codebase anyway (plain "HH:MM" strings).
- **EventsPage/TimelinePage poll the DB** (`fetchEvents` every 4s, registrations every 8s) and rebuild derived objects (`activeEvent`, category lists) as brand-new references each cycle even when content is unchanged. Any `useEffect` elsewhere that depends on one of these objects wholesale (instead of a stable primitive like `.title`) will re-fire on every poll tick — this caused a real bug where the event modal's tab selection snapped back to "Register" a few seconds after the user clicked Overview/Rules (fixed in commit 1d5eae0). Depend on stable primitives, not the whole object, when reacting to "did the selected event change."
- When a browser-pane repro looks broken in a way that contradicts the code, check for a stale Vite HMR bundle before concluding it's a real bug — this session hit a case where `[hmr] Failed to reload ...` had left genuinely stale JS running; a hard reload (`location.reload(true)`) resolved it and the "bug" wasn't real.

## Known gaps (as of 2026-10-08, end of session)

- Broader mobile-responsiveness pass across Events, Crew, Alliances, Home pages was started but not finished — Player HQ/profile section (`PortalPage.jsx`) was fixed; the rest (Events, Crew, Alliances page layouts themselves, not just the modal) still needs a pass.
- GitHub flags 7 Dependabot vulnerabilities (1 high, 6 moderate) on `main` — not yet triaged.
- `.claude/launch.json` was added this session to run the client dev server via the preview tool (`npm --prefix client run dev`, port 5173).

## Session log (reverse chronological, most recent first)

Each entry is a pushed commit; "Render redeploy needed" means it touched `server/` and requires the manual Render trigger (see Deploy flow above) to go live, separate from Vercel's automatic frontend deploy.

- `1d5eae0` fix: event modal's Overview/Rules tab reset back to Register automatically while viewing an event (polling-induced `useEffect` dependency bug, see Conventions above). No Render redeploy needed.
- `b349aec` feat: event dates updated to Oct 28–30, 2026 (Day Zero/Day 1/Day 2), replacing old Sep 12–14 placeholder — countdown, Connect Hub footer, Timeline page, Admin scheduling UI. No Render redeploy needed.
- `4a1b0fc` feat: top-left brand mark replaced with the real Addovedi logo artwork (was a hand-coded SVG icon + gradient text) in `HeroOverlay.jsx` and `CommonNav.jsx`; stacked above "SYSTEM ONLINE" instead of beside it to avoid overflowing into nav links. No Render redeploy needed.
- `a28a7d4` fix: Admin's Timeline Scheduling Start/End Time fields rejected valid input in Safari (native `<input type="time">` quirk) — switched to plain text inputs. No Render redeploy needed.
- `0d82684` feat: admin-controlled Timeline scheduling — see "Timeline scheduling" under Key systems above. **Render redeploy needed** (new `SubEvent.timeline` field).
- `cdad804` fix: Player HQ's Registered Events panel went blank on every page except Home — a CSS class (`.reg-btn` etc.) that `PortalPage.jsx` used but never defined itself, relying on another mounted component to provide it. No Render redeploy needed.
- `5c15516` feat: team-member registration status — a team member who didn't personally submit the registration form can now see their own real status (not just the leader), server-backed via `GET /registrations/my/:addovediId`. **Render redeploy needed** (new route).

Earlier history: see `git log` — the above covers this session only.
