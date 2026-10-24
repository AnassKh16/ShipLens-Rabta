import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
export function violations(source) {
  const clean = source.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [
    ['hex color', /#[\da-f]{3,8}\b/gi],
    ['raw font-family', /font-family\s*:(?!\s*var\()[^;}]+/gi],
    ['physical CSS property', /(?:^|[;{\s])(?:margin-(?:left|right)|padding-(?:left|right)|(?:left|right)|border-(?:left|right)(?:-[\w-]+)?)\s*:/gim],
    ['physical CSS value', /(?:text-align|float)\s*:\s*(?:left|right)\b/gi],
    ['physical inline style', /\b(?:marginLeft|marginRight|paddingLeft|paddingRight|borderLeft|borderRight|left|right)\s*:/g],
    ['raw inline font family', /fontFamily\s*:\s*['"](?!var\()/g],
  ];
  return rules.flatMap(([name, regex]) => [...clean.matchAll(regex)].map(m => `${name} at line ${clean.slice(0,m.index).split('\n').length}`));
}
export async function scan(root) {
  const results = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const file = resolve(root, entry.name);
    if (entry.isDirectory()) results.push(...await scan(file));
    else if (/\.(css|[jt]sx?)$/.test(file) && !/\/styles\/(tokens|fonts)\.css$/.test(file)) {
      results.push(...violations(await readFile(file, 'utf8')).map(message => `${file}: ${message}`));
    }
  }
  return results;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const errors = await scan(resolve(process.argv[2] ?? 'src'));
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  else console.log('Style token and logical-property checks passed.');
}
