import type { Persona } from '../data'

interface Recommendation {
  title: string
  description: string
  action: string
  actionUrl: string
  context: string
  emoji: string
}

// Persona-specific recommendations based on typical adoption gaps
const RECS: Record<string, Recommendation> = {
  de: {
    title: 'Enable DLT Expectations on Your Silver Layer',
    description: 'Your team is running Lakeflow pipelines in production — but expectations (data quality rules) aren\'t configured yet. They catch issues before they hit gold tables.',
    action: 'Read the 5-minute guide',
    actionUrl: 'https://docs.databricks.com/en/delta-live-tables/expectations.html',
    context: 'Teams with your DLT maturity typically see 40% fewer data quality incidents after enabling expectations.',
    emoji: '🔧',
  },
  an: {
    title: 'Try Workspace Skills for Genie',
    description: 'Genie generates SQL from natural language — but it doesn\'t know your business metrics yet. Workspace Skills teach it your domain vocabulary in minutes.',
    action: 'Set up your first skill',
    actionUrl: 'https://docs.databricks.com/en/genie/workspace-skills.html',
    context: '12 QSR companies activated Genie with custom skills in the last 90 days.',
    emoji: '📊',
  },
  ml: {
    title: 'Add MLflow Tracing to Your Inference Pipeline',
    description: 'You\'re using MLflow for experiments — tracing extends that observability to production inference. See exactly what your model does on each request.',
    action: 'Enable tracing',
    actionUrl: 'https://docs.databricks.com/en/mlflow/tracing.html',
    context: 'MLflow Tracing shipped to GA this quarter. Teams report 60% faster debugging of model quality issues.',
    emoji: '🧠',
  },
  ai: {
    title: 'Evaluate Your Agent with MLflow Scorers',
    description: 'Before shipping an agent to production, run it through MLflow\'s GenAI evaluation framework. Automated scorers catch hallucinations and grounding failures.',
    action: 'See the eval quickstart',
    actionUrl: 'https://docs.databricks.com/en/mlflow/genai-evaluation.html',
    context: 'Agent Bricks now supports Knowledge Assistant + Supervisor Agent patterns. Evaluation is the gate to production.',
    emoji: '🤖',
  },
  gv: {
    title: 'Audit Your UC Fine-Grained Access Posture',
    description: 'Unity Catalog governs access — but are you using row/column filters? Governed tags? Most teams leave gaps between what UC can do and what\'s actually configured.',
    action: 'Review access patterns',
    actionUrl: 'https://docs.databricks.com/en/data-governance/unity-catalog/manage-privileges.html',
    context: 'Governed Tags went GA this month — good time to audit your tagging strategy.',
    emoji: '🛡️',
  },
  ex: {
    title: 'Share Your Platform Momentum Story',
    description: 'Your team is actively using 6 Databricks products. That\'s above the QSR peer median. A 1-page summary of what\'s live and what\'s next makes a strong internal case.',
    action: 'Request a custom brief from your SA',
    actionUrl: '#feedback',
    context: 'Platform velocity is your competitive advantage. Let your leadership see it.',
    emoji: '📈',
  },
  all: {
    title: 'Explore What\'s New This Month',
    description: 'Databricks shipped 14 updates in the last 30 days — including 3 new GA capabilities and 9 breaking changes to watch. Filter by your role to see what matters to you.',
    action: 'Browse the release feed',
    actionUrl: '#releases',
    context: 'Use the persona filter above to narrow to your team\'s focus area.',
    emoji: '🚀',
  },
}

export function NextUnlock({ persona }: { persona: Persona }) {
  const rec = RECS[persona] || RECS['all']

  const handleAction = () => {
    if (rec.actionUrl.startsWith('#')) return // handled by parent
    window.open(rec.actionUrl, '_blank')
  }

  return (
    <div className="unlock">
      <div className="unlock-badge">💡 Recommended Next Step</div>
      <div className="unlock-layout">
        <div className="unlock-icon">{rec.emoji}</div>
        <div className="unlock-body">
          <h3 className="unlock-title">{rec.title}</h3>
          <p className="unlock-desc">{rec.description}</p>
          <p className="unlock-context">{rec.context}</p>
          <button className="unlock-action" onClick={handleAction}>{rec.action} →</button>
        </div>
      </div>
    </div>
  )
}
