import path from 'node:path';
import kleur from 'kleur';
import { ensureDir, writeFile, walkTemplates, readTemplate } from '../lib/fs-util.mjs';
import { fullRender } from '../lib/template.mjs';

// `init` lays down the project-agnostic skeleton:
//   docs/{requirement,concepts,decisions,runbooks,references,templates,api,database,fixes,deploy}/
//   docs/CHANGELOG.md
//   CLAUDE.md, AGENTS.md  (with {{project_name}} placeholders left for `stack`)
//   .claude/agents/, .codex/skills/  are NOT touched here — that's `stack`'s job.
export async function initCommand(opts) {
  const targetDir = path.resolve(opts.dir);
  const projectName = path.basename(targetDir);
  const today = new Date().toISOString().slice(0, 10);

  const log = (s) => console.log(s);
  log(kleur.cyan(`▶ Initializing agent-team scaffold into ${targetDir}`));
  log(kleur.dim(`  (project name inferred: ${projectName}; date: ${today})`));

  const docsRoot = path.join(targetDir, 'docs');
  const subdirs = [
    'requirement',
    'requirement/prototype',
    'concepts',
    'decisions',
    'runbooks',
    'references',
    'templates',
    'api',
    'database',
    'database/migrations',
    'fixes',
    'deploy',
  ];

  for (const sub of subdirs) {
    await ensureDir(path.join(docsRoot, sub));
  }
  log(kleur.green('✔ created docs/* taxonomy'));

  // Write README.md for each new-category dir + 3 example files.
  const filesToWrite = [
    ['docs/concepts/README.md', 'docs/concepts/README.md'],
    ['docs/decisions/README.md', 'docs/decisions/README.md'],
    ['docs/runbooks/README.md', 'docs/runbooks/README.md'],
    ['docs/templates/README.md', 'docs/templates/README.md'],
    ['docs/references/README.md', 'docs/references/README.md'],
    ['docs/templates/api-contract-template.yaml', 'docs/templates/api-contract-template.yaml'],
    ['docs/templates/adr-template.md', 'docs/templates/adr-template.md'],
    ['docs/templates/runbook-template.md', 'docs/templates/runbook-template.md'],
    ['docs/CHANGELOG.md', 'docs/CHANGELOG.md'],
    ['CLAUDE.md', 'CLAUDE.md'],
    ['AGENTS.md', 'AGENTS.md'],
  ];

  const vars = {
    project_name: projectName,
    today,
    description: '_(一句话描述项目——运行 `agent-team stack` 后会被填充)_',
    // Tech stack vars are filled later by `stack`; leave them as visible placeholders for now.
    stack_summary: '_(尚未由 `agent-team stack` 注入；运行 `agent-team stack` 后填入)_',
    stack_frontend: '待定',
    stack_backend: '待定',
    stack_database: '待定',
    stack_cache: '待定',
    stack_llm: '待定',
    stack_deploy: '待定',
    stack_auth: '待定',
  };

  for (const [outRel, tplRel] of filesToWrite) {
    const tpl = await readTemplate(tplRel);
    const rendered = fullRender(tpl, vars);
    const dest = path.join(targetDir, outRel);
    const res = await writeFile(dest, rendered, { force: opts.force, dryRun: opts.dryRun });
    log(formatStatus(res, outRel));
  }

  log('');
  log(kleur.green('Done.'));
  log(kleur.dim('Next: run `agent-team stack` to customize agent prompts to your tech stack.'));
}

function formatStatus(res, label) {
  switch (res.status) {
    case 'created': return `  ${kleur.green('+')} ${label}`;
    case 'overwritten': return `  ${kleur.yellow('~')} ${label} ${kleur.dim('(overwritten)')}`;
    case 'skipped': return `  ${kleur.dim('·')} ${label} ${kleur.dim('(exists, skipped — use --force to overwrite)')}`;
    case 'dry-run': return `  ${kleur.cyan('?')} ${label} ${kleur.dim(`(dry-run, ${res.bytes}B)`)}`;
    default: return `  ${label} ${res.status}`;
  }
}
