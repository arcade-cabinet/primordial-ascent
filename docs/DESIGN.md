---
title: Design
updated: 2026-04-24
status: current
domain: product
---

# Design

## Identity

*Primordial Ascent* is a **portrait touch-grapple climber**. You
play a first-person silhouette swinging up a basalt cavern over
rising magma. The point is the *feel* of each catch on an anchor —
the tension, the moment of rest, the choice of the next route.
There is no score-chase, no combo; the reward is muscle memory.

Every ascent is unique, driven by a "Cavern Signature" that
procedurally shapes the terrain, anchor placement, and visual
atmosphere.

## Player journey

1. **Land.** Oswald title in ember orange on volcanic void. Three
   verb chips: Grapple the ceilings / Rest on moss / Out-climb the
   lava. One CTA: Initiate Sequence.
2. **Signature.** Selecting the CTA opens the "New Ascent" console.
   The player can accept a procedurally generated "Cavern Signature"
   (e.g., Obsidian-Molten-Vault), request a new one, or toggle the
   "Daily Challenge" signature tied to today's date.
3. **Descend in.** Canvas fades in to a basalt cavern interior.
   A holographic signpost displays the current Cavern Signature.
   The first cyan anchor pulses above; the magma glow is distant.
4. **Swing.** Tap-to-aim, tap-to-fire hooks a cyan anchor, which
   triggers a rapier-driven swing. Releasing mid-arc carries
   momentum to the next anchor.
5. **Rest.** Landing on a moss ledge (green highlight) allows a
   moment of recovery, but the magma keeps rising.
6. **Break through.** Completion triggers a surface flare and
   fades to "SURFACE BREACHED" in limestone cream.

## Palette rationale

- `#120907` volcanic void — background. Near-black with a warm
  cast so the ember orange feels lit.
- `#2a1c18` basalt — terrain + rock walls. Warm charcoal.
- `#c75415` ember — the hero channel. Title, CTA, grapple
  indicator. Any ember is the player's primary target or action.
- `#00e5ff` / `#36fbd1` cyan/aquamarine — anchors. High-contrast
  unnatural light source to guide the player's eye upward.
- `#35d07f` / `#8bd450` moss — resting platforms. Cool greens
  signifying safety and recovery.
- `#e8dcc0` limestone cream — completion title. The "you're safe" color.
- `#f2e8d9` parchment — body text.
- `#a0907c` muted limestone — secondary labels.
- `#ff375f` / `#ff3333` hazard red — rising magma tint, defeat
  title. The only color that breaks the orange-cream-cyan
  triad, registering as a consequence rather than decoration.

## Fontography rationale

**Oswald** (display, heavy): tall condensed slab-adjacent
sans-serif. Carries the geological weight — letters feel carved
from basalt. Used for the title, phase banners, stat labels.

**Inter** (body): neutral, legible against warm parchment.

Both fall back to system fonts.

## Future work

- Haptics through Capacitor on successful anchor lock.
- Alternative control schemes: tilt-steer, swipe-aim.
- Cavern variant presets (vertical / wide / inverted).
