interface TLItem {
  id: string
  title: string
  author: string
  url: string
  domain: string
  sa_take: string
  personas: string[]
  tags: string[]
}

const ITEMS: TLItem[] = [
  { id: 'tl1', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann',
    url: 'https://dataintensive.net/', domain: 'dataintensive.net',
    sa_take: 'The best single book on data systems. If your DE team reads one thing this year, make it this.',
    personas: ['DE', 'GV'], tags: ['architecture', 'fundamentals'] },
  { id: 'tl2', title: 'Building LLM-Powered Applications', author: 'Chip Huyen',
    url: 'https://huyenchip.com/2025/01/16/building-llm-applications.html', domain: 'huyenchip.com',
    sa_take: 'Practical production patterns for LLM apps. Skip the hype, read this instead.',
    personas: ['AI', 'ML'], tags: ['genai', 'production'] },
  { id: 'tl3', title: 'The Log: What every software engineer should know', author: 'Jay Kreps',
    url: 'https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying',
    domain: 'engineering.linkedin.com',
    sa_take: '10 years old and still the clearest explanation of event-driven architecture. 30 minutes well spent.',
    personas: ['DE', 'ML'], tags: ['streaming', 'architecture'] },
  { id: 'tl4', title: 'Against Entropy: Why Your Data Platform Rots', author: 'Benn Stancil',
    url: 'https://benn.substack.com/p/against-entropy', domain: 'benn.substack.com',
    sa_take: 'Every analytics leader should read this before their next "data strategy" meeting.',
    personas: ['AN', 'EX', 'GV'], tags: ['strategy', 'analytics'] },
  { id: 'tl5', title: 'How to Evaluate LLM Applications', author: 'Hamel Husain',
    url: 'https://hamel.dev/blog/posts/evals/', domain: 'hamel.dev',
    sa_take: 'The most practical eval guide I\'ve found. Directly applicable to your agent POC.',
    personas: ['AI', 'ML'], tags: ['genai', 'evaluation'] },
]

function TLCard({ item }: { item: TLItem }) {
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="tl-card">
      <div className="tl-top">
        <span className="tl-domain">{item.domain}</span>
        <span className="tl-author">{item.author}</span>
      </div>
      <h4 className="tl-title">{item.title}</h4>
      <div className="sa-note" style={{ marginTop: 10 }}>
        <div className="sa-note-label">Kevin's take</div>
        <p className="sa-note-text">{item.sa_take}</p>
      </div>
      <div className="tl-tags">
        {item.tags.map(t => <span key={t} className="tag">{t}</span>)}
        {item.personas.map(p => (
          <span key={p} className="tl-persona">{p}</span>
        ))}
      </div>
    </a>
  )
}

export function ThoughtLeadership() {
  return (
    <div className="tl">
      <div className="tl-header">
        <h2 className="tl-heading">Reading List</h2>
        <span className="tl-sub">Platform-agnostic. Curated by Kevin. Nothing to do with Databricks.</span>
      </div>
      <div className="tl-grid">
        {ITEMS.map(item => <TLCard key={item.id} item={item} />)}
      </div>
    </div>
  )
}
