import { useMemo, useState } from 'react'
import {
  AcademicCapIcon, ArrowRightIcon, BellIcon, BookOpenIcon, CalendarDaysIcon,
  ChartBarIcon, CheckCircleIcon, CheckIcon, ChevronRightIcon, ClockIcon,
  Cog6ToothIcon, DocumentChartBarIcon, ExclamationCircleIcon, GiftIcon,
  LockClosedIcon, PencilSquareIcon, PlayIcon, PlusIcon, ReceiptPercentIcon,
  ShareIcon, ShieldCheckIcon, SparklesIcon, UserGroupIcon, UserPlusIcon,
} from '@heroicons/react/24/outline'
import { children, routes, surveys } from '../data'
import { useAppState } from '../state'
import type { GrowthTask } from '../types'
import { PaymentSheet, Sheet } from './ParentApp'

export function HomePage() {
  const { demo } = useAppState()
  return <div className="page home-page">
    <PageGreeting />
    {demo.monthly !== 'idle' && <MonthlyBanner />}
    {demo.stage === 'S0' && <UnprofiledHome />}
    {demo.stage === 'S1' && <CollectionHome />}
    {demo.stage === 'PAYWALL' && <PaywallHome />}
    {demo.stage === 'S2' && <GeneratingHome />}
    {demo.stage === 'S3' && <ReportReadyHome />}
    {demo.stage === 'S4' && <ActiveHome />}
  </div>
}

function PageGreeting() {
  const { demo } = useAppState()
  const child = children.find((item) => item.id === demo.childId) ?? children[0]
  return <div className="page-heading"><div><p>8 月 15 日 · 星期六</p><h1>早上好，林女士</h1><span>一起看看 {child.name} 今天的成长安排</span></div><button className="notification"><BellIcon /><i>2</i></button></div>
}

function UnprofiledHome() {
  const { setDemo } = useAppState()
  return <>
    <section className="hero-card hero-card--ink"><span className="hero-kicker">从了解开始</span><h2>为孩子建立第一份<br />成长档案</h2><p>用 2 分钟完善基础信息，开启家庭调研与趣味测评。</p><button onClick={() => setDemo({ stage: 'S1' })}>添加孩子 <ArrowRightIcon /></button><div className="hero-orbits"><i /><i /><i /></div></section>
    <SectionTitle title="接下来会发生什么" />
    <div className="timeline-card">{[['01', '建立孩子档案', '基础信息与家庭关系'], ['02', '双端完成测评', '家长 5 套 · 孩子 4 套'], ['03', '获得成长报告', '双路线与每周行动计划']].map((item) => <div key={item[0]}><b>{item[0]}</b><span><strong>{item[1]}</strong><small>{item[2]}</small></span></div>)}</div>
  </>
}

function CollectionHome() {
  const { setDemo } = useAppState()
  return <>
    <section className="progress-hero"><div><span className="eyebrow">调研采集期</span><h2>离生成报告<br />还差 3 项</h2><p>双方完成后将自动检查权益。</p></div><ProgressRing value={56} /></section>
    <SectionTitle title="今天优先完成" action="全部任务" />
    <button className="action-card action-card--dark"><span className="action-index">01</span><div><small>家长端 · 约 4 分钟</small><h3>继续家庭调研</h3><p>成长环境与习惯 · 已完成 7/15</p><div className="mini-progress"><i style={{ width: '47%' }} /></div></div><ArrowRightIcon /></button>
    <button className="action-card"><span className="action-index">02</span><div><small>孩子端 · 等待邀请</small><h3>邀请孩子完成趣味测评</h3><p>已完成 3/4 · 剩余「创意实验室」</p></div><ShareIcon /></button>
    <SectionTitle title="家庭调研" action="3/5 已完成" />
    <div className="survey-list">{surveys.map(([name, count, done]) => <button key={name}><span className={done ? 'status-icon is-done' : 'status-icon'}>{done ? <CheckIcon /> : <PlayIcon />}</span><span><b>{name}</b><small>{count} 题 · 支持断点续答</small></span><ChevronRightIcon /></button>)}</div>
    <button className="text-action" onClick={() => setDemo({ stage: 'PAYWALL', entitlement: 'unpaid' })}>演示：标记双端测评全部完成 <ArrowRightIcon /></button>
  </>
}

