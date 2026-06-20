import z from "zod";

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
  name: z.string().min(3).max(50),
  email: z.email(),
  password: z.string().min(8).max(100),
});

export const UpdateUserRequest = z.object({
  image: z.file().mime(["image/png", "image/jpeg", "image/webp"]).optional(),
  name: z.string().min(3).max(50),
  email: z.email(),
  password: z.string().min(8).max(100).optional(),
});

export const LoginRequest = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const UpdateMeRequest = z.object({
  image: z.file().mime(["image/png", "image/jpeg", "image/webp"]).optional(),
  name: z.string().min(3).max(50),
  email: z.email(),
  password: z.string().min(8).max(100).optional(),
});
