import z from "zod";

export interface RackDto {
  id: number;
  name: string;
  created_at: Date;
}

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
