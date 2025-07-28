import { z } from "zod";

// Book validation schema
export const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  publishedYear: z
    .number()
    .int("Published year must be an integer")
    .min(1000, "Published year must be at least 1000")
    .max(new Date().getFullYear(), `Published year cannot be in the future`),
  genre: z.string().min(1, "Genre is required"),
});

export type BookFormData = z.infer<typeof bookSchema>;