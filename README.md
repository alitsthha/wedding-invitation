# Shreeti & Prayag — Interactive Wedding Invitation

A production-ready, interactive digital wedding invitation. The site opens as a
closed paper envelope with a wax seal; scrolling breaks the seal, opens the
flap, and lifts the invitation card out into a full content page — one
continuous, scroll-driven transformation from physical object to website.

## Stack

- React 19 + TypeScript + Vite
- Three.js via React Three Fiber + @react-three/drei
- GSAP + ScrollTrigger for the master scroll timeline
- Framer Motion available for DOM micro-interactions
- Plain CSS with a small custom-property design system

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build     # type-checks with tsc, then builds to dist/
npm run preview   # serve the production build locally
```

## Configuring the invitation

Everything couple-specific — names, date, venue, story copy, timeline, gallery
images — lives in one file:

```
src/data/wedding.ts
```

Edit that object to reuse this project for a different event. No component
code needs to change.

## RSVP backend

`src/data/rsvpApi.ts` exposes a single `submitRSVP(data)` function. It posts
to `VITE_RSVP_ENDPOINT` (set in `.env`, see `.env.example`) if configured; with
no endpoint set it returns a clear "not connected" message instead of faking
success. Point it at your own server-side endpoint — never call a
third-party API with secrets directly from the browser.

## Background music (optional)

Set `VITE_MUSIC_URL` in `.env` to an mp3/ogg URL to enable the music toggle in
the bottom-right corner. Audio never autoplays; it only starts on a user tap,
and the on/off state is remembered for the session.

## Architecture

```
src/
├── components/
│   ├── invitation/   3D scene: envelope, flap, wax seal, card, particles, lighting
│   ├── sections/     Hero (opening experience) + the nine content sections + nav/footer
│   └── ui/           Button, Divider, Ornament, FloralDecoration, MusicToggle
├── animations/       Master scroll timeline, section reveal helpers, responsive
│                     scene-layout math, reduced-motion + WebGL-availability guards
├── data/             wedding.ts (content config) + rsvpApi.ts (submission)
├── hooks/            useReducedMotion, useMediaQuery/useDeviceTier, useInvitationAnimation
└── styles/           variables.css (tokens), typography.css, globals.css
```

The entire opening sequence is driven by **one** GSAP ScrollTrigger
(`animations/envelopeTimeline.ts`), which writes scroll progress into a plain
mutable ref. The Three.js scene reads that ref once per frame inside a single
`useFrame` loop and moves the camera/envelope/flap/seal/card directly —
there's no React state update per animation frame, and no `setTimeout`
anywhere in the sequence, so scrubbing forward, backward, or stopping midway
always stays in sync.

## Accessibility & fallbacks

- Respects `prefers-reduced-motion`: skips the pinned 3D sequence and shows
  the invitation directly, with all content and functionality intact.
- Falls back to a static SVG envelope if WebGL is unavailable or the 3D scene
  throws at runtime (`CanvasErrorBoundary`).
- Semantic HTML, labeled form fields, visible focus states, a skip link, and
  keyboard-operable navigation throughout.

## Performance notes

- The Three.js/R3F bundle is code-split behind `React.lazy`, so the initial
  page load doesn't pay for it until the opening scene is needed.
- Mobile devices get a capped device-pixel-ratio, fewer/no decorative
  particles, and disabled shadows (`animations/sceneLayout.ts`).
- Gallery images are lazy-loaded.

## Replacing placeholder assets

`public/assets/` contains SVG placeholders for the gallery and social preview
image, named so real photos can drop in with the same filenames
(`gallery-01.svg` → `gallery-01.jpg`, etc. — just update the extension in
`src/data/wedding.ts`).
