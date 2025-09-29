import type { Request, Response, NextFunction} from "express"

//imprimir cada petición
export const logger = (req: Request, res: Response, next: NextFunction) => {
  const now = new Date().toISOString();
  //method: GET / POST, etc
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
};
