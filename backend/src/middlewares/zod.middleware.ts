import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * validateBody(schema): valida req.body con Zod.
 * - Si falla, responde 400 con lista de {field, message}
 * - Si pasa, reemplaza req.body con los datos parseados y llama next()
 */
export const validateBody = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.body);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map(err => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return res.status(400).json({ ok: false, errors });
    }

    req.body = parseResult.data;
    next();
  };
};
