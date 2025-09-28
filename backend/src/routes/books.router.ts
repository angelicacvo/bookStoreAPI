import { Router } from "express";
import {
  getBooksController,
  getBookByIdController,
  postBookController,
  updateBookController,
  deleteBookController,
} from "../controllers/books.controller.ts";

const router: Router = Router();

router.get("/", getBooksController);

router.get("/:id", getBookByIdController);

router.post("/", postBookController);

router.put("/:id", updateBookController);

router.delete("/:id", deleteBookController);

export { router };








