import { memberBorrowsTable } from "@/db/schema";

export type MemberBorrowsEntity = typeof memberBorrowsTable.$inferInsert;
