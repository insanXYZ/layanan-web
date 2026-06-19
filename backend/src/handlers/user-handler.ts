import { db } from "@/db";
import { usersTable } from "@/db/schema";
import {
  CreateUserRequest,
  GetMeResponse,
  UpdateMeRequest,
  UpdateUserRequest,
} from "@/dto/user-dto";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { eq, ne } from "drizzle-orm";
import { NextRequest } from "next/server";
import { JWTPayload } from "jose";
import { UserEntity } from "@/entities/user-entity";
import {
  getAbsoluteFilenameUserImage,
  getFilename,
  saveUserImage,
} from "@/utils/file";
import bcrypt from "bcryptjs";

export async function GetMeHandler(_: NextRequest, claims: JWTPayload) {
  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, Number(claims.sub)));

    const user = users[0];

    const userResponse: GetMeResponse = {
      id: user.id,
      created_at: user.created_at,
      email: user.email,
      image: user.image!,
      name: user.name,
    };

    return ResponseOk(userResponse, "sukses mendapatkan informasi user");
  } catch (error) {
    return ResponseErr("gagal mendapatkan informasi user", error);
  }
}

export async function UpdateMeHandler(req: NextRequest, claims: JWTPayload) {
  try {
    const formData = await req.formData();

    const image = formData.get("image");
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const payload = {
      image: image ? (image as File) : undefined,
      name: name as string,
      email: email as string,
      password: password ? password : undefined,
    };

    const parsed = UpdateMeRequest.safeParse(payload);

    if (!parsed.success) {
      throw parsed.error;
    }

    const data = parsed.data;

    await db.transaction(async (tx) => {
      const userUpdate: Partial<UserEntity> = {
        name: data.name,
        email: data.email,
      };

      let newFilename: string | undefined;

      if (data.image) {
        newFilename = getFilename(data.image);
        const absoluteUserImage = getAbsoluteFilenameUserImage(newFilename);
        userUpdate.image = absoluteUserImage;
      }

      if (data.password) {
        userUpdate.password = bcrypt.hashSync(data.password, 10);
      }

      await tx
        .update(usersTable)
        .set(userUpdate)
        .where(eq(usersTable.id, Number(claims.sub)));

      if (data.image && newFilename) {
        await saveUserImage(data.image, newFilename);
      }
    });
    return ResponseOk(null, "sukses memperbarui profile");
  } catch (error) {
    return ResponseErr("gagal memperbarui profile", error);
  }
}

export async function GetUsers(claims: JWTPayload) {
  try {
    const selectUser = {
      name: usersTable.name,
      email: usersTable.email,
      image: usersTable.image,
      id: usersTable.id,
    };

    const users = await db
      .select(selectUser)
      .from(usersTable)
      .where(ne(usersTable.id, Number(claims.sub)));

    return ResponseOk(users, "sukses mendapatkan data akun.");
  } catch (error) {
    return ResponseErr("gagal mendapatkan data akun.", error);
  }
}

export async function CreateUser(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const payload = {
      image: image ? image : undefined,
      name,
      email,
      password,
    };

    const parsed = CreateUserRequest.safeParse(payload);
    if (!parsed.success) {
      throw parsed.error;
    }

    const data = parsed.data;
    let filename: string | undefined;

    const newUser: UserEntity = {
      name: data.name,
      password: bcrypt.hashSync(data.password, 10),
      email: data.email,
    };

    if (data.image) {
      filename = getFilename(data.image);
      const absoluteUserImage = getAbsoluteFilenameUserImage(filename);
      newUser.image = absoluteUserImage;
    }

    await db.insert(usersTable).values(newUser);

    if (filename && data.image) {
      await saveUserImage(data.image, filename);
    }

    return ResponseOk(null, "sukses membuat akun");
  } catch (error) {
    return ResponseErr("gagal membuat akun.", error);
  }
}

export async function UpdateUser(req: NextRequest, userId: string) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const payload = {
      image: image ? image : undefined,
      name,
      email,
      password: password ? password : undefined,
    };

    const parsed = UpdateUserRequest.safeParse(payload);
    if (!parsed.success) {
      throw parsed.error;
    }

    const data = parsed.data;
    let filename: string | undefined;

    const updateUser: Partial<UserEntity> = {
      name: data.name,
      email: data.email,
    };

    if (data.password) {
      updateUser.password = bcrypt.hashSync(data.password, 10);
    }

    if (data.image) {
      filename = getFilename(data.image);
      const absoluteUserImage = getAbsoluteFilenameUserImage(filename);
      updateUser.image = absoluteUserImage;
    }

    await db
      .update(usersTable)
      .set(updateUser)
      .where(eq(usersTable.id, Number(userId)));

    if (filename && data.image) {
      await saveUserImage(data.image, filename);
    }

    return ResponseOk(null, "sukses memperbarui akun");
  } catch (error) {
    return ResponseErr("gagal memperbarui akun.", error);
  }
}

export async function DeleteUser(userId: string) {
  try {
    await db.delete(usersTable).where(eq(usersTable.id, Number(userId)));

    return ResponseOk(null, "sukses menghapus akun.");
  } catch (error) {
    return ResponseErr("gagal menghapus akun.", error);
  }
}
