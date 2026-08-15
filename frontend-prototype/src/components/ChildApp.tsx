import { ArrowRightIcon, CheckIcon, LinkIcon, LockClosedIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { Brand } from './Brand'
import { useAppState } from '../state'

export function ChildApp() {
  const { logout } = useAppState()
  return <main className="app-stage"><div className="mobile-app child-app"><header className="app-header"><Brand compact /><button className="child-logout" onClick={logout}>退出</button></header><div className="child-home">
    <span className="child-kicker">HI，林小满</span><h1>今天也来认识<br />一点点自己吧</h1><p>没有标准答案，选择最像你的感受就好。</p>
    <section className="child-mission"><span><SparklesIcon /></span><small>今日推荐 · 约 5 分钟</small><h2>创意实验室</h2><p>用几个有趣的小选择，看看你习惯怎样解决问题。</p><div className="mini-progress"><i style={{ width: '0%' }} /></div><button>开始挑战 <ArrowRightIcon /></button></section>
    <div className="child-progress"><div><b>3/4</b><span>趣味测评</span></div><div><b>76%</b><span>本周任务</span></div><div><b>6</b><span>连续天数</span></div></div>
    <h2 className="child-section-title">我的探索</h2>
    <div className="child-quests">{[['好奇心岛', '已完成', true], ['选择迷宫', '已完成', true], ['情绪气象站', '已完成', true], ['创意实验室', '等待开启', false]].map(([name, status, done], i) => <button key={String(name)} className={done ? 'is-done' : ''}><span>{done ? <CheckIcon /> : <LockClosedIcon />}</span><div><b>{name}</b><small>{status}</small></div><em>0{i + 1}</em></button>)}</div>
    <button className="bind-family"><LinkIcon /><span><b>与家长账号关联</b><small>输入家长分享的 6 位邀请码</small></span><ArrowRightIcon /></button>
    <p className="child-note">孩子端完整测评与任务将在下一阶段递进实现。本页用于确认双身份外壳与视觉方向。</p>
  </div></div></main>
}
