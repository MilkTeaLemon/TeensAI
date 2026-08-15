# TeensAI 前端交互原型

面向第一、二周甲方评审的纯前端移动 H5。当前版本聚焦：

- 家长/孩子双身份及微信、验证码、密码三种登录方式
- 家长端「首页、报告、计划、我的」四 Tab 外壳
- S0–S4 主流程、月度回流叠加态、7 类权益状态演示
- 报告双路线、计划版本归档与相同任务进度延续说明
- 演示套餐、支付结果与带锁预览
- 孩子端视觉占位和趣味测评入口

## 本地运行

```bash
pnpm install
pnpm --filter @teens-ai/frontend-prototype dev
```

演示验证码为 `123456`，预填密码为 `TeensAI123`。演示数据会保存在浏览器 `localStorage`，可通过悬浮的「演示」按钮重置。

## 构建与部署

```bash
pnpm --filter @teens-ai/frontend-prototype build
```

推送 `main` 分支后，GitHub Actions 会构建并部署 `frontend-prototype/dist` 到 GitHub Pages。仓库需在 Settings → Pages 中选择 **GitHub Actions** 作为发布源。

公开演示地址：<https://milktealemon.github.io/TeensAI/>
