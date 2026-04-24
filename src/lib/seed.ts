import seedrandom from "seedrandom";

const ADJECTIVES_A = [
  "Obsidian", "Primal", "Basalt", "Volcanic", "Igneous", 
  "Tectonic", "Magmatic", "Ancient", "Archaic", "Geologic"
];

const ADJECTIVES_B = [
  "Ember", "Molten", "Searing", "Glowing", "Burning", 
  "Radiant", "Fuming", "Steaming", "Cracking", "Ascending"
];

const NOUNS = [
  "Vault", "Chasm", "Shaft", "Vent", "Cavern", 
  "Gorge", "Abyss", "Crevasse", "Crater", "Spire"
];

export function generateSeedPhrase(seed?: string): string {
  const rng = seedrandom(seed);
  const a = ADJECTIVES_A[Math.floor(rng() * ADJECTIVES_A.length)];
  const b = ADJECTIVES_B[Math.floor(rng() * ADJECTIVES_B.length)];
  const n = NOUNS[Math.floor(rng() * NOUNS.length)];
  return `${a}-${b}-${n}`;
}

export function createSeededRNG(seed: string) {
  return seedrandom(seed);
}

export function generateSeedColor(seed: string, saturation = 0.5, lightness = 0.5): string {
  const rng = seedrandom(seed);
  const hue = Math.floor(rng() * 360);
  return `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;
}
