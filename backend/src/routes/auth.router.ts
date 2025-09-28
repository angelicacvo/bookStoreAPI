import { Router } from "express";
import { registerController, loginController } from "../controllers/auth.controller.ts";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);

export { router as authRouter };

