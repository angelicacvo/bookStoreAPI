import type { Request, Response } from "express";
import { registerNewUserService, loginUserService } from "../services/auth.services.ts";
import jwt from "jsonwebtoken";

/**
 * Controlador para registrar un nuevo usuario
 * Ruta: POST /auth/register
 */
const registerController = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const result = await registerNewUserService(userData);
    return res.status(result.status).json(result);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
};

/**
 * Controlador para login de usuario
 * Ruta: POST /auth/login
 * Devuelve token JWT y datos básicos del usuario
 */
const loginController = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const result = await loginUserService(userData);
    if (result.status === 200) {
      // Decodifica el token para enviar datos básicos del usuario
      const decoded = jwt.decode(result.token!);
      return res.status(200).json({ token: result.token, user: decoded });
    }
    return res.status(result.status).json(result);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
};

export { registerController, loginController };

