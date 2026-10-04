/**
 * Same-origin proxy do endpointu formularza „Zgłoś swój pomysł” w CMS
 * (nb-cms/server/api/dream-map-idea.post.ts) — przekazuje tylko pola
 * formularza, walidacja i zapis odbywają się w CMS.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const pick = (key: string) => (typeof body?.[key] === 'string' ? body[key] : '')

  const config = useRuntimeConfig()
  return $fetch(`${config.public.cmsUrl}/api/dream-map-idea`, {
    method: 'POST',
    headers: { 'x-forwarded-for': getRequestIP(event, { xForwardedFor: true }) ?? '' },
    body: {
      title: pick('title'),
      problem: pick('problem'),
      solution: pick('solution'),
      contact: pick('contact'),
      website: pick('website'),
    },
  })
})
