import sanitizeHtml from 'sanitize-html'

/**
 * Dłuższe teksty z CMS (np. opisy w nagłówkach podstron) są wpisywane jako
 * zwykły tekst. Odtwarzamy z niego strukturę, nie zmieniając treści:
 *  • pusta linia rozdziela bloki,
 *  • krótka pierwsza linia bloku bez kropki na końcu → śródtytuł,
 *  • kilka krótkich linii zaczynających się od emoji → lista,
 *  • linie „Nazwa https://…” → lista linków,
 *  • reszta → akapity (każda linia osobno).
 */
export type RichBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: { icon: string; text: string }[] }
  | { type: 'links'; items: { label: string; url: string }[] }

const EMOJI_LEAD = /^((?:\p{Extended_Pictographic}|\p{Regional_Indicator}{2})(?:️|‍\p{Extended_Pictographic}|\p{Emoji_Modifier})*)\s*(.*)$/u
const LINK_LINE = /^(.+?)\s+(https?:\/\/\S+)$/
const URL = /(https?:\/\/[^\s)]+)/g

export function parseRichText(text: string | null | undefined): RichBlock[] {
  const out: RichBlock[] = []
  for (const group of (text || '').trim().split(/\n\s*\n/)) {
    const lines = group.split('\n').map((l) => l.trim()).filter(Boolean)
    if (!lines.length) continue

    if (lines.every((l) => LINK_LINE.test(l))) {
      const items = lines.map((l) => {
        const [, label, url] = l.match(LINK_LINE)!
        return { label: label.replace(/[\s–—:-]+$/, ''), url }
      })
      const prev = out[out.length - 1]
      if (prev?.type === 'links') prev.items.push(...items)
      else out.push({ type: 'links', items })
      continue
    }

    if (lines.length >= 2 && lines.every((l) => EMOJI_LEAD.test(l) && l.length <= 100)) {
      out.push({
        type: 'list',
        items: lines.map((l) => {
          const [, icon, rest] = l.match(EMOJI_LEAD)!
          return { icon, text: rest }
        }),
      })
      continue
    }

    let rest = lines
    if (lines.length >= 2 && lines[0].length <= 90 && !/[.!?:;,…]$/.test(lines[0])) {
      out.push({ type: 'heading', text: lines[0] })
      rest = lines.slice(1)
    }
    for (const line of rest) out.push({ type: 'paragraph', text: line })
  }
  return out
}

/** Dzieli akapit na zwykły tekst i klikalne adresy URL. */
export function splitUrls(text: string) {
  return text.split(URL).map((part, i) => ({ text: part, url: i % 2 === 1 }))
}

/** „share.google/abc” zamiast pełnego adresu — do podpisów linków. */
export function shortUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

/**
 * Treść z edytora CMS (HTML) wstawiamy przez v-html, więc przepuszczamy ją
 * przez sanitize-html (prawdziwy parser + biała lista): zostają tylko
 * znaczniki tekstowe, linki tylko http(s)/mailto/tel, bez atrybutów on*,
 * stylów i skryptów. Zewnętrzne linki otwierają się w nowej karcie.
 */
export function sanitizeCmsHtml(html: string | null | undefined) {
  const clean = sanitizeHtml(html || '', {
    allowedTags: ['p', 'br', 'h1', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'hr'],
    allowedAttributes: { a: ['href', 'target', 'rel'] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => {
        const external = /^https?:\/\//i.test(attribs.href || '')
        return {
          tagName,
          attribs: external ? { href: attribs.href, target: '_blank', rel: 'noopener noreferrer' } : { href: attribs.href || '' },
        }
      },
    },
  })
  return clean.replace(/<p>\s*<\/p>/g, '').trim()
}
