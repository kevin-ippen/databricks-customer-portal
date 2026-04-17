export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="search">
      <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        placeholder="Search updates..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && <button className="search-x" onClick={() => onChange('')}>&times;</button>}
    </div>
  )
}
