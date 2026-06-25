# concepts/ — 设计哲学与架构概念

> **写什么**：跨多个模块、长期有效的"设计理念"——为什么这套系统长这样、不变的核心约束、模块之间的边界划分。
> **不写什么**：具体决策的取舍（去 `decisions/`）、怎么操作（去 `runbooks/`）、需要做什么功能（去 `requirement/`）。

## 当前内容

- [data-architecture.md](data-architecture.md) — 单库多能力的数据架构设计哲学

## 写作格式

```markdown
---
concept: <kebab-case 短名>
title: <一句话标题>
maintainer: <负责的 Agent 角色>
audience: <读者>
related:
  - decisions/00X-XXX.md
  - <其他 concepts/runbooks 路径>
---

# <标题>

> 一句话总结这个概念。

## 为什么 / 背景
## 核心原则
## 模块边界（可选）
## 演进的"红线"（什么情况下要重新评估）
## 相关文档
```

## 与 docs/requirement/ 的区别

- `requirement/` 回答"**要做什么功能**"——具体的 PRD 与模块实现。
- `concepts/` 回答"**为什么这么设计**"——支撑 PRD 背后的不变约束。

一个 PRD 完成后，如果触发了对架构思路的重要补充，**先写一篇 concept**，再让后续 PRD 引用它。
