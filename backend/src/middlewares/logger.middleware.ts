import type { Request, Response, NextFunction} from "express"

// Logger: imprime método y URL con timestamp en cada petición
export const logger = (req: Request, res: Response, next: NextFunction) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
};
