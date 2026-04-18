import { useState } from 'react'
import type { FeedItem } from '../data'
import { logEvent } from '../hooks/analytics'

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

function ShareButton({ item }: { item: FeedItem }) {
  const [copied, setCopied] = useState(false)

  const share = (e: React.MouseEvent) => {
    e.stopPropagation()
    const text = `${item.title}\n${item.summary ? item.summary + '\n' : ''}${item.url}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    logEvent('share', item.id, { title: item.title })
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button className="card-share" onClick={share} title="Copy to clipboard">
      {copied ? '✓' : '↗'}
    </button>
  )
}

function AskSAButton({ item }: { item: FeedItem }) {
  const ask = (e: React.MouseEvent) => {
    e.stopPropagation()
    const subject = encodeURIComponent(`Question about: ${item.title}`)
    // In production this would route to feedback box or Slack
    // For now, scroll to feedback and pre-fill
    logEvent('ask_sa', item.id, { title: item.title })
    const el = document.querySelector('.feedback-textarea') as HTMLTextAreaElement
    if (el) {
      el.value = `Re: ${item.title}\n\n`
      el.focus()
    }
  }

  return (
    <button className="card-ask" onClick={ask} title="Ask your SA about this">
      ?
    </button>
  )
}

export function FeedCard({ item, isRead, onRead }: {
  item: FeedItem
  isRead: boolean
  onRead: (id: string) => void
}) {
  const isBreaking = item.impact === 'breaking'
  const isReading = item.contentType === 'reading'

  const handleClick = () => {
    onRead(item.id)
    logEvent('read', item.id, { title: item.title, area: item.area, impact: item.impact })
  }

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    logEvent('click_through', item.id, { title: item.title, url: item.url })
  }

  return (
    <article
      className={`card${isRead ? ' card-read' : ''}${isBreaking ? ' card-breaking' : ''}${isReading ? ' card-reading' : ''}`}
      onClick={handleClick}
    >
      <div className="card-layout">
        <div className="card-icon" style={{ background: item.areaBg || '#f1f0e8', color: item.areaColor || '#72726a' }}>
          <span>{item.areaIcon || '📋'}</span>
        </div>

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
              <ContentTypeBadge type={item.contentType} />
              <span className={`chip chip-${item.impact}`}>{IMPACT_LABEL[item.impact] || item.impact}</span>
            </div>
          </div>

          <h3 className="card-title">
            <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>{item.title}</a>
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

        {/* Actions */}
        <div className="card-actions">
          <ShareButton item={item} />
          <AskSAButton item={item} />
          {isRead && <span className="card-check">✓</span>}
        </div>
      </div>
    </article>
  )
}
