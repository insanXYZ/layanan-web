import {
  bigint,
  boolean,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
  id: int().primaryKey().autoincrement(),
  name: varchar({
    length: 50,
  }).notNull(),
  email: varchar({
    length: 50,
  })
    .notNull()
    .unique(),
  image: text(),
  password: varchar({ length: 100 }).notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().onUpdateNow(),
});

export const rackBooksTable = mysqlTable("racks", {
  id: int().primaryKey().autoincrement().notNull(),
  name: varchar({ length: 50 }).notNull(),
  created_at: timestamp().defaultNow().notNull(),
});

export const booksTable = mysqlTable("books", {
  id: int().primaryKey().autoincrement().notNull(),
  image: varchar({
    length: 255,
  }),
  quantity: int().notNull().default(0),
  title: varchar({ length: 100 }).notNull(),
  rack_id: int().references(() => rackBooksTable.id, { onDelete: "cascade" }),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().onUpdateNow(),
});

export const memberBorrowsTable = mysqlTable("member_borrows", {
  id: int().primaryKey().autoincrement().notNull(),
  name: varchar({ length: 50 }).notNull(),
  phone_number: varchar({ length: 50 }),
  created_at: timestamp().notNull().defaultNow(),
});

export const borrowsTable = mysqlTable("borrows", {
  id: int().primaryKey().autoincrement().notNull(),
  member_borrow_id: int()
    .notNull()
    .references(() => memberBorrowsTable.id, { onDelete: "cascade" }),
  is_returned: boolean().default(false).notNull(),
  due_date: timestamp().notNull(),
  returned_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
});

export const borrowDetailsTable = mysqlTable("borrow_details", {
  id: int().primaryKey().autoincrement().notNull(),
  book_id: int()
    .notNull()
    .references(() => booksTable.id, { onDelete: "cascade" }),
  quantity: int().notNull(),
  borrow_id: int()
    .notNull()
    .references(() => borrowsTable.id, { onDelete: "cascade" }),
  created_at: timestamp().defaultNow().notNull(),
});

export const feeTable = mysqlTable("fees", {
  id: int().primaryKey().autoincrement().notNull(),
  borrow_id: int()
    .references(() => borrowsTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  user_id: int()
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  price: bigint({
    unsigned: true,
    mode: "bigint",
  }).notNull(),
  created_at: timestamp().defaultNow().notNull(),
});
