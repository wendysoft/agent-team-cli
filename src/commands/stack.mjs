import fs from 'node:fs/promises';
import path from 'node:path';
import kleur from 'kleur';
import { input, select, confirm } from '@inquirer/prompts';
import { ensureDir, writeFile, walkTemplates, readTemplate, fileExists } from '../lib/fs-util.mjs';
import { fullRender } from '../lib/template.mjs';

// `stack` is the heart of customization. It:
//   1) Asks the user (or loads JSON from --from) about their stack.
//   2) Confirms the summary.
//   3) Renders 8 agent prompts in BOTH Claude Code format (.claude/agents/*.md)
//      AND Codex format (.codex/skills/<name>/{SKILL.md,agents/openai.yaml,references/legacy-role.md}).
//   4) Refreshes CLAUDE.md / AGENTS.md so the tech-stack section matches.
export async function stackCommand(opts) {
  const targetDir = path.resolve(opts.dir);
  const projectName = path.basename(targetDir);

  let answers;
  if (opts.from) {
    answers = JSON.parse(await fs.readFile(opts.from, 'utf-8'));
    console.log(kleur.cyan(`▶ Loaded stack answers from ${opts.from}`));
  } else {
    answers = await askStack(projectName);
  }

  console.log('');
  console.log(kleur.bold('— Stack summary —'));
  for (const [k, v] of Object.entries(answers)) {
    console.log(`  ${kleur.dim(k.padEnd(20))} ${kleur.cyan(v)}`);
  }
  console.log('');

  const ok = opts.from ? true : await confirm({ message: 'Proceed and write agent prompts with this stack?', default: true });
  if (!ok) {
    console.log(kleur.yellow('Aborted by user.'));
    return;
  }

  const vars = buildVars(projectName, answers);

  // 1. Refresh CLAUDE.md / AGENTS.md (overwrite OK — they're scaffolds from `init` + this).
  for (const f of ['CLAUDE.md', 'AGENTS.md']) {
    const tpl = await readTemplate(f);
    const rendered = fullRender(tpl, vars);
    const res = await writeFile(path.join(targetDir, f), rendered, { force: true, dryRun: opts.dryRun });
    console.log(formatStatus(res, f));
  }

  // 2. Write Claude Code agents: .claude/agents/*.md
  await ensureDir(path.join(targetDir, '.claude/agents'));
  for await (const [abs, rel] of walkTemplates('claude/agents')) {
    const tpl = await fs.readFile(abs, 'utf-8');
    const rendered = fullRender(tpl, vars);
    const dest = path.join(targetDir, '.claude/agents', rel);
    const res = await writeFile(dest, rendered, { force: true, dryRun: opts.dryRun });
    console.log(formatStatus(res, `.claude/agents/${rel}`));
  }

  // 3. Write Codex skills: .codex/skills/<name>/{SKILL.md,agents/openai.yaml,references/legacy-role.md}
  for await (const [abs, rel] of walkTemplates('codex/skills')) {
    const tpl = await fs.readFile(abs, 'utf-8');
    const rendered = fullRender(tpl, vars);
    const dest = path.join(targetDir, '.codex/skills', rel);
    await ensureDir(path.dirname(dest));
    const res = await writeFile(dest, rendered, { force: true, dryRun: opts.dryRun });
    console.log(formatStatus(res, `.codex/skills/${rel}`));
  }

  // 4. Append a CHANGELOG row noting the stack injection.
  if (!opts.dryRun) {
    const cl = path.join(targetDir, 'docs/CHANGELOG.md');
    if (await fileExists(cl)) {
      const today = new Date().toISOString().slice(0, 10);
      const line = `| ${today} | agent-team-cli | 工作规则 / 架构 | 通过 \`agent-team stack\` 注入技术栈到 8 个 agent prompt 与 CLAUDE.md/AGENTS.md：${vars.stack_summary} | \`.claude/agents/*\`、\`.codex/skills/*\`、\`CLAUDE.md\`、\`AGENTS.md\` | current |\n`;
      // Append by inserting after the header row.
      const content = await fs.readFile(cl, 'utf-8');
      const marker = '|------|------|---------|---------|---------|---------|';
      if (content.includes(marker)) {
        const next = content.replace(marker, `${marker}\n${line.trimEnd()}`);
        await fs.writeFile(cl, next, 'utf-8');
        console.log(kleur.green('✔ appended CHANGELOG row'));
      }
    }
  }

  console.log('');
  console.log(kleur.green('Done.'));
  console.log(kleur.dim('Tip: run `agent-team doctor` to verify everything lines up.'));
}

