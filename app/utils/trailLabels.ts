// Typy danych tras z CMS. Nazwy poziomów trudności i rowerów są w CMS
// („Elementy wspólne i kontakt”) — patrz useTrailLabels().

export type TrailDifficulty = 'latwa' | 'srednia' | 'trudna'
export type TrailBikeType = 'mtb' | 'gravel' | 'e-bike' | 'szosa'

export interface Trail {
  id: number
  slug: string
  title: string
  /** „Aktywna/Aktywny” w CMS — nieaktywne są ukryte na stronie. */
  active?: boolean
  difficulty: TrailDifficulty
  bikeTypes: string
  lengthKm: number
  elevationM: number
  durationHours: string
  surfaceAsfalt: number
  surfaceSzuter: number
  surfaceTeren: number
  image: CmsImage | null
  teaser: string
  description?: string
  highlights?: string
  stops?: string
  safety?: string
  gallery?: string
  gpxAvailable: boolean
  gpxFile?: string | null
  routeMapImage?: CmsImage | null
  elevationProfileImage?: CmsImage | null
  /** Ręczna kolejność z CMS (przeciąganie w panelu). */
  order?: number
}

export function trailBikeTypes(trail: Pick<Trail, 'bikeTypes'>): TrailBikeType[] {
  return (trail.bikeTypes || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean) as TrailBikeType[]
}
