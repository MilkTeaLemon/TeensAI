import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeftIcon, ArrowRightIcon, BeakerIcon, BellIcon, BoltIcon, BookOpenIcon,
  CalendarDaysIcon, ChartBarIcon, CheckCircleIcon, CheckIcon, ChevronRightIcon,
  ClockIcon, Cog6ToothIcon, FireIcon, FlagIcon, GlobeAltIcon, HeartIcon,
  HomeModernIcon, LinkIcon, LockClosedIcon, MagnifyingGlassIcon, MapIcon,
  MusicalNoteIcon, PaintBrushIcon, PaperAirplaneIcon, PencilSquareIcon,
  PuzzlePieceIcon, RocketLaunchIcon, ShieldCheckIcon, SparklesIcon, StarIcon,
  TrophyIcon, UserGroupIcon, UserIcon, XMarkIcon,
} from '@heroicons/react/24/outline'
import { Brand } from './Brand'
import { useAppState } from '../state'
import { childAssessments, childTraits, defaultAssessmentProgress } from '../childData'
import type {
  AgeBand, AssessmentDefinition, AssessmentKey, AssessmentOption,
  ChildFeedbackState, ChildPlanState, ChildPrototypeState, ChildTab,
  GuardianLinkState,
} from '../childTypes'

const defaultChildState: ChildPrototypeState = {
  linkState: 'unbound',
  assessments: defaultAssessmentProgress,
  planState: 'locked',
  feedbackState: 'locked',
  ageBand: '9-12',
  streak: 6,
  badges: ['first-step', 'steady-week'],
}

const childNav = [
  { key: 'plan' as const, label: '计划', icon: CalendarDaysIcon },
  { key: 'assessment' as const, label: '测评', icon: MapIcon },
  { key: 'feedback' as const, label: '反馈', icon: PaperAirplaneIcon },
  { key: 'profile' as const, label: '我的', icon: UserIcon },
]

export function ChildApp() {
  const { logout } = useAppState()
  const [tab, setTab] = useState<ChildTab>('plan')
  const [state, setState] = useState<ChildPrototypeState>(() => {
    const saved = localStorage.getItem('teensai-child-demo')
    return saved ? { ...defaultChildState, ...JSON.parse(saved) } : defaultChildState
  })
  const [runner, setRunner] = useState<AssessmentKey | null>(null)
  const [bindOpen, setBindOpen] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const appRef = useRef<HTMLDivElement>(null)

  useEffect(() => localStorage.setItem('teensai-child-demo', JSON.stringify(state)), [state])
  useEffect(() => {
    appRef.current?.scrollTo({ top: 0 })
    window.scrollTo({ top: 0 })
  }, [tab])

  const completedCount = Object.values(state.assessments).filter((item) => item.status === 'completed').length
  const updateState = (next: Partial<ChildPrototypeState>) => setState((current) => ({ ...current, ...next }))
  const updateAssessment = (key: AssessmentKey, answered: number, completed = false) => {
    setState((current) => {
      const assessments = { ...current.assessments, [key]: { status: completed ? 'completed' as const : 'in_progress' as const, answered } }
      const allComplete = Object.values(assessments).every((item) => item.status === 'completed')
      return { ...current, assessments, planState: allComplete && current.planState === 'locked' ? 'waiting_report' : current.planState }
    })
  }
  const reset = () => { setState(defaultChildState); setTab('plan'); setRunner(null); localStorage.removeItem('teensai-child-demo') }

  if (runner) {
    const definition = childAssessments.find((item) => item.key === runner)!
    return <main className="app-stage"><div className="mobile-app kid-app kid-app--runner"><AssessmentRunner definition={definition} state={state} onBack={() => setRunner(null)} onProgress={(answered) => updateAssessment(runner, answered)} onComplete={() => updateAssessment(runner, definition.questions.length, true)} onRequireBind={() => setBindOpen(true)} />{bindOpen && <BindFlow state={state.linkState} onState={(linkState) => updateState({ linkState })} onClose={() => setBindOpen(false)} />}</div></main>
  }

  return <main className="app-stage">
    <div className="mobile-app kid-app" ref={appRef}>
      <header className="kid-header"><Brand compact /><div><button className="kid-bell"><BellIcon /><i /></button><button className="kid-avatar" onClick={() => setTab('profile')}>满</button></div></header>
      <div className="kid-content" key={tab}>
        {tab === 'plan' && <KidPlanPage state={state} completedCount={completedCount} onBind={() => setBindOpen(true)} onAssessment={() => setTab('assessment')} />}
        {tab === 'assessment' && <KidAssessmentPage state={state} onStart={(key) => setRunner(key)} />}
        {tab === 'feedback' && <KidFeedbackPage state={state} onState={(feedbackState) => updateState({ feedbackState })} />}
        {tab === 'profile' && <KidProfilePage state={state} completedCount={completedCount} onBind={() => setBindOpen(true)} onLogout={logout} />}
      </div>
      <nav className="kid-nav">{childNav.map(({ key, label, icon: Icon }) => <button key={key} className={tab === key ? 'is-active' : ''} onClick={() => setTab(key)}><Icon /><span>{label}</span>{key === 'feedback' && state.feedbackState === 'open' && <i />}</button>)}</nav>
    </div>
    <button className="kid-demo-fab" onClick={() => setDemoOpen(!demoOpen)}><BeakerIcon /><span>孩子端演示</span></button>
    {demoOpen && <KidDemoPanel state={state} onState={updateState} onReset={reset} onClose={() => setDemoOpen(false)} />}
    {bindOpen && <BindFlow state={state.linkState} onState={(linkState) => updateState({ linkState })} onClose={() => setBindOpen(false)} />}
  </main>
}

