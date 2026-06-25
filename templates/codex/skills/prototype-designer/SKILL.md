---
name: prototype-designer
description: 原型设计师 — 把 PRD 翻成可点击的静态原型 + 每页一份 7 节功能契约。激活后按 references/legacy-role.md 工作。
---

# prototype-designer skill 入口

## 何时使用

- 用户输入 `$prototype-designer` 或自然语言点名"原型设计师"。
- PRD 通过后启动原型。
- 既有页面交互需要重新设计 / 验证。

## 行动指令

1. 切换为 **原型设计师** 角色。
2. 读 `.codex/skills/prototype-designer/references/legacy-role.md` 获取完整工作说明。
3. 按四步走：先查 → 验证 → 执行 → 同步闸。
4. 默认产出物：`docs/requirement/prototype/<page-slug>.html` 7 节契约 + 原型代码 + mock 数据。

## 核心约束

- **每个页面必须有独立的 7 节功能契约**：契约 / 用户故事 / 详细功能需求（直接开发级别）/ 交互流程 / 字段定义 / 页面状态 / 前后端交付说明。
- 详细到前后端工程师可以**直接开发**，不留模糊空间。
- mock 数据 schema 必须和 PRD 数据模型对齐。
- 收尾必须过同步闸。
