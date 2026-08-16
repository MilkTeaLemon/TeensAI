import { useEffect, useRef, useState } from 'react'
import {
  ChartBarSquareIcon, ClipboardDocumentCheckIcon, HomeIcon, UserCircleIcon,
  ChevronDownIcon, PlusIcon, SparklesIcon, XMarkIcon, ArrowPathIcon,
  CheckIcon, BeakerIcon, CreditCardIcon,
} from '@heroicons/react/24/outline'
import { useAppState } from '../state'
import { children, entitlementLabels, stageLabels } from '../data'
import type { Entitlement, MainStage, MonthlyStage, TabKey } from '../types'
import { Brand } from './Brand'
import { HomePage, PlanPage, ProfilePage, ReportsPage } from './ParentPages'

const navItems: { key: TabKey; label: string; icon: typeof HomeIcon }[] = [
  { key: 'home', label: '首页', icon: HomeIcon },
  { key: 'reports', label: '报告', icon: ChartBarSquareIcon },
  { key: 'plan', label: '计划', icon: ClipboardDocumentCheckIcon },
  { key: 'profile', label: '我的', icon: UserCircleIcon },
]

export function ParentApp() {
  const { tab, setTab, demo, setDemo } = useAppState()
  const [childPicker, setChildPicker] = useState(false)
  const appRef = useRef<HTMLDivElement>(null)
  const child = children.find((item) => item.id === demo.childId) ?? children[0]

  useEffect(() => {
    appRef.current?.scrollTo({ top: 0 })
    window.scrollTo({ top: 0 })
  }, [tab])

  return (
    <main className="app-stage">
      <div className="mobile-app" ref={appRef}>
        <header className="app-header">
          <Brand compact />
          <button className="child-switcher" onClick={() => setChildPicker(true)}>
            <span className="avatar avatar--small">{child.initials.slice(0, 1)}</span>
            <b>{child.name}</b><ChevronDownIcon />
          </button>
        </header>
        <div className="app-content" key={tab}>
          {tab === 'home' && <HomePage />}
          {tab === 'reports' && <ReportsPage />}
          {tab === 'plan' && <PlanPage />}
          {tab === 'profile' && <ProfilePage />}
        </div>
        <nav className="bottom-nav">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button key={key} className={tab === key ? 'is-active' : ''} onClick={() => setTab(key)}>
              <Icon /><span>{label}</span>{key === 'home' && demo.monthly !== 'idle' && <i />}
            </button>
          ))}
        </nav>
      </div>
      <DemoController />
      {childPicker && <Sheet title="切换孩子" onClose={() => setChildPicker(false)}>
        <div className="child-list">
          {children.map((item) => <button key={item.id} className={item.id === child.id ? 'is-active' : ''} onClick={() => { setDemo({ childId: item.id }); setChildPicker(false) }}>
            <span className={`avatar ${item.id === 'lin' ? '' : 'avatar--mint'}`}>{item.initials.slice(0, 1)}</span>
            <span><b>{item.name}</b><small>{item.age} 岁 · {item.grade} · 测评 {item.assessment}%</small></span>
            {item.id === child.id && <CheckIcon />}
          </button>)}
          <button className="add-child"><span><PlusIcon /></span><b>添加孩子</b><small>创建档案或发送邀请</small></button>
        </div>
      </Sheet>}
    </main>
  )
}

function DemoController() {
  const { demo, setDemo, resetDemo } = useAppState()
  const [open, setOpen] = useState(false)
  const stages: MainStage[] = ['S0', 'S1', 'PAYWALL', 'S2', 'S3', 'S4']
  const monthly: { key: MonthlyStage; label: string }[] = [
    { key: 'idle', label: '常规执行' }, { key: 'feedback', label: '月度反馈' }, { key: 'iterating', label: 'AI 迭代中' }, { key: 'new-report', label: '新报告待确认' },
  ]
  const entitlements: Entitlement[] = ['unpaid', 'pending', 'failed', 'active', 'expired', 'refunding', 'refunded']
  return <>
    <button className="demo-fab" onClick={() => setOpen(!open)} aria-label="打开演示控制器"><BeakerIcon /><span>演示</span></button>
    {open && <div className="demo-panel">
      <div className="demo-panel__head"><span><SparklesIcon /><b>演示控制器</b></span><button onClick={() => setOpen(false)}><XMarkIcon /></button></div>
      <p>即时切换业务状态，便于走查交互。</p>
      <label>主流程状态</label>
      <div className="demo-grid demo-grid--3">{stages.map((stage) => <button className={demo.stage === stage ? 'is-active' : ''} onClick={() => setDemo({ stage })} key={stage}><b>{stage}</b><small>{stageLabels[stage]}</small></button>)}</div>
      <label>月度循环（不打断执行）</label>
      <div className="demo-grid demo-grid--2">{monthly.map(({ key, label }) => <button className={demo.monthly === key ? 'is-active' : ''} onClick={() => setDemo({ monthly: key, stage: key === 'idle' ? demo.stage : 'S4' })} key={key}>{label}</button>)}</div>
      <label>权益状态</label>
      <select value={demo.entitlement} onChange={(e) => setDemo({ entitlement: e.target.value as Entitlement })}>{entitlements.map((item) => <option key={item} value={item}>{entitlementLabels[item]}</option>)}</select>
      <div className="demo-panel__footer"><button onClick={resetDemo}><ArrowPathIcon />重置演示</button><span>数据仅保存在本机</span></div>
    </div>}
  </>
}

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="sheet-layer" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="sheet"><div className="sheet__handle" /><header><h2>{title}</h2><button onClick={onClose}><XMarkIcon /></button></header>{children}</section></div>
}

