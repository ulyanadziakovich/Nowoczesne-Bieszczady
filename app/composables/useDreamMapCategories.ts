import type { DreamMapPoint } from '~/utils/dreamMapData'
import { categorySlugs } from '~/utils/dreamMapData'

/** Shape of a "dream-map-categories" row as the CMS returns it. */
interface DreamMapCategoryRecord {
  slug: string
  label: string
  /** Display name of the constellation drawn for this category. */
  constellation: string
  color: string
  order: number
  /** Constellation caption position, in % of the sky area. */
  labelX: number
  labelY: number
  /** Postulate number the decorative tail starts from — empty when the
   * category has no tail flourish. */
  tailFromPoint: number | null
  /** Where the tail ends, in % of the sky area. */
  tailX: number
  tailY: number
}

/** Neutral grey for a category present in the points but missing from the
 * "dream-map-categories" collection. */
const FALLBACK_COLOR = '#6b7280'

/** Every category's presentation metadata (label, colour, constellation
 * name, label/tail geometry), straight from the CMS — the sky map and the
 * card board both read from this one shared fetch (same dedup key), so
 * nothing about the categories lives in the frontend.
 *
 * Every lookup falls back gracefully: an empty collection, a failed fetch
 * or a slug the CMS doesn't describe must never break the page. */
export function useDreamMapCategories() {
  const { data } = useCmsCollection<DreamMapCategoryRecord>('dream-map-categories', { order: 'order' })

  /** Category records in CMS `order`. */
  const categories = computed<DreamMapCategoryRecord[]>(() => data.value?.records ?? [])

  const bySlug = computed(() => new Map(categories.value.map((c) => [c.slug, c])))

  function categoryColor(slug: string): string {
    return bySlug.value.get(slug)?.color || FALLBACK_COLOR
  }

  function categoryName(slug: string): string {
    const label = bySlug.value.get(slug)?.label
    if (label) return label
    return slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : slug
  }

  function categoryConstellation(slug: string): string {
    return bySlug.value.get(slug)?.constellation ?? ''
  }

  /** Where to draw this category's constellation caption — undefined means
   * "don't draw one", which is better than guessing a spot on the stars. */
  function categoryLabelPos(slug: string): { x: number; y: number } | undefined {
    const cat = bySlug.value.get(slug)
    if (!cat) return undefined
    return { x: cat.labelX, y: cat.labelY }
  }

  /** The decorative tail flourish extending past one star, like real
   * constellation drawings have — undefined when the CMS leaves the
   * starting point empty. */
  function categoryTail(slug: string): { fromId: number; x: number; y: number } | undefined {
    const cat = bySlug.value.get(slug)
    if (!cat || cat.tailFromPoint == null) return undefined
    return { fromId: cat.tailFromPoint, x: cat.tailX, y: cat.tailY }
  }

  /** Category slugs actually present in the given points, in CMS `order`;
   * slugs the CMS doesn't describe come last, in order of first appearance. */
  function orderedCategories(points: DreamMapPoint[]): string[] {
    return categorySlugs(points, categories.value.map((c) => c.slug))
  }

  return {
    categories,
    orderedCategories,
    categoryColor,
    categoryName,
    categoryConstellation,
    categoryLabelPos,
    categoryTail,
  }
}
