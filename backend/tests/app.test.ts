import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { pino } from 'pino';
import { createApp } from '../src/app.js';
import { parseEnv } from '../src/config/env.js';

const logger = pino({ level: 'silent' });
const down = createApp(
  {
    ping: async () => {
      throw new Error('sensitive connection details');
    },
  },
  logger,
);

describe('HTTP behavior without a database', () => {
  it('returns a safe 503 when the database fails', async () => {
    const response = await request(down).get('/health');
    expect(response.status).toBe(503);
    expect(response.body).toEqual({ status: 'degraded', db: 'down' });
    expect(response.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });
  it('returns the shared 404 shape and leaves CORS disabled', async () => {
    const response = await request(down)
      .get('/missing')
      .set('Origin', 'https://example.invalid');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: { code: 'NOT_FOUND', message: 'Route not found', details: null },
    });
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });
  it('does not expose invalid JSON contents', async () => {
    const response = await request(down)
      .post('/missing')
      .set('Content-Type', 'application/json')
      .send('{"secret":');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: 'INVALID_JSON',
        message: 'Invalid JSON body',
        details: null,
      },
    });
  });
  it('rejects bodies above 1mb', async () => {
    const response = await request(down)
      .post('/missing')
      .send({ text: 'x'.repeat(1024 * 1024) });
    expect(response.status).toBe(413);
    expect(response.body.error.code).toBe('PAYLOAD_TOO_LARGE');
  });
});

describe('configuration', () => {
  it('fails clearly without echoing invalid values', () => {
    const result = () =>
      parseEnv({
        DATABASE_URL: 'private-database-value',
        SESSION_SECRET: 'private-secret',
      });
    expect(result).toThrow('DATABASE_URL, SESSION_SECRET');
    expect(result).not.toThrow('private-database-value');
    expect(result).not.toThrow('private-secret');
  });
  it('accepts valid settings and sets safe defaults', () => {
    const config = parseEnv({
      DATABASE_URL: 'postgresql://localhost/rabta',
      SESSION_SECRET: 'x'.repeat(32),
    });
    expect(config.PORT).toBe(3000);
    expect(config.TZ_DISPLAY).toBe('Asia/Karachi');
  });
  it('rejects the documented secret placeholder', () => {
    expect(() =>
      parseEnv({
        DATABASE_URL: 'postgresql://localhost/rabta',
        SESSION_SECRET: 'replace-with-a-random-secret-at-least-32-characters',
      }),
    ).toThrow('SESSION_SECRET');
  });
});
