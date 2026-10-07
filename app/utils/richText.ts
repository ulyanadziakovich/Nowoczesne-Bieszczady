import { COMMENT_NODE, DOCTYPE_NODE, ELEMENT_NODE, TEXT_NODE, parse } from 'ultrahtml'

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
 * Treść z edytora CMS (HTML) wstawiamy przez v-html, więc najpierw parsujemy ją
 * prawdziwym parserem (ultrahtml — ten sam, którego używa Nitro) i budujemy
 * od nowa tylko z białej listy: znaczniki tekstowe, linki wyłącznie
 * http(s)/mailto/tel, żadnych innych atrybutów. Niebezpieczne elementy
 * znikają razem z zawartością, pozostałe nieznane — zostaje tylko ich tekst.
 */
const ALLOWED_TAGS = new Set(['p', 'br', 'h1', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'hr'])
const DROP_WITH_CONTENT = new Set(['script', 'style', 'iframe', 'object', 'embed', 'noscript', 'template', 'svg', 'math', 'textarea', 'select', 'title', 'head'])
const VOID_TAGS = new Set(['br', 'hr'])
const SAFE_URL = /^(https?:|mailto:|tel:)/

function decodeEntities(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);?/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&colon;/gi, ':')
    .replace(/&amp;/gi, '&')
}

function safeHref(raw: string | undefined) {
  if (!raw) return null
  const url = decodeEntities(raw).replace(/[\u0000-\u0020\u007f-\u009f]/g, '')
  return SAFE_URL.test(url.toLowerCase()) ? url : null
}

const escapeText = (value: string) => value.replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function serialize(node: any): string {
  if (node.type === TEXT_NODE) return escapeText(node.value)
  if (node.type === COMMENT_NODE || node.type === DOCTYPE_NODE) return ''
  const children = (node.children || []).map(serialize).join('')
  if (node.type !== ELEMENT_NODE) return children

  const tag = String(node.name).toLowerCase()
  if (DROP_WITH_CONTENT.has(tag)) return ''
  if (!ALLOWED_TAGS.has(tag)) return children
  if (VOID_TAGS.has(tag)) return `<${tag}>`
  if (tag === 'a') {
    const href = safeHref(node.attributes?.href)
    if (!href) return children
    const external = /^https?:/i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : ''
    return `<a href="${escapeAttr(href)}"${external}>${children}</a>`
  }
  return `<${tag}>${children}</${tag}>`
}

export function sanitizeCmsHtml(html: string | null | undefined) {
  if (!html) return ''
  return serialize(parse(html)).replace(/<p>\s*<\/p>/g, '').trim()
}
