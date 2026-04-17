import { useMemo } from 'react'
import type { FeedItem } from '../data'

const SWIMLANES = [
  { area: 'Data Engineering', color: '#1a4280', bg: '#eef2fc' },
  { area: 'AI/ML', color: '#4830a0', bg: '#f0edf9' },
  { area: 'AI/BI', color: '#9a5a08', bg: '#fdf4e4' },
  { area: 'Governance', color: '#1a6645', bg: '#eef6f1' },
]

const IMPACT_SIZE: Record<string, number> = { breaking: 14, high: 11, medium: 8, info: 6 }

function formatShort(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function InnovationTimeline({ items }: { items: FeedItem[] }) {
  const { lanes, dateRange } = useMemo(() => {
    const lanes = SWIMLANES.map(s => ({
      ...s,
      items: items
        .filter(i => i.area === s.area && i.published)
        .sort((a, b) => a.published.localeCompare(b.published)),
    }))

    const allDates = items.filter(i => i.published).map(i => i.published).sort()
    const dateRange = { min: allDates[0] || '', max: allDates[allDates.length - 1] || '' }

    return { lanes, dateRange }
  }, [items])

  if (!dateRange.min) return null

  const minTime = new Date(dateRange.min + 'T00:00:00').getTime()
  const maxTime = new Date(dateRange.max + 'T23:59:59').getTime()
  const span = maxTime - minTime || 1

  function getX(dateStr: string): number {
    const t = new Date(dateStr + 'T12:00:00').getTime()
    return ((t - minTime) / span) * 100
  }

  return (
    <div className="timeline">
      <div className="timeline-header">
        <h3 className="timeline-title">Innovation Timeline</h3>
        <p className="timeline-sub">{formatShort(dateRange.min)} — {formatShort(dateRange.max)} · {items.length} releases</p>
      </div>

      <div className="timeline-chart">
        {/* Date axis */}
        <div className="timeline-axis">
          <span>{formatShort(dateRange.min)}</span>
          <span>{formatShort(dateRange.max)}</span>
        </div>

        {/* Swimlanes */}
        {lanes.map(lane => (
          <div key={lane.area} className="timeline-lane">
            <div className="timeline-lane-label" style={{ color: lane.color }}>{lane.area}</div>
            <div className="timeline-lane-track" style={{ background: lane.bg }}>
              {lane.items.map(item => {
                const x = getX(item.published)
                const size = IMPACT_SIZE[item.impact] || 6
                return (
                  <div
                    key={item.id}
                    className={`timeline-dot${item.impact === 'breaking' ? ' timeline-dot-breaking' : ''}`}
                    style={{
                      left: `${x}%`,
                      width: size,
                      height: size,
                      background: item.impact === 'breaking' ? '#c0341e' : lane.color,
                    }}
                    title={`${item.title} (${item.impact})`}
                  />
                )
              })}
            </div>
            <div className="timeline-lane-count">{lane.items.length}</div>
          </div>
        ))}
      </div>

      <div className="timeline-legend">
        <span className="timeline-legend-item"><span className="timeline-legend-dot" style={{ width: 14, height: 14, background: '#c0341e' }} /> Breaking</span>
        <span className="timeline-legend-item"><span className="timeline-legend-dot" style={{ width: 11, height: 11, background: '#72726a' }} /> High</span>
        <span className="timeline-legend-item"><span className="timeline-legend-dot" style={{ width: 8, height: 8, background: '#72726a' }} /> Medium</span>
        <span className="timeline-legend-item"><span className="timeline-legend-dot" style={{ width: 6, height: 6, background: '#aeaea4' }} /> Info</span>
      </div>
    </div>
  )
}
