---
title: Standards
updated: 2026-04-23
status: current
domain: quality
---

# Primordial Ascent — Standards

## Code quality

### File length

Soft limit 300 LOC. Hard exceptions:
`src/engine/primordialSimulation.ts` up to ~900 (cavern layout +
physics tuning), `src/ui/game/CavernGuide.tsx` up to ~400 (R3F
beacons + trails), `src/ui/game/Player.tsx` up to ~400 (grapple +
first-person controller + input), `src/ui/Game.tsx` up to ~300.

### TypeScript

Strict. `verbatimModuleSyntax: true`. No `any`. Explicit return
types on exported functions. `useTrait` results must be guarded
with `if (!state) return null;` because StrictMode double-renders
mount the scene children before traits settle.

### Linting

Biome 2.4. No Tailwind build (pinned utility subset in
`src/theme/tw.css`).

### Dependencies

Weekly dependabot, minor+patch grouped. three, @react-three/*,
koota, simplex-noise, capacitor pinned by major.

## Player-journey gate (non-negotiable)

Must pass on desktop (1280×800) AND mobile-portrait (390×844):

1. Cold load first paint under 2 seconds.
2. Start screen shows "PRIMORDIAL ASCENT" in Oswald ember-orange
   on volcanic void, the tagline, three verb chips (Grapple the
   ceilings / Rest on moss / Out-climb the lava), the Initiate
   Sequence CTA. No layout shift.
3. Tapping CTA transitions to the R3F scene within 1.5s (R3F +
   rapier cold-start is allowed to take longer than the 600ms
   cabinet gate). No console errors (ref-count shader warnings on
   cleanup are allowed).
4. In gameplay the player can see: the first cyan anchor, the
   rising magma below, the crosshair, the altitude readout.
5. Portrait-locked capacitor config (set in `capacitor.config.ts`).
6. Completion screen reads "SURFACE BREACHED"; failure reads
   "CONSUMED BY MAGMA" — both offer a continue path.

## Brand

- Title: "Primordial Ascent"
- Tagline: "Thumb a grapple up a primal face, feel each catch,
  reach a variable final climb that tests what you learned."
- Palette/fonts: see `CLAUDE.md`.
- Icon: an ember-orange grapple silhouette on volcanic charcoal.
  TODO.
