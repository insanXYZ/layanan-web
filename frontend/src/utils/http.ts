import { Response } from "@/dto/http-dto";
import { NextResponse } from "next/server";

export const ResponseOk = (data: any, message: string) => {
  const response: Response = {
    data,
    message,
  };

  return NextResponse.json(response, {
    status: 200,
  });
};

export const ResponseErr = (message: string, error?: any) => {
  const response: Response = {
    message,
  };

  if (error) {
    response.error = error instanceof Error ? error.message : undefined;
  }

  return NextResponse.json(response, {
    status: 400,
  });
};
