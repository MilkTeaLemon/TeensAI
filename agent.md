# 青少儿 AI 成长教练小程序 Demo：后续实现指南

## 1. 文档目的

本文件是项目后续开发的统一实现基线，依据以下两份需求材料整理：

1. 《青少儿 AI 成长教练小程序 Demo 版项目开发方案与实施路线 V1.0》
2. 《青少儿 AI 成长教练小程序 Demo 版完整技术开发需求说明书》

当前仓库只建立目录骨架，不包含业务代码、配置、依赖清单、数据库迁移、提示词、种子数据或部署脚本。后续开发应先冻结范围与契约，再按本文约定向对应目录填充实现，禁止为了快速演示把所有功能堆入单一服务。

## 2. 产品目标与闭环

Demo 的完整主链路为：

孩子端四类趣味测评 + 家长端五类家庭调研
→ 确定性计分与特质标签
→ AI 八维成长建模
→ 十模块可视化成长报告与至少两条成长路径
→ 六维周计划
→ 每周打卡与家长微调
→ 孩子、家长、老师预留、系统行为四方数据回流
→ 月度报告与路径迭代
→ 第三方教育资源匹配
→ 历史版本和成长趋势追踪
→ PDF 与分享长图交付。

Demo 必须跑通真实数据闭环，同时满足可演示、可追溯、可审计、可回放、可版本化和未成年人合规要求。

## 3. 范围分级

### 3.1 Demo 必做

- 家长端、孩子端双端共九套测评与调研。
- 答题进度、断点续答、提交、计分和特质标签。
- 八维成长画像和不少于两条成长路径。
- 十个固定模块的成长报告、图表数据和双口吻文案。
- 六维周计划、家长微调、AI 再生成、打卡和完成度。
- 孩子与家长月度反馈、老师反馈占位、系统行为汇总。
- 月度报告 V1 → V2 → V3 版本链和变化点对比。
- 七类教育资源基础库和四维匹配。
- 雷达图、柱状图、趋势图、标签云和成长图谱。
- A4 PDF、分享长图或分享卡片。
- 业务管理后台、权限、安全和审计基础能力。
- 政策库、资源库、题库、权重和模板的版本化管理。
- 小程序、业务服务、智能体服务的部署、接口和运营文档。

### 3.2 只预留，不在 Demo 实现

- 老师反馈轻量入口或数据接口，不建设完整老师端。
- 合作机构的数据同步与资源供给接口，不建设机构端界面。
- 会员、权益与支付字段或接口占位，不建设复杂会员和交易闭环。
- 二期多端能力占位，不建设原生 App。

### 3.3 明确不做

- 直播、社区、商城。
- 千万级并发架构。
- 医疗或心理诊断。
- 未经甲方范围变更流程确认的新业务。

## 4. 四个核心工程的边界

### 4.1 frontend-prototype

只用于产品定义和第 1、2 周甲方交付。存放信息架构、交互流程、高低保真原型、样例数据、示例报告、视觉规范、评审材料和范围冻结记录。

这里不是生产小程序源码目录。原型通过甲方评审后，冻结的页面、字段、状态和文案应转化为 contracts、docs 和 miniapp-frontend 的开发输入。

### 4.2 miniapp-business-backend

业务后端是业务事实和敏感数据的唯一权威来源，负责：

- 登录、用户、监护人同意、家长与孩子绑定。
- 家庭与孩子档案。
- 题库、答题会话、断点续答、确定性计分和标签映射。
- 报告、计划、反馈、打卡、资源推荐和历史版本的持久化。
- 管理后台 API 与管理员 Web。
- RBAC、隐私权利、审计、幂等、文件权限。
- 异步任务状态、调度、PDF/长图渲染和对象存储。
- 微信、智能体服务器、政策来源、资源导入和机构接口的集成。

确定性计分必须留在业务后端；智能体只能解释、建模和生成候选结果，不能替代可复现的计分规则。

