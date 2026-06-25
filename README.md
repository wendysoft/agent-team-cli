# agent-team-cli

> 把"8-agent 协作 + 知识同步闸"骨架一键注入任意项目，**同时支持 Claude Code 与 Codex**。
> 灵感来自 llmwiki 的「概念 / 决策 / 操作 / 参考 / 模板」五分类文档结构。

## 这是什么

一个独立的 Node CLI。给一个新项目（或既有项目）安装：

- **`docs/` 五分类目录** —— `concepts/`（设计哲学）、`decisions/`（ADR）、`runbooks/`（操作手册）、`references/`（外部资源）、`templates/`（模板与样板），与既有 `requirement/ · api/ · database/ · fixes/ · deploy/` 并列。
- **`docs/CHANGELOG.md`** —— 知识同步闸的回写入口。
- **`CLAUDE.md` / `AGENTS.md`** —— 控制层总则，两端同步。
- **`.claude/agents/*.md`** —— Claude Code 的 8 个 agent 定义。
- **`.codex/skills/<name>/`** —— Codex 的 8 个 skill 定义（`SKILL.md` + `agents/openai.yaml` + `references/legacy-role.md`）。

8 个 agent：`market-analyst` · `product-manager` · `prototype-designer` · `frontend-engineer` · `db-architect` · `backend-engineer` · `qa-engineer` · `devops-engineer`。

## 安装

```bash
# 方式 A：本地链接（开发期推荐）
cd ~/Desktop/agent-team-cli
npm install
npm link
agent-team --help

# 方式 B：直接跑（无需安装）
node ~/Desktop/agent-team-cli/bin/agent-team.mjs --help
```

## 命令

### `agent-team init`

把 `docs/` 五分类骨架 + `CLAUDE.md` / `AGENTS.md` 写进当前目录。**不**触碰 `.claude/agents/` 或 `.codex/skills/`——那是 `stack` 的活儿。

```bash
cd /path/to/your-project
agent-team init
# 已存在文件默认会跳过；想覆写加 --force
agent-team init --force
# 看一下要写什么但不真的写
agent-team init --dry-run
```

### `agent-team stack`

问你的技术栈（或读 JSON 文件），确认后把答案灌入两端的 agent prompts。

```bash
agent-team stack
# 跳过交互问答，用文件提供答案
agent-team stack --from stack.json
# 演练一遍但不写
agent-team stack --dry-run
```

`stack.json` 示例：

```json
{
  "project_name": "my-app",
  "description": "面向 SMB 的财税自动化 SaaS",
  "frontend": "React 18 + TypeScript + TailwindCSS",
  "backend": "Python 3.11 + FastAPI",
  "database": "PostgreSQL 16",
  "cache": "Redis 7",
  "llm": "OpenAI gpt-4o + text-embedding-3-small",
  "auth": "JWT + OAuth2/OIDC SSO",
  "deploy": "Docker Compose 单机"
}
```

执行 `stack` 后：

- `CLAUDE.md` / `AGENTS.md` 的「六、技术栈速查」会填上具体栈。
- 8 个 Claude agent + 8 个 Codex skill 的 prompt 里所有 `{{stack_*}}` 占位符都会被替换。
- `docs/CHANGELOG.md` 自动追加一行注入记录。

### `agent-team doctor`

只读检查：目录、关键文件、agent 定义是否齐全。

```bash
agent-team doctor
```

## 典型流程

```bash
# 1. 新项目脚手架
mkdir my-new-project && cd $_
git init

# 2. 装结构
agent-team init

# 3. 把技术栈灌入 prompts
agent-team stack
# 选择前端 / 后端 / 数据库 / 缓存 / LLM / 认证 / 部署 → 确认 → 写入

# 4. 验证
agent-team doctor

# 5. 在 Claude Code / Codex 里直接用
# /market-analyst   (Claude Code)
# $market-analyst   (Codex)
```

## 设计原则

1. **不替换、不破坏**：`init` 默认跳过已存在的文件；用 `--force` 才覆写。
2. **两端同步**：`CLAUDE.md` / `AGENTS.md`、`.claude/agents/` / `.codex/skills/` 内容一致，确保 Claude Code 与 Codex 行为一致。
3. **占位符可二次定制**：`{{project_name}}` / `{{stack_*}}` / `{{description}}` 是模板里的变量，`stack` 命令负责填充；你也可以手动改模板文件后重新 `stack`。
4. **知识同步闸内建**：每个 agent prompt 都内置"收尾过同步闸"的 checklist；CHANGELOG 是其唯一汇总入口。

## 目录结构

```
agent-team-cli/
├── bin/
│   └── agent-team.mjs          # CLI entry
├── src/
│   ├── commands/
│   │   ├── init.mjs
│   │   ├── stack.mjs
│   │   └── doctor.mjs
│   └── lib/
│       ├── fs-util.mjs         # 文件读写、模板遍历
│       └── template.mjs        # {{var}} 渲染（含 {{#if}}）
├── templates/
│   ├── CLAUDE.md               # Claude Code 控制层模板
│   ├── AGENTS.md               # Codex 控制层模板
│   ├── docs/
│   │   ├── CHANGELOG.md
│   │   ├── concepts/README.md
│   │   ├── decisions/README.md
│   │   ├── runbooks/README.md
│   │   ├── references/README.md
│   │   └── templates/{README.md, api-contract-template.yaml, adr-template.md, runbook-template.md}
│   ├── claude/agents/          # 8 个 .md
│   └── codex/skills/<name>/    # 每个 skill 3 个文件
└── package.json
```

## 后续可扩展

- `agent-team upgrade` —— 把模板的最新版本拉进既有项目（diff + apply）。
- `agent-team add-agent <name>` —— 加入团队第 9 个 / 第 10 个 agent。
- 切换不同的 stack profile（如不同的客户项目用同一套结构、不同的栈）。

## License

MIT
