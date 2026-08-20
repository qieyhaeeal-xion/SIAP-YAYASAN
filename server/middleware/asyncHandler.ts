import { Request, Response, NextFunction, RequestHandler } from 'express';

// Wrapper untuk route handler async: error otomatis diteruskan ke
// global error handler di index.ts, sehingga promise rejection
// tidak pernah membuat server crash atau hang.
type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export function asyncHandler(fn: AsyncRouteHandler): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