function KidPlanPage({ state, completedCount, onBind, onAssessment }: { state: ChildPrototypeState; completedCount: number; onBind: () => void; onAssessment: () => void }) {
  if (state.linkState !== 'bound') return <div className="kid-page"><KidGreeting eyebrow="成长星图尚未连接" /><section className="kid-onboard-hero"><PlanetArt variant="orbit" /><span>第一站</span><h1>连接你的<br />家庭探索队</h1><p>输入家长分享的邀请码，正式保存探索记录。你也可以先去测评页试玩 2 题。</p><button onClick={onBind}>绑定家长 <ArrowRightIcon /></button></section><KidJourneySteps active={0} /></div>
  if (completedCount < 4) return <div className="kid-page"><KidGreeting eyebrow="今日探索任务" /><section className="kid-plan-intro"><div><span>测评进度</span><h1>还差 {4 - completedCount} 颗星球</h1><p>自由选择探索顺序，全部完成后解锁特质标签库。</p></div><Ring value={completedCount * 25} /></section><div className="kid-section-head"><h2>继续探索</h2><span>{completedCount}/4 已完成</span></div><div className="kid-mission-list">{childAssessments.filter((item) => state.assessments[item.key].status !== 'completed').slice(0, 2).map((item, index) => <button key={item.key} onClick={onAssessment} className={`kid-mission kid-theme--${item.color}`}><span className="kid-mission__index">0{index + 1}</span><div><small>{item.planet} · {item.duration}</small><h3>{item.title}</h3><p>{state.assessments[item.key].status === 'in_progress' ? `已探索 ${state.assessments[item.key].answered}/5` : item.subtitle}</p></div><ArrowRightIcon /></button>)}</div><KidJourneySteps active={1} /></div>
  if (state.planState === 'waiting_report' || state.planState === 'locked') return <div className="kid-page"><KidGreeting eyebrow="四颗星球探索完成" /><section className="kid-wait-card"><div className="kid-scan"><SparklesIcon /><i /><i /></div><span>成长线索汇聚中</span><h1>AI 正在绘制<br />你的成长星图</h1><p>家长的家庭调研完成后，会一起生成成长报告。</p><div><i style={{ width: '64%' }} /></div><small>你可以离开此页面，完成后会通知你</small></section><KidJourneySteps active={2} /></div>
  if (state.planState === 'waiting_route') return <div className="kid-page"><KidGreeting eyebrow="成长报告已经到达" /><section className="kid-route-wait"><PlanetArt variant="route" /><span>等待家庭探索队</span><h1>下一段旅程<br />正在选择中</h1><p>家长会从两条成长路线中确认一个方向。确认后，你的第一周任务会出现在这里。</p><div className="kid-route-lines"><i /><i /></div></section><KidJourneySteps active={3} /></div>
  return <ActiveKidPlan state={state} />
}

