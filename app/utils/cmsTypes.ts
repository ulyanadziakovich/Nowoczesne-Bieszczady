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
}

export interface EventItem {
  id: number
  title: string
  date: string
  time: string
  place: string
  image: CmsImage | null
  freeEntry: boolean
  ticketsHref?: string
  tag?: string
}

export interface TeamMember {
  id: number
  name: string
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
  fileUrl?: string
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
  featured: boolean
}

export interface Contest {
  id: number
  title: string
  description: string
  fundingNote: string
  image: CmsImage | null
}

export interface FlagshipTile {
  id: number
  title: string
  description: string
  back: string
  image: CmsImage | null
  moreHref: string
  order?: number
}

export interface Podcast {
  id: number
  title: string
  href?: string
  order?: number
}
