import { pino } from 'pino';

export function createLogger() {
  return pino({
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'res.headers["set-cookie"]',
        'password',
        'password_hash',
        'SESSION_SECRET',
        'DATABASE_URL',
        'TEST_DATABASE_URL',
      ],
      censor: '[REDACTED]',
    },
  });
}