### 4.3 agent-server-backend

智能体服务器是内部 AI 演算平台，负责：

- DeepSeek Harness 的业务化适配。
- Skills、Subagents、Workflow 和后台任务。
- 八维建模、报告生成、计划拆解、月度迭代和资源匹配。
- 政策与资源 RAG。
- JSON Schema 校验、合规门禁、失败重试和模型降级。
- 会话、最小化记忆、任务追踪、成本控制、评测和审计回放。

智能体服务器不直接面向小程序，不拥有用户主数据，不直接修改业务库。它通过内部私有契约接收脱敏或最小化快照，返回结构化候选结果，由业务后端校验、持久化并形成版本链。

### 4.4 miniapp-frontend

生产微信小程序前端，承载家长端、孩子端和公共监护流程。前端只调用业务后端公开 API，不直接调用智能体服务，不保存服务端密钥，不将敏感家庭数据写入普通埋点。

微信原生与 Taro 尚未最终冻结。目录暂保持框架中立；P1 设计评审通过 ADR 后，再增加对应框架配置。

## 5. 跨工程硬性约束

1. 契约先行：OpenAPI、JSON Schema、事件和错误码先冻结，三端再并行实现。
2. 单向调用：小程序 → 业务 API → 智能体私有 API；小程序禁止直连智能体。
3. 最小化数据：智能体只接收完成当前任务所需字段，健康、经济、心理相关字段需分级和脱敏。
4. 版本不可覆盖：旧报告必须继续绑定当时的题库、权重、模板、政策索引、资源索引、Prompt、模型与 Schema 版本。
5. 确定性与生成式分离：计分、权限、状态机和硬过滤使用确定性规则；自然语言解释、路径建议和摘要再交给模型。
6. 异步优先：报告生成、月度迭代、资源索引和 PDF 渲染均使用异步任务，并提供进度、重试、超时和幂等。
7. 合规先于发布：固定风险提示、免责声明和 AI 生成标识不可被后台配置删除。
8. 政策可追溯：政策建议必须带来源、地区、学段、发布时间、生效时间和索引版本，不能只依赖模型记忆。
9. 资源推荐先规则过滤再 AI 排序，预算、年龄学段、地区和有效状态属于硬约束。
10. 原型不是实现：原型中的 mock 字段必须经契约和数据模型评审后才能进入生产。

## 6. 第 1、2 周前端原型交付

### 6.1 Week 1

目标是完成信息架构、闭环流程和家长端可点击原型，供周五走查。

应准备：

- 家长端、孩子端、后台的信息架构和页面流程。
- 登录、监护同意、孩子绑定与建档。
- 家长首页、孩子档案。
- 五套家庭调研：教养方式、家庭条件、教育期许、托举资源、孩子成长与身心状态。
- 报告首页和报告文案样例。
- 数据结构草案、页面状态和异常状态。
- Week 1 评审记录。

### 6.2 Week 2

目标是补齐孩子端、后台和完整示例材料，在周末评审会上冻结范围。

应准备：

- 孩子端四套游戏化测评：天赋、性格、兴趣、梦想。
- 图文化选项、答题进度、断点续答和完成结果。
- 特质标签与示例试评结果。
- 完整十模块成长报告样张和至少两条路径对比。
- 六维周计划、打卡、家长微调和 AI 再生成流程。
- 月度报告 V1 → V2 静态对比和变化点高亮。
- 雷达图、柱状图、趋势图、标签云、成长图谱终稿。
- A4 PDF、微信分享长图或分享卡片样例。
- 管理后台可点击低保真原型。
- 智能体真实生成报告片段的演示脚本与故事板。
- 会前材料包、验收清单、决策记录、会议纪要和范围冻结清单。

P0 验收以更严格口径为准：家长端、孩子端和后台全部关键页面均应可点击走查，覆盖主闭环的每一步。

## 7. 业务功能划分

### 7.1 身份、监护与档案

