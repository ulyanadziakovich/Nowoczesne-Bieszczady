/** A "navigation" row as the CMS returns it. */
interface NavigationRecord {
  key: string
  /** `key` of the parent item — empty/null for a top-level item. */
  parentKey: string | null
  label: string
  url: string
  order: number
  showInHeader: boolean
  showInFooter: boolean
}

/** A menu entry in the shape the header/footer templates consume. */
export interface NavLink {
  label: string
  to: string
  children?: { label: string; to: string }[]
}

/**
 * Built-in menus, used verbatim whenever the CMS has no navigation rows yet
 * (empty collection) or the fetch failed. Deliberate duplication: the site
 * must never render without a menu, so the shipped frontend keeps a copy of
 * the navigation it was released with instead of degrading to an empty nav.
 * Once the "navigation" collection has records, these are ignored entirely.
 */
const FALLBACK_HEADER_LINKS: NavLink[] = [
  { label: 'Szlaki rowerowe', to: '/szlaki' },
  { label: 'Ustrzyki 2036', to: '/ustrzyki-2036' },
  { label: 'Korona Ustrzyckich Gór', to: '/korona-gor' },
  { label: 'Kultura', to: '/kultura' },
  { label: 'Inicjatywy', to: '/inicjatywy' },
  {
    label: 'O nas',
    to: '/o-nas/misja',
    children: [
      { label: 'Kim jesteśmy / Misja', to: '/o-nas/misja' },
      { label: 'Cele Stowarzyszenia', to: '/o-nas/cele' },
      { label: 'Statut Stowarzyszenia', to: '/o-nas/statut' },
      { label: 'Deklaracja członkowska', to: '/o-nas/deklaracja' },
      { label: 'Zarząd i Zespół', to: '/o-nas/zarzad' },
      { label: 'Sprawozdania', to: '/o-nas/sprawozdania' },
      { label: 'Partnerzy i Grantodawcy', to: '/o-nas/partnerzy' },
    ],
  },
  { label: 'Aktualności', to: '/aktualnosci' },
  { label: 'Kontakt', to: '/kontakt' },
]

const FALLBACK_FOOTER_LINKS: NavLink[] = [
  { label: 'Szlaki rowerowe', to: '/szlaki' },
  { label: 'Ustrzyki 2036', to: '/ustrzyki-2036' },
  { label: 'Korona Gór', to: '/korona-gor' },
  { label: 'Kultura i wydarzenia', to: '/kultura' },
  { label: 'Inicjatywy i edukacja', to: '/inicjatywy' },
  { label: 'O nas', to: '/o-nas/misja' },
  { label: 'Aktualności', to: '/aktualnosci' },
  { label: 'Kontakt', to: '/kontakt' },
]

/**
 * Turns the flat CMS rows into a two-level menu: rows without `parentKey`
 * become top-level entries, the rest are attached to the matching parent.
 * A child only survives when its parent passes the same visibility filter,
 * so hiding a group hides the whole group.
 */
function buildTree(records: NavigationRecord[], visible: (r: NavigationRecord) => boolean): NavLink[] {
  const shown = records.filter(visible)
  const roots = shown.filter((r) => !r.parentKey)
  const byParent = new Map<string, NavigationRecord[]>()

  for (const record of shown) {
    if (!record.parentKey) continue
    const siblings = byParent.get(record.parentKey)
    if (siblings) siblings.push(record)
    else byParent.set(record.parentKey, [record])
  }

  return roots
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((root) => {
      const children = byParent.get(root.key)
      if (!children?.length) return { label: root.label, to: root.url }
      return {
        label: root.label,
        to: root.url,
        children: children
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((child) => ({ label: child.label, to: child.url })),
      }
    })
}

/**
 * The site menus, straight from the CMS. Header and footer share one fetch
 * (same dedup key), and each picks its own entries via the `showInHeader` /
 * `showInFooter` flags — so a single item can carry a different label in each
 * place by living as two records with complementary flags.
 */
export async function useNavigation() {
  const { data } = await useCmsCollection<NavigationRecord>('navigation', { order: 'order' })

  const records = computed<NavigationRecord[]>(() => data.value?.records ?? [])

  const headerLinks = computed<NavLink[]>(() => {
    if (!records.value.length) return FALLBACK_HEADER_LINKS
    return buildTree(records.value, (r) => r.showInHeader)
  })

  const footerLinks = computed<NavLink[]>(() => {
    if (!records.value.length) return FALLBACK_FOOTER_LINKS
    return buildTree(records.value, (r) => r.showInFooter)
  })

  return { headerLinks, footerLinks }
}
