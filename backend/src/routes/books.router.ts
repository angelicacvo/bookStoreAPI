// routes/books.router.ts - Endpoints para libros
// GET abiertos; POST/PUT/DELETE protegidos por JWT + validaciones Zod
import { Router } from "express";
import {
  getBooksController,
  getBookByIdController,
  postBookController,
  updateBookController,
  deleteBookController,
} from "../controllers/books.controller.ts";
import { logger } from "../middlewares/logger.middleware.ts";
import { bookSchema } from "../models/schemas/book.schema.ts";
import { validateBody } from "../middlewares/zod.middleware.ts";
import { auth } from "../middlewares/auth.middleware.ts";

const router: Router = Router();

// Loggea todas las peticiones a /books
router.use(logger);

// Público: lista todos los libros
router.get("/", getBooksController);

// Público: obtiene un libro por ID
router.get("/:id", getBookByIdController);

// Protegido: crea libro (requiere token y body válido)
router.post("/", auth, validateBody(bookSchema), postBookController);

// Protegido: edita libro (requiere token y body válido)
router.put("/:id", auth, validateBody(bookSchema), updateBookController);

// Protegido: elimina libro (requiere token)
router.delete("/:id", auth, deleteBookController);

export { router };











