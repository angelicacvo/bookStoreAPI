import { Router } from "express";
import {
  getUsersController,
  getUserByIdController,
  postUserController,
  updateUserController,
  deleteUserController,
} from "../controllers/users.controller.ts";

const router: Router = Router();

router.get("/", getUsersController);

router.get("/:id", getUserByIdController);

router.post("/", postUserController);

router.put("/:id", updateUserController);

router.delete("/:id", deleteUserController);

export { router };