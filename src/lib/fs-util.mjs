// Filesystem helpers — keep them tiny so the CLI stays dependency-light.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
export const PKG_ROOT = path.resolve(path.dirname(__filename), '..', '..');
export const TEMPLATES_DIR = path.join(PKG_ROOT, 'templates');

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export async function writeFile(filePath, content, { force = false, dryRun = false } = {}) {
  const exists = await fileExists(filePath);
  if (exists && !force) {
    return { status: 'skipped', reason: 'exists' };
  }
  if (dryRun) {
    return { status: 'dry-run', bytes: Buffer.byteLength(content, 'utf-8') };
  }
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
  return { status: exists ? 'overwritten' : 'created' };
}

export async function readTemplate(relativePath) {
  return fs.readFile(path.join(TEMPLATES_DIR, relativePath), 'utf-8');
}

export async function listTemplates(relativeDir) {
  const dir = path.join(TEMPLATES_DIR, relativeDir);
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries;
}

// Walk a templates subdirectory, yielding [absoluteSource, relativeToSubdir].
export async function* walkTemplates(relativeDir) {
  const root = path.join(TEMPLATES_DIR, relativeDir);
  async function* walk(currentDir, prefix) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(currentDir, entry.name);
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        yield* walk(abs, rel);
      } else {
        yield [abs, rel];
      }
    }
  }
  yield* walk(root, '');
}
