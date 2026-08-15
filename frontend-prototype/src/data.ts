import type { ChildProfile, GrowthTask } from './types'

export const children: ChildProfile[] = [
  { id: 'lin', name: '林小满', initials: '小满', age: 11, grade: '五年级', school: '杭州市青禾实验学校', region: '浙江 · 杭州', assessment: 78 },
  { id: 'yu', name: '林知屿', initials: '知屿', age: 8, grade: '二年级', school: '杭州市青禾实验学校', region: '浙江 · 杭州', assessment: 35 },
]

export const tasks: GrowthTask[] = [
  { id: 't1', continuityKey: 'habit.calligraphy.daily', title: '书法专注练习', dimension: '专注力', type: 'duration', target: 30, progress: 20, unit: '分钟', owner: '孩子', parentConfirmed: true },
  { id: 't2', continuityKey: 'family.reading.together', title: '亲子共读与讨论', dimension: '家庭关系', type: 'binary', target: 1, progress: 0, unit: '次', owner: '亲子', parentConfirmed: false },
  { id: 't3', continuityKey: 'stem.logic.challenge', title: '完成一道逻辑挑战', dimension: '科创思维', type: 'count', target: 1, progress: 1, unit: '题', owner: '孩子', parentConfirmed: false },
]

export const surveys = [
  ['家庭资源与支持', 12, true],
  ['教养方式与陪伴', 18, true],
  ['家长期许与目标', 10, true],
  ['成长环境与习惯', 15, false],
  ['时代能力与政策关注', 8, false],
] as const

export const routes = [
  { id: 'stem', code: 'A', title: '科创探索路线', subtitle: '从好奇心出发，建立问题解决力', tone: 'blue', tags: ['逻辑思维', '创造力', '项目实践'], fit: 92 },
  { id: 'whole', code: 'B', title: '综合素养路线', subtitle: '以稳定习惯为支点，均衡发展', tone: 'green', tags: ['自驱力', '表达力', '身心韧性'], fit: 86 },
] as const

export const stageLabels = {
  S0: '未建档', S1: '调研采集期', PAYWALL: '权益确认', S2: 'AI 演算中', S3: '报告待确认', S4: '执行期',
} as const

export const entitlementLabels = {
  unpaid: '未购买', pending: '支付处理中', failed: '支付失败', active: '已生效', expired: '已过期', refunding: '退款中', refunded: '已退款',
} as const
