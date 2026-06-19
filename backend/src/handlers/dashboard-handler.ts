import { db } from "@/db";
import { booksTable, borrowsTable, memberBorrowsTable } from "@/db/schema";
import { GetDashboardInformationResponse } from "@/dto/dashboard-dto";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { count, sql } from "drizzle-orm";

export async function GetDashboardInformation() {
  try {
    const [countMember, countBorrow, countBook] = await Promise.all([
      db
        .select({
          count_member: sql<number>`COALESCE(COUNT(${memberBorrowsTable.id}), 0)`,
        })
        .from(memberBorrowsTable),
      db
        .select({
          count_borrow: sql<number>`COALESCE(COUNT(${borrowsTable.id}), 0)`,
        })
        .from(borrowsTable),
      db
        .select({
          count_book: sql<number>`COALESCE(COUNT(${booksTable.id}), 0)`,
        })
        .from(booksTable),
    ]);

    const histories = await db
      .select({
        count_borrow: count(borrowsTable.id),
        borrow_at: sql<string>`DATE(${borrowsTable.created_at})`,
      })
      .from(borrowsTable)
      .groupBy(sql`DATE(${borrowsTable.created_at})`);

    const res: GetDashboardInformationResponse = {
      count_borrow: countBorrow[0].count_borrow,
      count_book: countBook[0].count_book,
      count_member: countMember[0].count_member,
      borrow_histories: histories,
    };

    return ResponseOk(res, "sukses mendapatkan informasi dashboard.");
  } catch (error) {
    return ResponseErr("gagal mendapatkan informasi dashboard.", error);
  }
}
