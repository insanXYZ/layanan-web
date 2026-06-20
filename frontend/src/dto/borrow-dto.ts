import z from "zod";
import { BookDto } from "./book-dto";
import { MemberBorrowDto } from "./member-borrow-dto";

export interface BorrowDto {
  id: number;
  member_borrow_id: number;
  is_returned: boolean;
  due_date: Date;
  returned_at: Date;
  created_at: Date;
  member: MemberBorrowDto;
  borrow_details: BorrowDetailDto[];
}

export interface BorrowDetailDto {
  id: number;
  book_id: number;
  quantity: number;
  borrow_id: number;
  created_at: Date;
  book: BookDto;
}

export type GetBorrowResponse = BorrowDto;

export const CreateBorrowRequest = z.object({
  member_borrow_id: z.int(),
  due_date: z.coerce.date(),
  borrow_details: z
    .array(
      z.object({
        book_id: z.number().int(),
        quantity: z.number().int(),
      }),
    )
    .min(1),
});
