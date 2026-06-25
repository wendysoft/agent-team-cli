import path from 'node:path';
import fs from 'node:fs/promises';
import kleur from 'kleur';
import { fileExists } from '../lib/fs-util.mjs';

// `doctor` does a fast read-only sweep of the standard expectations:
//   - docs/{requirement,concepts,decisions,runbooks,references,templates} exist
//   - docs/CHANGELOG.md is present
//   - CLAUDE.md + AGENTS.md are present and reference each other
//   - .claude/agents/ has the 8 agents
//   - .codex/skills/ has 8 subdirs each with SKILL.md
const EXPECTED_DOCS = [
  'docs/requirement',
  'docs/concepts',
  'docs/decisions',
  'docs/runbooks',
  'docs/references',
  'docs/templates',
  'docs/CHANGELOG.md',
];

const EXPECTED_TOP_FILES = ['CLAUDE.md', 'AGENTS.md'];

const AGENTS = [
  'market-analyst',
  'product-manager',
  'prototype-designer',
  'frontend-engineer',
  'db-architect',
  'backend-engineer',
  'qa-engineer',
  'devops-engineer',
];

export async function doctorCommand(opts) {
  const dir = path.resolve(opts.dir);
  console.log(kleur.cyan(`▶ Diagnosing ${dir}`));

  let ok = 0, miss = 0;
  const ck = async (p, label) => {
    const exists = await fileExists(path.join(dir, p));
    if (exists) { ok++; console.log(`  ${kleur.green('✓')} ${label || p}`); }
    else { miss++; console.log(`  ${kleur.red('✗')} ${label || p} ${kleur.dim('(missing)')}`); }
  };

  console.log(kleur.bold('\n[docs taxonomy]'));
  for (const p of EXPECTED_DOCS) await ck(p);

  console.log(kleur.bold('\n[top-level control files]'));
  for (const p of EXPECTED_TOP_FILES) await ck(p);

  console.log(kleur.bold('\n[Claude Code agents]'));
  for (const a of AGENTS) await ck(`.claude/agents/${a}.md`);

  console.log(kleur.bold('\n[Codex skills]'));
  for (const a of AGENTS) {
    await ck(`.codex/skills/${a}/SKILL.md`, `.codex/skills/${a}/SKILL.md`);
    await ck(`.codex/skills/${a}/agents/openai.yaml`, `.codex/skills/${a}/agents/openai.yaml`);
  }

  console.log('');
  if (miss === 0) console.log(kleur.green(`All checks passed (${ok}).`));
  else console.log(kleur.yellow(`${ok} ok, ${miss} missing. Run \`agent-team init\` and/or \`agent-team stack\` to repair.`));
}
