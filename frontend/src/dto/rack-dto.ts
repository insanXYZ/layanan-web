import z from "zod";
import { messageMaxZod } from "@/utils/zod";

export interface RackDto {
  id: number;
  name: string;
  created_at: Date;
}

export const CreateRackRequest = z.object({
  name: z.string().max(15, messageMaxZod(15, "nama")),
});

export const UpdateRackRequest = z.object({
  name: z.string().max(15, messageMaxZod(15, "nama")),
});

interface RackBook {
  title: string;
}

export interface GetRackResponse {
  id: number;
  name: string;
  created_at: Date;
  total_book: number;
  books: RackBook[];
}
