import { useState } from 'react'
import { blogs, releases, personas, type Persona, type FeedItem } from '../data'
import { FeedCard } from './FeedCard'

// Pick top 3 by impact then recency
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

export function HomePage({ onRead, readItems }: { onRead: (id: string) => void; readItems: Set<string> }) {
  const [tab, setTab] = useState<Persona>('all')

  const allBlogs = blogs.sort((a, b) => b.published.localeCompare(a.published))
  const topBlogs = topN(allBlogs, 3)

  const personaFiltered = tab === 'all'
    ? topN([...releases, ...blogs], 3)
    : topN([...releases, ...blogs].filter(i => i.personas.includes(tab)), 3)

  return (
    <div className="home">
      <div className="home-grid">
        {/* Left: pinned + video */}
        <div className="home-left">
          <PinnedMessage />
          <FeaturedVideo />
        </div>

        {/* Right: top blogs */}
        <div className="home-right">
          <h3 className="home-section-title">This Week's Top Blogs</h3>
          <div className="home-cards">
            {topBlogs.map(item => (
              <FeedCard key={item.id} item={item} isRead={readItems.has(item.id)} onRead={onRead} />
            ))}
          </div>
        </div>
      </div>

      {/* Persona picks */}
      <div className="home-persona-section">
        <h3 className="home-section-title">Top Picks by Role</h3>
        <div className="home-persona-tabs">
          {personas.map(p => (
            <button key={p.key} className={`home-persona-tab${tab === p.key ? ' active' : ''}`} onClick={() => setTab(p.key)}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="home-cards">
          {personaFiltered.length === 0
            ? <p className="home-empty">No items for this role yet.</p>
            : personaFiltered.map(item => (
                <FeedCard key={item.id} item={item} isRead={readItems.has(item.id)} onRead={onRead} />
              ))
          }
        </div>
      </div>

      {/* Breaking changes callout */}
      {releases.some(r => r.impact === 'breaking') && (
        <div className="home-breaking">
          <h3 className="home-section-title">⚠️ Breaking Changes</h3>
          <div className="home-cards">
            {releases.filter(r => r.impact === 'breaking').slice(0, 3).map(item => (
              <FeedCard key={item.id} item={item} isRead={readItems.has(item.id)} onRead={onRead} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
