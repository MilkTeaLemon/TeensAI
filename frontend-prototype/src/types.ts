export type Role = 'parent' | 'child'
export type TabKey = 'home' | 'reports' | 'plan' | 'profile'
export type MainStage = 'S0' | 'S1' | 'PAYWALL' | 'S2' | 'S3' | 'S4'
export type MonthlyStage = 'idle' | 'feedback' | 'iterating' | 'new-report'
export type Entitlement = 'unpaid' | 'pending' | 'failed' | 'active' | 'expired' | 'refunding' | 'refunded'
export type CompletionType = 'binary' | 'duration' | 'count' | 'percentage' | 'rating'

export interface ChildProfile {
  id: string
  name: string
  initials: string
  age: number
  grade: string
  school: string
  region: string
  assessment: number
}

export interface GrowthTask {
  id: string
  continuityKey: string
  title: string
  dimension: string
  type: CompletionType
  target: number
  progress: number
  unit: string
  owner: '孩子' | '亲子' | '家长'
  parentConfirmed: boolean
}

export interface DemoState {
  stage: MainStage
  monthly: MonthlyStage
  entitlement: Entitlement
  childId: string
  reportVersion: 'V1' | 'V2'
}
