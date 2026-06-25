import z from "zod";
import { messageEmailZod, messageMaxZod, messageMinZod } from "@/utils/zod";

export interface UserDto {
  id: number;
  name: string;
  email: string;
  image?: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface GetMeResponse {
  id: number;
  name: string;
  email: string;
  image: string;
  created_at: Date;
}

export const CreateUserRequest = z.object({
  image: z.file().mime(["image/png", "image/jpeg", "image/webp"]).optional(),
  name: z
    .string()
    .min(3, messageMinZod(3, "nama"))
    .max(50, messageMaxZod(50, "nama")),
  email: z.email({ message: "email tidak valid" }),
  password: z
    .string()
    .min(8, messageMinZod(8, "password"))
    .max(100, messageMaxZod(100, "password")),
});

export const UpdateUserRequest = z.object({
  image: z.file().mime(["image/png", "image/jpeg", "image/webp"]).optional(),
  name: z
    .string()
    .min(3, messageMinZod(3, "nama"))
    .max(50, messageMaxZod(50, "nama")),
  email: z.email(messageEmailZod()),
  password: z
    .string()
    .min(8, messageMinZod(8, "password"))
    .max(100, messageMaxZod(100, "password"))
    .optional(),
});

export const LoginRequest = z.object({
  email: z.email(messageEmailZod()),
  password: z.string().min(8, messageMinZod(8, "password")),
});

export const UpdateMeRequest = z.object({
  image: z.file().mime(["image/png", "image/jpeg", "image/webp"]).optional(),
  name: z
    .string()
    .min(3, messageMinZod(3, "nama"))
    .max(50, messageMinZod(50, "nama")),
  email: z.email(messageEmailZod()),
  password: z
    .string()
    .min(8, messageMinZod(8, "password"))
    .max(100, messageMaxZod(100, "password"))
    .optional(),
});
