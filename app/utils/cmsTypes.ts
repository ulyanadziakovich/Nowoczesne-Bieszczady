// Shared TypeScript shapes for records coming from the Pruvious CMS.

export interface HomeContent {
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
  aboutImage?: string
}

export interface SiteSettings {
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
  image: string
  excerpt: string
  body?: string
}

export interface EventItem {
  id: number
  title: string
  date: string
  time: string
  place: string
  image: string
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
  logo?: string
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
  year: string
  title: string
  description: string
  image: string
  featured: boolean
}

export interface Contest {
  id: number
  title: string
  description: string
  image: string
}

export interface FlagshipTile {
  id: number
  title: string
  description: string
  back: string
  image: string
  moreHref: string
  order?: number
}

export interface Podcast {
  id: number
  title: string
  href?: string
  order?: number
}
