import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1] // Bearer <token>

    if (!token) return res.status(401).json({ ok: false, message: "No token provided" })

    try {
        // verificar si el token es válido
        const decoded = jwt.verify(token, "secretkey")
        next()
    } catch (err) {
        return res.status(401).json({ ok: false, message: "Invalid token" });
    }
}




