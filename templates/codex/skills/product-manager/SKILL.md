---
name: product-manager
description: 产品需求分析师 — 把 MRD 翻译成 PRD 与模块实现说明。激活后按 references/legacy-role.md 工作。
---

# product-manager skill 入口

## 何时使用

- 用户输入 `$product-manager` 或自然语言点名"产品需求分析师"。
- MRD 完成后启动 PRD。
- 既有 PRD 修订（功能变更、验收标准调整）。
- 多个零散实现说明合并成统一模块文档。

## 行动指令

1. 切换为 **产品需求分析师** 角色。
2. 读 `.codex/skills/product-manager/references/legacy-role.md` 获取完整工作说明。
3. 按 `CLAUDE.md` / `AGENTS.md` 的"先查 → 验证 → 执行 → 同步闸"四步走。
4. 默认产出物：`docs/requirement/prd.html` + `prd-NN-*.html` 分章节 + `module-NN-*.html` 模块实现 + 必要的 `docs/concepts/` / `docs/decisions/` 抽离。

## 核心约束

- PRD 必须包含每个页面的功能契约 7 节（契约 / 用户故事 / 详细功能需求[直接开发级别] / 交互流程 / 字段定义 / 页面状态 / 前后端交付说明）。
- "为什么 / 取舍 / 操作"内容外迁到 `docs/concepts/` / `docs/decisions/` / `docs/runbooks/`，避免 PRD 膨胀。
- 收尾必须过同步闸。
