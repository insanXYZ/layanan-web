import { db } from ".";
import bcrypt from "bcryptjs";
import { usersTable } from "./schema";
import { UserEntity } from "@/entities/user-entity";

async function seed() {
  try {
    const userAdmin: UserEntity = {
      name: "admin1",
      password: bcrypt.hashSync("12345678", 10),
      email: "admin@gmail.com",
    };

    await db.insert(usersTable).values(userAdmin);
  } catch (error) {
    console.log(error);
  }
}

seed();
