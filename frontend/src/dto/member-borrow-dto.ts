import z from "zod";
import { messageMaxZod, messageMinZod } from "@/utils/zod";

export interface MemberBorrowDto {
  id: number;
  name: string;
  phone_number: string;
  created_at: Date;
}

export const UpdateMemberBorrowRequest = z.object({
  name: z
    .string()
    .min(3, messageMinZod(3, "nama"))
    .max(50, messageMaxZod(50, "nama")),
  phone_number: z
    .string()
    .max(50, messageMaxZod(50, "nomor handphone"))
    .optional(),
});

export const CreateMemberBorrowRequest = z.object({
  name: z
    .string()
    .min(3, messageMinZod(3, "nama"))
    .max(50, messageMaxZod(50, "nama")),
  phone_number: z
    .string()
    .max(50, messageMaxZod(50, "nomor handphone"))
    .optional(),
});
