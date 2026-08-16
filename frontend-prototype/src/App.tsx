import { StateProvider, useAppState } from './state'
import { AuthFlow } from './components/AuthFlow'
import { ParentApp } from './components/ParentApp'
import { ChildApp } from './components/ChildApp'

function AppContent() {
  const { session } = useAppState()
  if (!session) return <AuthFlow />
  return session.role === 'parent' ? <ParentApp /> : <ChildApp />
}

export default function App() {
  return (
    <StateProvider>
      <AppContent />
    </StateProvider>
  )
}
