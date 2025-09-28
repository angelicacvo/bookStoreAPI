import type { Request, Response } from "express";
import { registerNewUserService, loginUserService } from "../services/auth.services.ts";

// POST /auth/register
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

// POST /auth/login
const loginController = async (req: Request, res: Response) => {
  try {
    const userData = req.body; 
    const result = await loginUserService(userData);
    return res.status(result.status).json(result);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
};

export { registerController, loginController };

