import express, { type RequestHandler } from 'express';
import { resolve, sep } from 'node:path';

export function frontendMiddleware(directory: string): RequestHandler {
  const root = resolve(directory);
  const router = express.Router();
  // API and health namespaces must never be shadowed by files or SPA HTML.
  router.use((req, res, next) => {
    if (/^\/(api|health)(\/|$)/i.test(req.path)) return next('router');
    next();
  });
  router.use(
    express.static(root, {
      index: false,
      redirect: false,
      setHeaders(res, path) {
        // Vite fingerprints built assets; unversioned files must revalidate.
        const hashedAsset =
          path.startsWith(resolve(root, 'assets') + sep) &&
          /-[\w-]{8,}\.[\w.]+$/.test(path);
        res.setHeader(
          'Cache-Control',
          hashedAsset ? 'public, max-age=31536000, immutable' : 'no-cache',
        );
      },
    }),
  );
  router.get('/{*path}', (req, res, next) => {
    // Missing assets should not receive HTML with a misleading 200 response.
    if (req.path.startsWith('/assets/')) return next();
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(resolve(root, 'index.html'), (error) => {
      if (error && 'statusCode' in error && error.statusCode === 404)
        return next();
      if (error) next(error);
    });
  });
  return router;
}
