# A Studio — Cinematic Dark

Scroll-driven site for A Studio and its three sub-brands: A Drone Company (modular folding drones), A Web Company (websites for companies) and A Exam Company (VCE Exam Trainer).
React 19 + TypeScript + Vite, GSAP (ScrollTrigger, SplitText), Lenis, three@0.169 + react-three-fiber, @shadergradient/react.

## Run

```bash
npm install
npm run dev      # http://localhost:5181 (strict port)
npm run build    # tsc -b && vite build
npm run lint     # oxlint
npm test         # vitest run
```

## Structure

- `src/content.ts` — all copy, links and brand colours.
- `src/App.tsx` — page map (`hub`, `drone`, `web`, `exam`); `providers/` holds Lenis smooth scroll (synced to the GSAP ticker), the hash router with its brand-bar curtain transition, and the intro flag the loader flips.
- `src/pages/` — one page per route. Routes are `#/`, `#/drone`, `#/web`, `#/exam` (`lib/route.ts`); other hashes such as `#contact` are in-page anchors.
- Each company page sets `data-company` on `.site`, which swaps the accent colour variables (`--accent`, `--accent-rgb`) in `styles/global.css`: blue drones, yellow web, red exam.
- `src/sections/` — Hero (takes a route), IntroStatement, Companies (chooser and cross-links), DroneSequence, Principles, Work, Footer.
- `public/marks/` and `src/lib/companyMarks.ts` — the sub-brand logos, drawn with the A Studio mark's stroke at the same scale. `CompanyMark` draws them in the company's accent, and each company page also uses its logo as the favicon.
- `src/components/` — Loader, Cursor, Nav, RouteCurtain, ScrollProgress, Marquee, MagneticButton, GlassPanel (SVG displacement glass), SitePreview (live iframe), ReactiveWordmark, RevealHeading.
- `src/scenes/drone/` — procedural drone: `buildDrone` (pure three.js scene graph), `applyDroneState` (writes a sampled state onto it), `DroneRig` (per-frame director: smoothing, camera orbit, callout projection), `Atmosphere`, `SceneEnvironment`.
- `src/lib/` — pure helpers with Vitest tests: `droneTimeline` (scroll progress → arm/prop/module/camera state), keyframes, easing, math, pointer maths, render quality tiers, seeded random, glass displacement map.

## Notes

- One ScrollTrigger pin drives the drone: its progress feeds `droneStateAt`, which every frame turns into arm angles, prop speed, module docking, camera pose and callout opacity.
- `prefers-reduced-motion`: no Lenis, no pins or scrubs, the drone renders once fully deployed, text appears with plain fades.
- Mobile: lower render tier (DPR ≤ 1.5, fewer particles and segments); desktop DPR is capped at 2. WebGL canvases pause when off screen.
- three is pinned to 0.169 because @shadergradient/react breaks on newer versions.

## Hosting

Served from GitHub Pages at https://a4rav-1.github.io/astudio-website/ from the `gh-pages` branch (no Actions workflow, the build is pushed directly).

```bash
npm run build:pages   # builds with base /astudio-website/ into dist-pages/
```

Publish by pushing the contents of `dist-pages/` (plus an empty `.nojekyll`) to the `gh-pages` branch.
