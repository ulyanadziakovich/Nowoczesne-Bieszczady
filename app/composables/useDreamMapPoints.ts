import { DREAM_MAP_POINTS, type DreamMapPoint } from '~/utils/dreamMapData'

const points = ref<DreamMapPoint[]>(DREAM_MAP_POINTS.map((p) => ({ ...p, votes: 0 })))

/** Set by the sky map when a star is clicked (desktop only — see
 * DreamMapSky.vue) so the card board below can scroll to and highlight
 * the matching card. Module-scoped so both components share it without
 * prop-drilling through the page. */
const highlightedId = ref<number | null>(null)

/** One-vote-per-postulate-per-browser — not a real auth system, just
 * stops the same visitor from repeatedly clicking the same star. Loaded
 * once per page load, client-side only (voting has no meaning during
 * SSR/prerendering). */
const STORAGE_KEY = 'dream-map-voted'
const votedIds = ref<Set<number>>(new Set())

if (import.meta.client) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (Array.isArray(stored)) votedIds.value = new Set(stored)
  } catch {
    // Corrupt/blocked storage — just start from "nothing voted yet".
  }
}

function persistVotedIds() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...votedIds.value]))
  } catch {
    // Private browsing / storage disabled — voting still works for this
    // page view, it just won't be remembered next visit.
  }
}

/** Shared, module-scoped postulate list so the sky map and the card board
 * (both rendering the same 18 postulates) read from the same source. */
export function useDreamMapPoints() {
  // Same dedup-by-key pattern already used for dream-map-settings: every
  // component calling this composable shares one underlying fetch.
  const { data } = useCmsCollection<{ pointNumber: number; votes: number }>('dream-map-points', { order: 'pointNumber' })

  watch(
    data,
    (res) => {
      if (!res) return
      for (const row of res.records) {
        const point = points.value.find((p) => p.id === row.pointNumber)
        if (point) point.votes = row.votes ?? 0
      }
    },
    { immediate: true },
  )

  function hasVoted(id: number) {
    return votedIds.value.has(id)
  }

  async function voteFor(id: number) {
    if (votedIds.value.has(id)) return
    const point = points.value.find((p) => p.id === id)
    if (!point) return

    // Optimistic update — feels instant, rolled back below if the request
    // actually fails.
    point.votes++
    votedIds.value.add(id)
    persistVotedIds()

    try {
      const result = await $fetch<{ votes: number }>('/api/dream-map-vote', {
        method: 'POST',
        body: { pointNumber: id },
      })
      point.votes = result.votes
    } catch {
      point.votes--
      votedIds.value.delete(id)
      persistVotedIds()
    }
  }

  return { points, highlightedId, hasVoted, voteFor }
}
