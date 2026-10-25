import type { Pool } from 'pg';
export function healthRepository(pool: Pool) {
  return {
    async ping(): Promise<void> {
      await pool.query('SELECT 1');
    },
  };
}