function PaywallHome() {
  const { demo } = useAppState()
  const [showPayment, setShowPayment] = useState(false)
  const failed = demo.entitlement === 'failed'
  const pending = demo.entitlement === 'pending'
  return <>
    <section className="hero-card hero-card--warm"><span className="hero-kicker">双端测评已完成</span><h2>成长画像已就绪</h2><p>启用成长服务后，AI 将结合家庭调研与孩子测评生成专属报告。</p><div className="data-pill-row"><span><CheckIcon /> 家庭调研 5/5</span><span><CheckIcon /> 趣味测评 4/4</span></div></section>
    {(failed || pending) && <div className={`status-notice ${failed ? 'is-error' : ''}`}><ExclamationCircleIcon /><span><b>{failed ? '上次支付未完成' : '订单正在确认中'}</b><small>{failed ? '你可以重新支付或选择其他套餐。' : '通常需要几秒，请稍后刷新状态。'}</small></span></div>}
    <section className="offer-card"><div className="offer-icon"><GiftIcon /></div><span className="eyebrow">首次体验</span><h3>首次成长报告</h3><p>一次看清优势、潜能与下一步行动方向。</p><ul><li><CheckIcon />完整成长报告 V1</li><li><CheckIcon />2 条专属成长路线</li><li><CheckIcon />4 周可执行任务计划</li></ul><div className="offer-price"><b>¥199</b><small>一次性体验</small></div><button className="button button--primary" onClick={() => setShowPayment(true)}>查看套餐并开通</button></section>
    <p className="trust-line"><ShieldCheckIcon /> 模拟支付 · 不产生真实扣款</p>
    {showPayment && <PaymentSheet onClose={() => setShowPayment(false)} />}
  </>
}

function GeneratingHome() {
  const { setDemo } = useAppState()
  return <>
    <section className="generating-card"><div className="ai-loader"><i /><i /><SparklesIcon /></div><span className="eyebrow">AI 演算中</span><h2>正在连接孩子的<br />成长线索</h2><p>正在综合天赋、家庭条件、家长期许、时代能力与成长目标。</p><div className="generation-progress"><i style={{ width: '68%' }} /></div><div className="generation-meta"><span>已完成 68%</span><span>预计还需 48 秒</span></div></section>
    <div className="insight-preview"><div><SparklesIcon /><span><b>正在生成的内容</b><small>优势雷达 · 潜能诊断 · 双路线 · 行动计划</small></span></div><p>无需停留在此页面，完成后我们会发送通知。</p></div>
    <button className="text-action" onClick={() => setDemo({ stage: 'S3', reportVersion: 'V1' })}>演示：立即完成生成 <ArrowRightIcon /></button>
  </>
}

function ReportReadyHome() {
  const { setTab } = useAppState()
  return <>
    <section className="hero-card hero-card--coral"><span className="hero-kicker">关键行动</span><h2>小满的成长报告<br />已经生成</h2><p>请查看完整报告，并从两条成长路线中选择一条开始执行。</p><button onClick={() => setTab('reports')}>查看报告并选择路线 <ArrowRightIcon /></button><DocumentChartBarIcon className="hero-card__watermark" /></section>
    <SectionTitle title="我们发现了什么" />
    <div className="insight-grid"><div><span>优势潜能</span><b>空间推理</b><small>高于同龄参考 24%</small></div><div><span>成长支点</span><b>稳定专注</b><small>从习惯建立突破</small></div></div>
    <section className="route-teaser"><span className="eyebrow">报告 V1 · 双路线</span><h3>不同方向，相同的成长底座</h3><p>切换路线时，逻辑相同的任务会沿用已完成进度。</p><div>{routes.map((route) => <span key={route.id}>{route.code} · {route.title}</span>)}</div></section>
  </>
}

