# TeensAI Monorepo

青少儿 AI 成长教练小程序 Demo 的统一代码仓库。当前阶段只包含经过需求拆解的工程目录、仓库规范与实现指南，尚未初始化具体应用代码或安装依赖。

## 核心工作区

- frontend-prototype：第 1、2 周甲方原型、样张、评审材料和范围冻结记录。
- miniapp-frontend：生产微信小程序，包含家长端、孩子端和公共监护流程。
- miniapp-business-backend：小程序业务 API、管理员 API、管理员 Web 和后台任务。
- agent-server-backend：DeepSeek Harness、专家智能体、技能、工作流、RAG、安全与评测。
- contracts：OpenAPI、JSON Schema、事件、错误码与契约示例。
- data：题库、政策、资源、模板、Mock 和评测数据占位。
- docs：需求、架构、合规、测试、运维、交付和验收文档。
- infra：环境、容器、数据库、监控、备份和部署。
- quality：契约、端到端、兼容性、安全和阶段验收。

完整边界和实现顺序见 [agent.md](agent.md)。

## Monorepo 管理

- Git 默认分支：main。
- JavaScript/TypeScript 工作区：pnpm workspace。
- Python 或其他运行时可在各自服务目录维护独立项目配置，但仍共享同一 Git 历史、契约和质量门禁。
- 每个可部署应用应拥有自己的依赖、测试、构建和部署入口。
- 应用之间禁止通过跨目录相对路径共享业务代码；跨服务数据只通过 contracts 中的版本化契约传递。

## 根级命令

具体包加入 workspace 并定义对应脚本后，可在根目录使用：

- pnpm dev：并行启动所有提供 dev 脚本的包。
- pnpm build：构建所有提供 build 脚本的包。
- pnpm test：运行所有提供 test 脚本的包。
- pnpm lint：运行所有提供 lint 脚本的包。
- pnpm typecheck：运行所有提供 typecheck 脚本的包。
- pnpm check：依次执行 lint、typecheck 和 test。

当前未安装外部依赖；pnpm-lock.yaml 只记录初始空工作区基线，后续依赖变更必须同步提交锁文件。

## 初始开发顺序

1. 从 frontend-prototype/deliverables/week-01 开始原型交付。
2. 在 contracts 中冻结 API 与 AI JSON Schema。
3. 初始化 miniapp-frontend、业务 API、管理员 Web 和智能体私有 API。
4. 按 agent.md 的 P0 至 P5 顺序逐步实现和验收。
