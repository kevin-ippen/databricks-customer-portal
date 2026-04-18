import { useState, useMemo, useCallback } from 'react'
import { feed, releases, personas, type Persona, type View, type DateRange } from './data'
import { usePersistedSet, usePersistedString } from './hooks/usePersistedState'
import { FeedCard } from './components/FeedCard'
import { EventsHub } from './components/EventsHub'
import { ThoughtLeadership } from './components/ThoughtLeadership'
import { AskTheStack } from './components/AskTheStack'
import { ReleaseHeatmap } from './components/ReleaseHeatmap'
import { InnovationTimeline } from './components/InnovationTimeline'
import { HomePage } from './components/HomePage'
import { FeedbackBox } from './components/FeedbackBox'

const VIEWS: { key: View; label: string }[] = [
  { key: 'home', label: 'ICYMI' },
  { key: 'releases', label: 'Releases' },
  { key: 'blogs', label: 'Blogs' },
  { key: 'reading', label: 'Reading List' },
  { key: 'events', label: 'Events' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'about', label: 'About' },
]

const DATE_RANGES: { key: DateRange; label: string; days: number }[] = [
  { key: '7d', label: '7d', days: 7 },
  { key: '30d', label: '30d', days: 30 },
  { key: '90d', label: '90d', days: 90 },
  { key: 'all', label: 'All', days: 9999 },
]

function daysAgo(d: string): number {
  return Math.floor((Date.now() - new Date(d + 'T12:00:00').getTime()) / 86400000)
}

// Search that hits title, summary, concepts, area, and source
function matchesSearch(item: typeof feed[0], q: string): boolean {
  return (
    item.title.toLowerCase().includes(q) ||
    item.summary.toLowerCase().includes(q) ||
    item.area.toLowerCase().includes(q) ||
    item.source.toLowerCase().includes(q) ||
    (item.author || '').toLowerCase().includes(q) ||
    item.concepts.some(c => c.toLowerCase().includes(q))
  )
}

