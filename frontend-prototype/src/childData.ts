import type { AssessmentDefinition, AssessmentKey } from './childTypes'

export const childAssessments: AssessmentDefinition[] = [
  {
    key: 'talent', code: '01', title: '天赋优势', planet: '能力探险岛', subtitle: '发现你自然会使用的能力',
    description: '在不同任务场景中，找到你最顺手的解决方式。', duration: '约 4 分钟', color: 'violet',
    questions: [
      { id: 'talent-1', scene: '废弃的太空站需要重新启动', prompt: '你会先从哪里开始？', hint: '没有正确答案，选最像你的做法', options: [
        { id: 'a', title: '拆开控制台', description: '看看里面怎样运作', visual: 'build' },
        { id: 'b', title: '观察整座空间站', description: '先找到规律和线索', visual: 'observe' },
        { id: 'c', title: '召集伙伴讨论', description: '听听每个人的想法', visual: 'team' },
      ] },
      { id: 'talent-2', scene: '你得到一盒没有说明书的零件', prompt: '最吸引你的挑战是什么？', hint: '想象你真的拿到了这盒零件', options: [
        { id: 'a', title: '直接动手搭建', description: '边试边调整', visual: 'build' },
        { id: 'b', title: '推测它的用途', description: '在脑中画出结构', visual: 'observe' },
        { id: 'c', title: '为它编一个故事', description: '让作品有自己的世界', visual: 'story' },
      ] },
      { id: 'talent-3', scene: '探索队遇到一道复杂谜题', prompt: '你更愿意承担哪个角色？', hint: '选择你最自然的反应', options: [
        { id: 'a', title: '整理线索', description: '把复杂信息分成几类', visual: 'observe' },
        { id: 'b', title: '提出新办法', description: '尝试别人没想过的方向', visual: 'create' },
        { id: 'c', title: '带大家行动', description: '决定下一步并推进', visual: 'lead' },
      ] },
      { id: 'talent-4', scene: '你有一整个下午完成自由作品', prompt: '哪种过程会让你忘记时间？', hint: '选你愿意持续投入的方式', options: [
        { id: 'a', title: '制作真实物件', description: '看见想法一点点成形', visual: 'build' },
        { id: 'b', title: '写作或表达', description: '把感受讲给别人听', visual: 'story' },
        { id: 'c', title: '挑战身体技巧', description: '通过练习突破动作', visual: 'move' },
      ] },
      { id: 'talent-5', scene: '任务结束，大家需要复盘', prompt: '你最容易发现什么？', hint: '根据平时的真实体验选择', options: [
        { id: 'a', title: '哪里效率不高', description: '想到更清晰的流程', visual: 'observe' },
        { id: 'b', title: '谁需要支持', description: '注意到伙伴的状态', visual: 'help' },
        { id: 'c', title: '还能怎样变化', description: '看到更多可能性', visual: 'create' },
      ] },
    ],
  },
  {
    key: 'personality', code: '02', title: '性格人格', planet: '情绪天气站', subtitle: '认识你的节奏与相处方式',
    description: '从日常选择中了解情绪、社交和恢复能量的方式。', duration: '约 4 分钟', color: 'coral',
    questions: [
      { id: 'personality-1', scene: '第一次加入一支陌生探索队', prompt: '你通常会怎样进入状态？', hint: '选择平时更常发生的情况', options: [
        { id: 'a', title: '先安静观察', description: '熟悉之后再加入', visual: 'observe' },
        { id: 'b', title: '主动认识大家', description: '从交流开始熟悉', visual: 'speak' },
        { id: 'c', title: '找一件事一起做', description: '在合作中建立连接', visual: 'team' },
      ] },
      { id: 'personality-2', scene: '准备很久的任务突然失败', prompt: '你的第一反应更接近哪一种？', hint: '不是理想答案，而是真实反应', options: [
        { id: 'a', title: '先独处一会儿', description: '整理情绪再回来', visual: 'solo' },
        { id: 'b', title: '马上再试一次', description: '行动能让我恢复', visual: 'move' },
        { id: 'c', title: '找信任的人聊聊', description: '说出来会更清楚', visual: 'speak' },
      ] },
      { id: 'personality-3', scene: '小组对下一步出现分歧', prompt: '你更可能怎么做？', hint: '想象大家都很坚持自己的看法', options: [
        { id: 'a', title: '听完再总结', description: '寻找大家的共同点', visual: 'calm' },
        { id: 'b', title: '明确表达立场', description: '让观点被清楚看见', visual: 'speak' },
        { id: 'c', title: '做个小实验', description: '用结果帮助判断', visual: 'science' },
      ] },
      { id: 'personality-4', scene: '这一周安排得特别满', prompt: '什么最能帮你恢复能量？', hint: '选真正对你有效的方式', options: [
        { id: 'a', title: '拥有独处时间', description: '安静做喜欢的事', visual: 'solo' },
        { id: 'b', title: '运动或去户外', description: '让身体先动起来', visual: 'nature' },
        { id: 'c', title: '和朋友在一起', description: '通过陪伴获得能量', visual: 'team' },
      ] },
      { id: 'personality-5', scene: '需要在大家面前展示作品', prompt: '你最在意哪一部分？', hint: '选择让你最有安全感的准备', options: [
        { id: 'a', title: '内容足够扎实', description: '提前反复练习', visual: 'calm' },
        { id: 'b', title: '现场有交流感', description: '根据大家反应调整', visual: 'speak' },
        { id: 'c', title: '形式足够特别', description: '让表达有记忆点', visual: 'create' },
      ] },
    ],
  },
  {
    key: 'interest', code: '03', title: '兴趣爱好', planet: '兴趣万花筒', subtitle: '找到让你好奇和投入的方向',
    description: '穿过不同兴趣空间，选择你愿意主动靠近的体验。', duration: '约 4 分钟', color: 'cyan',
    questions: [
      { id: 'interest-1', scene: '周末的自由探索时间到了', prompt: '你最想先去哪一站？', hint: '假设没有成绩和比较', options: [
        { id: 'a', title: '未来实验室', description: '机器人、编程和科学实验', visual: 'science' },
        { id: 'b', title: '创意工作室', description: '绘画、音乐和设计', visual: 'art' },
        { id: 'c', title: '户外挑战场', description: '运动、自然和冒险', visual: 'nature' },
      ] },
      { id: 'interest-2', scene: '你可以订阅一个长期频道', prompt: '哪类内容最容易让你点进去？', hint: '想想你真正会持续看的内容', options: [
        { id: 'a', title: '世界怎样运转', description: '科技、自然与知识', visual: 'science' },
        { id: 'b', title: '人们怎样生活', description: '故事、文化与社会', visual: 'story' },
        { id: 'c', title: '怎样变得更强', description: '竞技、训练与挑战', visual: 'move' },
      ] },
      { id: 'interest-3', scene: '学校开放一个自主项目月', prompt: '你最想完成怎样的作品？', hint: '可以大胆想象', options: [
        { id: 'a', title: '解决真实问题的工具', description: '让生活更方便', visual: 'build' },
        { id: 'b', title: '能打动人的作品', description: '表达一种感受或观点', visual: 'art' },
        { id: 'c', title: '一次团队行动', description: '和伙伴影响更多人', visual: 'team' },
      ] },
      { id: 'interest-4', scene: '遇到一个完全陌生的主题', prompt: '什么会让你愿意继续了解？', hint: '选择最能点燃好奇心的入口', options: [
        { id: 'a', title: '亲自试一试', description: '通过操作理解它', visual: 'build' },
        { id: 'b', title: '听一个好故事', description: '从人物和经历进入', visual: 'story' },
        { id: 'c', title: '和别人讨论', description: '交换不同的看法', visual: 'speak' },
      ] },
      { id: 'interest-5', scene: '如果可以学习一种新能力', prompt: '你希望它带来什么？', hint: '想想你期待的变化', options: [
        { id: 'a', title: '创造新东西', description: '把想法变成现实', visual: 'create' },
        { id: 'b', title: '理解更大世界', description: '接触语言和文化', visual: 'language' },
        { id: 'c', title: '帮助身边的人', description: '让别人因我而更好', visual: 'help' },
      ] },
    ],
  },
  {
    key: 'dream', code: '04', title: '梦想目标', planet: '未来星球', subtitle: '探索你想成为怎样的人',
    description: '不急着选择职业，先看看什么样的未来让你有动力。', duration: '约 4 分钟', color: 'amber',
    questions: [
      { id: 'dream-1', scene: '十年后的你发来一张照片', prompt: '照片中的什么让你最期待？', hint: '未来不只有一种标准答案', options: [
        { id: 'a', title: '完成困难的创造', description: '做出以前不存在的东西', visual: 'create' },
        { id: 'b', title: '帮助许多人', description: '让自己的工作有意义', visual: 'help' },
        { id: 'c', title: '自由探索世界', description: '持续遇见新的可能', visual: 'explore' },
      ] },
      { id: 'dream-2', scene: '你获得一次改变世界的机会', prompt: '你最想改善哪一件事？', hint: '选择你最愿意长期投入的方向', options: [
        { id: 'a', title: '技术与生活', description: '用发明解决问题', visual: 'science' },
        { id: 'b', title: '人与人的理解', description: '减少隔阂和冲突', visual: 'help' },
        { id: 'c', title: '自然与环境', description: '让未来更可持续', visual: 'nature' },
      ] },
      { id: 'dream-3', scene: '一项长期任务遇到困难', prompt: '什么最可能让你继续坚持？', hint: '想想真正能推动你的力量', options: [
        { id: 'a', title: '我想证明能做到', description: '突破本身让我有动力', visual: 'move' },
        { id: 'b', title: '这件事对别人有用', description: '意义让我愿意坚持', visual: 'help' },
        { id: 'c', title: '过程让我很好奇', description: '未知让我想继续探索', visual: 'explore' },
      ] },
      { id: 'dream-4', scene: '你可以组建自己的未来团队', prompt: '你希望自己承担什么角色？', hint: '选择最想尝试的位置', options: [
        { id: 'a', title: '提出方向的人', description: '看见目标和机会', visual: 'lead' },
        { id: 'b', title: '把事情做成的人', description: '让计划稳定落地', visual: 'build' },
        { id: 'c', title: '连接大家的人', description: '让不同的人共同前进', visual: 'team' },
      ] },
      { id: 'dream-5', scene: '未来的你回望现在', prompt: '你最希望感谢现在的自己什么？', hint: '选择最想从今天开始的改变', options: [
        { id: 'a', title: '一直保持好奇', description: '没有停止学习和提问', visual: 'explore' },
        { id: 'b', title: '认真练习一件事', description: '把喜欢变成真正能力', visual: 'calm' },
        { id: 'c', title: '勇敢表达选择', description: '按照自己的方向前进', visual: 'speak' },
      ] },
    ],
  },
]

export const childTraits = [
  { id: 'spatial', name: '空间想象家', source: '天赋优势', color: 'violet' },
  { id: 'observer', name: '观察雷达', source: '天赋优势', color: 'violet' },
  { id: 'steady', name: '稳定恢复力', source: '性格人格', color: 'coral' },
  { id: 'connector', name: '温暖连接者', source: '性格人格', color: 'coral' },
  { id: 'science', name: '科创好奇者', source: '兴趣爱好', color: 'cyan' },
  { id: 'maker', name: '动手实验派', source: '兴趣爱好', color: 'cyan' },
  { id: 'explorer', name: '未来探索者', source: '梦想目标', color: 'amber' },
  { id: 'purpose', name: '目标点灯人', source: '梦想目标', color: 'amber' },
]

export const defaultAssessmentProgress: Record<AssessmentKey, { status: 'not_started'; answered: number }> = {
  talent: { status: 'not_started', answered: 0 },
  personality: { status: 'not_started', answered: 0 },
  interest: { status: 'not_started', answered: 0 },
  dream: { status: 'not_started', answered: 0 },
}
