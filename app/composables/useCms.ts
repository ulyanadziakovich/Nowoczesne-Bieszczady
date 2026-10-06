/**
 * Helpers for reading content from the Pruvious CMS project (../nb-cms).
 * All editorial content (trails, news, events, team, partners, page copy...)
 * lives there — nothing here is hardcoded on the frontend.
 */

export interface CmsListResponse<T> {
  currentPage: number
  lastPage: number
  perPage: number
  records: T[]
  total: number
}

/** A populated Pruvious `image` field — the file lives on the CMS, not this repo. */
export interface CmsImage {
  src: string
  alt: string
  width: number
  height: number
  type: string
}

/**
 * A populated Pruvious `file` field — a row of the built-in "uploads"
 * collection. The public path of the file is `directory + filename`.
 */
export interface CmsFile {
  filename: string
  directory: string
  type: string
  size: number
}

/**
 * A brief CMS hiccup (pod restart, dropped connection) should heal before the
 * render ever sees it, so every CMS read retries twice with a short pause.
 * The proxy's stale cache is the second line of defence, for outages that
 * outlast these retries.
 */
const CMS_RETRY = 2
const CMS_RETRY_DELAY_MS = 300

interface CmsCollectionOptions {
  limit?: number
  order?: string
}

/** Fetch a multi-entry collection (e.g. "trails", "news", "events"). */
export function useCmsCollection<T = Record<string, any>>(name: string, opts: CmsCollectionOptions = {}) {
  return useFetch<CmsListResponse<T>>(`/api/cms/collections/${name}`, {
    key: `cms-${name}`,
    query: { limit: opts.limit ?? 100, populate: true, ...(opts.order ? { order: opts.order } : {}) },
    retry: CMS_RETRY,
    retryDelay: CMS_RETRY_DELAY_MS,
  })
}

/** Fetch a single-entry (singleton) collection (e.g. "home", "site-settings"). */
export function useCmsSingle<T = Record<string, any>>(name: string) {
  return useFetch<T>(`/api/cms/collections/${name}`, {
    key: `cms-${name}`,
    query: { populate: true },
    retry: CMS_RETRY,
    retryDelay: CMS_RETRY_DELAY_MS,
  })
}

/**
 * Image fields and multi-line "gallery" text fields both store paths
 * relative to the CMS's own domain (e.g. "/uploads/news/photo.jpg") — this
 * turns one into a URL the browser can actually load, wherever the CMS is
 * deployed.
 */
export function resolveCmsUrl(path: string | undefined | null) {
  // Undefined (not '') on empty input, so it composes with a component prop's
  // own `default` — passing '' would count as "provided" and skip it.
  if (!path) return undefined
  if (/^https?:\/\//.test(path)) return path
  const config = useRuntimeConfig()
  return `${config.public.cmsUrl}${path}`
}

/**
 * Same file, but routed through our own `/api/cms/` proxy instead of straight
 * at the CMS domain.
 *
 * Use `resolveCmsUrl()` for anything the *browser* loads by URL (`<img src>`,
 * `<a href>`, CSS backgrounds) — those are exempt from CORS, and going direct
 * skips a hop.
 *
 * Use this one for anything JavaScript has to `fetch()` and read, such as GPX
 * tracks: the CMS sends no CORS headers, so a direct cross-origin fetch fails.
 */
export function cmsFileProxyUrl(file: CmsFile | undefined | null) {
  // Undefined (not '') on empty input, to match resolveCmsUrl()'s contract.
  if (!file?.filename) return undefined
  // `directory` is '' at the media root and 'name/' inside a folder, so it
  // already carries its own trailing slash.
  return `/api/cms/uploads/${file.directory}${file.filename}`
}

export interface PageContentBlock {
  id: number
  key: string
  title?: string
  body?: string
  /** Sformatowana treść z edytora w CMS (HTML) — ma pierwszeństwo przed `body`. */
  content?: string
  image?: string
}

/**
 * Fetches every keyed text block from the "page-content" collection once
 * (cached/shared across the whole app) and exposes lookup helpers.
 */
export function usePageContent() {
  const { data } = useCmsCollection<PageContentBlock>('page-content', { limit: 200 })
  const blocks = computed(() => data.value?.records ?? [])

  function get(key: string) {
    return blocks.value.find((b) => b.key === key)
  }

  function title(key: string, fallback = '') {
    return get(key)?.title || fallback
  }

  function body(key: string, fallback = '') {
    return get(key)?.body || fallback
  }

  /** Treść z edytora w CMS (HTML) albo '' gdy pole jest puste lub go jeszcze nie ma. */
  function html(key: string) {
    const value = get(key)?.content || ''
    return value.replace(/<p>\s*<\/p>/g, '').trim() ? value : ''
  }

  function image(key: string, fallback = '') {
    return get(key)?.image || fallback
  }

  /** Splits a body field into paragraphs on blank lines. */
  function paragraphs(key: string) {
    return (body(key) || '').split(/\n\s*\n/).filter(Boolean)
  }

  /** Splits a body/text field into a list, one item per line. */
  function lines(key: string) {
    return (body(key) || '').split('\n').filter(Boolean)
  }

  /** Parses "Label: value" lines into { label, value } pairs — for small stat lists. */
  function pairs(key: string) {
    return lines(key).map((line) => {
      const [label, ...rest] = line.split(':')
      return { label: label.trim(), value: rest.join(':').trim() }
    })
  }

  return { blocks, get, title, body, html, image, paragraphs, lines, pairs }
}
