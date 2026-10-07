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
  photos?: CmsGalleryImage[] | null
  gpxAvailable: boolean
    gpxFile?: string | null
  /** Plik GPX wgrany w CMS (pole „Plik GPX”) — ma pierwszeństwo przed gpxFile. */
  gpxUpload?: CmsFile | null
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

/** Adres wgranego w CMS pliku GPX (przez nasze proxy — mapa czyta go fetch-em). */
export function trailGpxUrl(trail: Pick<Trail, 'gpxUpload'>) {
  return cmsFileProxyUrl(trail.gpxUpload ?? null)
}
