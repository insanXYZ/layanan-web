import z from "zod";

export const CreateRackRequest = z.object({
  name: z.string().max(15),
});

export const UpdateRackRequest = z.object({
  name: z.string().max(15),
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
