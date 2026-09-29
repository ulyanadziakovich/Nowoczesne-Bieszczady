import type { DreamMapPoint } from '~/utils/dreamMapData'

/** Shape of a "dream-map-points" row as the CMS returns it. */
interface DreamMapPointRecord {
  pointNumber: number
  category: string
  title: string
  challenge: string
  solution: string
  px: number
  py: number
  connectsTo: string | null
  votes: number | null
}

/** Set by the sky map when a star is clicked (desktop only — see
 * DreamMapSky.vue) so the card board below can scroll to and highlight
 * the matching card. Module-scoped so both components share it without
 * prop-drilling through the page. */
const highlightedId = ref<number | null>(null)

/** Per-postulate vote *floors* — the highest count this browser knows about
 * (an optimistic bump, then the server's authoritative answer). Kept apart
 * from the fetched records (which are shared, cached and may be re-fetched)
 * so a vote can be rolled back by simply dropping the floor again.
 * A floor is deliberately not a hard overwrite: `points` renders
 * `max(cmsVotes, floor)`, so once a later collection fetch catches up — e.g.
 * because other visitors voted too — the fresher CMS value wins and the
 * counter never freezes at our own stale number. */
const voteOverrides = ref(new Map<number, number>())

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

/** Every postulate, straight from the CMS — the sky map and the card board
 * both read from this one shared fetch (same dedup key), so nothing about
 * the postulates lives in the frontend. */
export function useDreamMapPoints() {
  const { data } = useCmsCollection<DreamMapPointRecord>('dream-map-points', { order: 'pointNumber' })

  const points = computed<DreamMapPoint[]>(() =>
    (data.value?.records ?? []).map((row) => ({
      id: row.pointNumber,
      category: row.category,
      title: row.title,
      challenge: row.challenge,
      solution: row.solution,
      px: row.px,
      py: row.py,
      connectsTo: row.connectsTo ?? '',
      // Floor semantics: whichever of the two is fresher/higher wins.
      votes: Math.max(row.votes ?? 0, voteOverrides.value.get(row.pointNumber) ?? 0),
    })),
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
    const previousOverride = voteOverrides.value.get(id)
    const optimisticVotes = point.votes + 1
    voteOverrides.value.set(id, optimisticVotes)
    votedIds.value.add(id)
    persistVotedIds()

    try {
      const result = await $fetch<{ votes: number }>('/api/dream-map-vote', {
        method: 'POST',
        body: { pointNumber: id },
      })
      // Take the server's authoritative count, but never step back below the
      // optimistic bump we already painted — that would flicker.
      voteOverrides.value.set(id, Math.max(result.votes, optimisticVotes))
    } catch {
      if (previousOverride === undefined) voteOverrides.value.delete(id)
      else voteOverrides.value.set(id, previousOverride)
      votedIds.value.delete(id)
      persistVotedIds()
    }
  }

  return { points, highlightedId, hasVoted, voteFor }
}
