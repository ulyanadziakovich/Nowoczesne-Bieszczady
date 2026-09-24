import { DREAM_MAP_POINTS, type DreamMapPoint } from '~/utils/dreamMapData'

const points = ref<DreamMapPoint[]>(DREAM_MAP_POINTS)

/** Shared, module-scoped postulate list so the sky map and the card board
 * (both rendering the same 18 postulates) read from the same source. */
export function useDreamMapPoints() {
  return { points }
}
