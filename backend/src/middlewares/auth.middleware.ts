import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Middleware de autenticación con JWT.
 * - Espera header: Authorization: Bearer <token>
 * - Si es válido, adjunta el payload en req.user
 * - Si no, responde 401
 */
export const auth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    // Espera formato: Authorization: Bearer <token>
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ ok: false, message: "Unauthorized: No token provided" });
    }

    try {
        // Verifica el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
        // Puedes guardar el usuario en req.user si lo necesitas
        (req as any).user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ ok: false, message: "Invalid token" });
    }
}




