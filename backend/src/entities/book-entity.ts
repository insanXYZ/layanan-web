import { booksTable } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";

export type BookEntity = InferInsertModel<typeof booksTable>;
