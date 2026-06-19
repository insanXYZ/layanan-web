import { BookEntity } from "@/entities/book-entity";
import z from "zod";

export type BookDto = BookEntity;

export const CreateBookRequest = z.object({
  image: z.file().mime(["image/png", "image/jpeg", "image/webp"]).optional(),
  title: z.string().min(3).max(100),
  rack_id: z.string().optional(),
  quantity: z.int().min(0),
});

export const UpdateBookRequest = z.object({
  image: z.file().mime(["image/png", "image/jpeg", "image/webp"]).optional(),
  title: z.string().min(3).max(100),
  rack_id: z.string().optional(),
  quantity: z.int().min(0),
});

export interface GetBookResponse extends BookEntity {
  available_quantity: number;
  rack_name: string;
}
