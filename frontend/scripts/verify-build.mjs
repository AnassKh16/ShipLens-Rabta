import { readdir, readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
const files = await readdir('dist/assets');
if (files.some(file => /TokenPage|tokens-preview|ComponentsPage|components-preview/i.test(file))) throw new Error('Development route chunk leaked into production.');
let total = 0;
for (const file of files.filter(file => file.endsWith('.js'))) {
  const source = await readFile(`dist/assets/${file}`);
  if (source.includes('swatches') || source.includes('--sample-space') || source.includes('component-showcase') || source.includes('focus-destination')) throw new Error('Token inspector implementation leaked into production.');
  const bytes = gzipSync(source).length;
  console.log(`${file}: ${bytes} gzip bytes`);
  total += bytes;
}
// Conservative budget: count every JS chunk, including the lazy admin tree.
if (total > 150 * 1024) throw new Error('Public JavaScript budget exceeded.');
console.log(`All JS chunks combined: ${total} gzip bytes. Development route absent.`);
const images = JSON.parse(await readFile('src/assets/images/manifest.json','utf8'));
for (const [file,metadata] of Object.entries(images)) {
  if (metadata.bytes !== (await readFile(`src/assets/images/${file}`)).length) throw new Error(`Stale manifest: ${file}`);
  if (metadata.bytes > 150 * 1024) throw new Error(`Image budget exceeded: ${file}`);
}
console.log('Image manifest and image budgets passed.');
