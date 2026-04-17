import { useState, useCallback } from 'react'

export function usePersistedSet(key: string): [Set<string>, (id: string) => void, () => void, () => void] {
  const [items, setItems] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')) }
    catch { return new Set() }
  })

  const add = useCallback((id: string) => {
    setItems(prev => {
      const next = new Set(prev)
      next.add(id)
      localStorage.setItem(key, JSON.stringify([...next]))
      return next
    })
  }, [key])

  const addAll = useCallback((ids: string[]) => {
    setItems(prev => {
      const next = new Set(prev)
      ids.forEach(id => next.add(id))
      localStorage.setItem(key, JSON.stringify([...next]))
      return next
    })
  }, [key])

  const clear = useCallback(() => {
    setItems(new Set())
    localStorage.setItem(key, '[]')
  }, [key])

  return [items, add, addAll as unknown as () => void, clear]
}

export function usePersistedString<T extends string>(key: string, fallback: T): [T, (val: T) => void] {
  const [val, setVal] = useState<T>(() => (localStorage.getItem(key) as T) || fallback)
  const set = useCallback((v: T) => { setVal(v); localStorage.setItem(key, v) }, [key])
  return [val, set]
}
