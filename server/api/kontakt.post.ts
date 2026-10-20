/**
 * Same-origin proxy do endpointu formularza kontaktowego w CMS
 * (nb-cms/server/api/contact.post.ts) — przekazuje tylko pola formularza,
 * walidacja i wysyłka maila odbywają się w CMS.
 */

/** CMS ma własne limity SMTP (do ~40 s); dłużej nie trzymamy użytkownika. */
const CMS_TIMEOUT_MS = 45_000

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const pick = (key: string) => (typeof body?.[key] === 'string' ? body[key] : '')

  const config = useRuntimeConfig()
  try {
    return await $fetch(`${config.public.cmsUrl}/api/contact`, {
      method: 'POST',
      headers: { 'x-forwarded-for': getRequestIP(event, { xForwardedFor: true }) ?? '' },
      body: {
        name: pick('name'),
        email: pick('email'),
        message: pick('message'),
        website: pick('website'),
      },
      timeout: CMS_TIMEOUT_MS,
      redirect: 'error',
    })
  } catch (error) {
    // Kod z CMS (400/413/429/502/503) przechodzi dalej; adres CMS i treść błędu nie.
    // Timeout / brak połączenia nie ma statusCode -> 502.
    const upstream = error instanceof Error && 'statusCode' in error ? Number(error.statusCode) : 0
    const status = upstream >= 400 && upstream < 600 ? upstream : 502
    console.error('[kontakt] CMS /api/contact failed:', status, error instanceof Error ? error.message : error)
    throw createError({ statusCode: status, statusMessage: 'Message could not be sent' })
  }
})
