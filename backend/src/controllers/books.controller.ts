// maneja la lógica de la ruta, maneja errores y decide que servicios utiliza
// no sabe de lógica de negocio
import type { Request, Response } from "express";
import {
  getBooksService,
  getBookByIdService,
  postBookService,
  updateBookService,
  deleteBookService,
} from "../services/books.services.ts";

export const getBooksController = async (req: Request, res: Response) => {
  const books = await getBooksService();
  res.json(books);
};

export const getBookByIdController = async (req: Request, res: Response) => {
  const bookId = Number(req.params.id);
  const book = await getBookByIdService(bookId);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
};


export const postBookController = async (req: Request, res: Response) => {
  const newBook = await postBookService(req.body);
  res.status(201).json(newBook);
};

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

export const deleteBookController = async (req: Request, res: Response) => {
  const bookId = Number(req.params.id);
  const deleted = await deleteBookService(bookId);
  if (!deleted) return res.status(404).json({ error: "Book not found" });
  res.json({ message: "Book deleted successfully" });
};