function ActiveKidPlan({ state }: { state: ChildPrototypeState }) {
  const [done, setDone] = useState<string[]>(['logic'])
  const tasks = [
    { id: 'focus', title: '书法专注练习', meta: '专注力 · 30 分钟', icon: PencilSquareIcon, tone: 'violet' },
    { id: 'logic', title: '完成一道逻辑挑战', meta: '科创思维 · 1 题', icon: PuzzlePieceIcon, tone: 'cyan' },
    { id: 'read', title: '亲子共读与讨论', meta: '家庭关系 · 20 分钟', icon: BookOpenIcon, tone: 'amber' },
  ]
  return <div className="kid-page"><KidGreeting eyebrow="8 月 16 日 · 星期日" />{state.planState === 'refreshing' && <div className="kid-refresh-banner"><SparklesIcon /><span><b>新的成长方案正在准备</b><small>当前计划继续执行，不会被打断</small></span><i>V2</i></div>}<section className="kid-today"><div className="kid-today__orbit"><i /><RocketLaunchIcon /></div><small>今日航行计划</small><h1>{tasks.length - done.length} 项任务<br />等待完成</h1><p>预计还需 35 分钟 · 连续完成 {state.streak} 天</p><div className="kid-energy"><span><FireIcon /> 今日能量</span><b>{Math.round(done.length / tasks.length * 100)}%</b><div><i style={{ width: `${done.length / tasks.length * 100}%` }} /></div></div></section><div className="kid-section-head"><h2>今日任务</h2><span>{done.length}/{tasks.length} 完成</span></div><div className="kid-task-list">{tasks.map(({ id, title, meta, icon: Icon, tone }) => { const complete = done.includes(id); return <button key={id} className={complete ? 'is-done' : ''} onClick={() => setDone((items) => complete ? items.filter((item) => item !== id) : [...items, id])}><span className={`kid-task-icon kid-task-icon--${tone}`}><Icon /></span><span><b>{title}</b><small>{meta}</small></span><i>{complete && <CheckIcon />}</i></button> })}</div><section className="kid-week-flight"><div><span>本周航行</span><b>76%</b></div><div className="kid-week-dots">{['一', '二', '三', '四', '五', '六', '日'].map((day, index) => <span key={day} className={index < 5 ? 'is-done' : index === 5 ? 'is-today' : ''}><i>{index < 5 && <CheckIcon />}</i><small>{day}</small></span>)}</div></section></div>
}

function KidAssessmentPage({ state, onStart }: { state: ChildPrototypeState; onStart: (key: AssessmentKey) => void }) {
  const completed = Object.values(state.assessments).filter((item) => item.status === 'completed').length
  const allComplete = completed === 4
  return <div className="kid-page"><div className="kid-page-title"><span>自我探索</span><h1>测评星系</h1><p>没有标准答案，只选择最像你的真实反应。</p></div><section className={`kid-tag-vault ${allComplete ? 'is-unlocked' : ''}`}><div><span>{allComplete ? <SparklesIcon /> : <LockClosedIcon />}</span><div><small>MY TRAIT ATLAS</small><h2>{allComplete ? '特质星图已解锁' : '完整特质星图'}</h2><p>{allComplete ? '8 枚特质标签等待查看' : `完成四颗星球后解锁 · ${completed}/4`}</p></div></div>{allComplete ? <div className="kid-mini-tags">{childTraits.slice(0, 4).map((tag) => <i key={tag.id}>{tag.name}</i>)}</div> : <div className="kid-vault-progress"><i style={{ width: `${completed * 25}%` }} /></div>}</section><div className="kid-section-head"><h2>自由选择目的地</h2><span>{completed}/4</span></div><div className="kid-planet-grid">{childAssessments.map((assessment) => { const progress = state.assessments[assessment.key]; return <button key={assessment.key} className={`kid-planet-card kid-theme--${assessment.color}`} onClick={() => onStart(assessment.key)}><div className="kid-planet-card__art"><PlanetArt variant={assessment.key} /></div><span>{assessment.code}</span><small>{assessment.planet}</small><h3>{assessment.title}</h3><p>{assessment.subtitle}</p><div className="kid-planet-status">{progress.status === 'completed' ? <><CheckCircleIcon /> 已完成</> : progress.status === 'in_progress' ? <><ClockIcon /> 继续 {progress.answered}/5</> : <><RocketLaunchIcon /> 开始探索</>}</div></button> })}</div><p className="kid-safe-copy"><ShieldCheckIcon /> 测评只用于成长参考，不构成心理或医学诊断</p></div>
}

