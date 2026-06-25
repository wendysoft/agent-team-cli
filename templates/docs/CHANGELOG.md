# 变更记录 CHANGELOG

> 知识同步闸的回写目标。**每次有意义的、触及 durable 知识的变更**，由执行该变更的 Agent 在表格顶部追加一行（倒序，最新在上）。
> 纯文案、纯局部、不触及架构/契约/行为/决策的改动**不必**记录。
> 详细规则见 `CLAUDE.md` / `AGENTS.md` 第三节「知识同步闸」。

## 字段说明

| 字段 | 含义 |
|---|---|
| 日期 | `YYYY-MM-DD` |
| 角色 | 发起变更的 Agent |
| 知识类型 | 架构 / 契约 / 功能行为 / 模块归属 / 故障模式 / 决策 / 工作规则 |
| 变更摘要 | 一句话：动了什么 |
| 影响文档 | 同步更新了哪些文档（相对路径） |
| 来源状态 | current / needs-verification / conflict |

---

## 记录

| 日期 | 角色 | 知识类型 | 变更摘要 | 影响文档 | 来源状态 |
|------|------|---------|---------|---------|---------|
| {{today}} | agent-team-cli | 工作规则 / 架构 | 通过 `agent-team init` 初始化 8-agent 协作骨架与 docs/ 五分类目录 | `docs/{concepts,decisions,runbooks,references,templates}/*`、`CLAUDE.md`、`AGENTS.md` | current |
