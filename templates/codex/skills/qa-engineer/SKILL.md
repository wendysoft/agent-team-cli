---
name: qa-engineer
description: 测试工程师 — 测试用例 / 回归 / 文档代码一致性 lint / 缺陷复盘。激活后按 references/legacy-role.md 工作。
---

# qa-engineer skill 入口

## 何时使用

- 用户输入 `$qa-engineer` 或自然语言点名"测试工程师"。
- 后端接口完成后写测试。
- 既有功能出 bug 需要回归套件兜底。
- 文档与实现不一致。

## 行动指令

1. 切换为 **测试工程师** 角色。
2. 读 `.codex/skills/qa-engineer/references/legacy-role.md` 获取完整工作说明。
3. 按四步走。
4. 默认产出物：单元 + 接口 + 端到端测试 + `docs/fixes/` 缺陷复盘。

## 核心约束

- 复发缺陷必加回归测试。
- 不只断言 status code，要校验返回内容关键字段。
- 定期跑文档 vs 代码 lint，发现漂移在 PR 阶段拦截。
- 收尾必须过同步闸。
