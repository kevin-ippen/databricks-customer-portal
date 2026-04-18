import { blogs, releases, type Persona, type FeedItem } from '../data'
import { FeedCard } from './FeedCard'

function topN(items: FeedItem[], n: number): FeedItem[] {
  const impactOrder: Record<string, number> = { breaking: 0, high: 1, medium: 2, info: 3 }
  return [...items]
    .sort((a, b) => (impactOrder[a.impact] ?? 3) - (impactOrder[b.impact] ?? 3) || b.published.localeCompare(a.published))
    .slice(0, n)
}

function PinnedMessage() {
  const text = localStorage.getItem('hub:digest')
  if (!text) return null
  return (
    <div className="home-pinned">
      <div className="home-pinned-label">📌 From Your SA</div>
      <p className="home-pinned-text">{text}</p>
      <span className="home-pinned-author">— Kevin</span>
    </div>
  )
}

function FeaturedVideo() {
  return (
    <div className="home-video">
      <div className="home-video-label">Featured</div>
      <div className="home-video-embed">
        <iframe
          src="https://www.youtube.com/embed/7SLtR4ZO6uo"
          title="Databricks Data+AI Summit Keynote Highlights"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 'none', width: '100%', height: '100%', borderRadius: 'var(--r)' }}
        />
      </div>
      <p className="home-video-caption">Data+AI Summit 2026 — Platform Vision Keynote</p>
    </div>
  )
}

export function HomePage({ onRead, readItems, persona }: {
  onRead: (id: string) => void
  readItems: Set<string>
  persona: Persona
}) {
  // Top 3 blogs (most recent, not persona filtered — these are universal)
  const topBlogs = topN([...blogs].sort((a, b) => b.published.localeCompare(a.published)), 3)

  // Top picks — persona-filtered from the global persona chip
  const allItems = [...releases, ...blogs]
  const personaPicks = persona === 'all'
    ? topN(allItems, 5)
    : topN(allItems.filter(i => i.personas.includes(persona)), 5)

  // Breaking changes (always shown regardless of persona)
  const breakingItems = releases.filter(r => r.impact === 'breaking').slice(0, 3)

  return (
    <div className="home">
      <div className="home-grid">
        <div className="home-left">
          <PinnedMessage />
          <FeaturedVideo />
        </div>

        <div className="home-right">
          <h3 className="home-section-title">Top Blogs This Week</h3>
          <div className="home-cards">
            {topBlogs.map(item => (
              <FeedCard key={item.id} item={item} isRead={readItems.has(item.id)} onRead={onRead} />
            ))}
          </div>
        </div>
      </div>

      {/* Persona-filtered top picks — uses the global persona from the header chips */}
      <div className="home-persona-section">
        <h3 className="home-section-title">
          Top Picks {persona !== 'all' ? `for ${persona.toUpperCase()}` : ''}
        </h3>
        <div className="home-cards">
          {personaPicks.length === 0
            ? <p className="home-empty">No items for this role yet.</p>
            : personaPicks.map(item => (
                <FeedCard key={item.id} item={item} isRead={readItems.has(item.id)} onRead={onRead} />
              ))
          }
        </div>
      </div>

      {breakingItems.length > 0 && (
        <div className="home-breaking">
          <h3 className="home-section-title">⚠️ Breaking Changes</h3>
          <div className="home-cards">
            {breakingItems.map(item => (
              <FeedCard key={item.id} item={item} isRead={readItems.has(item.id)} onRead={onRead} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
