import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function AskTheStack() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || streaming) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setStreaming(true)

    // Mock streaming response — replace with SSE from FastAPI
    const response = generateMockResponse(userMsg.content)
    let partial = ''
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    for (let i = 0; i < response.length; i++) {
      partial += response[i]
      const captured = partial
      await new Promise(r => setTimeout(r, 8))
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = { role: 'assistant', content: captured }
        return next
      })
    }
    setStreaming(false)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  if (!open) {
    return (
      <button className="ask-fab" onClick={() => setOpen(true)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Ask the Stack</span>
      </button>
    )
  }

  return (
    <div className="ask-drawer">
      <div className="ask-header">
        <div>
          <h3 className="ask-title">Ask the Stack</h3>
          <p className="ask-sub">Context-aware. Knows your DPZ configuration.</p>
        </div>
        <button className="ask-close" onClick={() => setOpen(false)}>&times;</button>
      </div>

      <div className="ask-messages">
        {messages.length === 0 && (
          <div className="ask-empty">
            <p>Ask anything about your Databricks setup.</p>
            <div className="ask-suggestions">
              {[
                'How should I set up DLT expectations for our UC config?',
                'What\'s the best migration path from Oracle to Delta?',
                'Should we enable Genie for our regional ops directors?',
              ].map(q => (
                <button key={q} className="ask-suggestion" onClick={() => { setInput(q); }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`ask-msg ask-msg-${msg.role}`}>
            <div className="ask-msg-label">{msg.role === 'user' ? 'You' : 'Stack'}</div>
            <div className="ask-msg-text">{msg.content}{streaming && i === messages.length - 1 && <span className="ask-cursor">▊</span>}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="ask-input-area">
        <textarea
          className="ask-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about your Databricks config..."
          rows={2}
          disabled={streaming}
        />
        <button className="ask-send" onClick={send} disabled={!input.trim() || streaming}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m22 2-7 20-4-9-9-4z" /><path d="m22 2-11 11" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function generateMockResponse(question: string): string {
  const q = question.toLowerCase()
  if (q.includes('dlt') || q.includes('expectations') || q.includes('pipeline')) {
    return `Given your current Unity Catalog configuration in the dpz_prod catalog, I'd recommend setting up DLT expectations at the silver layer. Your EDW migration (Phase 2) is already using Lakeflow pipelines, so you can add expectations directly to your existing streaming tables.

Specifically for your setup:
• Use \`CONSTRAINT valid_order_id EXPECT (order_id IS NOT NULL) ON VIOLATION DROP ROW\` for your Kitchen Intelligence data
• Add row count expectations between bronze and silver to catch ingestion issues early
• Your UC fine-grained access rollout (currently blocked on ABAC preview) won't affect expectation configuration

One thing to watch: since you're on Runtime 18.2, the new cascade delete behavior for UC pipelines is coming. Make sure your CI/CD scripts handle the new default before it ships.`
  }
  if (q.includes('oracle') || q.includes('migration') || q.includes('delta')) {
    return `For your Oracle-to-Delta migration (EDW Phase 2), here's the recommended path based on your current stack:

1. **Lakeflow Connect** for incremental CDC from Oracle → bronze Delta tables. You're already using this for Phase 1 workloads.
2. **Type Widening (now GA)** handles the INT→BIGINT and VARCHAR→STRING conversions in-place — no need for the manual rewrite scripts your team was planning.
3. **Auto Loader with automatic type widening (Preview)** can handle schema drift from the Oracle side without pipeline failures.

Your current maturity score on Delta Lake is 88/100 — highest in your stack. The gap is in DLT (65/100), specifically around expectations and streaming table patterns. Closing that gap accelerates the migration.

Timeline consideration: the VOID columns behavioral change drops in the next release. Audit any SELECT * in your downstream consumers before that ships.`
  }
  if (q.includes('genie') || q.includes('regional') || q.includes('ops')) {
    return `For your Regional Ops directors (the Genie for Regional Ops project, currently in-flight), here's my recommendation:

**Yes, enable it** — but with workspace skills configured first. The new "Workspace Skills for Genie Code" feature (just shipped) lets you teach Genie your DPZ-specific metric definitions, naming conventions, and common query patterns. Without that, Genie will generate technically correct but semantically wrong SQL.

Setup sequence:
1. Define 5–10 workspace skills covering your core operational metrics (store sales, labor cost, food cost, delivery times)
2. Start with 3 pilot regions (you're already here)
3. Get feedback on query accuracy before expanding
4. Use the dynamic parameters feature in the new SQL editor to let directors customize date ranges and region filters

Your Genie maturity score is 30/100 — below the QSR peer median of 25. But your SQL Warehouse maturity (80/100) gives you a solid foundation. The gap is purely in Genie-specific configuration, not infrastructure.`
  }
  return `Based on your DPZ Databricks configuration (Unity Catalog active, Lakeflow in production, SQL Warehouse at 80/100 maturity):

That's a great question. Let me look at your current stack posture and the relevant recent platform changes to give you a specific answer.

Your team's strongest areas are Delta Lake (88/100) and SQL Warehouse (80/100). The biggest growth opportunities are in Genie (30/100 vs 25 peer median) and Vector Search (20/100).

I'd suggest we discuss this in the next office hours session — I can walk through the specifics with your team. In the meantime, check the Release Radar for any breaking changes that might affect your current setup.`
}
