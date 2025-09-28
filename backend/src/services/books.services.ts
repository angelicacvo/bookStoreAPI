import { promises as fs } from "fs";
import type { IBook } from "../interfaces/books.interface.ts";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Rutas necesarias para encontrar el archivo books.json
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const filePath = join(__dirname, "../models/books.json");

// Leer todos los libros
const getBooksService = async (): Promise<IBook[]> => {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data) as IBook[];
};

// Buscar libro por ID
const getBookByIdService = async (bookId: number): Promise<IBook | null> => {
  const books = await getBooksService();
  return books.find((b) => b.bookId === bookId) ?? null;
};

// Crear nuevo libro
const postBookService = async (
  bookData: Omit<IBook, "bookId" | "createdAt">
): Promise<IBook> => {
  const books = await getBooksService();

  const newBook: IBook = {
    bookId: (books[books.length - 1]?.bookId ?? 0) + 1, // autoincremental
    createdAt: new Date(),
    ...bookData,
  };

  books.push(newBook);
  await fs.writeFile(filePath, JSON.stringify(books, null, 2));
  return newBook;
};

// Actualizar libro
const updateBookService = async (
  bookId: number,
  bookData: Partial<IBook>
): Promise<IBook | null> => {
  const books = await getBooksService();
  const index = books.findIndex((b) => b.bookId === bookId);
  if (index === -1) return null;

  const existing = books[index]
  if (!existing){
    return null
  }

  const updatedBook: IBook = { ...existing, ...bookData, bookId: existing.bookId };
  books[index] = updatedBook
  await fs.writeFile(filePath, JSON.stringify(books, null, 2));
  return updatedBook;
};

// Eliminar libro
const deleteBookService = async (bookId: number): Promise<boolean> => {
  const books = await getBooksService();
  const index = books.findIndex((b) => b.bookId === bookId);
  if (index === -1) return false;

  books.splice(index, 1);
  await fs.writeFile(filePath, JSON.stringify(books, null, 2));
  return true;
};

export {
  getBooksService,
  getBookByIdService,
  postBookService,
  updateBookService,
  deleteBookService,
};