- 微信登录与业务会话。
- 家长、孩子、家庭和关系绑定。
- 监护授权、隐私协议、协议版本、撤回记录。
- 孩子档案创建、选择与切换。
- 数据导出、注销和删除申请占位。

### 7.2 九套题库

孩子端四套：

- 天赋优势。
- 性格人格。
- 兴趣爱好。
- 梦想目标。

家长端五套：

- 教养方式。
- 家庭客观条件。
- 教育期许。
- 可托举资源。
- 孩子饮食、健康和精神状态。

题库需支持草稿、测试、发布、上下架、版本、题目、选项、计分规则、标签映射和历史引用。

### 7.3 八维画像

- 天赋优劣势。
- 性格、情绪和抗压。
- 真实兴趣。
- 梦想与主观意愿。
- 家庭教养模式。
- 家庭经济和资源承载能力。
- 教育政策与升学趋势。
- 家长期许和托举能力。

### 7.4 报告十模块

1. 天赋人格全景画像。
2. 优势挖掘与短板改善。
3. 兴趣发展适配方向。
4. 家庭教养匹配与亲子冲突建议。
5. 家庭资源匹配评估。
6. 本学期或本年度短期目标。
7. 3 年、6 年、12 年中长期路径。
8. 政策趋势适配分析及来源。
9. 性格、学习、亲子风险提示和免责声明。
10. 至少两条专属成长总路径方案及投入对比。

最终字段仍以 P0 范围冻结和 P1 report JSON Schema 为准。

### 7.5 六维周计划

- 学习。
- 习惯。
- 性格。
- 兴趣。
- 亲子。
- 素养。

每个任务至少需考虑周期、频次、完成条件、打卡项、负荷、家长调整、AI 优化版本和完成度。

### 7.6 四方月度回流

- 孩子自我反馈。
- 家长反馈。
- 老师评价预留。
- 系统行为数据。

月度迭代应更新成长路径、短板方案、目标难度、兴趣优先级和下一阶段计划，并保存输入快照、差异说明与新报告版本。

### 7.7 七类资源

- 学科培优。
- 心理辅导与情绪成长。
- 正面管教和亲子教育。
- 科创、艺术和运动。
- 研学、夏令营和社会实践。
- 出国留学和语言备考。
- 高考、志愿填报和生涯规划。

匹配固定考虑天赋短板、兴趣方向、家庭条件和年龄学段。文档中出现的品牌仅为类型示例，不代表首期需要商业 API 对接。

## 8. 专家智能体设计

### 8.1 assessment-analyst

输入原始答案和版本化计分结果，输出维度解释、特质标签、缺失信息和置信度。它不能私自改变业务侧得分。

### 8.2 growth-modeler

汇总八维画像、家庭约束和政策证据，输出路径、阶段目标、风险、资源需求和至少两套候选方案。

### 8.3 report-writer

把建模 JSON 转成家长版和孩子版两种通俗口吻，输出十模块文案与图表数据，不得制造诊断结论或无来源政策事实。

### 8.4 plan-planner

把年度或阶段路径拆解为六维周计划，校验负荷和可执行性；家长调整后可再次优化，但必须保留调整前后版本。

### 8.5 policy-researcher

检索政策库，根据地区和学段输出有来源、有效期和适用范围的政策要点。来源不足时必须明确不确定性。

### 8.6 resource-matcher

在业务侧硬过滤后的候选资源中排序，输出匹配理由、约束满足情况和风险，不得推荐超出家庭承受能力的项目。

### 8.7 compliance-reviewer

按通俗性、经济适配、政策依据、未成年人保护、风险提示、免责声明、AI 标识和诊断边界逐项审核。未通过时有权驳回并触发重写。

## 9. 推荐工作流

### 9.1 首次报告

业务计分完成
→ assessment-analyst 解释
→ growth-modeler 建模
→ policy-researcher 补充依据
→ report-writer 生成
→ compliance-reviewer 审核
→ 不通过则定向重写
→ 业务后端最终校验、落库并形成 V1。

