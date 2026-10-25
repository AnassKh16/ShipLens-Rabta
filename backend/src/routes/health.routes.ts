import { Router } from 'express';
import { healthController } from '../controllers/health.controller.js';
import type { DatabaseProbe } from '../services/health.service.js';
export function healthRoutes(database: DatabaseProbe) {
  const router = Router();
  router.get('/health', healthController(database));
  return router;
}