export function PaymentSheet({ onClose }: { onClose: () => void }) {
  const { setDemo } = useAppState()
  const [selected, setSelected] = useState('first')
  const [step, setStep] = useState<'products' | 'order' | 'result'>('products')
  const [result, setResult] = useState<'success' | 'failed' | 'cancelled'>('success')
  const packages = [
    { id: 'first', name: '首次成长报告', price: '199', note: '报告 V1 · 双路线 · 4 周计划', badge: '推荐体验' },
    { id: 'season', name: '成长陪伴季卡', price: '599', note: '3 次月度迭代 · 周计划滚动更新', badge: '家庭常选' },
    { id: 'year', name: '年度成长会员', price: '1,699', note: '12 次迭代 · 完整成长档案', badge: '长期陪伴' },
  ]
  const current = packages.find((item) => item.id === selected) ?? packages[0]
  const finish = () => {
    const entitlement = result === 'success' ? 'active' : result === 'failed' ? 'failed' : 'unpaid'
    setDemo({ entitlement, stage: result === 'success' ? 'S2' : 'PAYWALL' })
    onClose()
  }
  if (step === 'result') return <Sheet title="支付结果" onClose={onClose}><div className={`payment-result payment-result--${result}`}><span>{result === 'success' ? <CheckIcon /> : <XMarkIcon />}</span><h2>{result === 'success' ? '支付成功' : result === 'failed' ? '支付未完成' : '已取消支付'}</h2><p>{result === 'success' ? '成长服务已生效，即将开始生成报告。' : result === 'failed' ? '本次为演示失败结果，你可以返回重新选择。' : '订单已保留，可稍后在“我的－订单与权益”继续。'}</p><div><small>订单编号</small><b>TA202608150018</b></div><button className="button button--primary" onClick={finish}>{result === 'success' ? '开始生成报告' : '返回首页'}</button></div></Sheet>
  if (step === 'order') return <Sheet title="确认订单" onClose={onClose}><div className="order-card"><span className="order-brand">TeensAI Growth</span><h3>{current.name}</h3><p>{current.note}</p><dl><div><dt>服务对象</dt><dd>林小满</dd></div><div><dt>生效方式</dt><dd>支付后立即生效</dd></div><div><dt>商品金额</dt><dd>¥ {current.price}</dd></div><div><dt>优惠</dt><dd>¥ 0</dd></div></dl><div className="order-total"><span>应付</span><b>¥ {current.price}</b></div></div><label className="confirm-check"><input type="checkbox" defaultChecked /><span><CheckIcon /></span>已阅读并同意《成长服务协议》</label><button className="button button--primary" onClick={() => { setResult('success'); setStep('result') }}><CreditCardIcon /> 确认支付</button><div className="payment-test"><button onClick={() => { setResult('failed'); setStep('result') }}>模拟失败</button><button onClick={() => { setResult('cancelled'); setStep('result') }}>模拟取消</button></div></Sheet>
  return <Sheet title="选择成长服务" onClose={onClose}>
    <div className="package-list">{packages.map((item) => <button key={item.id} className={selected === item.id ? 'is-active' : ''} onClick={() => setSelected(item.id)}>
      <span className="package-badge">{item.badge}</span><b>{item.name}</b><strong><small>¥</small>{item.price}</strong><p>{item.note}</p><i>{selected === item.id && <CheckIcon />}</i>
    </button>)}</div>
    <div className="payment-summary"><span>应付金额</span><b>¥ {current.price}</b></div>
    <button className="button button--primary" onClick={() => { setDemo({ entitlement: 'pending' }); setStep('order') }}>下一步：确认订单</button>
    <p className="fine-print">演示商品与价格仅用于原型走查，不产生真实交易。</p>
  </Sheet>
}
