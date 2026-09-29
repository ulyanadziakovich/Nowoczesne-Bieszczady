// Shared types and helpers for the "Cyfrowa Mapa Marzeń" page. Every piece
// of editorial content comes from the CMS at runtime: the postulates from
// the "dream-map-points" collection (see useDreamMapPoints.ts) and the
// category labels, colours and constellation geometry from
// "dream-map-categories" (see useDreamMapCategories.ts). Nothing here is
// hardcoded — this file only holds the shared type and two pure helpers.

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
  /** Comma-separated postulate numbers this star draws a constellation line
   * to (e.g. `"1, 12"`); empty when no line starts here. */
  connectsTo: string
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

/** Category slugs actually present in the given points, ordered by
 * `knownOrder` (the CMS's own category order); slugs missing from it come
 * last, in order of first appearance. */
export function categorySlugs(points: DreamMapPoint[], knownOrder: string[]): string[] {
  const present = new Set(points.map((p) => p.category))
  const known = knownOrder.filter((slug) => present.has(slug))
  const extra = [...present].filter((slug) => !knownOrder.includes(slug))
  return [...known, ...extra]
}
