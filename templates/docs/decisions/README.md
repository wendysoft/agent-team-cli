# decisions/ — 架构决策记录（ADR）

> **写什么**：有取舍、有备选、未来可能被推翻的**技术决策**。每条决策一个文件，编号递增。
> **不写什么**：通用设计哲学（去 `concepts/`）、操作步骤（去 `runbooks/`）。

## 当前内容

- [001-why-postgresql.md](001-why-postgresql.md) — 选择 PostgreSQL 16 作为单一数据库

## 文件命名

`<3 位编号>-<kebab-case 主题>.md`，例：
- `001-why-postgresql.md`
- `002-llm-vendor-strategy.md`
- `003-jwt-vs-session.md`

## 写作格式（精简版 Michael Nygard ADR）

```markdown
---
adr: <编号>
title: <一句话决策>
status: proposed | accepted | deprecated | superseded
date: YYYY-MM-DD
deciders: <参与决策的角色>
supersedes: <被本决策替代的旧 ADR 编号，或 ->
superseded-by: <替代本决策的新 ADR 编号，或 ->
related:
  - <其他 decisions / concepts 路径>
---

# <编号> — <一句话决策>

## 背景（Context）
说清楚是什么场景下需要做这个选择，业务约束是什么。

## 决策（Decision）
我们选了什么。一句话主干 + 几条要点。

## 备选与权衡（Alternatives）
列出 2-4 个对比方案，每个都写明拒绝原因。

## 后果（Consequences）
- ✅ 正向：得到了什么
- ⚠️ 负向 / 需注意：付出了什么
- 🔄 触发重新评估的条件：什么情况下要重审

## 落地（Implementation）
指向具体的代码/迁移/文档。

## 参考（References）
论文、官方文档、行业案例。
```

## 关键规则

1. **编号永不复用**：哪怕被废弃，编号也保留。
2. **修改既有 ADR**：原则上不改，要变就开一个新 ADR 标 `supersedes: 00X`，旧 ADR 标 `superseded-by: 0XX status: superseded`。
3. **status 字段必须实时维护**——deprecated 的决策容易误导新成员。
4. **写在前面**：决策做出后立刻写 ADR，**不要等"以后补"**。
