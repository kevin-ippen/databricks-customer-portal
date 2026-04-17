import rawFeed from './feed.json'
import type { FeedItem, PersonaDef } from './types'

export type { FeedItem, PersonaDef }
export type { Persona, Impact, View, DateRange } from './types'

const SA_NOTES: Record<string, string> = {}

export const feed: FeedItem[] = (rawFeed as FeedItem[]).map(item => ({
  ...item,
  saNote: SA_NOTES[item.id] || undefined,
}))

export const releases = feed.filter(i => i.source === 'Release Notes' || i.source === "What's Coming")
export const blogs = feed.filter(i => i.contentType === 'article' || i.source === 'Blog')
export const reading = feed.filter(i => i.contentType === 'reading')

export const personas: PersonaDef[] = [
  { key: 'all', label: 'All', short: 'All' },
  { key: 'de',  label: 'Data Engineering', short: 'DE' },
  { key: 'an',  label: 'Analytics & BI', short: 'AN' },
  { key: 'ml',  label: 'ML / Data Science', short: 'ML' },
  { key: 'ai',  label: 'GenAI', short: 'AI' },
  { key: 'gv',  label: 'Platform & Gov', short: 'GV' },
  { key: 'ex',  label: 'Leadership', short: 'EX' },
]
