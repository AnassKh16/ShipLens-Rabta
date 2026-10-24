import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const source = process.argv[2];
if (!source) throw new Error('Provide the external hero originals directory as the first argument.');
const output = resolve('src/assets/images');
await mkdir(output, { recursive: true });
const jobs = [
  ['hero-desktop-1920', 'hero-original.jpg', 1920, 1080, true],
  ['hero-desktop-960', 'hero-original.jpg', 960, 540, true],
  ['hero-mobile-720', 'hero-original.jpg', 720, 900, true],
  ['about-alt-1280', 'hero-alt-1.jpg', 1280, 853, false],
];
// The grading color is read from the single design-token source.
const tokens = await (await import('node:fs/promises')).readFile('src/styles/tokens.css', 'utf8');
const primary = tokens.match(/--primary:\s*([^;]+);/)[1].trim();
const manifest = {};
for (const [name, original, width, height, overlay] of jobs) {
  const input = sharp(resolve(source, original)).rotate();
  const meta = await input.metadata();
  const cropWidth = Math.min(meta.width, Math.round(meta.height * width / height));
  const cropHeight = Math.min(meta.height, Math.round(meta.width * height / width));
  // Center the horizon/sun strip at 55% of the original height.
  const left = Math.round((meta.width - cropWidth) / 2);
  const top = Math.max(0, Math.min(meta.height - cropHeight, Math.round(meta.height * .55 - cropHeight / 2)));
  let graded = input.extract({ left, top, width: cropWidth, height: cropHeight }).resize(width, height).modulate({ saturation: .6 });
  if (overlay) {
    const tint = await sharp({ create: { width, height, channels: 4, background: primary } }).ensureAlpha(.18).png().toBuffer();
    graded = graded.composite([{ input: tint, blend: 'over' }]);
  }
  const raw = await graded.png().toBuffer();
  for (const format of ['avif', 'webp']) {
    let data;
    for (let quality = 75; quality >= 15; quality -= 5) {
      data = await sharp(raw)[format]({ quality }).toBuffer();
      if (data.length <= 150 * 1024) break;
    }
    if (data.length > 150 * 1024) throw new Error(`${name}.${format} exceeds the size budget`);
    const file = `${name}.${format}`;
    await writeFile(resolve(output, file), data);
    manifest[file] = { width, height, bytes: data.length };
  }
}
await writeFile(resolve(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(manifest);
