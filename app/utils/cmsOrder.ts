/**
 * Ręczna kolejność z CMS (pole „Kolejność”, ustawiane przeciąganiem w panelu).
 * Sortuje rosnąco po `order`, a przy równych wartościach zachowuje kolejność,
 * w jakiej rekordy przyszły z API (stabilne sortowanie) — dzięki temu działa
 * też wtedy, gdy CMS jeszcze nie ma tego pola.
 */
export function byCmsOrder<T extends { order?: number | null }>(records: T[]): T[] {
  return records
    .map((record, index) => ({ record, index }))
    .sort((a, b) => (a.record.order ?? 0) - (b.record.order ?? 0) || a.index - b.index)
    .map(({ record }) => record)
}

/** Rekord jest widoczny, dopóki w CMS nie odznaczono „Aktywna/Aktywny”. */
export function isCmsActive(record: { active?: boolean | null }) {
  return record.active !== false
}
