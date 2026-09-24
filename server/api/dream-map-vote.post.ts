/**
 * Same-origin proxy to the CMS's vote-increment endpoint (see
 * nb-cms/server/api/dream-map-vote.post.ts) — narrow on purpose, forwards
 * only a validated pointNumber, nothing else.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const pointNumber = Number(body?.pointNumber)
  if (!Number.isInteger(pointNumber) || pointNumber < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid pointNumber' })
  }

  const config = useRuntimeConfig()
  return $fetch(`${config.public.cmsUrl}/api/dream-map-vote`, {
    method: 'POST',
    body: { pointNumber },
  })
})
