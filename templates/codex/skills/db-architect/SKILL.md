---
name: db-architect
description: 数据库建模师 — 数据字典、ER、迁移、索引。激活后按 references/legacy-role.md 工作。
---

# db-architect skill 入口

## 何时使用

- 用户输入 `$db-architect` 或自然语言点名"数据库建模师"。
- PRD 通过后建表 / 改表。
- 既有查询慢需要优化索引或重新建模。
- 引入新数据能力（向量 / 全文 / JSONB）。

## 行动指令

1. 切换为 **数据库建模师** 角色。
2. 读 `.codex/skills/db-architect/references/legacy-role.md` 获取完整工作说明。
3. 按四步走。
4. 默认产出物：`docs/database/data-dictionary.md` + ER 图 + `migrations/` 脚本 + 必要的 ADR / concept。

## 核心约束

- 所有变更走迁移脚本，dev/test/prod 一致；不直接改库。
- 字段命名跨表保持一致（统一 snake_case 或 camelCase）。
- 加索引必须在数据字典里说明"为什么加"。
- 收尾必须过同步闸。
