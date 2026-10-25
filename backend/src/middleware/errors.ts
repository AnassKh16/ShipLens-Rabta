import type { ErrorRequestHandler, RequestHandler } from 'express';

export const notFound: RequestHandler = (_req, res) => {
  res
    .status(404)
    .json({
      error: { code: 'NOT_FOUND', message: 'Route not found', details: null },
    });
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  const type =
    typeof error === 'object' && error !== null && 'type' in error
      ? error.type
      : undefined;
  const status =
    type === 'entity.too.large'
      ? 413
      : type === 'entity.parse.failed'
        ? 400
        : 500;
  const code =
    status === 413
      ? 'PAYLOAD_TOO_LARGE'
      : status === 400
        ? 'INVALID_JSON'
        : 'INTERNAL_ERROR';
  const message =
    status === 413
      ? 'Request body exceeds 1mb'
      : status === 400
        ? 'Invalid JSON body'
        : 'Internal server error';
  req.log.error({ requestId: req.id, code }, 'Request failed');
  res.status(status).json({ error: { code, message, details: null } });
};
