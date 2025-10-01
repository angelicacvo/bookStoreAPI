// schemas/book.schema.ts
import { z } from "zod";

export const bookSchema = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    isbn: z.string().optional(), 
    genre: z.string().min(1, "Genre is required"),
    language:  z.string().min(1, "Language is required"),
    cover_url:  z.string().min(1, "Cover url is required"),
    description:  z.string().min(1, "Description is required"),
});
