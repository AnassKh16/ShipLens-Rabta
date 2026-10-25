import express from 'express';
import helmet from 'helmet';
import { frontendMiddleware } from './middleware/static.js';
import { pinoHttp } from 'pino-http';
import { randomUUID } from 'node:crypto';
import type { Logger } from 'pino';
import { createLogger } from './utils/logger.js';
import { healthRoutes } from './routes/health.routes.js';
import type { DatabaseProbe } from './services/health.service.js';
import { errorHandler, notFound } from './middleware/errors.js';

export function createApp(
  database: DatabaseProbe,
  logger: Logger = createLogger(),
  options: { frontendDist?: string; production?: boolean } = {},
) {
  const app = express();
  app.disable('x-powered-by');
  app.use(
    helmet({
      strictTransportSecurity: options.production
        ? { maxAge: 31536000, includeSubDomains: true }
        : false,
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          styleSrcAttr: ["'unsafe-inline'"],
          fontSrc: ["'self'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
          frameAncestors: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
    }),
  );
  // Generate IDs server-side; never trust arbitrary caller-supplied log identifiers.
  app.use(
    pinoHttp({
      logger,
      genReqId: (_req, res) => {
        const id = randomUUID();
        res.setHeader('X-Request-Id', id);
        return id;
      },
      // Do not log headers, bodies, query strings, or exception objects.
      serializers: {
        req: (req: { id: string; method: string }) => ({
          id: req.id,
          method: req.method,
        }),
        res: (res: { statusCode: number }) => ({ statusCode: res.statusCode }),
        err: () => ({ message: 'Request failed' }),
      },
    }),
  );
  // CORS middleware is deliberately not enabled: the frontend is same-origin.
  app.use(express.json({ limit: '1mb' }));
  app.use(healthRoutes(database));
  if (options.frontendDist) app.use(frontendMiddleware(options.frontendDist));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
