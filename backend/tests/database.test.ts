import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import pg from 'pg';
import request from 'supertest';
import { pino } from 'pino';
import { migrate } from '../src/db/migrate.js';
import { createApp } from '../src/app.js';
import { healthRepository } from '../src/repositories/health.repository.js';

dotenv.config({
  path: fileURLToPath(new URL('../../.env', import.meta.url)),
  quiet: true,
});
const databaseUrl = process.env.TEST_DATABASE_URL;
if (!databaseUrl)
  console.warn(
    'PostgreSQL integration tests SKIPPED: TEST_DATABASE_URL is not set.',
  );

// Each run owns a random schema. No public tables or development data are reset.
const schema = `test_${randomUUID().replaceAll('-', '')}`;
const identifier = pg.escapeIdentifier(schema);
let admin: pg.Pool;
let pool: pg.Pool;
let branchId: string;
let userId: string;

describe.skipIf(!databaseUrl)('real PostgreSQL integration', () => {
  beforeAll(async () => {
    admin = new pg.Pool({
      connectionString: databaseUrl,
      connectionTimeoutMillis: 5000,
    });
    await admin.query(`CREATE SCHEMA ${identifier}`);
    pool = new pg.Pool({
      connectionString: databaseUrl,
      options: `-c search_path=${schema} -c timezone=UTC`,
      max: 20,
      connectionTimeoutMillis: 5000,
    });
    expect(await migrate(pool)).toEqual([
      '0001_core.sql',
      '0002_audit_and_content.sql',
    ]);
    const branch = await pool.query(
      'INSERT INTO branches (name, city) VALUES ($1, $2) RETURNING id',
      ['Test Branch', 'Test City'],
    );
    branchId = branch.rows[0].id;
    const user = await pool.query(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [
        'fixture@example.invalid',
        'not-a-real-password-hash',
        'Test User',
        'super_admin',
      ],
    );
    userId = user.rows[0].id;
  });
  afterAll(async () => {
    await pool?.end();
    if (admin) {
      try {
        await admin.query(`DROP SCHEMA IF EXISTS ${identifier} CASCADE`);
      } finally {
        await admin.end();
      }
    }
  });
  it('/health succeeds after a real SELECT 1', async () => {
    const app = createApp(healthRepository(pool), pino({ level: 'silent' }));
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      db: 'up',
      time: expect.any(String),
    });
    expect(new Date(response.body.time).toISOString()).toBe(response.body.time);
  });
  it('applies nothing on the second migration run', async () => {
    expect(await migrate(pool)).toEqual([]);
    const result = await pool.query('SELECT count(*) FROM schema_migrations');
    expect(result.rows[0].count).toBe('2');
  });
  it.each([
    'UPDATE audit_log SET action = $1',
    'DELETE FROM audit_log',
    'TRUNCATE audit_log',
  ])('blocks %s', async (sql) => {
    await pool.query(
      'INSERT INTO audit_log (action, entity, entity_id) VALUES ($1, $2, $3)',
      ['test', 'branches', branchId],
    );
    await expect(
      pool.query(sql, sql.includes('$1') ? ['changed'] : []),
    ).rejects.toMatchObject({ code: '55000' });
  });
  it('generates 20 distinct branch codes under concurrency', async () => {
    const results = await Promise.all(
      Array.from({ length: 20 }, (_, i) =>
        pool.query(
          'INSERT INTO branches (name, city) VALUES ($1, $2) RETURNING code',
          [`Test Branch ${i}`, 'Test City'],
        ),
      ),
    );
    const codes = results.map((result) => result.rows[0].code);
    expect(new Set(codes).size).toBe(20);
    for (const code of codes) expect(code).toMatch(/^BR-\d{6,}$/);
  });
  it('rejects duplicate pending emails but allows a new application after review', async () => {
    const sql =
      'INSERT INTO applications (full_name, email, phone, city, motivation) VALUES ($1, $2, $3, $4, $5)';
    const values = [
      'Test Applicant',
      'applicant@example.invalid',
      'TEST-PHONE',
      'Test City',
      'Test motivation',
    ];
    await pool.query(sql, values);
    await expect(
      pool.query(sql, [
        values[0],
        'APPLICANT@example.invalid',
        ...values.slice(2),
      ]),
    ).rejects.toMatchObject({ code: '23505' });
    await pool.query('UPDATE applications SET status = $1 WHERE email = $2', [
      'declined',
      values[1],
    ]);
    await expect(pool.query(sql, values)).resolves.toMatchObject({
      rowCount: 1,
    });
  });
  it.each([0, -1])('rejects amount_paisa=%i', async (amount) => {
    await expect(
      pool.query(
        'INSERT INTO collections (branch_id, amount_paisa, collected_on, source, logged_by) VALUES ($1, $2, $3, $4, $5)',
        [branchId, amount, '2026-10-19', 'Test source', userId],
      ),
    ).rejects.toMatchObject({ code: '23514' });
  });
  it('accepts positive paisa amounts', async () => {
    await expect(
      pool.query(
        'INSERT INTO collections (branch_id, amount_paisa, collected_on, source, logged_by) VALUES ($1, $2, $3, $4, $5)',
        [branchId, '1', '2026-10-19', 'Test source', userId],
      ),
    ).resolves.toMatchObject({ rowCount: 1 });
  });
});
