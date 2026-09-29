// Shared types and category presentation metadata for the "Cyfrowa Mapa
// Marzeń" page. The postulates themselves (title/challenge/solution/position/
// category) come from the CMS "dream-map-points" collection at runtime — see
// useDreamMapPoints.ts. Nothing editorial is hardcoded here.
//
// The category maps below are the last remaining editorial leftovers; they'll
// move to the CMS in a follow-up step, which is why every lookup goes through
// an accessor with a fallback for slugs this file doesn't know about.

export interface DreamMapPoint {
  /** Stable postulate number from the CMS (`pointNumber`), not the DB row id. */
  id: number
  /** Category slug — dynamic, whatever the CMS holds. */
  category: string
  title: string
  challenge: string
  solution: string
  /** Position on the night-sky map, in % of the sky area. */
  px: number
  py: number
  votes: number
}

/** Polish plural of "głos" (vote) for the given count — used in aria-labels. */
export function voteWord(n: number): string {
  if (n === 1) return 'głos'
  const lastDigit = n % 10
  const lastTwo = n % 100
  if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return 'głosy'
  return 'głosów'
}

export const CATEGORY_COLORS: Record<string, string> = {
  ekologia: '#135e24',
  turystyka: '#1f6fa8',
  mlodziez: '#a8551f',
  seniorzy: '#0f6e56',
  infrastruktura: '#8a4a2e',
}

export const CATEGORY_NAMES: Record<string, string> = {
  ekologia: 'Ekologia',
  turystyka: 'Turystyka',
  mlodziez: 'Młodzież',
  seniorzy: 'Seniorzy',
  infrastruktura: 'Infrastruktura',
}

export const CATEGORY_CONSTELLATIONS: Record<string, string> = {
  ekologia: 'Gwiazdozbiór Życia',
  turystyka: 'Gwiazdozbiór Odkrywców',
  mlodziez: 'Gwiazdozbiór Energii',
  seniorzy: 'Gwiazdozbiór Mądrości',
  infrastruktura: 'Gwiazdozbiór Fundamentów',
}

/**
 * Explicit edges (star id pairs) tracing each constellation's actual shape —
 * not just "connect the points in order". Modeled on real constellations
 * whose star count matches each category:
 *  - infrastruktura (7): Wielki Wóz / Ursa Major — bowl (closed
 *    quadrilateral) + handle (open, bent arc), the classic dipper shape.
 *  - turystyka (4): Krzyż Południa / Crux — two crossing lines, not
 *    connected to each other at their ends.
 *  - mlodziez (4): Delfin / Delphinus — a small closed diamond/kite.
 *  - seniorzy (2): a single line — real asterisms often are just a pair
 *    (e.g. Ursa Major's own "pointer stars").
 *  - ekologia (1): a lone bright star, no line — see CATEGORY_TAIL.
 */
export const CATEGORY_LINES: Record<string, [number, number][]> = {
  ekologia: [],
  turystyka: [
    [5, 7], // Gacrux -> Acrux: the long arm
    [2, 14], // Mimosa -> Delta Crucis: the short arm, crossing the long one
  ],
  mlodziez: [
    [9, 16],
    [16, 10],
    [10, 17],
    [17, 9],
  ],
  seniorzy: [[11, 18]],
  infrastruktura: [
    // bowl (Dubhe -> Merak -> Phecda -> Megrez -> Dubhe)
    [1, 4],
    [4, 6],
    [6, 8],
    [8, 1],
    // handle (Megrez -> Alioth -> Mizar -> Alkaid), open — doesn't close
    [8, 12],
    [12, 13],
    [13, 15],
  ],
}

/** A short decorative "tail" flourish extending from one star in each
 * constellation — not a postulate, purely for the hand-drawn look real
 * constellation figures have (Delphinus' own faint tail star is the direct
 * inspiration). */
export const CATEGORY_TAIL: Record<string, { fromId: number; x: number; y: number }> = {
  ekologia: { fromId: 3, x: 64, y: 30 },
  turystyka: { fromId: 7, x: 75, y: 64 }, // continues past Acrux, like Crux's real pointer to the pole
  mlodziez: { fromId: 10, x: 48, y: 38 },
  seniorzy: { fromId: 18, x: 42, y: 64 },
  infrastruktura: { fromId: 15, x: 36, y: 2 }, // continues the handle's curve past Alkaid
}

/** Neutral grey for a category the CMS has but this file doesn't know yet. */
const FALLBACK_CATEGORY_COLOR = '#6b7280'

export function categoryColor(slug: string): string {
  return CATEGORY_COLORS[slug] ?? FALLBACK_CATEGORY_COLOR
}

export function categoryName(slug: string): string {
  return CATEGORY_NAMES[slug] ?? (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : slug)
}

export function categoryConstellation(slug: string): string {
  return CATEGORY_CONSTELLATIONS[slug] ?? ''
}

export function categoryLines(slug: string): [number, number][] {
  return CATEGORY_LINES[slug] ?? []
}

export function categoryTail(slug: string): { fromId: number; x: number; y: number } | undefined {
  return CATEGORY_TAIL[slug]
}

/** Category slugs actually present in the given points — known ones first,
 * in the order of the metadata maps above, then any slug the CMS added on
 * its own, in order of first appearance. */
export function categorySlugs(points: DreamMapPoint[]): string[] {
  const present = new Set(points.map((p) => p.category))
  const known = Object.keys(CATEGORY_NAMES).filter((slug) => present.has(slug))
  const extra = [...present].filter((slug) => !(slug in CATEGORY_NAMES))
  return [...known, ...extra]
}
