import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { DemoState, GrowthTask, Role, TabKey } from './types'
import { tasks as initialTasks } from './data'

type Session = { role: Role; phone: string } | null
type StateContextValue = {
  session: Session
  login: (role: Role, phone?: string) => void
  logout: () => void
  tab: TabKey
  setTab: (tab: TabKey) => void
  demo: DemoState
  setDemo: (next: Partial<DemoState>) => void
  tasks: GrowthTask[]
  updateTask: (id: string, progress: number) => void
  resetDemo: () => void
}

const defaultDemo: DemoState = { stage: 'S4', monthly: 'idle', entitlement: 'active', childId: 'lin', reportVersion: 'V1' }
const StateContext = createContext<StateContextValue | null>(null)

export function StateProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(() => {
    const saved = localStorage.getItem('teensai-session')
    return saved ? JSON.parse(saved) : null
  })
  const [tab, setTab] = useState<TabKey>('home')
  const [demo, setDemoState] = useState<DemoState>(() => {
    const saved = localStorage.getItem('teensai-demo')
    return saved ? { ...defaultDemo, ...JSON.parse(saved) } : defaultDemo
  })
  const [tasks, setTasks] = useState(initialTasks)

  useEffect(() => localStorage.setItem('teensai-demo', JSON.stringify(demo)), [demo])
  useEffect(() => session ? localStorage.setItem('teensai-session', JSON.stringify(session)) : localStorage.removeItem('teensai-session'), [session])

  const value = useMemo<StateContextValue>(() => ({
    session,
    login: (role, phone = '138 0013 8000') => { setSession({ role, phone }); setTab('home') },
    logout: () => { setSession(null); setTab('home') },
    tab, setTab,
    demo,
    setDemo: (next) => setDemoState((current) => ({ ...current, ...next })),
    tasks,
    updateTask: (id, progress) => setTasks((items) => items.map((item) => item.id === id ? { ...item, progress } : item)),
    resetDemo: () => { setDemoState(defaultDemo); setTasks(initialTasks); localStorage.removeItem('teensai-demo') },
  }), [session, tab, demo, tasks])

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}

export function useAppState() {
  const value = useContext(StateContext)
  if (!value) throw new Error('useAppState must be used inside StateProvider')
  return value
}
