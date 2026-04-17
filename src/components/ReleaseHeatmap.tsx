import { useMemo } from 'react'
import type { FeedItem } from '../data'

const AREAS = ['Data Engineering', 'AI/ML', 'AI/BI', 'Governance', 'Platform', 'Other']
const AREA_COLORS: Record<string, string> = {
  'Data Engineering': '#1a4280',
  'AI/ML': '#4830a0',
  'AI/BI': '#9a5a08',
  'Governance': '#1a6645',
  'Platform': '#72726a',
  'Other': '#aeaea4',
}

function getWeeks(items: FeedItem[]): string[] {
  const weeks = new Set<string>()
  items.forEach(i => {
    if (!i.published) return
    const d = new Date(i.published + 'T12:00:00')
    // Get Monday of that week
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(d.setDate(diff))
    weeks.add(monday.toISOString().slice(0, 10))
  })
  return [...weeks].sort()
}

function formatWeekLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function ReleaseHeatmap({ items }: { items: FeedItem[] }) {
  const { weeks, grid, maxCount } = useMemo(() => {
    const weeks = getWeeks(items)
    const grid: Record<string, Record<string, number>> = {}

    AREAS.forEach(area => {
      grid[area] = {}
      weeks.forEach(w => { grid[area][w] = 0 })
    })

    items.forEach(item => {
      if (!item.published) return
      const d = new Date(item.published + 'T12:00:00')
      const day = d.getDay()
      const diff = d.getDate() - day + (day === 0 ? -6 : 1)
      const monday = new Date(d.setDate(diff))
      const weekKey = monday.toISOString().slice(0, 10)
      const area = AREAS.includes(item.area) ? item.area : 'Other'
      if (grid[area] && grid[area][weekKey] !== undefined) {
        grid[area][weekKey]++
      }
    })

    let maxCount = 0
    Object.values(grid).forEach(row => {
      Object.values(row).forEach(v => { if (v > maxCount) maxCount = v })
    })

    return { weeks, grid, maxCount }
  }, [items])

  if (weeks.length === 0) return null

  return (
    <div className="heatmap">
      <div className="heatmap-header">
        <h3 className="heatmap-title">Release Activity</h3>
        <p className="heatmap-sub">Signal volume by product area over trailing weeks</p>
      </div>
      <div className="heatmap-grid">
        {/* Column headers */}
        <div className="heatmap-row heatmap-header-row">
          <div className="heatmap-label" />
          {weeks.map(w => (
            <div key={w} className="heatmap-week-label">{formatWeekLabel(w)}</div>
          ))}
        </div>

        {/* Rows */}
        {AREAS.map(area => (
          <div key={area} className="heatmap-row">
            <div className="heatmap-label">{area}</div>
            {weeks.map(w => {
              const count = grid[area]?.[w] || 0
              const opacity = maxCount > 0 ? Math.max(0.08, count / maxCount) : 0
              const color = AREA_COLORS[area] || '#72726a'
              return (
                <div
                  key={w}
                  className="heatmap-cell"
                  style={{ background: count > 0 ? color : 'var(--paper-3)', opacity: count > 0 ? opacity : 1 }}
                  title={`${area}: ${count} releases (week of ${formatWeekLabel(w)})`}
                >
                  {count > 0 && <span className="heatmap-count">{count}</span>}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
