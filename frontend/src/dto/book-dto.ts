import z from "zod";
import { messageMaxZod, messageMinZod } from "@/utils/zod";

export interface BookDto {
  id: number;
  image?: string;
  quantity: number;
  title: string;
  rack_id: number;
  created_at: Date;
  updated_at: Date;
}

export const CreateBookRequest = z.object({
  image: z.file().mime(["image/png", "image/jpeg", "image/webp"]).optional(),
  title: z
    .string()
    .min(3, messageMinZod(3, "judul"))
    .max(100, messageMaxZod(100, "judul")),
  rack_id: z.string().optional(),
  quantity: z.int().min(0),
});

export const UpdateBookRequest = z.object({
  image: z.file().mime(["image/png", "image/jpeg", "image/webp"]).optional(),
  title: z
    .string()
    .min(3, messageMinZod(3, "judul"))
    .max(100, messageMaxZod(100, "judul")),
  rack_id: z.string().optional(),
  quantity: z.int().min(0),
});

export interface GetBookResponse extends BookDto {
  available_quantity: number;
  rack_name: string;
}