### 9.2 周计划

已选成长路径
→ plan-planner 生成六维任务
→ compliance-reviewer 检查负荷和表达
→ 业务后端落库
→ 家长调整
→ 可选 AI 再优化
→ 保留每一版计划与修改来源。

### 9.3 月度迭代

业务 scheduler 到期触发
→ 冻结四方输入快照
→ 智能体 Workflow 复盘
→ 更新路径、难度、短板和优先级
→ 生成新版报告和计划候选
→ 合规审核
→ 业务后端以新版本落库
→ 前端展示差异和趋势。

调度所有权属于业务后端，演算所有权属于智能体工作流。

## 10. 数据与版本策略

至少需要为以下对象保留版本或快照：

- 题库、题目、选项、计分和标签规则。
- 八维权重。
- 报告模板与图表 Schema。
- Prompt、Agent、Skill、Workflow 和模型参数。
- 政策库、资源库及向量索引。
- 测评结果、孩子画像和家庭快照。
- 报告、成长路径、计划、反馈与迭代。
- 合规审核结果。
- PDF 和分享长图。

新参数只影响新报告，旧报告不得被重新解释或静默覆盖。报告详情必须能够显示或追溯生成时使用的主要版本。

## 11. 安全、隐私与合规

- 未成年人数据必须先取得监护人同意。
- 健康、饮食、精神状态、经济条件属于敏感信息，需单独分级、最小化采集和严格审计。
- 后台采用最小权限 RBAC，敏感字段访问需记录操作者、用途和时间。
- 传输、存储、备份和对象文件均需加密；PDF 默认私有访问并支持短时链接。
- AI 请求日志默认脱敏，不记录无关原始答案。
- 支持同意撤回、账号注销、数据导出和删除流程。
- 报告只作为成长参考，不输出医疗、心理或法律诊断。
- 高风险内容需进入人工复核或转介提示，不得由模型独立处置。
- 固定免责声明、风险提示和 AI 生成标识不可被后台删除。
- 防范 Prompt 注入、越权工具调用、知识库污染和敏感信息回显。
- 合作机构接口未来应支持租户隔离、授权范围、字段映射、幂等和同步审计。

## 12. 质量与验收基线

- 双端九套测评支持断点续答并完整入库。
- 报告包含十模块和至少两条路径。
- 报告生成成功率目标不低于 95%，端到端 P95 不高于 3 分钟。
- 报告失败具备重试、降级和用户可理解的兜底提示。
- 周计划完整覆盖六维并支持微调和再生成。
- V1 → V2 → V3 版本链可回看，任何一期均不可丢失。
- 资源匹配不得违反预算、年龄学段和家庭条件硬约束。
- 管理后台普通操作目标响应不高于 2 秒。
- iOS 与 Android 主流机型分别不少于 3 款完成真机回归。
- 5 至 10 个真实家庭完成一周内测。
- P0 阻断缺陷清零；P1 重要缺陷不超过约定上限并有时间表。
- 单个孩子全周期模型成本可估算并有 token 上限。

## 13. 根目录结构

    TeensAI/
    ├─ agent.md
    ├─ frontend-prototype/              # W1/W2 甲方原型与评审材料
    ├─ miniapp-business-backend/        # 业务 API、管理员 Web/API、后台任务
    ├─ agent-server-backend/            # DSH、智能体、技能、工作流、RAG 与评测
    ├─ miniapp-frontend/                 # 生产微信小程序
    ├─ contracts/                        # 跨工程唯一契约
    ├─ data/                             # 题库、政策、资源、模板和样例数据占位
    ├─ docs/                             # 需求、架构、合规、运维和交付文档
    ├─ infra/                            # 环境、容器、数据库、监控和部署占位
    └─ quality/                          # 契约、端到端、兼容、安全和阶段验收

