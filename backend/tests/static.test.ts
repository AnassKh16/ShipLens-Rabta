import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { pino } from 'pino';
import { createApp } from '../src/app.js';

let root: string;
const html = '<!doctype html><html><body>RABTA fixture</body></html>';
const logger = pino({ level: 'silent' });
const probe = { async ping() {} };
const app = (production = false) =>
  createApp(probe, logger, { frontendDist: root, production });

beforeAll(async () => {
  root = await mkdtemp(join(tmpdir(), 'rabta-static-'));
  await mkdir(join(root, 'assets'));
  await mkdir(join(root, 'api'));
  await writeFile(join(root, 'index.html'), html);
  await writeFile(
    join(root, 'assets', 'app-abcdefgh.js'),
    'console.log("fixture");',
  );
  await writeFile(join(root, 'assets', 'plain.js'), '// unversioned fixture');
  await writeFile(join(root, 'api', 'shadow'), 'must not be served');
});
afterAll(async () => {
  await rm(root, { recursive: true, force: true });
});

describe('static frontend and routing', () => {
  it.each(['/', '/dev/tokens', '/dev/tokens/nested', '/index.html'])(
    'serves HTML without caching for %s',
    async (path) => {
      const res = await request(app()).get(path);
      expect(res.status).toBe(200);
      expect(res.text).toBe(html);
      expect(res.headers['content-type']).toContain('text/html');
      expect(res.headers['cache-control']).toBe('no-cache');
    },
  );
  it('keeps the health response ahead of SPA fallback', async () => {
    const res = await request(app()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'ok',
      db: 'up',
      time: expect.any(String),
    });
  });
  it.each([
    '/api',
    '/api/unknown',
    '/api/shadow',
    '/health/unknown',
    '/assets/missing.js',
  ])('returns JSON 404 for %s', async (path) => {
    const res = await request(app()).get(path);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: { code: 'NOT_FOUND', message: 'Route not found', details: null },
    });
  });
  it('does not fall back on POST', async () => {
    expect((await request(app()).post('/dev/tokens')).status).toBe(404);
  });
  it('caches fingerprinted assets for a year', async () => {
    const res = await request(app()).get('/assets/app-abcdefgh.js');
    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toBe(
      'public, max-age=31536000, immutable',
    );
  });
  it('revalidates assets without a fingerprint', async () => {
    const res = await request(app()).get('/assets/plain.js');
    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toBe('no-cache');
  });
  it('returns JSON 404 when no frontend build exists', async () => {
    const empty = createApp(probe, logger, {
      frontendDist: join(root, 'absent'),
    });
    expect((await request(empty).get('/dev/tokens')).status).toBe(404);
  });
  it.each([false, true])(
    'sets CSP and environment-specific HSTS (production=%s)',
    async (production) => {
      const res = await request(app(production)).get('/');
      const csp = res.headers['content-security-policy'];
      for (const directive of [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self'",
        "font-src 'self'",
        "img-src 'self' data:",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "style-src-attr 'unsafe-inline'",
      ])
        expect(csp.split(';')).toContain(directive);
      if (production)
        expect(res.headers['strict-transport-security']).toContain(
          'max-age=31536000',
        );
      else expect(res.headers['strict-transport-security']).toBeUndefined();
    },
  );
});
