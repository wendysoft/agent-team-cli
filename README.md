# agent-team-cli

[中文](./README.zh-CN.md) | English

> One-click injection of "8-agent collaboration + knowledge sync gate" scaffolding into any project, **supporting both Claude Code and Codex**.
> Inspired by llmwiki's five-category documentation structure: Concepts / Decisions / Operations / References / Templates.

## What is this

An independent Node CLI that installs into a new (or existing) project:

- **`docs/` five-category structure** — `concepts/` (design philosophy), `decisions/` (ADRs), `runbooks/` (operations guides), `references/` (external resources), `templates/` (templates & boilerplates), coexisting with existing `requirement/`, `api/`, `database/`, `fixes/`, `deploy/` directories.
- **`docs/CHANGELOG.md`** — The sync gate's write-back entry point.
- **`CLAUDE.md` / `AGENTS.md`** — Control layer manifests, synchronized across both platforms.
- **`.claude/agents/*.md`** — 8 agent definitions for Claude Code.
- **`.codex/skills/<name>/`** — 8 skill definitions for Codex (`SKILL.md` + `agents/openai.yaml` + `references/legacy-role.md`).

8 agents: `market-analyst` · `product-manager` · `prototype-designer` · `frontend-engineer` · `db-architect` · `backend-engineer` · `qa-engineer` · `devops-engineer`.

## Installation

```bash
# Method A: Local link (recommended for development)
cd ~/Desktop/agent-team-cli
npm install
npm link
agent-team --help

# Method B: Direct run (no install needed)
node ~/Desktop/agent-team-cli/bin/agent-team.mjs --help
```

## Commands

### `agent-team init`

Writes the `docs/` five-category scaffolding + `CLAUDE.md` / `AGENTS.md` into the current directory. Does **not** touch `.claude/agents/` or `.codex/skills/` — that's `stack`'s job.

```bash
cd /path/to/your-project
agent-team init
# Existing files are skipped by default; use --force to overwrite
agent-team init --force
# Preview what will be written without actually writing
agent-team init --dry-run
```

### `agent-team stack`

Asks for your tech stack (or reads from a JSON file), then injects the answers into agent prompts on both platforms.

```bash
agent-team stack
# Skip interactive prompts and use a file
agent-team stack --from stack.json
# Dry run without writing
agent-team stack --dry-run
```

Example `stack.json`:

```json
{
  "project_name": "my-app",
  "description": "Tax automation SaaS for SMBs",
  "frontend": "React 18 + TypeScript + TailwindCSS",
  "backend": "Python 3.11 + FastAPI",
  "database": "PostgreSQL 16",
  "cache": "Redis 7",
  "llm": "OpenAI gpt-4o + text-embedding-3-small",
  "auth": "JWT + OAuth2/OIDC SSO",
  "deploy": "Docker Compose single-node"
}
```

After running `stack`:

- `CLAUDE.md` / `AGENTS.md` "Tech Stack Quick Reference" section will be filled with concrete stack details.
- All `{{stack_*}}` placeholders in the 8 Claude agents + 8 Codex skills prompts will be replaced.
- `docs/CHANGELOG.md` automatically appends an injection record.

### `agent-team doctor`

Read-only check: verifies directories, key files, and agent definitions are complete.

```bash
agent-team doctor
```

## Typical Workflow

```bash
# 1. New project scaffolding
mkdir my-new-project && cd $_
git init

# 2. Install structure
agent-team init

# 3. Inject tech stack into prompts
agent-team stack
# Select frontend / backend / database / cache / LLM / auth / deploy → confirm → write

# 4. Verify
agent-team doctor

# 5. Use directly in Claude Code / Codex
# /market-analyst   (Claude Code)
# $market-analyst   (Codex)
```

## Design Principles

1. **Non-destructive**: `init` skips existing files by default; use `--force` to overwrite.
2. **Cross-platform sync**: `CLAUDE.md` / `AGENTS.md`, `.claude/agents/` / `.codex/skills/` have identical content to ensure consistent behavior across Claude Code and Codex.
3. **Customizable placeholders**: `{{project_name}}` / `{{stack_*}}` / `{{description}}` are template variables filled by the `stack` command; you can also manually edit templates and re-run `stack`.
4. **Built-in sync gate**: Every agent prompt includes an end-of-task "sync gate checklist"; CHANGELOG is the single aggregation entry point.

## Directory Structure

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
│       ├── fs-util.mjs         # File read/write, template traversal
│       └── template.mjs        # {{var}} rendering (with {{#if}})
├── templates/
│   ├── CLAUDE.md               # Claude Code control layer template
│   ├── AGENTS.md               # Codex control layer template
│   ├── docs/
│   │   ├── CHANGELOG.md
│   │   ├── concepts/README.md
│   │   ├── decisions/README.md
│   │   ├── runbooks/README.md
│   │   ├── references/README.md
│   │   └── templates/{README.md, api-contract-template.yaml, adr-template.md, runbook-template.md}
│   ├── claude/agents/          # 8 .md files
│   └── codex/skills/<name>/    # 3 files per skill
└── package.json
```

## Future Extensions

- `agent-team upgrade` — Pull latest template versions into existing projects (diff + apply).
- `agent-team add-agent <name>` — Add a 9th or 10th agent to the team.
- Switch between different stack profiles (e.g., different customer projects with the same structure but different stacks).

## License

MIT


