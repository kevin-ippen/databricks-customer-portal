/**
 * Engagement logging — localStorage now, Delta table later.
 * Tracks: reads, click-throughs, shares, searches, feedback, page views.
 */

interface EngagementEvent {
  action: string
  item_id?: string
  metadata?: Record<string, string>
  timestamp: string
  persona: string
}

const STORAGE_KEY = 'hub:events'
const MAX_EVENTS = 500

function getPersona(): string {
  return localStorage.getItem('hub:persona') || 'all'
}

export function logEvent(action: string, itemId?: string, metadata?: Record<string, string>) {
  const event: EngagementEvent = {
    action,
    item_id: itemId,
    metadata,
    timestamp: new Date().toISOString(),
    persona: getPersona(),
  }

  // Log to console in dev
  if (import.meta.env.DEV) {
    console.log('[analytics]', event)
  }

  // Persist to localStorage
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as EngagementEvent[]
    stored.push(event)
    // Keep only the most recent events
    const trimmed = stored.slice(-MAX_EVENTS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

export function getEvents(): EngagementEvent[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function getLastVisit(): string | null {
  return localStorage.getItem('hub:last_visit')
}

export function recordVisit() {
  localStorage.setItem('hub:last_visit', new Date().toISOString())
}

export function getNewSinceLastVisit(items: { published: string }[]): number {
  const lastVisit = getLastVisit()
  if (!lastVisit) return items.length // first visit — everything is new
  const lastDate = new Date(lastVisit)
  return items.filter(i => new Date(i.published + 'T23:59:59') > lastDate).length
}
