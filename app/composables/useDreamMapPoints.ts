import { DREAM_MAP_POINTS, type DreamMapPoint } from '~/utils/dreamMapData'

const points = ref<DreamMapPoint[]>(DREAM_MAP_POINTS)

/** Set by the sky map when a star is clicked (desktop only — see
 * DreamMapSky.vue) so the card board below can scroll to and highlight
 * the matching card. Module-scoped so both components share it without
 * prop-drilling through the page. */
const highlightedId = ref<number | null>(null)

/** Shared, module-scoped postulate list so the sky map and the card board
 * (both rendering the same 18 postulates) read from the same source. */
export function useDreamMapPoints() {
  return { points, highlightedId }
}
