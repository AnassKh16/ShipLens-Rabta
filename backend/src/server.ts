import { createApp } from './app.js';
import { loadConfig } from './config/env.js';
import { createPool } from './db/pool.js';
import { healthRepository } from './repositories/health.repository.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger();
// Validation errors contain field names only and must fail before listening.
const config = loadConfig();
const pool = createPool(config.DATABASE_URL);
pool.on('error', () => logger.error('Idle database connection failed'));
const app = createApp(healthRepository(pool), logger);
const server = app.listen(config.PORT, () =>
  logger.info({ port: config.PORT }, 'Server listening'),
);
server.on('error', () => {
  logger.error('HTTP server failed');
  process.exitCode = 1;
  void pool.end();
});
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    server.close(() => {
      void pool.end();
    });
  });
}
