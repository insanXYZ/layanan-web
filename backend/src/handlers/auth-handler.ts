import "dotenv/config";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { KeyAccessToken } from "@/dto/http-dto";
import { CreateToken } from "@/utils/jwt";
import { ResponseErr, ResponseOk } from "@/utils/http";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { LoginRequest } from "@/dto/user-dto";

export const LoginHandler = async (request: NextRequest) => {
  try {
    const json = await request.json();
    const parsed = LoginRequest.parse(json);
    console.log("request", parsed);
    console.log(process.env.DATABASE_URL!);
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, parsed.email));

    if (users.length == 0) {
      throw new Error("email or password wrong");
    }

    const user = users[0];

    const isCompared = bcrypt.compareSync(parsed.password, user.password);
    if (!isCompared) {
      throw new Error("email or password wrong");
    }

    const token = await CreateToken({
      payload: {
        sub: user.id.toString(),
      },
      exp: "1d",
    });

    const response = ResponseOk(null, "success login");
    response.cookies.set(KeyAccessToken, token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.log("error ", error);
    return ResponseErr("email or password wrong", error);
  }
};
