# TeensAI 前端交互原型

面向第一、二周甲方评审的纯前端移动 H5。当前版本聚焦：

- 家长/孩子双身份及微信、验证码、密码三种登录方式
- 家长端「首页、报告、计划、我的」四 Tab 外壳
- S0–S4 主流程、月度回流叠加态、7 类权益状态演示
- 报告双路线、计划版本归档与相同任务进度延续说明
- 演示套餐、支付结果与带锁预览
- 孩子端「计划、测评、反馈、我的」四 Tab 与独立状态机
- 星球探险主题的四套场景化测评、两题试玩绑定门禁与完整特质标签解锁
- 孩子计划打卡、月度反馈只读归档、连续完成和探索徽章

## 本地运行

```bash
pnpm install
pnpm --filter @teens-ai/frontend-prototype dev
```

演示验证码为 `123456`，预填密码为 `TeensAI123`，孩子端家庭邀请码为 `482916`。演示数据会保存在浏览器 `localStorage`，家长端与孩子端均可通过悬浮的演示控制器重置或切换状态。

## 构建与部署

```bash
pnpm --filter @teens-ai/frontend-prototype build
```

推送 `main` 分支后，GitHub Actions 会构建并部署 `frontend-prototype/dist` 到 GitHub Pages。仓库需在 Settings → Pages 中选择 **GitHub Actions** 作为发布源。

公开演示地址：<https://milktealemon.github.io/TeensAI/>