## 14. frontend-prototype 结构

    frontend-prototype/
    ├─ source/
    │  ├─ design-system/
    │  │  ├─ colors/
    │  │  ├─ typography/
    │  │  ├─ spacing/
    │  │  ├─ icons/
    │  │  ├─ illustrations/
    │  │  ├─ components/
    │  │  ├─ chart-specs/
    │  │  └─ tone-and-copy/
    │  ├─ user-flows/
    │  │  ├─ auth-and-consent/
    │  │  ├─ parent-onboarding/
    │  │  ├─ child-onboarding/
    │  │  ├─ assessment-to-report/
    │  │  ├─ weekly-plan-and-checkin/
    │  │  ├─ monthly-iteration/
    │  │  ├─ resource-matching/
    │  │  ├─ export-and-share/
    │  │  └─ admin-operations/
    │  ├─ common-pages/
    │  ├─ parent-miniapp/pages/
    │  │  ├─ home/
    │  │  ├─ child-profile/
    │  │  ├─ family-surveys/
    │  │  ├─ assessment-status/
    │  │  ├─ reports/
    │  │  ├─ weekly-plan/
    │  │  ├─ plan-adjustment/
    │  │  ├─ checkin-and-completion/
    │  │  ├─ monthly-feedback/
    │  │  ├─ iteration-history/
    │  │  ├─ growth-trends/
    │  │  ├─ resource-matching/
    │  │  ├─ export-and-share/
    │  │  └─ profile/
    │  ├─ child-miniapp/pages/
    │  │  ├─ home/
    │  │  ├─ assessments/
    │  │  ├─ trait-tags/
    │  │  ├─ weekly-checkin/
    │  │  ├─ monthly-self-feedback/
    │  │  └─ profile/
    │  ├─ admin-web/pages/
    │  └─ reserved/
    ├─ mock-data/
    ├─ samples/
    │  ├─ assessment-result/
    │  ├─ growth-report/
    │  ├─ weekly-plan/
    │  ├─ monthly-version-comparison/
    │  ├─ visual-tracking/
    │  ├─ pdf-print/
    │  └─ share-card/
    ├─ deliverables/
    │  ├─ week-01/
    │  └─ week-02/
    └─ review/
       ├─ scope-freeze/
       ├─ decision-log/
       ├─ acceptance-checklists/
       └─ meeting-minutes/

family-surveys 下已按五套调研拆分；reports 下已按十个报告模块拆分；assessments 下已按孩子四套测评拆分。

## 15. miniapp-business-backend 结构

    miniapp-business-backend/
    ├─ apps/
    │  ├─ miniapp-api/modules/
    │  │  ├─ authentication/
    │  │  ├─ guardian-consent/
    │  │  ├─ users/
    │  │  ├─ families/
    │  │  ├─ children/
    │  │  ├─ questionnaires/
    │  │  ├─ assessment-sessions/
    │  │  ├─ assessment-scoring/
    │  │  ├─ trait-profiles/
    │  │  ├─ growth-reports/
    │  │  ├─ report-versions/
    │  │  ├─ growth-paths/
    │  │  ├─ weekly-plans/
    │  │  ├─ checkins/
    │  │  ├─ monthly-feedback/
    │  │  ├─ teacher-feedback-reserved/
    │  │  ├─ behavior-events/
    │  │  ├─ monthly-iterations/
    │  │  ├─ growth-tracking/
    │  │  ├─ resource-catalog/
    │  │  ├─ resource-recommendations/
    │  │  ├─ exports-and-sharing/
    │  │  ├─ async-task-progress/
    │  │  ├─ files/
    │  │  ├─ privacy-and-data-rights/
    │  │  └─ audit/
    │  ├─ admin-api/modules/
    │  │  ├─ admin-authentication/
    │  │  ├─ roles-and-permissions/
    │  │  ├─ questionnaire-management/
    │  │  ├─ scoring-and-tag-management/
    │  │  ├─ dimension-weight-management/
    │  │  ├─ report-template-management/
    │  │  ├─ policy-management/
    │  │  ├─ resource-management/
    │  │  ├─ user-and-family-management/
    │  │  ├─ report-and-iteration-history/
    │  │  ├─ analytics-dashboard/
    │  │  ├─ ai-task-operations/
    │  │  ├─ audit-and-sensitive-access/
    │  │  ├─ system-configuration/
    │  │  └─ institution-integration-reserved/
    │  ├─ admin-web/
    │  │  ├─ pages/
    │  │  ├─ components/
    │  │  ├─ services/
    │  │  ├─ state/
    │  │  ├─ assets/
    │  │  └─ tests/
    │  └─ business-worker/jobs/
    │     ├─ report-rendering/
    │     ├─ weekly-plan-refresh/
    │     ├─ monthly-iteration-scheduling/
    │     ├─ policy-index-sync/
    │     ├─ resource-index-sync/
    │     ├─ export-cleanup/
    │     └─ data-retention/
    ├─ domain/
    ├─ database/
    │  ├─ schema/
    │  ├─ migrations/
    │  ├─ seeds/
    │  ├─ views/
    │  └─ backup-and-restore/
    ├─ integrations/
    ├─ shared/
    ├─ reserved/
    │  ├─ membership/
    │  ├─ payment/
    │  └─ institution-portal/
    ├─ docs/
    └─ tests/