async function askStack(projectName) {
  console.log(kleur.cyan(`Stack interview for ${projectName} (Ctrl+C to abort)`));
  const project_name = await input({ message: '项目名 / Project name', default: projectName });
  const description = await input({ message: '一句话描述（domain / goal）', default: '一句话说清楚这个项目做什么' });
  const frontend = await select({
    message: '前端框架',
    choices: [
      { name: 'React 18 + TypeScript + Tailwind', value: 'React 18 + TypeScript + TailwindCSS' },
      { name: 'Vue 3 + TypeScript + Tailwind', value: 'Vue 3 + TypeScript + TailwindCSS' },
      { name: 'Next.js 14 (App Router)', value: 'Next.js 14 (App Router) + TypeScript + Tailwind' },
      { name: 'Svelte / SvelteKit', value: 'SvelteKit + TypeScript' },
      { name: '(无前端)', value: 'none' },
    ],
  });
  const backend = await select({
    message: '后端框架',
    choices: [
      { name: 'Python FastAPI', value: 'Python 3.11 + FastAPI' },
      { name: 'Python Django', value: 'Python 3.11 + Django' },
      { name: 'Node + NestJS', value: 'Node 20 + NestJS + TypeScript' },
      { name: 'Node + Express', value: 'Node 20 + Express + TypeScript' },
      { name: 'Go + Gin', value: 'Go 1.22 + Gin' },
      { name: 'Java + Spring Boot', value: 'Java 21 + Spring Boot 3' },
    ],
  });
  const database = await select({
    message: '主数据库',
    choices: [
      { name: 'PostgreSQL 16 (+ 可选 pgvector/zhparser)', value: 'PostgreSQL 16' },
      { name: 'MySQL 8', value: 'MySQL 8.0' },
      { name: 'MongoDB', value: 'MongoDB 7' },
      { name: 'SQLite (开发)', value: 'SQLite' },
    ],
  });
  const cache = await select({
    message: '缓存 / 队列',
    choices: [
      { name: 'Redis', value: 'Redis 7' },
      { name: 'Memcached', value: 'Memcached' },
      { name: '不使用', value: 'none' },
    ],
  });
  const llm = await input({ message: 'LLM / Embedding 选型（写明品牌+模型）', default: 'OpenAI gpt-4o + text-embedding-3-small' });
  const auth = await select({
    message: '认证方案',
    choices: [
      { name: 'JWT + SSO（OAuth2/OIDC）', value: 'JWT + OAuth2/OIDC SSO' },
      { name: 'Session Cookie', value: 'Session Cookie' },
      { name: 'API Key', value: 'API Key' },
    ],
  });
  const deploy = await select({
    message: '部署方式',
    choices: [
      { name: 'Docker Compose (单机)', value: 'Docker Compose 单机' },
      { name: 'Kubernetes', value: 'Kubernetes' },
      { name: 'Serverless (Vercel/Cloud Run/Lambda)', value: 'Serverless' },
      { name: '裸机 systemd', value: '裸机 systemd' },
    ],
  });
  return { project_name, description, frontend, backend, database, cache, llm, auth, deploy };
}

function buildVars(projectName, a) {
  return {
    project_name: a.project_name || projectName,
    description: a.description,
    today: new Date().toISOString().slice(0, 10),
    stack_frontend: a.frontend,
    stack_backend: a.backend,
    stack_database: a.database,
    stack_cache: a.cache,
    stack_llm: a.llm,
    stack_auth: a.auth,
    stack_deploy: a.deploy,
    stack_summary: `${a.frontend} / ${a.backend} / ${a.database}${a.cache !== 'none' ? ` / ${a.cache}` : ''} / ${a.llm} / ${a.auth} / ${a.deploy}`,
    has_frontend: a.frontend !== 'none' ? '1' : '',
    has_cache: a.cache !== 'none' ? '1' : '',
  };
}

function formatStatus(res, label) {
  switch (res.status) {
    case 'created': return `  ${kleur.green('+')} ${label}`;
    case 'overwritten': return `  ${kleur.yellow('~')} ${label}`;
    case 'skipped': return `  ${kleur.dim('·')} ${label} (exists)`;
    case 'dry-run': return `  ${kleur.cyan('?')} ${label} (${res.bytes}B)`;
    default: return `  ${label}`;
  }
}
