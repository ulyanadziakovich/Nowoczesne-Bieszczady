// Same-origin proxy to the Pruvious CMS. Fetching the CMS directly from the
// browser would be blocked by CORS (nb.dexint.xyz sends no CORS headers);
// routing through our own server avoids that, since the browser only ever
// talks to this origin and the CMS call happens server-to-server.
//
// Two kinds of request get through, each with its own upstream prefix:
//   - "collections/<name>"  -> <cms>/api/collections/<name>   (read-only JSON)
//   - "uploads/<path>"      -> <cms>/uploads/<path>           (media files)
// Media matters because <img src> can load cross-origin without CORS, but
// fetch() cannot — and GPX tracks have to be *read*, not just displayed.

/** Path segments are slugs Pruvious itself produced; anything else is refused. */
const SAFE_SEGMENT = /^[a-z0-9][a-z0-9._-]*$/i

/**
 * Media files never change once uploaded (Pruvious de-duplicates by appending
 * a suffix rather than overwriting), so they can be cached hard.
 */
const UPLOAD_CACHE_CONTROL = 'public, max-age=31536000, immutable'

/** Passed through from the CMS so the browser gets a usable, revalidatable response. */
const FORWARDED_HEADERS = ['content-type', 'content-length', 'etag', 'last-modified'] as const

/**
 * Last known-good body of every collection request, keyed by path + the query
 * parameters that actually change the payload.
 *
 * Deliberately a plain in-process `Map`: on Vercel it lives inside one
 * serverless instance, is not shared between instances, and vanishes on a cold
 * start. That is enough for the problem it solves — the CMS runs a single
 * SQLite-backed pod with a `Recreate` rollout, so every redeploy is ~25s of
 * hard downtime — and it buys that without an external store (KV/Redis) and
 * the failure modes that come with one.
 *
 * Entries never expire: they are read *only* when the CMS is unreachable, and
 * a stale trail list always beats a page with no logo and "0 trails".
 */
const staleCache = new Map<string, string>()

/** Room for every collection/variant the site fetches, several times over. */
const STALE_CACHE_MAX_ENTRIES = 64

/** ~1 MB in UTF-16 units; keeps one outsized collection from pinning memory. */
const STALE_CACHE_MAX_LENGTH = 1_000_000

/** The only query parameters that change a collection payload. */
const CACHE_KEY_PARAMS = ['limit', 'order', 'populate'] as const

/** A hung upstream must not hold the render open — fail fast, serve stale. */
const CMS_TIMEOUT_MS = 8_000

/** Pruvious always answers these with JSON; we pass the body through verbatim. */
const COLLECTION_CONTENT_TYPE = 'application/json; charset=utf-8'

function cacheKey(path: string, query: Record<string, unknown>): string {
  let key = path
  for (const param of CACHE_KEY_PARAMS) {
    const value = query[param]
    if (value !== undefined) key += `\n${param}=${String(value)}`
  }
  return key
}

/** `Map` iterates in insertion order, so re-inserting marks an entry as used. */
function readStale(key: string): string | undefined {
  const body = staleCache.get(key)
  if (body === undefined) return undefined
  staleCache.delete(key)
  staleCache.set(key, body)
  return body
}

function writeStale(key: string, body: string): void {
  // An oversized (or empty) response simply isn't remembered; any older entry
  // survives, which is still better than nothing on the failure path.
  if (body.length === 0 || body.length > STALE_CACHE_MAX_LENGTH) return

  staleCache.delete(key)
  staleCache.set(key, body)

  while (staleCache.size > STALE_CACHE_MAX_ENTRIES) {
    const leastRecentlyUsed = staleCache.keys().next().value
    if (leastRecentlyUsed === undefined) break
    staleCache.delete(leastRecentlyUsed)
  }
}

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') ?? ''
  const config = useRuntimeConfig()

  // Without an allowlist, a raw catch-all would let a caller reach any CMS
  // route through our own server — auth or writing upload endpoints — or
  // escape the intended prefixes entirely via ".." segments to hit routes
  // like /dashboard.
  if (/^collections\/[a-z0-9-]+$/i.test(path)) {
    const query = getQuery(event)
    const key = cacheKey(path, query)
    let body: string

    try {
      // `$fetch.raw` + `responseType: 'text'` hands back the upstream bytes
      // untouched: parsing the JSON here only for h3 to re-serialise it would
      // be wasted work, and the raw string is exactly what the stale cache
      // wants to hold. (`$fetch.raw` also sidesteps the recursion blow-up
      // Nitro's typed-route overload hits on a runtime-built absolute URL.)
      const upstream = await $fetch.raw<string>(`${config.public.cmsUrl}/api/${path}`, {
        query,
        responseType: 'text',
        timeout: CMS_TIMEOUT_MS,
        // A collections GET has no business redirecting; fail loudly instead of
        // silently following a 3xx to wherever the upstream points.
        redirect: 'error',
      })

      body = upstream._data ?? ''
    } catch (error) {
      // Timeout, ECONNREFUSED, 5xx, or the 404 a restarting Pruvious serves:
      // all of them mean "the CMS is not answering right now", never "this
      // content is gone" — the allowlisted collections are ones the site ships
      // with. Serving the last good copy keeps the page whole.
      const stale = readStale(key)

      // Nothing remembered yet (cold instance while the CMS is down): there is
      // no better answer than the original failure.
      if (stale === undefined) throw error

      // Purely diagnostic — lets `curl -I` tell a stale render from a fresh one.
      setResponseHeader(event, 'x-cms-stale', '1')
      setResponseHeader(event, 'content-type', COLLECTION_CONTENT_TYPE)
      return stale
    }

    writeStale(key, body)
    setResponseHeader(event, 'content-type', COLLECTION_CONTENT_TYPE)
    return body
  }

  const segments = path.split('/')

  if (segments[0] !== 'uploads' || segments.length < 2 || !segments.every((segment) => SAFE_SEGMENT.test(segment))) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  // No query forwarding: the upstream serves these as static files, so a query
  // string could only muddy the cache key. `$fetch` would parse a JSON or text
  // body, which mangles binary files — take the raw stream instead.
  //
  // `ignoreResponseError` keeps ofetch from throwing on a non-2xx upstream: that
  // throw happens before any of the code below runs, so a deleted file would
  // surface to the browser as a 500 instead of the CMS's own 404.
  const upstream = await $fetch.raw(`${config.public.cmsUrl}/${path}`, {
    responseType: 'stream',
    redirect: 'error',
    ignoreResponseError: true,
  })

  if (!upstream.ok) {
    throw createError({
      statusCode: upstream.status,
      statusMessage: upstream.status === 404 ? 'Not found' : 'Upstream error',
    })
  }

  for (const header of FORWARDED_HEADERS) {
    const value = upstream.headers.get(header)
    if (value) setResponseHeader(event, header, value)
  }

  // Only a successful response is safe to cache for a year.
  setResponseHeader(event, 'cache-control', UPLOAD_CACHE_CONTROL)

  return upstream._data
})
