import pg from 'pg';

export function createPool(connectionString: string) {
  return new pg.Pool({
    connectionString,
    options: '-c timezone=UTC',
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    statement_timeout: 10000,
  });
}
