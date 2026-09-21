// UI vocabulary for trail data coming from the CMS — not content itself,
// just how raw field values (stored as plain strings) are labeled/rendered.

export type TrailDifficulty = 'latwa' | 'srednia' | 'trudna'
export type TrailBikeType = 'mtb' | 'gravel' | 'e-bike' | 'szosa'

export const difficultyLabels: Record<TrailDifficulty, string> = {
  latwa: 'Łatwa',
  srednia: 'Średnia',
  trudna: 'Trudna',
}

export const bikeTypeLabels: Record<TrailBikeType, string> = {
  mtb: 'MTB',
  gravel: 'Gravel',
  'e-bike': 'E-bike',
  szosa: 'Szosa',
}

export interface Trail {
  id: number
  slug: string
  title: string
  difficulty: TrailDifficulty
  bikeTypes: string
  lengthKm: number
  elevationM: number
  durationHours: string
  surfaceAsfalt: number
  surfaceSzuter: number
  surfaceTeren: number
  image: string
  teaser: string
  description?: string
  highlights?: string
  stops?: string
  safety?: string
  gallery?: string
  gpxAvailable: boolean
}

export function trailBikeTypes(trail: Pick<Trail, 'bikeTypes'>): TrailBikeType[] {
  return (trail.bikeTypes || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean) as TrailBikeType[]
}
