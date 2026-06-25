#!/usr/bin/env node
// agent-team CLI entry — dispatches to subcommands.
// Subcommands:
//   init      Scaffold base docs/ taxonomy + CHANGELOG + CLAUDE.md/AGENTS.md into the current project.
//   stack     Ask for the project's tech stack, confirm, then write Claude Code agents + Codex skills
//             with the stack baked into each agent prompt.
//   doctor    Verify the current project's docs taxonomy, CHANGELOG, agent prompt locations.

import { Command } from 'commander';
import kleur from 'kleur';
import { initCommand } from '../src/commands/init.mjs';
import { stackCommand } from '../src/commands/stack.mjs';
import { doctorCommand } from '../src/commands/doctor.mjs';

const program = new Command();

program
  .name('agent-team')
  .description('Bootstrap an 8-agent collaborative team into a project (Claude Code + Codex).')
  .version('0.1.0');

program
  .command('init')
  .description('Scaffold base docs/ taxonomy + CHANGELOG + CLAUDE.md/AGENTS.md into the current directory.')
  .option('-d, --dir <path>', 'Target project directory', process.cwd())
  .option('--force', 'Overwrite existing files (use with care).', false)
  .option('--dry-run', 'Show what would be written; do not touch the disk.', false)
  .action(initCommand);

program
  .command('stack')
  .description('Customize agent prompts to your tech stack, then write them into .claude/agents/ and .codex/skills/.')
  .option('-d, --dir <path>', 'Target project directory', process.cwd())
  .option('--from <file>', 'Read answers from a JSON file (skip interactive prompts).')
  .option('--dry-run', 'Show the rendered prompts without writing them.', false)
  .action(stackCommand);

program
  .command('doctor')
  .description('Check that docs taxonomy, CHANGELOG, and agent prompt directories are in order.')
  .option('-d, --dir <path>', 'Target project directory', process.cwd())
  .action(doctorCommand);

program.parseAsync(process.argv).catch((err) => {
  console.error(kleur.red('✖ ' + (err?.message || err)));
  process.exit(1);
});
