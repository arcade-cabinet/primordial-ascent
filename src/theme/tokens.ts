/**
 * Primordial Ascent palette — volcanic geological.
 *
 * See docs/DESIGN.md for rationale. Short version: the player climbs
 * a basalt face over a rising magma pool. Charcoal is the rock; ember
 * orange is the grapple path and the lava itself; limestone cream is
 * the grip beacon; body text is a warm off-white.
 */

export const palette = {
  bg: "#120907",
  charcoal: "#2a1c18",
  ember: "#c75415",
  limestone: "#e8dcc0",
  fg: "#f2e8d9",
  fgMuted: "#a0907c",
  warn: "#ff375f",
} as const;

export type PaletteKey = keyof typeof palette;