export function App() {
  const [persona, setPersona] = usePersistedString<Persona>('hub:persona', 'all')
  const [view, setView] = useState<View>('home')
  const [dateRange, setDateRange] = useState<DateRange>('30d')
  const [readItems, markRead, , clearRead] = usePersistedSet('hub:read')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [search, setSearch] = useState('')

  const rangeDays = DATE_RANGES.find(r => r.key === dateRange)?.days || 9999
  const q = search.toLowerCase()

  // Filtered releases — full index, all filters
  const filteredReleases = useMemo(() => {
    let items = persona === 'all' ? releases : releases.filter(i => i.personas.includes(persona))
    if (rangeDays < 9999) items = items.filter(i => daysAgo(i.published) <= rangeDays)
    if (unreadOnly) items = items.filter(i => !readItems.has(i.id))
    if (q) items = items.filter(i => matchesSearch(i, q))
    return items
  }, [persona, rangeDays, unreadOnly, readItems, q])

  // Filtered blogs — also date + persona + search
  const filteredBlogs = useMemo(() => {
    let items = feed.filter(i => i.contentType === 'article' || i.source === 'Blog')
    if (persona !== 'all') items = items.filter(i => i.personas.includes(persona))
    if (rangeDays < 9999) items = items.filter(i => daysAgo(i.published) <= rangeDays)
    if (q) items = items.filter(i => matchesSearch(i, q))
    return items
  }, [persona, rangeDays, q])

  const markAllRead = useCallback(() => { filteredReleases.forEach(i => markRead(i.id)) }, [filteredReleases, markRead])
  const readCount = filteredReleases.filter(i => readItems.has(i.id)).length
  const currentPersona = personas.find(p => p.key === persona)

  // Show toolbar on releases and blogs views
  const showToolbar = view === 'releases' || view === 'blogs'

  return (
    <div className="app">
      {/* Top bar */}
      <div className="topbar">
        <div className="topbar-main">
          <div className="topbar-brand">
            <span className="topbar-logo">Databricks <em>Portal</em></span>
            <span className="topbar-account">Platform Intelligence Hub</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-search">
              <svg className="topbar-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Search releases, blogs, features..." value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button className="topbar-search-x" onClick={() => setSearch('')}>&times;</button>}
            </div>
          </div>
        </div>

        {/* View tabs — primary nav, IN the top bar */}
        <div className="persona-tabs">
          {VIEWS.map(v => (
            <button key={v.key} className={`persona-tab${view === v.key ? ' active' : ''}`} onClick={() => setView(v.key)}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Page */}
      <div className="page">
        {/* Page header + persona filter */}
        <div className="page-header">
          <div className="page-header-left">
            <div className="page-kicker">{currentPersona?.label || 'All Roles'}</div>
            <h1 className="page-title">
              {view === 'home' && <>In Case You <em>Missed It</em></>}
              {view === 'releases' && <>Release <em>Notes</em></>}
              {view === 'blogs' && <>Blog <em>Posts</em></>}
              {view === 'reading' && <>Reading <em>List</em></>}
              {view === 'events' && <>Events & <em>Office Hours</em></>}
              {view === 'feedback' && <>How Can We <em>Help?</em></>}
              {view === 'about' && <>About This <em>Portal</em></>}
            </h1>
          </div>

          {/* Persona filter — only on content views */}
          {(view === 'home' || view === 'releases' || view === 'blogs') && (
            <div className="persona-filter">
              {personas.map(p => (
                <button key={p.key} className={`pf-chip${persona === p.key ? ' active' : ''}`} onClick={() => setPersona(p.key)}>
                  {p.short}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Toolbar for releases + blogs */}
        {showToolbar && (
          <div className="toolbar">
            <div className="toolbar-left">
              <div className="date-pills">
                {DATE_RANGES.map(r => (
                  <button key={r.key} className={`date-pill${dateRange === r.key ? ' active' : ''}`} onClick={() => setDateRange(r.key)}>{r.label}</button>
                ))}
              </div>
              <span className="toolbar-stat">
                {view === 'releases' ? `${filteredReleases.length} releases` : `${filteredBlogs.length} posts`}
                {view === 'releases' && ` · ${readCount} read`}
              </span>
            </div>
            <div className="toolbar-right">
              {view === 'releases' && (
                <>
                  <label className="toolbar-toggle"><input type="checkbox" checked={unreadOnly} onChange={e => setUnreadOnly(e.target.checked)} /><span>Unread only</span></label>
                  <button className="toolbar-btn" onClick={markAllRead}>Mark all read</button>
                  <button className="toolbar-btn" onClick={clearRead}>Reset</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Views */}
        {view === 'home' && <HomePage onRead={markRead} readItems={readItems} persona={persona} />}

        {view === 'releases' && (
          <div>
            <ReleaseHeatmap items={filteredReleases} />
            <InnovationTimeline items={filteredReleases} />
            <div className="feed">
              {filteredReleases.length === 0
                ? <div className="empty">{search ? `No results for "${search}"` : 'No releases in this range.'}</div>
                : filteredReleases.map(item => <FeedCard key={item.id} item={item} isRead={readItems.has(item.id)} onRead={markRead} />)
              }
            </div>
          </div>
        )}

        {view === 'blogs' && (
          <div className="feed">
            {filteredBlogs.length === 0
              ? <div className="empty">{search ? `No results for "${search}"` : 'No blog posts in this range.'}</div>
              : filteredBlogs.map(item => <FeedCard key={item.id} item={item} isRead={readItems.has(item.id)} onRead={markRead} />)
            }
          </div>
        )}

        {view === 'reading' && <ThoughtLeadership />}
        {view === 'events' && <EventsHub />}
        {view === 'feedback' && <FeedbackBox />}

        {view === 'about' && (
          <div className="about">
            <div className="about-card">
              <h2>What is this?</h2>
              <p>A personalized hub for Databricks platform intelligence — release notes, blogs, curated reading, and events, filtered by your role and annotated by your SA.</p>
            </div>
            <div className="about-card">
              <h2>Navigation</h2>
              <ul>
                <li><strong>ICYMI</strong> — The highlights: pinned messages, top blogs, role-specific picks, breaking changes.</li>
                <li><strong>Releases</strong> — Full release note index with timeline and heatmap visualizations.</li>
                <li><strong>Blogs</strong> — Databricks blog posts and technical articles.</li>
                <li><strong>Reading List</strong> — Platform-agnostic recommendations from your SA.</li>
                <li><strong>Events</strong> — Workshops, webinars, and SA office hours.</li>
                <li><strong>Feedback</strong> — Suggestions, questions, issues — anonymous option available.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <AskTheStack />
    </div>
  )
}
