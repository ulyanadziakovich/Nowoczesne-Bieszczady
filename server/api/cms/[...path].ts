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

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') ?? ''
  const config = useRuntimeConfig()

  // Without an allowlist, a raw catch-all would let a caller reach any CMS
  // route through our own server — auth or writing upload endpoints — or
  // escape the intended prefixes entirely via ".." segments to hit routes
  // like /dashboard.
  if (/^collections\/[a-z0-9-]+$/i.test(path)) {
    return $fetch(`${config.public.cmsUrl}/api/${path}`, {
      query: getQuery(event),
      // A collections GET has no business redirecting; fail loudly instead of
      // silently following a 3xx to wherever the upstream points.
      redirect: 'error',
    })
  }

  const segments = path.split('/')

  if (segments[0] !== 'uploads' || segments.length < 2 || !segments.every((segment) => SAFE_SEGMENT.test(segment))) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  // No query forwarding: the upstream serves these as static files, so a query
  // string could only muddy the cache key. `$fetch` would parse a JSON or text
  // body, which mangles binary files — take the raw stream instead.
  const upstream = await $fetch.raw(`${config.public.cmsUrl}/${path}`, {
    responseType: 'stream',
    redirect: 'error',
  })

  for (const header of FORWARDED_HEADERS) {
    const value = upstream.headers.get(header)
    if (value) setResponseHeader(event, header, value)
  }

  setResponseHeader(event, 'cache-control', UPLOAD_CACHE_CONTROL)

  return upstream._data
})