function AssessmentRunner({ definition, state, onBack, onProgress, onComplete, onRequireBind }: { definition: AssessmentDefinition; state: ChildPrototypeState; onBack: () => void; onProgress: (answered: number) => void; onComplete: () => void; onRequireBind: () => void }) {
  const initial = Math.min(state.assessments[definition.key].answered, definition.questions.length - 1)
  const [index, setIndex] = useState(initial)
  const [selected, setSelected] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const question = definition.questions[index]
  const allOthersComplete = childAssessments.every((item) => item.key === definition.key || state.assessments[item.key].status === 'completed')
  const next = () => {
    if (!selected) return
    const answered = index + 1
    onProgress(answered)
    if (state.linkState !== 'bound' && answered >= 2 && index < definition.questions.length - 1) { onRequireBind(); return }
    if (index === definition.questions.length - 1) { if (state.linkState !== 'bound') { onRequireBind(); return }; onComplete(); setFinished(true); return }
    setIndex(index + 1); setSelected(null)
  }
  if (finished) return <div className={`kid-assessment-done kid-theme--${definition.color}`}><div className="kid-complete-planet"><CheckIcon /><i /><i /></div><span>{definition.planet} · 探索完成</span><h1>{allOthersComplete ? '四颗星球，全部抵达' : '又了解了自己一点'}</h1><p>{allOthersComplete ? '完整特质星图已经解锁，回到测评页查看属于你的标签。' : '你的选择已经安全保存。完整标签将在四套测评全部完成后一起解锁。'}</p><button onClick={onBack}>{allOthersComplete ? '查看特质星图' : '返回测评星系'} <ArrowRightIcon /></button></div>
  return <div className={`kid-runner kid-theme--${definition.color}`}><header><button onClick={onBack}><ArrowLeftIcon /></button><div><small>{definition.planet}</small><b>{index + 1} / {definition.questions.length}</b></div><button aria-label="退出" onClick={onBack}><XMarkIcon /></button></header><div className="kid-runner-progress"><i style={{ width: `${(index + 1) / definition.questions.length * 100}%` }} /></div><section className="kid-question-scene"><span>SCENE {String(index + 1).padStart(2, '0')}</span><div className="kid-scene-art"><PlanetArt variant={definition.key} /><i /><i /></div><p>{question.scene}</p><h1>{question.prompt}</h1><small>{question.hint}</small></section><div className="kid-option-list">{question.options.map((option) => <button key={option.id} className={selected === option.id ? 'is-selected' : ''} onClick={() => setSelected(option.id)}><OptionVisual option={option} /><span><b>{option.title}</b><small>{option.description}</small></span><i>{selected === option.id && <CheckIcon />}</i></button>)}</div><button className="kid-next" disabled={!selected} onClick={next}>{index === definition.questions.length - 1 ? '完成探索' : '前往下一幕'} <ArrowRightIcon /></button>{state.linkState !== 'bound' && <p className="kid-trial-note"><LockClosedIcon /> 未绑定状态可试玩前 2 题</p>}</div>
}

