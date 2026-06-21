import { and, count, eq, gt, sql } from "drizzle-orm";
import { DateTime } from "luxon";
import { db } from "@/db";
import { booksTable, borrowsTable, memberBorrowsTable } from "@/db/schema";
import { GetDashboardInformationResponse } from "@/dto/dashboard-dto";
import { ResponseErr, ResponseOk } from "@/utils/http";

export async function GetDashboardInformation() {
  try {
    const [
      countMember,
      countBorrow,
      countBook,
      totalReturned,
      totalBorrowed,
      totalLated,
    ] = await Promise.all([
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
      db
        .select({
          total_returned: sql<number>`COALESCE(COUNT(${borrowsTable.id}), 0)`,
        })
        .from(borrowsTable)
        .where(eq(borrowsTable.is_returned, true)),
      db
        .select({
          total_borrowed: sql<number>`COALESCE(COUNT(${borrowsTable.id}), 0)`,
        })
        .from(borrowsTable)
        .where(eq(borrowsTable.is_returned, false)),
      db
        .select({
          total_lated: sql<number>`COALESCE(COUNT(${borrowsTable.id}), 0)`,
        })
        .from(borrowsTable)
        .where(
          and(
            eq(borrowsTable.is_returned, false),
            gt(borrowsTable.due_date, DateTime.now().toJSDate()),
          ),
        ),
    ]);

    const histories = await db
      .select({
        count_borrow: count(borrowsTable.id),
        borrow_at: sql<string>`DATE(${borrowsTable.created_at})`,
      })
      .from(borrowsTable)
      .groupBy(sql`DATE(${borrowsTable.created_at})`);

    const res: GetDashboardInformationResponse = {
      total_borrow: countBorrow[0].count_borrow,
      total_book: countBook[0].count_book,
      total_member: countMember[0].count_member,
      total_returned: totalReturned[0].total_returned,
      total_borrowed: totalBorrowed[0].total_borrowed,
      total_lated: totalLated[0].total_lated,
      borrow_histories: histories,
    };

    return ResponseOk(res, "sukses mendapatkan informasi dashboard.");
  } catch (error) {
    return ResponseErr("gagal mendapatkan informasi dashboard.", error);
  }
}
