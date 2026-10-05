// Dzieli opis trasy (tekst z audytu, akapity oddzielone pustą linią) na bloki
// do wyświetlenia: nagłówki, kafelki odcinków nawierzchni i etapy osi czasu.
// Tekst nie jest zmieniany — tylko rozpoznawana jest jego struktura.

export type DescriptionBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'segments'; items: { label: string; text: string }[] }
  | { type: 'stages'; items: { title: string; range: string; body: string[] }[] }

const STAGE_START = /^(\d+\.\d+\.\s+|Odcinek \d+:\s)/

function isShortTitle(p: string) {
  return p.length <= 160 && !/[.!?]$/.test(p)
}

function splitStageTitle(title: string) {
  // „Tytuł (ok. 0,0 – 11,0 km)” albo „Tytuł, ok. 0-18 km”
  const m = title.match(/\s*\(([^()]*\d[^()]*km)\)\s*$/) || title.match(/,\s*((?:ok\.\s*)?[\d,.]+\s*[-–]\s*[\d,.]+\s*km)\s*$/)
  return m ? { title: title.slice(0, m.index).trim(), range: m[1].trim() } : { title: title.trim(), range: '' }
}

/** „4.1. Tytuł (ok. 0,0 – 11,0 km) Treść…” — tytuł i treść w jednym akapicie. */
function splitInlineStage(p: string) {
  const m = p.match(/^(\d+\.\d+\.\s+.*?\([^()]*km\))\s+(\S[\s\S]*)$/)
  return m ? { head: m[1], body: m[2] } : null
}

function splitSegment(p: string) {
  const m = p.match(/^(.{2,140}?km\)?):\s+([\s\S]+)$/) || p.match(/^([^:]{2,120}):\s+([\s\S]+)$/)
  return m ? { label: m[1].trim(), text: m[2].trim() } : { label: '', text: p }
}

export function parseTrailDescription(description: string | null | undefined): DescriptionBlock[] {
  const paras = (description || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const blocks: DescriptionBlock[] = []
  let mode: 'default' | 'segments' = 'default'

  const lastStages = () => {
    const last = blocks[blocks.length - 1]
    if (last?.type === 'stages') return last
    const fresh: DescriptionBlock = { type: 'stages', items: [] }
    blocks.push(fresh)
    return fresh as Extract<DescriptionBlock, { type: 'stages' }>
  }

  for (const p of paras) {
    const inline = splitInlineStage(p)
    if (inline) {
      mode = 'default'
      lastStages().items.push({ ...splitStageTitle(inline.head.replace(STAGE_START, '')), body: [inline.body] })
      continue
    }
    if (STAGE_START.test(p) && isShortTitle(p)) {
      mode = 'default'
      lastStages().items.push({ ...splitStageTitle(p.replace(STAGE_START, '')), body: [] })
      continue
    }
    if (isShortTitle(p) && p.length <= 90 && !p.includes(': ')) {
      blocks.push({ type: 'heading', text: p })
      mode = /profil|nawierzchni/i.test(p) ? 'segments' : 'default'
      continue
    }
    const last = blocks[blocks.length - 1]
    if (mode === 'segments') {
      if (last?.type === 'segments') last.items.push(splitSegment(p))
      else blocks.push({ type: 'segments', items: [splitSegment(p)] })
      continue
    }
    if (last?.type === 'stages' && last.items.length) {
      last.items[last.items.length - 1].body.push(p)
      continue
    }
    blocks.push({ type: 'paragraph', text: p })
  }
  return blocks
}

/** „Etykieta: treść” → etykieta do wyróżnienia; bez dwukropka zwraca sam tekst. */
export function splitLeadLabel(text: string) {
  const m = text.match(/^([^:\n]{2,90}):\s+([\s\S]+)$/)
  return m && !/[.!?]/.test(m[1]) ? { label: m[1], rest: m[2] } : { label: '', rest: text }
}
