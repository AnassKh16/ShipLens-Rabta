import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Pool } from 'pg';
import { loadConfig } from '../config/env.js';
import { createLogger } from '../utils/logger.js';
import { createPool } from './pool.js';

const defaultDirectory = fileURLToPath(
  new URL('../../../db/migrations/', import.meta.url),
);

export async function migrate(
  pool: Pool,
  directory = defaultDirectory,
): Promise<string[]> {
  const files = (await readdir(directory))
    .filter((file) => /^\d{4}_[a-z0-9_]+\.sql$/.test(file))
    .sort();
  const client = await pool.connect();
  const applied: string[] = [];
  try {
    // Session lock serializes runners, including creation of the ledger.
    await client.query('SELECT pg_advisory_lock($1)', [726282]);
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      filename text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now()
    )`);
    for (const file of files) {
      const found = await client.query(
        'SELECT filename FROM schema_migrations WHERE filename = $1',
        [file],
      );
      if (found.rowCount) continue;
      const sql = await readFile(resolve(directory, file), 'utf8');
      await client.query('BEGIN');
      try {
        // SQL comes only from trusted, version-controlled migration files.
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1)',
          [file],
        );
        await client.query('COMMIT');
        applied.push(file);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
    return applied;
  } finally {
    try {
      await client.query('SELECT pg_advisory_unlock($1)', [726282]);
    } finally {
      client.release();
    }
  }
}

async function main() {
  const logger = createLogger();
  let pool: Pool | undefined;
  try {
    const config = loadConfig();
    pool = createPool(config.DATABASE_URL);
    const applied = await migrate(pool);
    logger.info({ applied }, 'Migrations complete');
  } catch {
    // Database exceptions may include connection strings or record contents.
    logger.error(
      'Migration failed; check environment configuration and migration files',
    );
    process.exitCode = 1;
  } finally {
    await pool?.end();
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await main();
}