管理员业务界面放在 apps/admin-web，管理员 API 放在 apps/admin-api；DSH 的调试与回放界面放在 agent-server-backend/apps/agent-ops-console，二者不能混用。

## 16. agent-server-backend 结构

    agent-server-backend/
    ├─ apps/
    │  ├─ agent-private-api/
    │  ├─ agent-worker/
    │  └─ agent-ops-console/
    ├─ agents/
    │  ├─ assessment-analyst/
    │  ├─ growth-modeler/
    │  ├─ report-writer/
    │  ├─ plan-planner/
    │  ├─ policy-researcher/
    │  ├─ resource-matcher/
    │  └─ compliance-reviewer/
    ├─ skills/
    ├─ workflows/
    │  ├─ assessment-to-report/
    │  ├─ report-compliance-rewrite/
    │  ├─ weekly-plan-generation/
    │  ├─ weekly-plan-regeneration/
    │  ├─ monthly-report-iteration/
    │  ├─ resource-recommendation/
    │  └─ human-review-escalation/
    ├─ prompts/
    ├─ schemas/
    ├─ knowledge/
    │  ├─ assessment-theory/
    │  ├─ policy/
    │  ├─ resources/
    │  ├─ terminology/
    │  └─ citations/
    ├─ rag/
    │  ├─ ingestion/
    │  ├─ chunking/
    │  ├─ indexing/
    │  ├─ retrieval/
    │  ├─ reranking/
    │  └─ citation-grounding/
    ├─ memory/
    ├─ runtime/
    │  ├─ deepseek-harness/
    │  ├─ sessions/
    │  ├─ background-jobs/
    │  ├─ tool-sandbox/
    │  ├─ retries-and-fallbacks/
    │  ├─ checkpoints/
    │  ├─ token-budget/
    │  ├─ model-routing/
    │  └─ cache/
    ├─ integrations/
    ├─ safety/
    ├─ evaluation/
    ├─ observability/
    ├─ docs/
    └─ tests/

skills 已按测评解析、八维建模、成长路径、报告生成、周计划、月度迭代、政策检索、资源匹配、合规和个性化质量检查分别占位。

