---
title: Design
updated: 2026-04-23
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

Three sectors per cavern, and every third run the final section is
seeded differently so what you've learned gets tested against a
face you haven't climbed before.

## Player journey

1. **Land.** Oswald title in ember orange on volcanic void. Three
   verb chips: Grapple the ceilings / Rest on moss / Out-climb the
   lava. One CTA: Initiate Sequence.
2. **Descend in.** Canvas fades in from void to a basalt cavern
   interior. Camera locks to the first-person climber. The first
   cyan anchor pulses above; the magma glow is still distant.
3. **Swing.** Tap-to-aim, tap-to-fire hooks a cyan anchor, which
   triggers a rapier-driven swing. Releasing mid-arc carries
   momentum to the next anchor.
4. **Rest.** Landing on a moss ledge (green highlight) lets the
   magma get closer — but only resting here restores the grapple
   reserve.
5. **Break through.** The final variable climb tests what you've
   internalized: the familiar ceiling spacing is now a trickier
   asymmetric pattern. Completion fades to "SURFACE BREACHED" in
   limestone cream.

## Palette rationale

- `#120907` volcanic void — background. Near-black with a warm
  cast so the ember orange feels lit.
- `#2a1c18` basalt — terrain + rock walls. Warm charcoal.
- `#c75415` ember — the hero channel. Title, CTA, grapple
  indicator, lava glow. Any ember is the player's target.
- `#e8dcc0` limestone cream — moss highlight, completion title.
  The "you're safe" color.
- `#f2e8d9` parchment — body text.
- `#a0907c` muted limestone — secondary labels.
- `#ff375f` hazard red — rising magma tint, "CONSUMED BY MAGMA"
  title. The only color that breaks the orange-cream palette, so
  it registers as a consequence rather than decoration.

## Fontography rationale

**Oswald** (display, heavy): tall condensed slab-adjacent
sans-serif. Carries the geological weight — letters feel carved
from basalt. Used for the title, phase banners, stat labels.

**Inter** (body): neutral, legible against warm parchment.

Both fall back to system fonts.

## Future work

- Audio: cave drone, anchor lock click, rope creak, lava rumble.
- Seeded daily final-climb challenge.
- Haptics through Capacitor on successful anchor lock.
- Alternative control schemes: tilt-steer, swipe-aim.
- Cavern variant presets (vertical / wide / inverted).