function ActiveHome() {
  const { tasks } = useAppState()
  const done = tasks.filter((task) => task.progress >= task.target).length
  return <>
    <section className="today-overview"><div><span className="eyebrow">今日计划 · 8 月 15 日</span><h2>3 项任务，<br />从一小步开始</h2><p>{done}/3 已完成 · 预计还需 35 分钟</p></div><ProgressRing value={Math.round(done / tasks.length * 100)} dark /></section>
    <SectionTitle title="今日任务" action={`${done}/${tasks.length} 已完成`} />
    <div className="task-list">{tasks.map((task) => <TaskCard task={task} key={task.id} />)}</div>
    <section className="week-card"><div className="week-card__top"><span><small>本周完成度</small><b>76%</b></span><div><i>连续</i><strong>6 天</strong></div></div><div className="week-bars">{[80, 100, 65, 90, 60, 25, 0].map((value, index) => <div key={index}><i style={{ height: `${Math.max(value, 8)}%` }} className={value === 100 ? 'is-full' : ''} /><small>{'一二三四五六日'[index]}</small></div>)}</div></section>
    <SectionTitle title="最新成长洞察" action="报告 V1" />
    <button className="report-snippet"><span className="report-snippet__number">01</span><div><small>本周观察</small><h3>当任务有清晰边界时，<br />小满的专注更稳定</h3><p>建议延续 20–30 分钟的短周期练习。</p></div><ArrowRightIcon /></button>
    <SectionTitle title="为你推荐" />
    <div className="resource-row"><article><span>亲子工具</span><h3>不催促的<br />任务复盘法</h3><small>5 分钟阅读</small></article><article><span>能力练习</span><h3>把好奇心<br />变成小实验</h3><small>周末可实践</small></article></div>
  </>
}

function TaskCard({ task }: { task: GrowthTask }) {
  const { updateTask } = useAppState()
  const done = task.progress >= task.target
  return <button className={`task-card ${done ? 'is-done' : ''}`} onClick={() => updateTask(task.id, done ? 0 : task.target)}>
    <span className="task-check">{done && <CheckIcon />}</span><span className="task-card__copy"><small>{task.dimension} · {task.owner}</small><b>{task.title}</b><em>{task.type === 'binary' ? (done ? '已完成' : '点击完成') : `${task.progress}/${task.target} ${task.unit}`}</em></span>{task.type !== 'binary' && <span className="task-meter"><i style={{ height: `${Math.min(task.progress / task.target * 100, 100)}%` }} /></span>}<ChevronRightIcon />
  </button>
}

function MonthlyBanner() {
  const { demo, setDemo } = useAppState()
  const content = {
    feedback: ['月度反馈已开放', '花 3 分钟，帮助小满升级成长方案', '开始反馈'],
    iterating: ['AI 正在复盘这个月', '当前计划照常执行，完成后会通知你', '查看进度'],
    'new-report': ['成长报告 V2 已到达', '查看变化点，并重新确认下一阶段路线', '查看新版'],
    idle: ['', '', ''],
  }[demo.monthly]
  return <button className={`monthly-banner monthly-banner--${demo.monthly}`} onClick={() => demo.monthly === 'feedback' ? setDemo({ monthly: 'iterating' }) : undefined}><SparklesIcon /><span><b>{content[0]}</b><small>{content[1]}</small></span><em>{content[2]} <ArrowRightIcon /></em></button>
}

