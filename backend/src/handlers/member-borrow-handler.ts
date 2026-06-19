import { desc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { memberBorrowsTable } from "@/db/schema";
import {
  CreateMemberBorrowRequest,
  UpdateMemberBorrowRequest,
} from "@/dto/member-borrow-dto";
import { MemberBorrowsEntity } from "@/entities/member-borrows-entity";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { Atoi } from "@/utils/utils";

export async function GetMemberBorrows() {
  try {
    const members = await db
      .select()
      .from(memberBorrowsTable)
      .orderBy(desc(memberBorrowsTable.id));

    return ResponseOk(members, "sukses mendapatkan data member perpustakaan,");
  } catch (error) {
    return ResponseErr("gagal mendapatkan data member perpustakaan.", error);
  }
}

export async function UpdateMember(req: NextRequest, memberId: string) {
  try {
    const json = await req.json();
    const parsed = UpdateMemberBorrowRequest.safeParse(json);

    if (!parsed.success) {
      throw parsed.error;
    }

    const data = parsed.data;
    const numMemberId = Atoi(memberId);

    await db
      .update(memberBorrowsTable)
      .set({
        name: data.name,
        phone_number: data.phone_number,
      })
      .where(eq(memberBorrowsTable.id, numMemberId));

    return ResponseOk(
      null,
      "sukses memperbarui informasi member perpustakaan.",
    );
  } catch (error) {
    return ResponseErr(
      "gagal memperbarui informasi member perpustakaan.",
      error,
    );
  }
}

export async function DeleteMember(memberId: string) {
  try {
    const numMemberId = Atoi(memberId);

    await db
      .delete(memberBorrowsTable)
      .where(eq(memberBorrowsTable.id, numMemberId));

    return ResponseOk(null, "sukses menghapus member perpustakaan.");
  } catch (error) {
    return ResponseErr("gagal menghapus member perpustakaan", error);
  }
}

export async function CreateMember(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = CreateMemberBorrowRequest.safeParse(json);

    if (!parsed.success) {
      throw parsed.error;
    }

    const data = parsed.data;

    const newMember: MemberBorrowsEntity = {
      phone_number: data.phone_number,
      name: data.name,
    };

    await db.insert(memberBorrowsTable).values(newMember);

    return ResponseOk(null, "sukses membuat member perpustakaan");
  } catch (error) {
    return ResponseErr("gagal membuat member perpustakaan.", error);
  }
}
