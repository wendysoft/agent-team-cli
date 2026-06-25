# templates/ — 标准与样板

> **写什么**：项目内反复使用的**结构化模板**——API 契约、ADR、PR 描述、Code Review 清单、Issue 模板、迁移脚本头部……
> **不写什么**：一次性的代码片段（写在对应模块的源码里）。

## 当前内容

- [api-contract-template.yaml](api-contract-template.yaml) — API 契约 YAML 模板

## 用途

- **原型设计师** 交付页面契约时引用 `api-contract-template.yaml`。
- **后端工程师** 定义新接口时复制本模板。
- **数据库建模师** 写新迁移时套用迁移脚本头部模板（待补）。
- **测试工程师** 写测试用例时套用用例模板（待补）。

## 命名规范

`<对象>-<类型>-template.<ext>`，例：

- `api-contract-template.yaml`
- `adr-template.md`（实际写在 `decisions/README.md` 里）
- `runbook-template.md`（实际写在 `runbooks/README.md` 里）
- `migration-template.sql`（待补）
- `pr-description-template.md`（待补）

## 维护规则

1. 模板里的注释要解释"为什么这么写"，不是只说"这里填什么"。
2. 任一模板**被修改**，要在 `docs/CHANGELOG.md` 留一行——因为它会影响后续所有产出物的样式。
3. 模板和实际产出物的 schema 必须保持一致：发现产出物多出/少了字段，要么更新模板，要么修产出物。
