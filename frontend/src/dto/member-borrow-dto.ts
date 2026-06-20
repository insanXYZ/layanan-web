import z from "zod";

export interface MemberBorrowDto {
  id: number;
  name: string;
  phone_number: string;
  created_at: Date;
}

export const UpdateMemberBorrowRequest = z.object({
  name: z.string().min(3).max(50),
  phone_number: z.string().max(50).optional(),
});

export const CreateMemberBorrowRequest = z.object({
  name: z.string().min(3).max(50),
  phone_number: z.string().max(50).optional(),
});
