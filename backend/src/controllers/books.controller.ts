import type { Request, Response } from "express";
import {
  getBooksService,
  getBookByIdService,
  postBookService,
  updateBookService,
  deleteBookService,
} from "../services/books.services.ts";

/**
 * Obtiene todos los libros.
 * Ruta: GET /books
 */
export const getBooksController = async (req: Request, res: Response) => {
  const books = await getBooksService();
  res.json(books);
};

/**
 * Obtiene un libro por ID.
 * Ruta: GET /books/:id
 */
export const getBookByIdController = async (req: Request, res: Response) => {
  const bookId = Number(req.params.id);
  const book = await getBookByIdService(bookId);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
};

/**
 * Crea un nuevo libro. Protegido por autenticación.
 * Ruta: POST /books
 */
export const postBookController = async (req: Request, res: Response) => {
  const newBook = await postBookService(req.body);
  res.status(201).json(newBook);
};

/**
 * Actualiza un libro existente. Protegido por autenticación.
 * Ruta: PUT /books/:id
 */
export const updateBookController = async (req: Request, res: Response) => {
  try {
    const bookId = Number(req.params.id);
    const updatedBook = await updateBookService(bookId, req.body);
    if (!updatedBook) return res.status(404).send("Book not found");
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

/**
 * Elimina un libro. Protegido por autenticación.
 * Ruta: DELETE /books/:id
 */
export const deleteBookController = async (req: Request, res: Response) => {
  const bookId = Number(req.params.id);
  const deleted = await deleteBookService(bookId);
  if (!deleted) return res.status(404).json({ error: "Book not found" });
  res.json({ message: "Book deleted successfully" });
};
