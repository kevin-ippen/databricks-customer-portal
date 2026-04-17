import type { FeedItem } from '../data'

const IMPACT_LABEL: Record<string, string> = {
  breaking: 'Breaking',
  high: 'New GA',
  medium: 'Update',
  info: 'Info',
}

function formatDate(d: string) {
  if (!d) return ''
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function ContentTypeBadge({ type }: { type?: string }) {
  if (!type || type === 'release') return null
  const config: Record<string, { label: string; color: string; bg: string }> = {
    reading: { label: '📖 Reading', color: '#0a6b6b', bg: '#eaf5f5' },
    article: { label: '📝 Article', color: '#1a4280', bg: '#eef2fc' },
    video: { label: '▶ Video', color: '#4830a0', bg: '#f0edf9' },
  }
  const c = config[type]
  if (!c) return null
  return <span className="chip" style={{ background: c.bg, color: c.color }}>{c.label}</span>
}

export function FeedCard({ item, isRead, onRead }: {
  item: FeedItem
  isRead: boolean
  onRead: (id: string) => void
}) {
  const isBreaking = item.impact === 'breaking'
  const isReading = item.contentType === 'reading'
  const isPinned = item.pinned

  return (
    <article
      className={`card${isRead ? ' card-read' : ''}${isBreaking ? ' card-breaking' : ''}${isReading ? ' card-reading' : ''}${isPinned ? ' card-pinned' : ''}`}
      onClick={() => onRead(item.id)}
    >
      <div className="card-layout">
        {/* Area icon */}
        <div className="card-icon" style={{ background: item.areaBg || '#f1f0e8', color: item.areaColor || '#72726a' }}>
          <span>{item.areaIcon || '📋'}</span>
        </div>

        {/* Content */}
        <div className="card-body">
          <div className="card-top">
            <div className="card-meta">
              <span>{item.source}</span>
              <span className="dot" />
              <span>{formatDate(item.published)}</span>
              <span className="dot" />
              <span>{item.area}</span>
              {item.author && <><span className="dot" /><span>{item.author}</span></>}
            </div>
            <div className="card-badges">
              {isPinned && <span className="pin-badge">📌 Pinned</span>}
              <ContentTypeBadge type={item.contentType} />
              <span className={`chip chip-${item.impact}`}>{IMPACT_LABEL[item.impact] || item.impact}</span>
            </div>
          </div>

          <h3 className="card-title">
            <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
          </h3>

          {item.summary && <p className="card-summary">{item.summary}</p>}

          {item.concepts.length > 0 && (
            <div className="card-tags">
              {item.stage && <span className={`chip chip-${item.stage === 'Beta' ? 'beta' : 'preview'}`}>{item.stage}</span>}
              {item.concepts.map(c => <span key={c} className="tag">{c}</span>)}
            </div>
          )}

          {item.saNote && (
            <div className="sa-note">
              <div className="sa-note-label">Kevin's take</div>
              <p className="sa-note-text">{item.saNote}</p>
            </div>
          )}
        </div>

        {/* Read indicator */}
        {isRead && <span className="card-check">✓</span>}
      </div>
    </article>
  )
}
