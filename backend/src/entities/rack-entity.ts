import { rackBooksTable } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";

export type RackEntity = InferInsertModel<typeof rackBooksTable>;
