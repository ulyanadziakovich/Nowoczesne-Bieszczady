// Same-origin proxy to the Pruvious CMS API. Fetching the CMS directly from
// the browser would be blocked by CORS (nb.dexint.xyz sends no CORS
// headers); routing through our own server avoids that, since the browser
// only ever talks to this origin and the CMS call happens server-to-server.
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') ?? ''

  // Only forward read-only collection lookups (what useCms.ts actually
  // calls). Without this allowlist, a raw catch-all would let a caller
  // reach any CMS API route through our own server — including auth or
  // upload endpoints — or escape the /api/ prefix entirely via "../"
  // segments to hit routes like /dashboard.
  if (!/^collections\/[a-z0-9-]+$/i.test(path)) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  const config = useRuntimeConfig()
  return $fetch(`${config.public.cmsUrl}/api/${path}`, {
    query: getQuery(event),
    // A collections GET has no business redirecting; fail loudly instead of
    // silently following a 3xx to wherever the upstream points.
    redirect: 'error',
  })
})
