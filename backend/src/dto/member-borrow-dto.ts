import z from "zod";

export const UpdateMemberBorrowRequest = z.object({
  name: z.string().min(3).max(50),
  phone_number: z.string().max(50).optional(),
});

export const CreateMemberBorrowRequest = z.object({
  name: z.string().min(3).max(50),
  phone_number: z.string().max(50).optional(),
});
