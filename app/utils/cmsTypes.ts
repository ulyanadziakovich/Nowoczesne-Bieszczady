// Shared TypeScript shapes for records coming from the Pruvious CMS.

export interface HomeContent {
  heroImage?: CmsImage | null
  heroKicker?: string
  heroTitle: string
  heroSubtitle: string
  heroCta?: string
  heroCtaHref?: string
  aboutKicker?: string
  aboutTitle?: string
  aboutParagraph1: string
  aboutParagraph2: string
  aboutTagline?: string
  aboutImage?: CmsImage | null
}

export interface SiteSettings {
  logo?: CmsImage | null
  email: string
  phone: string
  address: string
  facebookUrl?: string
  facebookLabel?: string
  footerTagline?: string
}

export interface NewsPost {
  id: number
  slug: string
  title: string
  date: string
  category: string
  image: CmsImage | null
  excerpt: string
  body?: string
    gallery?: string
  photos?: CmsGalleryImage[] | null
  /** Podstrony, na których wpis ma się też pokazać („Pokaż także na podstronach”). */
  showOn?: string[] | null

  /** Ręczna kolejność z CMS (przeciąganie w panelu). */
  order?: number
}


export interface TeamMember {
  id: number
  name: string
  photo?: CmsImage | null
  role: string
  order?: number
}

export interface Partner {
  id: number
  name: string
  logo?: CmsImage | null
  order?: number
}

export interface Report {
  id: number
  year: string
  title: string
  /** Plik sprawozdania wgrany w CMS. */
  file?: CmsFile | null
  /** Ręczna kolejność z CMS (przeciąganie w panelu). */
  order?: number
}

export interface Goal {
  id: number
  title: string
  description: string
  order?: number
}

export interface Peak {
  id: number
  name: string
  elevation: number
  note: string
  tower: boolean
  order?: number
}

export interface FestivalEdition {
  id: number
  slug: string
  year: string
  title: string
  description: string
  image: CmsImage | null
    gallery: string
  photos?: CmsGalleryImage[] | null

  featured: boolean
  /** Ręczna kolejność z CMS (przeciąganie w panelu). */
  order?: number
}

export interface Contest {
  id: number
  title: string
  /** „Aktywna/Aktywny” w CMS — nieaktywne są ukryte na stronie. */
  active?: boolean
  facts?: { label: string; value: string }[]
  documents?: { label: string; file: CmsFile | null }[]
  description: string
  fundingNote: string
  image: CmsImage | null
  /** Ręczna kolejność z CMS (przeciąganie w panelu). */
  order?: number
}

export interface FlagshipTile {
  id: number
  title: string
  description: string
  back: string
  image: CmsImage | null
    moreHref: string
  /** Etykiety na kafelku — jedna w linii. */
  tags?: string | null
  ctaLabel?: string | null
  order?: number
}

export interface Podcast {
  id: number
  title: string
  href?: string
  order?: number
}
