import { borrowDetailsTable, borrowsTable } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type BorrowEntity = InferSelectModel<typeof borrowsTable>;

export type BorrowDetailEntity = typeof borrowDetailsTable.$inferInsert;
