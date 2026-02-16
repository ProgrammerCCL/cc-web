import {
  timestamp,
  pgTable,
  text,
  serial,
  json,
  numeric,
  pgEnum,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";
import { users } from "./auth.schema";

export const transType = pgEnum("trans_type", [
  "sale",
  "refill",
  "deposit",
  "dispense",
  "exchange",
  "endofday",
]);
export const status = pgEnum("status", ["wip", "finish", "cancel", "error"]);

export const transaction = pgTable("transaction", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4().replaceAll("-", "")),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  userName: text("user_name").notNull(), // = users.name
  type: transType("trans_type").notNull(),
  cashIn: json("cash_in").notNull(),
  cashOut: json("cash_out").notNull(),
  status: status("status").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
  fee: numeric("fee", { precision: 10, scale: 2 }).notNull().default("0.00"),
  remarks: text("remarks").default(""),
  createAt: timestamp("create_at").notNull().defaultNow(),

  // World Market
  httpStatus: integer("http_status"),
  isError: boolean("is_error").notNull().default(true),
  erpMessege: text("erp_messege"),
  erpDetail: text("erp_detail"),
});

export const transactionCi = pgTable("transaction_ci", {
  id: serial("id").primaryKey(),
  transId: text("trans_id").references(() => transaction.id, {
    onDelete: "cascade",
  }),
  ciTransId: text("ci_trans_id").notNull(),
});
