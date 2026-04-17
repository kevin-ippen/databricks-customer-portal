import { useState } from 'react'

type FeedbackType = 'suggestion' | 'question' | 'issue' | 'praise'

const TYPES: { key: FeedbackType; label: string; emoji: string }[] = [
  { key: 'suggestion', label: 'Suggestion', emoji: '💡' },
  { key: 'question', label: 'Question', emoji: '❓' },
  { key: 'issue', label: 'Report an Issue', emoji: '🐛' },
  { key: 'praise', label: 'Something Great', emoji: '🎉' },
]

export function FeedbackBox() {
  const [type, setType] = useState<FeedbackType>('suggestion')
  const [message, setMessage] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submit = () => {
    // In production: POST to API or write to Delta table
    console.log('Feedback:', { type, message, anonymous, name: anonymous ? 'Anonymous' : name })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setMessage('')
      setName('')
    }, 3000)
  }

  return (
    <div className="feedback">
      <div className="feedback-intro">
        <h2 className="feedback-title">How can we help?</h2>
        <p className="feedback-desc">Have a question, suggestion, or something you'd like to see from our team? We'd love to hear it. All feedback goes directly to your Databricks SA.</p>
      </div>

      {submitted ? (
        <div className="feedback-thanks">
          <span className="feedback-thanks-emoji">✓</span>
          <h3>Thank you!</h3>
          <p>Your feedback has been received. We'll follow up if needed.</p>
        </div>
      ) : (
        <div className="feedback-form">
          <div className="feedback-types">
            {TYPES.map(t => (
              <button
                key={t.key}
                className={`feedback-type${type === t.key ? ' active' : ''}`}
                onClick={() => setType(t.key)}
              >
                <span className="feedback-type-emoji">{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <textarea
            className="feedback-textarea"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={
              type === 'suggestion' ? "What would make your Databricks experience better?"
              : type === 'question' ? "What would you like to know?"
              : type === 'issue' ? "What's not working as expected?"
              : "What's going well?"
            }
            rows={5}
          />

          <div className="feedback-meta">
            <label className="feedback-anon">
              <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} />
              <span>Submit anonymously</span>
            </label>

            {!anonymous && (
              <input
                className="feedback-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name (optional)"
              />
            )}
          </div>

          <button className="feedback-submit" onClick={submit} disabled={!message.trim()}>
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  )
}
