import { useState } from 'react'
import {
  ArrowLeftIcon, ArrowRightIcon, ChatBubbleOvalLeftEllipsisIcon,
  CheckCircleIcon, DevicePhoneMobileIcon, EyeIcon, EyeSlashIcon,
  LockClosedIcon, ShieldCheckIcon, UserIcon,
} from '@heroicons/react/24/outline'
import type { Role } from '../types'
import { useAppState } from '../state'
import { Brand } from './Brand'

type Method = 'wechat' | 'sms' | 'password'
type AuthView = 'login' | 'register' | 'forgot' | 'bind' | 'wechat-confirm'

export function AuthFlow() {
  const { login } = useAppState()
  const [role, setRole] = useState<Role>('parent')
  const [method, setMethod] = useState<Method>('wechat')
  const [view, setView] = useState<AuthView>('login')
  const [phone, setPhone] = useState('13800138000')
  const [code, setCode] = useState('123456')
  const [password, setPassword] = useState('TeensAI123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const verifyAndLogin = () => {
    if ((method === 'sms' || view !== 'login') && code !== '123456') {
      setError('演示验证码为 123456')
      return
    }
    setError('')
    login(role, phone)
  }

  if (view === 'wechat-confirm') {
    return <AuthCanvas><StepHeader onBack={() => setView('login')} title="微信授权" />
      <div className="auth__body auth__body--center">
        <div className="wechat-orb"><ChatBubbleOvalLeftEllipsisIcon /></div>
        <h1>允许 TeensAI 登录</h1>
        <p className="body-copy">将获取你的公开昵称与头像，用于创建成长教练账号。</p>
        <div className="consent-card">
          <span className="avatar avatar--mini">林</span>
          <span><b>微信用户 · 林女士</b><small>模拟微信授权信息</small></span>
          <CheckCircleIcon />
        </div>
        <button className="button button--primary" onClick={() => setView('bind')}>同意并继续</button>
        <button className="button button--text" onClick={() => setView('login')}>暂不授权</button>
      </div>
    </AuthCanvas>
  }

  if (view === 'bind') {
    return <AuthCanvas><StepHeader onBack={() => setView('wechat-confirm')} title="绑定手机号" />
      <div className="auth__body">
        <div className="step-number">01</div>
        <h1>完善登录信息</h1>
        <p className="body-copy">首次微信授权需绑定手机号，并确认本次登录身份。</p>
        <PhoneField phone={phone} setPhone={setPhone} />
        <CodeField code={code} setCode={setCode} />
        <RolePicker value={role} onChange={setRole} compact />
        {error && <p className="form-error">{error}</p>}
        <button className="button button--primary" onClick={verifyAndLogin}>确认绑定并登录</button>
        <p className="fine-print"><ShieldCheckIcon /> 仅用于登录和重要成长通知</p>
      </div>
    </AuthCanvas>
  }

  if (view === 'forgot' || view === 'register') {
    const isRegister = view === 'register'
    return <AuthCanvas><StepHeader onBack={() => setView('login')} title={isRegister ? '创建账号' : '找回密码'} />
      <div className="auth__body">
        <div className="step-number">{isRegister ? 'NEW' : 'RESET'}</div>
        <h1>{isRegister ? '加入 TeensAI' : '重新设置密码'}</h1>
        <p className="body-copy">{isRegister ? '手机号对应一个账号；登录后可在注销状态下切换身份。' : '验证手机号后，为账号设置一个新密码。'}</p>
        <PhoneField phone={phone} setPhone={setPhone} />
        <CodeField code={code} setCode={setCode} />
        {isRegister && <RolePicker value={role} onChange={setRole} compact />}
        <PasswordField value={password} onChange={setPassword} visible={showPassword} toggle={() => setShowPassword(!showPassword)} label={isRegister ? '设置密码' : '新密码'} />
        {error && <p className="form-error">{error}</p>}
        <button className="button button--primary" onClick={verifyAndLogin}>{isRegister ? '注册并登录' : '保存并登录'}</button>
        {isRegister && <p className="fine-print"><ShieldCheckIcon /> 孩子账号可稍后通过家长邀请码建立关联</p>}
      </div>
    </AuthCanvas>
  }

  return (
    <AuthCanvas>
      <div className="auth__hero">
        <Brand />
        <div className="auth__eyebrow">成长不是一条标准答案</div>
        <h1>看见孩子的<br /><em>独特成长路径</em></h1>
        <p>连接家庭洞察、趣味测评与可执行计划。</p>
      </div>
      <div className="auth__panel">
        <div className="section-label">选择登录身份</div>
        <RolePicker value={role} onChange={setRole} />
        <div className="method-tabs" role="tablist">
          {([['wechat', '微信'], ['sms', '验证码'], ['password', '密码']] as const).map(([key, label]) =>
            <button key={key} className={method === key ? 'is-active' : ''} onClick={() => { setMethod(key); setError('') }}>{label}</button>
          )}
        </div>
        {method === 'wechat' ? (
          <div className="wechat-login">
            <button className="button button--wechat" onClick={() => setView('wechat-confirm')}><ChatBubbleOvalLeftEllipsisIcon /> 微信授权登录</button>
            <p>首次授权后需绑定手机号</p>
          </div>
        ) : (
          <div className="auth-form">
            <PhoneField phone={phone} setPhone={setPhone} />
            {method === 'sms' ? <CodeField code={code} setCode={setCode} /> : <PasswordField value={password} onChange={setPassword} visible={showPassword} toggle={() => setShowPassword(!showPassword)} />}
            {error && <p className="form-error">{error}</p>}
            <button className="button button--primary" onClick={verifyAndLogin}>登录 <ArrowRightIcon /></button>
            {method === 'password' && <button className="inline-link" onClick={() => setView('forgot')}>忘记密码？</button>}
          </div>
        )}
        <button className="register-link" onClick={() => setView('register')}>还没有账号？<b>注册新账号</b></button>
        <p className="legal">登录即代表你同意《用户协议》与《隐私政策》</p>
      </div>
    </AuthCanvas>
  )
}

