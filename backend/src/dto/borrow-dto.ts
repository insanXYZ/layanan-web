import z from "zod";
import { BorrowDetailEntity, BorrowEntity } from "@/entities/borrow-entity";
import { BookDto } from "./book-dto";

export interface BorrowDetailDto extends BorrowDetailEntity {
  book: BookDto;
}

export interface BorrowDto extends BorrowEntity {
  member_borrow_name: string;
  borrow_details: BorrowDetailDto[];
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
