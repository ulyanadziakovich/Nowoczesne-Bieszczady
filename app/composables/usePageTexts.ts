import { pageTextDefaults, type PageTextName } from '~/utils/pageTextDefaults'

type FieldOf<N extends PageTextName> = keyof (typeof pageTextDefaults)[N] & string
type Vars = Record<string, string | number>

/**
 * Teksty i obrazki jednej strony z jej formularza w CMS („Strona: …”).
 *
 * Wartość z CMS ma zawsze pierwszeństwo — także pusta (redaktor może celowo
 * ukryć napis). Tekst startowy z pageTextDefaults pojawia się tylko, gdy CMS
 * w ogóle nie ma danego pola (np. przed wdrożeniem nowej wersji CMS).
 */
export async function usePageTexts<N extends PageTextName>(name: N) {
  const { data } = await useCmsSingle<Record<string, any>>(name)
  return pageTextsFrom(name, data)
}

/**
 * To samo bez czekania — dla komponentów, które pojawiają się dopiero po
 * interakcji (karty po zmianie filtra, mapa). Strona pobrała już ten formularz,
 * więc dane są od razu w pamięci; do tego czasu działają teksty startowe.
 */
export function usePageTextsSync<N extends PageTextName>(name: N) {
  const { data } = useCmsSingle<Record<string, any>>(name)
  return pageTextsFrom(name, data)
}

function pageTextsFrom<N extends PageTextName>(name: N, data: Ref<Record<string, any> | null | undefined>) {
  const defaults = pageTextDefaults[name] as Record<string, string>

  function raw(field: string): string {
    const value = data.value?.[field]
    if (value === undefined || value === null) return defaults[field] ?? ''
    return typeof value === 'string' ? value : String(value)
  }

  /** Tekst z podmienionymi znacznikami, np. t('statPosts', { liczba: 10 }). */
  function t(field: FieldOf<N>, vars?: Vars) {
    const value = raw(field)
    return vars ? value.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : value
  }

  /** Polska odmiana: pola …One / …Few / …Many, np. plural('statPosts', 10). */
  function plural(base: string, n: number, vars?: Vars) {
    const last = n % 10
    const lastTwo = n % 100
    const form = n === 1 ? 'One' : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? 'Few' : 'Many'
    return t(`${base}${form}` as FieldOf<N>, { liczba: n, ...vars })
  }

  /** Treść z edytora (HTML); pusty edytor zapisuje „<p></p>”. */
  function html(field: FieldOf<N>) {
    const value = raw(field)
    return value.replace(/<p>\s*<\/p>/g, '').trim() ? value : ''
  }

  /** Adres zdjęcia z pola „obrazek” (albo undefined). */
  function image(field: string) {
    return resolveCmsUrl(data.value?.[field]?.src)
  }

  function imageAlt(field: string, fallback = '') {
    return data.value?.[field]?.alt || fallback
  }

  /** Adres pliku z pola „plik” (albo undefined). */
  function file(field: string) {
    const f = data.value?.[field] as CmsFile | null | undefined
    return f?.filename ? resolveCmsUrl(`/uploads/${f.directory}${f.filename}`) : undefined
  }

  /** Pole wielolinijkowe jako lista (jedna pozycja w linii). */
  function lines(field: FieldOf<N>) {
    return raw(field)
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  /** Linie „Podpis: wartość” jako pary — do pasków z liczbami. */
  function pairs(field: FieldOf<N>) {
    return lines(field).map((line) => {
      const [label, ...rest] = line.split(':')
      return { label: label!.trim(), value: rest.join(':').trim() }
    })
  }

  return { data, t, plural, html, image, imageAlt, file, lines, pairs }
}

/** Tytuł w karcie przeglądarki: „<tytuł> — <nazwa strony z CMS>”. */
export async function usePageTitle(title: () => string) {
  // Po `await` Nuxt gubi kontekst komponentu — useHead wołamy w nim z powrotem.
  const nuxtApp = useNuxtApp()
  const common = await usePageTexts('site-settings')
  nuxtApp.runWithContext(() => useHead({ title: () => [title(), common.t('siteName')].filter(Boolean).join(' — ') }))
}

/** Nazwy poziomów trudności i typów rowerów z „Elementów wspólnych” w CMS. */
export function useTrailLabels() {
  const common = usePageTextsSync('site-settings')
  const difficulty = computed<Record<TrailDifficulty, string>>(() => ({
    latwa: common.t('difficultyEasy'),
    srednia: common.t('difficultyMedium'),
    trudna: common.t('difficultyHard'),
  }))
  const bike = computed<Record<TrailBikeType, string>>(() => ({
    mtb: common.t('bikeMtb'),
    gravel: common.t('bikeGravel'),
    'e-bike': common.t('bikeEbike'),
    szosa: common.t('bikeRoad'),
  }))
  return { difficulty, bike }
}