export function ReportsPage() {
  const { demo, setDemo, setTab } = useAppState()
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [routeSheet, setRouteSheet] = useState(false)
  const unlocked = demo.stage === 'S3' || demo.stage === 'S4'
  const confirm = () => { if (!selectedRoute) return; setDemo({ stage: 'S4', monthly: 'idle' }); setRouteSheet(false); setTab('plan') }
  return <div className="page">
    <PageTitle eyebrow="成长档案" title="报告" subtitle="每个版本，都记录一次看见与理解。" />
    {!unlocked ? <LockedPreview type="报告" /> : <>
      <article className="featured-report"><div className="report-cover"><span>TeensAI</span><b>{demo.reportVersion}</b><em>成长<br />洞察<br />报告</em><small>林小满 · 2026.08</small><i /></div><div className="featured-report__body"><span className="tag">{demo.reportVersion === 'V2' ? '最新迭代' : '初始报告'}</span><h2>林小满的成长<br />洞察报告</h2><p>10 个模块 · 2 条成长路线</p><div><span>生成于 2026.08.15</span><button>阅读全文 <ArrowRightIcon /></button></div></div></article>
      <div className="report-stats"><div><span>核心优势</span><b>空间推理</b><small>观察力 · 创造力</small></div><div><span>优先成长</span><b>稳定专注</b><small>计划力 · 自我管理</small></div></div>
      <SectionTitle title="成长路线" action={demo.stage === 'S3' ? '请选择 1 条' : '当前：路线 A'} />
      <div className="route-list">{routes.map((route) => <button key={route.id} onClick={() => { setSelectedRoute(route.id); setRouteSheet(true) }} className={route.id === 'stem' && demo.stage === 'S4' ? 'is-current' : ''}><span className={`route-code route-code--${route.tone}`}>{route.code}</span><div><small>{route.fit}% 匹配</small><h3>{route.title}</h3><p>{route.subtitle}</p><div>{route.tags.map((tag) => <i key={tag}>{tag}</i>)}</div></div><ChevronRightIcon /></button>)}</div>
      <SectionTitle title="历史版本" action="全部" />
      <button className="history-row"><span><DocumentChartBarIcon /></span><div><b>成长洞察报告 V1</b><small>2026.08.15 · 当前执行版本</small></div><ChevronRightIcon /></button>
    </>}
    {routeSheet && selectedRoute && <Sheet title="确认成长路线" onClose={() => setRouteSheet(false)}><div className="route-confirm"><span className="route-code route-code--blue">{routes.find((r) => r.id === selectedRoute)?.code}</span><h2>{routes.find((r) => r.id === selectedRoute)?.title}</h2><p>{routes.find((r) => r.id === selectedRoute)?.subtitle}</p><div className="continuity-note"><ArrowPathMini /><span><b>进度连续性已保护</b><small>切换路线时，“书法专注练习”等相同任务将沿用历史进度；旧计划完整归档。</small></span></div><label className="confirm-check"><input type="checkbox" defaultChecked /><span><CheckIcon /></span>我已阅读路线说明，并确认立即生效</label><button className="button button--primary" onClick={confirm}>确认并生成计划</button></div></Sheet>}
  </div>
}

function ArrowPathMini() { return <span className="continuity-icon">↻</span> }

export function PlanPage() {
  const { demo, tasks } = useAppState()
  const [historyOpen, setHistoryOpen] = useState(false)
  const unlocked = demo.stage === 'S4'
  const grouped = useMemo(() => ({ morning: tasks.slice(0, 1), evening: tasks.slice(1) }), [tasks])
  return <div className="page">
    <PageTitle eyebrow="成长行动" title="计划" subtitle="把方向拆成今天可以完成的一小步。" />
    {!unlocked ? <LockedPreview type="计划" /> : <>
      <section className="plan-summary"><div><span className="eyebrow">报告 V1 · 路线 A</span><h2>科创探索路线</h2><p>第 2 周 · 建立稳定的探索节奏</p></div><button onClick={() => setHistoryOpen(true)}><ClockIcon />历史</button><div className="plan-summary__progress"><i style={{ width: '76%' }} /><span>本周完成 16/21</span><b>76%</b></div></section>
      <div className="date-strip">{[['一', '11'], ['二', '12'], ['三', '13'], ['四', '14'], ['五', '15'], ['六', '16'], ['日', '17']].map(([day, date]) => <button key={date} className={date === '15' ? 'is-active' : ''}><small>{day}</small><b>{date}</b>{['12', '13', '14'].includes(date) && <i />}</button>)}</div>
      <SectionTitle title="上午" action="1 项" />
      <div className="task-list">{grouped.morning.map((task) => <TaskCard task={task} key={task.id} />)}</div>
      <SectionTitle title="放学后" action="2 项" />
      <div className="task-list">{grouped.evening.map((task) => <TaskCard task={task} key={task.id} />)}</div>
      <button className="add-note"><PlusIcon /><span><b>补记或调整完成度</b><small>家长可补签，修改后以家长确认为准</small></span><ChevronRightIcon /></button>
      <section className="plan-rule"><SparklesIcon /><span><b>任务会按类型记录</b><small>时长、次数、是否完成、百分比与主观评分，由计划 JSON 配置；家长确认具有最终效力。</small></span></section>
    </>}
    {historyOpen && <Sheet title="历史计划" onClose={() => setHistoryOpen(false)}><div className="filter-pills"><button className="is-active">报告 V1</button><button>报告 V2</button><button>全部版本</button></div><div className="archive-list"><article><span>A</span><div><b>科创探索路线 · 第 2 周</b><small>当前执行 · 完成 76%</small></div><i>当前</i></article><article><span>B</span><div><b>综合素养路线 · 第 1 周</b><small>2026.08.08 归档 · 完成 64%</small></div><ChevronRightIcon /></article></div><div className="continuity-note"><ArrowPathMini /><span><b>3 项任务已延续进度</b><small>相同 continuityKey 的任务共享事实记录，但每个计划版本仍完整保留。</small></span></div></Sheet>}
  </div>
}

