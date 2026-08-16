export type ChildTab = 'plan' | 'assessment' | 'feedback' | 'profile'
export type GuardianLinkState = 'unbound' | 'pending' | 'bound'
export type AssessmentKey = 'talent' | 'personality' | 'interest' | 'dream'
export type AssessmentStatus = 'not_started' | 'in_progress' | 'completed'
export type ChildPlanState = 'locked' | 'waiting_report' | 'waiting_route' | 'active' | 'refreshing'
export type ChildFeedbackState = 'locked' | 'open' | 'draft' | 'submitted' | 'iterating' | 'archived'
export type AgeBand = '6-8' | '9-12' | '13-15' | '16-18'

export interface ChildAssessmentProgress {
  status: AssessmentStatus
  answered: number
}

export interface ChildPrototypeState {
  linkState: GuardianLinkState
  assessments: Record<AssessmentKey, ChildAssessmentProgress>
  planState: ChildPlanState
  feedbackState: ChildFeedbackState
  ageBand: AgeBand
  streak: number
  badges: string[]
}

export interface AssessmentOption {
  id: string
  title: string
  description: string
  visual: 'build' | 'observe' | 'story' | 'move' | 'solo' | 'team' | 'calm' | 'speak' | 'science' | 'art' | 'nature' | 'language' | 'create' | 'help' | 'explore' | 'lead'
}

export interface AssessmentQuestion {
  id: string
  scene: string
  prompt: string
  hint: string
  options: AssessmentOption[]
}

export interface AssessmentDefinition {
  key: AssessmentKey
  code: string
  title: string
  planet: string
  subtitle: string
  description: string
  duration: string
  color: 'violet' | 'coral' | 'cyan' | 'amber'
  questions: AssessmentQuestion[]
}