## 17. miniapp-frontend 结构

    miniapp-frontend/
    ├─ src/
    │  ├─ app/
    │  ├─ pages/
    │  │  ├─ shared/
    │  │  ├─ parent/
    │  │  │  ├─ family-surveys/
    │  │  │  ├─ reports/
    │  │  │  ├─ weekly-plan/
    │  │  │  ├─ checkin-and-completion/
    │  │  │  ├─ monthly-feedback/
    │  │  │  ├─ iteration-history/
    │  │  │  ├─ growth-trends/
    │  │  │  ├─ resource-matching/
    │  │  │  └─ export-and-share/
    │  │  └─ child/
    │  │     ├─ assessments/
    │  │     ├─ trait-tags/
    │  │     ├─ weekly-checkin/
    │  │     └─ monthly-self-feedback/
    │  ├─ features/
    │  ├─ components/
    │  ├─ services/
    │  ├─ state/
    │  ├─ hooks/
    │  ├─ types/
    │  ├─ constants/
    │  ├─ utils/
    │  ├─ assets/
    │  ├─ styles/
    │  └─ mocks/
    └─ tests/

页面目录负责路由和组合；features 负责业务能力；components 只放可复用展示；services 只处理 API、认证、异步任务、文件和埋点。禁止在页面中散落业务状态机或报告字段常量。

## 18. 共享目录

### 18.1 contracts

- openapi：小程序 API、管理员 API、智能体私有 API、机构预留 API。
- json-schema：测评、八维画像、成长报告、周计划、月度迭代、资源推荐、合规审核和异步任务。
- events：报告、计划、月度迭代、索引同步事件。
- errors：统一错误语义。
- versioning：契约兼容和弃用策略。
- examples：原型、前端和测试共享的契约示例。

contracts 是跨工程唯一事实源。任何字段变更必须先更新契约、示例和契约测试。

### 18.2 data

- 九套题库种子目录。
- 特质标签、八维权重、报告模板和固定免责声明。
- 政策种子库。
- 七类资源种子库。
- mock 家庭、孩子、测评、报告、计划和迭代数据。
- AI 评测场景、导入区和测试夹具。

P1 目标为政策条目不少于 30 条、资源种子不少于 100 条；当前目录只是占位，不代表已有内容或版权授权。

### 18.3 docs

存放需求提炼、范围冻结、用户故事、架构、数据、API、智能体设计、合规、测试、运维、阶段交付、验收和会议记录。

### 18.4 infra

存放 local、development、test、staging、production 环境占位，以及容器、PostgreSQL、pgvector、对象存储、网络、日志、指标、链路追踪、备份、密钥模板、CI/CD 和部署。

### 18.5 quality

存放 P0 至 P5 阶段验收、四条核心 E2E 链路、契约测试、iOS/Android/微信兼容性、性能、安全和 AI 质量评测。

## 19. 分阶段落地顺序

### P0：第 1–2 周

只做原型、样例、评审材料、决策记录和范围冻结。不得提前用临时代码替代产品决策。

### P1：第 3–4 周

冻结九套题库、计分和标签、八维权重、报告 JSON Schema、数据库模型、OpenAPI、UI 规范、智能体设计、合规清单、政策和资源种子。

### P2：第 5–7 周

实现登录建档、双端测评、计分、首次报告、周计划和打卡，先跑通最短真实闭环。

### P3：第 8–9 周

实现四方回流、月度迭代、V1 → V2 → V3、资源匹配、趋势、PDF 和长图。

### P4：第 10 周

实现业务管理员 Web/API、内容与参数管理、历史追踪、RBAC、安全和机构接口占位。

### P5：第 11–12 周

完成回归、真机兼容、真实家庭内测、性能与安全、微信审核、部署、运营文档和源码交付。

项目周次的正式起算点以 P0 后双方签署的范围冻结版为准。

## 20. 待甲方冻结的决策