function KidFeedbackPage({ state, onState }: { state: ChildPrototypeState; onState: (next: ChildFeedbackState) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const questions = [
    { id: 'mood', title: '这个月的整体感受', options: ['晴朗有能量', '平稳普通', '有些疲惫', '变化很多'] },
    { id: 'task', title: '现在的任务难度', options: ['想再挑战一点', '刚刚好', '有一点难'] },
    { id: 'interest', title: '最想保留的成长体验', options: ['动手创造', '安静练习', '和伙伴合作', '自由探索'] },
  ]
  if (state.feedbackState === 'locked') return <div className="kid-page"><div className="kid-page-title"><span>月度回望</span><h1>反馈</h1><p>每个月，用几分钟记录真实的感受。</p></div><section className="kid-feedback-locked"><PlanetArt variant="feedback" /><span><LockClosedIcon /></span><h2>下一次反馈将在<br />9 月 15 日开放</h2><p>你的日常任务和打卡数据会自动保存，不需要额外记录。</p><div><ClockIcon />还有 30 天</div></section><section className="kid-feedback-why"><SparklesIcon /><span><b>为什么需要反馈？</b><small>你的感受会帮助 AI 调整任务难度和兴趣优先级，但不会单独形成诊断结论。</small></span></section></div>
  if (['submitted', 'iterating', 'archived'].includes(state.feedbackState)) return <div className="kid-page"><div className="kid-page-title"><span>月度回望</span><h1>反馈</h1><p>本期回答已提交，原始内容不可修改。</p></div><section className="kid-feedback-receipt"><span><CheckCircleIcon /></span><small>2026 年 8 月反馈</small><h2>{state.feedbackState === 'iterating' ? 'AI 正在理解这个月' : '谢谢你的真实表达'}</h2><p>{state.feedbackState === 'iterating' ? '当前计划会继续执行。家长反馈和行为数据到齐后，将生成新的成长方案。' : '你的反馈已安全保存，家长只能确认和追加自己的观察。'}</p><div className="kid-receipt-answers">{['整体感受：平稳普通', '任务难度：刚刚好', '最喜欢：动手创造'].map((item) => <span key={item}>{item}</span>)}</div></section><div className="kid-feedback-timeline"><div className="is-done"><i><CheckIcon /></i><span><b>孩子反馈</b><small>已提交</small></span></div><div className={state.feedbackState === 'iterating' ? 'is-active' : 'is-done'}><i>{state.feedbackState !== 'submitted' && <CheckIcon />}</i><span><b>家庭反馈汇总</b><small>{state.feedbackState === 'submitted' ? '等待家长确认' : '数据已齐'}</small></span></div><div className={state.feedbackState === 'iterating' ? 'is-active' : ''}><i><SparklesIcon /></i><span><b>成长方案迭代</b><small>{state.feedbackState === 'iterating' ? '进行中' : '尚未开始'}</small></span></div></div></div>
  return <div className="kid-page"><div className="kid-page-title"><span>本月反馈已开放</span><h1>三分钟回望</h1><p>选最接近真实感受的答案，不需要迎合任何人。</p></div><div className="kid-feedback-form">{questions.map((question, index) => <section key={question.id}><small>0{index + 1}</small><h2>{question.title}</h2><div>{question.options.map((option) => <button key={option} className={answers[question.id] === option ? 'is-selected' : ''} onClick={() => { setAnswers((current) => ({ ...current, [question.id]: option })); onState('draft') }}>{option}{answers[question.id] === option && <CheckIcon />}</button>)}</div></section>)}</div><label className="kid-feedback-note"><span>还想说些什么？（可选）</span><textarea placeholder="例如：我希望下个月有更多动手任务……" /></label><button className="kid-submit-feedback" disabled={Object.keys(answers).length < 3} onClick={() => onState('submitted')}>确认提交 <ArrowRightIcon /></button><p className="kid-readonly-hint"><ShieldCheckIcon />提交后家长不能修改你的原始回答</p></div>
}

function KidProfilePage({ state, completedCount, onBind, onLogout }: { state: ChildPrototypeState; completedCount: number; onBind: () => void; onLogout: () => void }) {
  const unlocked = completedCount === 4
  return <div className="kid-page"><div className="kid-profile-hero"><div className="kid-profile-avatar">满<i /></div><span>探索者 ID · TA-0815</span><h1>林小满</h1><p>11 岁 · 五年级 · {state.ageBand} 岁内容模式</p><div><span><FireIcon /><b>{state.streak}</b><small>连续天数</small></span><span><TrophyIcon /><b>{state.badges.length}</b><small>获得徽章</small></span><span><GlobeAltIcon /><b>{completedCount}</b><small>抵达星球</small></span></div></div><div className="kid-section-head"><h2>我的特质星图</h2><span>{unlocked ? '8 枚标签' : `${completedCount}/4`}</span></div>{unlocked ? <div className="kid-trait-cloud">{childTraits.map((trait, index) => <span key={trait.id} className={`kid-trait--${trait.color}`}><StarIcon />{trait.name}<small>0{index + 1}</small></span>)}</div> : <button className="kid-traits-locked"><LockClosedIcon /><span><b>完整标签尚未解锁</b><small>完成四套测评后，一次性认识你的优势、节奏、兴趣和动力。</small></span><ChevronRightIcon /></button>}<div className="kid-section-head"><h2>探索徽章</h2><span>查看全部</span></div><div className="kid-badge-row"><article><span><RocketLaunchIcon /></span><b>第一步</b><small>开始自我探索</small></article><article><span><FireIcon /></span><b>稳定航行</b><small>连续完成 5 天</small></article><article className={unlocked ? '' : 'is-locked'}><span>{unlocked ? <SparklesIcon /> : <LockClosedIcon />}</span><b>星图收藏家</b><small>完成四套测评</small></article></div><div className="kid-section-head"><h2>家庭探索队</h2></div>{state.linkState === 'bound' ? <button className="kid-family-card"><span className="kid-family-avatar">林</span><span><b>已连接林女士</b><small>妈妈 · 家长主账号</small></span><ShieldCheckIcon /></button> : <button className="kid-family-card kid-family-card--empty" onClick={onBind}><LinkIcon /><span><b>{state.linkState === 'pending' ? '等待家长确认' : '绑定家长账号'}</b><small>{state.linkState === 'pending' ? '邀请码已发送' : '输入六位邀请码建立连接'}</small></span><ChevronRightIcon /></button>}<div className="kid-settings"><button><Cog6ToothIcon /><span><b>账号设置</b><small>头像、昵称与消息提醒</small></span><ChevronRightIcon /></button><button><ShieldCheckIcon /><span><b>隐私与成长数据</b><small>了解数据怎样被使用</small></span><ChevronRightIcon /></button></div><button className="kid-logout" onClick={onLogout}>退出登录</button><p className="kid-version">TeensAI Child · Prototype 0.2</p></div>
}

function BindFlow({ state, onState, onClose }: { state: GuardianLinkState; onState: (state: GuardianLinkState) => void; onClose: () => void }) {
  const [code, setCode] = useState('482916')
  const pending = state === 'pending'
  return <div className="sheet-layer"><section className="sheet kid-bind-sheet"><div className="sheet__handle" /><header><h2>{pending ? '等待家长确认' : '连接家庭探索队'}</h2><button onClick={onClose}><XMarkIcon /></button></header>{pending ? <div className="kid-bind-pending"><div><PaperAirplaneIcon /><i /><i /></div><h3>邀请已经发送</h3><p>家长确认后，你的测评进度和计划会连接到家庭账号。</p><span>林女士 · 138 **** 8000</span><button className="button button--primary" onClick={() => { onState('bound'); onClose() }}>演示：家长已确认</button><button className="button button--text" onClick={() => onState('unbound')}>重新输入邀请码</button></div> : <><div className="kid-bind-visual"><UserGroupIcon /><span><b>和家长一起守护成长数据</b><small>家长看不到你的密码，也不能修改你提交后的月度反馈。</small></span></div><label className="kid-code-field"><span>六位家庭邀请码</span><input value={code} maxLength={6} inputMode="numeric" onChange={(event) => setCode(event.target.value)} /></label><p className="kid-demo-code">演示邀请码：482916</p><button className="button button--primary" disabled={code.length !== 6} onClick={() => onState('pending')}>发送绑定申请</button><p className="fine-print"><ShieldCheckIcon />正式保存和提交测评前必须完成监护绑定</p></>}</section></div>
}

function KidDemoPanel({ state, onState, onReset, onClose }: { state: ChildPrototypeState; onState: (next: Partial<ChildPrototypeState>) => void; onReset: () => void; onClose: () => void }) {
  const linkStates: GuardianLinkState[] = ['unbound', 'pending', 'bound']
  const planStates: ChildPlanState[] = ['locked', 'waiting_report', 'waiting_route', 'active', 'refreshing']
  const feedbackStates: ChildFeedbackState[] = ['locked', 'open', 'draft', 'submitted', 'iterating', 'archived']
  const allCompleted = () => onState({ assessments: Object.fromEntries(childAssessments.map((item) => [item.key, { status: 'completed', answered: 5 }])) as ChildPrototypeState['assessments'], linkState: 'bound', planState: 'waiting_report' })
  return <div className="kid-demo-panel"><header><span><BeakerIcon /><b>孩子端演示控制器</b></span><button onClick={onClose}><XMarkIcon /></button></header><p>状态轴彼此独立，可组合走查。</p><label>家长绑定</label><div className="kid-demo-grid kid-demo-grid--3">{linkStates.map((item) => <button key={item} className={state.linkState === item ? 'is-active' : ''} onClick={() => onState({ linkState: item })}>{({ unbound: '未绑定', pending: '待确认', bound: '已绑定' } as const)[item]}</button>)}</div><label>测评状态</label><div className="kid-demo-grid kid-demo-grid--2"><button onClick={() => onState({ assessments: defaultAssessmentProgress, planState: 'locked' })}>全部重置</button><button onClick={allCompleted}>四套完成</button></div><label>计划状态</label><select value={state.planState} onChange={(event) => onState({ planState: event.target.value as ChildPlanState })}>{planStates.map((item) => <option key={item} value={item}>{({ locked: '未解锁', waiting_report: '等待报告', waiting_route: '等待家长选路线', active: '计划执行中', refreshing: '月度更新中' } as const)[item]}</option>)}</select><label>反馈状态</label><select value={state.feedbackState} onChange={(event) => onState({ feedbackState: event.target.value as ChildFeedbackState })}>{feedbackStates.map((item) => <option key={item} value={item}>{({ locked: '未开放', open: '已开放', draft: '填写中', submitted: '已提交', iterating: 'AI 迭代中', archived: '已归档' } as const)[item]}</option>)}</select><label>年龄内容模式</label><div className="kid-demo-grid kid-demo-grid--4">{(['6-8', '9-12', '13-15', '16-18'] as AgeBand[]).map((item) => <button key={item} className={state.ageBand === item ? 'is-active' : ''} onClick={() => onState({ ageBand: item })}>{item}</button>)}</div><footer><button onClick={onReset}>重置全部演示数据</button><span>localStorage</span></footer></div>
}

function KidGreeting({ eyebrow }: { eyebrow: string }) { return <div className="kid-greeting"><div><span>{eyebrow}</span><h2>你好，林小满</h2></div><i><SparklesIcon /></i></div> }

function KidJourneySteps({ active }: { active: number }) { return <section className="kid-journey"><div className="kid-section-head"><h2>成长旅程</h2><span>你的进度</span></div><div>{['连接家庭', '探索自己', '生成星图', '开始计划'].map((label, index) => <span key={label} className={index < active ? 'is-done' : index === active ? 'is-active' : ''}><i>{index < active ? <CheckIcon /> : index + 1}</i><small>{label}</small></span>)}</div></section> }

function Ring({ value }: { value: number }) { return <div className="kid-ring" style={{ '--kid-progress': `${value * 3.6}deg` } as React.CSSProperties}><span><b>{value}</b><small>%</small></span></div> }

function PlanetArt({ variant }: { variant: AssessmentKey | 'orbit' | 'route' | 'feedback' }) { return <div className={`kid-planet-art kid-planet-art--${variant}`}><span /><i /><i /><em /></div> }

function OptionVisual({ option }: { option: AssessmentOption }) {
  const icons = { build: HomeModernIcon, observe: MagnifyingGlassIcon, story: BookOpenIcon, move: BoltIcon, solo: StarIcon, team: UserGroupIcon, calm: HeartIcon, speak: PaperAirplaneIcon, science: BeakerIcon, art: PaintBrushIcon, nature: GlobeAltIcon, language: MusicalNoteIcon, create: SparklesIcon, help: HeartIcon, explore: RocketLaunchIcon, lead: FlagIcon }
  const Icon = icons[option.visual]
  return <span className={`kid-option-visual kid-option-visual--${option.visual}`}><Icon /><i /></span>
}
