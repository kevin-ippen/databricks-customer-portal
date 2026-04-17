export type Persona = 'all' | 'de' | 'ml' | 'ai' | 'an' | 'gv' | 'ex'
export type Impact = 'breaking' | 'high' | 'medium' | 'info'
export type View = 'home' | 'releases' | 'blogs' | 'reading' | 'events' | 'feedback' | 'about'
export type DateRange = '7d' | '30d' | '90d' | 'all'

export interface FeedItem {
  id: string
  title: string
  url: string
  published: string
  source: string
  area: string
  impact: Impact
  summary: string
  concepts: string[]
  personas: Persona[]
  stage?: string
  saNote?: string
  contentType?: string
  areaIcon?: string
  areaColor?: string
  areaBg?: string
  author?: string
  domain?: string
}

export interface PersonaDef {
  key: Persona
  label: string
  short: string
}