function AuthCanvas({ children }: { children: React.ReactNode }) {
  return <main className="auth-canvas"><div className="auth-device">{children}</div><p className="desktop-note">TeensAI 移动端交互原型 · 建议使用手机浏览</p></main>
}

function StepHeader({ onBack, title }: { onBack: () => void; title: string }) {
  return <header className="step-header"><button onClick={onBack} aria-label="返回"><ArrowLeftIcon /></button><b>{title}</b><span /></header>
}

function RolePicker({ value, onChange, compact = false }: { value: Role; onChange: (role: Role) => void; compact?: boolean }) {
  return <div className={`role-picker ${compact ? 'role-picker--compact' : ''}`}>
    <button className={value === 'parent' ? 'is-active' : ''} onClick={() => onChange('parent')}><span><UserIcon /></span><b>我是家长</b>{!compact && <small>管理档案与成长计划</small>}</button>
    <button className={value === 'child' ? 'is-active' : ''} onClick={() => onChange('child')}><span><UserIcon /></span><b>我是孩子</b>{!compact && <small>完成趣味测评与任务</small>}</button>
  </div>
}

function PhoneField({ phone, setPhone }: { phone: string; setPhone: (v: string) => void }) {
  return <label className="field"><span>手机号</span><div><DevicePhoneMobileIcon /><span className="country-code">+86</span><input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" /></div></label>
}

function CodeField({ code, setCode }: { code: string; setCode: (v: string) => void }) {
  return <label className="field"><span>验证码</span><div><LockClosedIcon /><input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" /><button className="field-action" type="button">获取验证码</button></div><small>演示验证码：123456</small></label>
}

function PasswordField({ value, onChange, visible, toggle, label = '密码' }: { value: string; onChange: (v: string) => void; visible: boolean; toggle: () => void; label?: string }) {
  return <label className="field"><span>{label}</span><div><LockClosedIcon /><input type={visible ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} /><button className="icon-button" type="button" onClick={toggle}>{visible ? <EyeSlashIcon /> : <EyeIcon />}</button></div></label>
}
