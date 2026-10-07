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

  const headerLinks = computed<NavLink[]>(() => buildTree(records.value, (r) => r.showInHeader))
  const footerLinks = computed<NavLink[]>(() => buildTree(records.value, (r) => r.showInFooter))

  /** Podpozycje jednej pozycji menu (np. boczne menu „O nas”), w kolejności z CMS. */
  function childrenOf(parentKey: string) {
    return records.value
      .filter((r) => r.parentKey === parentKey)
      .sort((a, b) => a.order - b.order)
      .map((r) => ({ label: r.label, to: r.url }))
  }

  return { headerLinks, footerLinks, childrenOf }
}