1. 报告迭代频率：需求同时出现“每周升级报告”和“每月迭代报告”。建议 Demo 默认为月度报告迭代，周维度只刷新计划；调度周期保留配置能力。
2. 十模块是否全部保留，以及路径为两条还是三条。
3. 每套题库题量；建议 12 至 20 题，孩子端总题量不超过 80。
4. 自研题库的理论依据、量表版权和内容审核责任。
5. Taro 或微信原生。
6. 家长版与孩子版的口吻、配色、图表、免责声明和风险边界。
7. 政策库和资源库的数据来源、版权、更新责任和审核责任。
8. Demo 是否完全不含微信支付；默认仅保留 payment 和 membership 占位。
9. 老师反馈采用一次性链接、管理员录入还是 API。
10. 小程序主体、服务器、域名、ICP、大模型账号、费用和密钥所有权。
11. 数据保存周期、注销删除、PDF 有效期和真实家庭内测授权。
12. P0 后正式的 12 周起算方式。

每项结论应进入 frontend-prototype/review/decision-log 和 docs/architecture/decisions，并同步更新 scope-freeze。

## 21. 后续 Agent 工作规则

1. 开始实现前先阅读本文件、范围冻结清单、相关契约和对应模块文档。
2. 只修改任务所属模块；跨模块变更先更新 contracts 和架构决策。
3. 不把 PII、模型密钥、生产数据或真实家庭样本提交到仓库。
4. 不把确定性评分逻辑塞进 Prompt。
5. 不让智能体直接写业务主表；所有结果先经 Schema、合规和业务规则校验。
6. 不覆盖历史报告、计划、Prompt、权重或政策版本。
7. 不在前端复制报告 Schema；应从共享契约生成或导入类型。
8. 新增 AI 功能时同时补充 evaluation、safety、observability 和契约测试占位。
9. 新增敏感字段时同时说明采集目的、授权、访问角色、日志脱敏和删除策略。
10. 未经书面变更流程，不实现直播、社区、商城、复杂会员、支付或机构 UI。
11. 每个阶段以可运行演示和可勾选验收项为完成标准，不以“代码已写完”为标准。
12. 当前所有目录为空骨架；首次放入实现时，应在模块内补充 README、测试和运行说明。

## 22. 当前状态

- 两份需求文档已完成正文与表格层面的只读提取。
- 四个核心工程和跨工程支撑目录已建立。
- 目录已覆盖 P0 至 P5、九套题库、八维画像、十模块报告、六维计划、四方回流、七类资源和七个专家智能体。
- 已初始化本地 Git monorepo，默认分支为 main；JavaScript/TypeScript 工作区采用 pnpm。
- 尚未选择应用框架、安装依赖、初始化数据库、创建 API、编写 Prompt 或实现任何业务代码。
- 下一步应从 frontend-prototype/deliverables/week-01 开始，而不是直接进入生产编码。

## 23. Monorepo 管理规则

- 仓库根目录是唯一 Git 根，禁止在子目录再次初始化嵌套 Git 仓库。
- pnpm-workspace.yaml 只管理具有 package.json 的 JavaScript/TypeScript 包；目录匹配但尚无 package.json 时不会成为实际 workspace package。
- Python 或其他语言的智能体服务可保留各自依赖和锁文件，但必须接入根级 CI 与统一契约测试。
- package.json 的根级命令只负责编排各包已经定义的 dev、build、test、lint、typecheck 和 format，不承载业务逻辑。
- 每个 apps 下的可部署单元应独立拥有包名、依赖、测试、镜像与发布版本。
- agents、skills 或共享模块若成为 pnpm 包，应使用 workspace 协议声明内部依赖。
- 应用不得通过跨目录相对路径直接导入另一个应用的源码。
- 可共享的类型与协议放入 contracts；可共享实现只有在边界明确时才能建立独立包。
- 一个功能若同时修改契约与消费者，应在同一提交中完成并通过契约测试。
- 暂不引入 Turborepo 或 Nx；真实构建产生缓存和受影响任务需求后，再用 ADR 决策。
- 空叶子目录通过 .gitkeep 进入初始版本；放入首个真实文件后删除对应 .gitkeep。
- 不提交 node_modules、虚拟环境、构建产物、运行数据、密钥、生产备份或真实家庭数据。
