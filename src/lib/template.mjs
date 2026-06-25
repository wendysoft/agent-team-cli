// Simple {{ var }} renderer — no logic, no loops. We control the templates.
// Unknown vars render as empty string and emit a warning to stderr (caller may suppress).

export function render(template, vars, { onMissing = 'warn' } = {}) {
  const missing = new Set();
  const out = template.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, key) => {
    const value = resolve(vars, key);
    if (value === undefined || value === null) {
      missing.add(key);
      return '';
    }
    return String(value);
  });
  if (missing.size && onMissing === 'warn') {
    for (const key of missing) {
      process.stderr.write(`⚠️  template missing variable: ${key}\n`);
    }
  }
  return out;
}

function resolve(vars, dottedKey) {
  return dottedKey.split('.').reduce((acc, k) => (acc == null ? undefined : acc[k]), vars);
}

// Conditional render: keep block between {{#if key}} ... {{/if}} only when key is truthy.
export function renderConditionals(template, vars) {
  return template.replace(/\{\{#if\s+([a-zA-Z0-9_.]+)\s*\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, block) => {
    const value = resolve(vars, key);
    return value ? block : '';
  });
}

export function fullRender(template, vars) {
  // Order matters: conditionals first, then var substitution.
  return render(renderConditionals(template, vars), vars);
}
