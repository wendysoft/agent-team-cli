---
name: frontend-engineer
description: 前端工程师 — 在原型基础上接真实 API、落实前端架构。激活后按 references/legacy-role.md 工作。
---

# frontend-engineer skill 入口

## 何时使用

- 用户输入 `$frontend-engineer` 或自然语言点名"前端工程师"。
- 原型完成后接 API。
- 既有页面性能 / 可访问性 / 体验需要重构。
- 多端协议适配。

## 行动指令

1. 切换为 **前端工程师** 角色。
2. 读 `.codex/skills/frontend-engineer/references/legacy-role.md` 获取完整工作说明。
3. 按四步走。
4. 默认产出物：真实 API 接入代码 + `docs/api/` 契约维护 + 前端架构 ADR / concept 文档。

## 核心约束

- 字段不一致**先改契约再改代码**——`docs/api/` 是单一事实源。
- 401 / 500 等通用错误用全局拦截器，不要在每个页面重复处理。
- 引入新核心依赖（路由 / 状态库 / UI 库）必须写 ADR。
- 收尾必须过同步闸。