export function ProfilePage() {
  const { demo, logout } = useAppState()
  const child = children.find((item) => item.id === demo.childId) ?? children[0]
  return <div className="page profile-page">
    <PageTitle eyebrow="家庭中心" title="我的" subtitle="管理孩子、家庭关系与账号。" />
    <section className="profile-card"><span className="avatar avatar--large">林</span><div><h2>林女士</h2><p>138 **** 8000 · 妈妈</p><span><ShieldCheckIcon /> 家长主账号</span></div><button><PencilSquareIcon /></button></section>
    <SectionTitle title="孩子档案" action="2 位孩子" />
    <button className="child-profile-card"><span className="avatar">{child.initials.slice(0, 1)}</span><div><b>{child.name}</b><p>{child.age} 岁 · {child.grade}</p><small>{child.school}</small></div><ChevronRightIcon /></button>
    <div className="profile-grid"><button><UserPlusIcon /><span><b>邀请监护人</b><small>多人共同陪伴</small></span></button><button><ShareIcon /><span><b>邀请孩子</b><small>完成趣味测评</small></span></button></div>
    <SectionTitle title="成长档案" />
    <div className="menu-list">
      <MenuItem icon={AcademicCapIcon} title="孩子基础信息" detail="生日、学段、学校与地区" />
      <MenuItem icon={UserGroupIcon} title="家庭信息与家长期许" detail="家庭条件、陪伴方式与成长目标" />
      <MenuItem icon={ChartBarIcon} title="测评与 AI 成长画像" detail="天赋潜能、时代能力与变化记录" badge="7/9" />
    </div>
    <SectionTitle title="服务与账号" />
    <div className="menu-list">
      <MenuItem icon={ReceiptPercentIcon} title="订单与权益" detail="成长陪伴服务 · 使用中" badge="有效" />
      <MenuItem icon={BookOpenIcon} title="协议与隐私" detail="家庭数据与未成年人保护" />
      <MenuItem icon={Cog6ToothIcon} title="账号设置" detail="手机号、密码与消息通知" />
    </div>
    <button className="logout-button" onClick={logout}>退出登录</button>
    <p className="app-version">TeensAI Demo · v0.1.0</p>
  </div>
}

function MenuItem({ icon: Icon, title, detail, badge }: { icon: typeof AcademicCapIcon; title: string; detail: string; badge?: string }) {
  return <button><span className="menu-icon"><Icon /></span><span><b>{title}</b><small>{detail}</small></span>{badge && <i>{badge}</i>}<ChevronRightIcon /></button>
}

function LockedPreview({ type }: { type: '报告' | '计划' }) {
  const { demo, setTab } = useAppState()
  const descriptions = demo.stage === 'S0' ? '先为孩子建立档案，即可开始双端测评。' : demo.stage === 'S1' ? '完成家长调研与孩子趣味测评后解锁。' : demo.stage === 'PAYWALL' ? '权益生效并生成报告后解锁。' : 'AI 正在生成内容，完成后会自动解锁。'
  return <div className="locked-wrap"><section className="locked-card"><span className="lock-orb"><LockClosedIcon /></span><small>待解锁</small><h2>{type === '报告' ? '孩子的成长线索，正在汇聚' : '路线确认后，行动计划将在这里展开'}</h2><p>{descriptions}</p><button onClick={() => setTab('home')}>返回首页继续 <ArrowRightIcon /></button></section><div className="blur-preview">{[1, 2, 3].map((n) => <div key={n}><i /><span><b /><small /></span></div>)}</div></div>
}

function ProgressRing({ value, dark = false }: { value: number; dark?: boolean }) {
  return <div className={`progress-ring ${dark ? 'progress-ring--dark' : ''}`} style={{ '--progress': `${value * 3.6}deg` } as React.CSSProperties}><div><b>{value}</b><small>%</small></div></div>
}

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return <div className="section-title"><h2>{title}</h2>{action && <span>{action}</span>}</div>
}

function PageTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <div className="title-block"><span>{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div>
}
