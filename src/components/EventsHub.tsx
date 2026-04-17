interface Event {
  id: string
  title: string
  event_at: string
  event_type: string
  url?: string
  description: string
  personas: string[]
  is_office_hours: boolean
}

const EVENTS: Event[] = [
  { id: 'e1', title: 'SA Office Hours — Open Q&A', event_at: '2026-04-22T14:00:00',
    event_type: 'office-hours', description: 'Bring any question. No agenda required.',
    personas: ['DE', 'ML', 'AI', 'AN', 'GV', 'EX'], is_office_hours: true },
  { id: 'e2', title: 'Data+AI Summit 2026', event_at: '2026-06-09T09:00:00',
    event_type: 'conference', url: 'https://www.databricks.com/dataaisummit',
    description: 'Annual Databricks conference. San Francisco.',
    personas: ['DE', 'ML', 'AI', 'AN', 'GV', 'EX'] },
  { id: 'e3', title: 'UC Deep-Dive Workshop — DPZ Specific', event_at: '2026-05-06T10:00:00',
    event_type: 'workshop', description: 'Hands-on: UC fine-grained access patterns for franchise data isolation.',
    personas: ['GV', 'DE'] },
  { id: 'e4', title: 'SA Office Hours — ML/AI Focus', event_at: '2026-05-13T14:00:00',
    event_type: 'office-hours', description: 'MLflow, Model Serving, Agent Bricks — bring your questions.',
    personas: ['ML', 'AI'], is_office_hours: true },
  { id: 'e5', title: 'Genie Best Practices Webinar', event_at: '2026-05-20T11:00:00',
    event_type: 'webinar', url: 'https://www.databricks.com/resources',
    description: 'Workspace skills, domain modeling, and permission patterns for Genie.',
    personas: ['AN', 'EX'] },
]

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  'office-hours': { label: 'Office Hours', color: '#c0341e', bg: '#fdf1ee' },
  'conference':   { label: 'Conference', color: '#4830a0', bg: '#f0edf9' },
  'workshop':     { label: 'Workshop', color: '#1a6645', bg: '#eef6f1' },
  'webinar':      { label: 'Webinar', color: '#1a4280', bg: '#eef2fc' },
  'meetup':       { label: 'Meetup', color: '#9a5a08', bg: '#fdf4e4' },
}

function formatEventDate(d: string) {
  const dt = new Date(d)
  return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function EventCard({ event }: { event: Event }) {
  const cfg = TYPE_CONFIG[event.event_type] || TYPE_CONFIG['webinar']
  const isPast = new Date(event.event_at) < new Date()

  return (
    <div className={`event-card${isPast ? ' event-past' : ''}${event.is_office_hours ? ' event-pinned' : ''}`}>
      <div className="event-top">
        <span className="event-type" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
        <span className="event-date">{formatEventDate(event.event_at)}</span>
      </div>
      <h4 className="event-title">
        {event.url ? <a href={event.url} target="_blank" rel="noopener noreferrer">{event.title}</a> : event.title}
      </h4>
      <p className="event-desc">{event.description}</p>
      <div className="event-personas">
        {event.personas.map(p => <span key={p} className="project-persona">{p}</span>)}
      </div>
    </div>
  )
}

export function EventsHub() {
  const pinned = EVENTS.filter(e => e.is_office_hours)
  const upcoming = EVENTS.filter(e => !e.is_office_hours && new Date(e.event_at) >= new Date())

  return (
    <div className="events">
      {pinned.length > 0 && (
        <div className="events-section">
          <h3 className="events-section-title">Office Hours</h3>
          <div className="events-list">
            {pinned.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </div>
      )}
      {upcoming.length > 0 && (
        <div className="events-section">
          <h3 className="events-section-title">Upcoming</h3>
          <div className="events-list">
            {upcoming.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </div>
      )}
    </div>
  )
}
