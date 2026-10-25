import type { RequestHandler } from 'express';
import {
  healthService,
  type DatabaseProbe,
} from '../services/health.service.js';
export function healthController(database: DatabaseProbe): RequestHandler {
  const service = healthService(database);
  return async (_req, res) => {
    const result = await service.check();
    res.status(result.db === 'up' ? 200 : 503).json(result);
  };
}
