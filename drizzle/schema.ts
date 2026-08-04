import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  businessId: varchar("businessId", { length: 64 }),
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const callConsoleSettings = mysqlTable("callConsoleSettings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  calls: int("calls").default(0),
  ticket: int("ticket").default(0),
  close: int("close").default(100),
  weeks: int("weeks").default(4),
  setup: int("setup").default(0),
  retainer: int("retainer").default(0),
  cost: int("cost").default(0),
  buildcost: int("buildcost").default(0),
  newclients: int("newclients").default(0),
  runningclients: int("runningclients").default(0),
  numbersHidden: int("numbersHidden").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const trackerEntries = mysqlTable("trackerEntries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  date: varchar("date", { length: 256 }).notNull(),
  client: varchar("client", { length: 256 }).notNull(),
  note: text("note"),
  value: int("value").default(0),
  flag: int("flag").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const tradeBenchmarks = mysqlTable("tradeBenchmarks", {
  id: int("id").autoincrement().primaryKey(),
  trade: varchar("trade", { length: 256 }).notNull().unique(), // e.g., 'HVAC', 'Plumbing', 'Electrical'
  avgCalls: int("avgCalls").default(0),
  avgTicket: int("avgTicket").default(0),
  avgClose: int("avgClose").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const objectionResponses = mysqlTable("objectionResponses", {
  id: int("id").autoincrement().primaryKey(),
  objection: text("objection").notNull(),
  response: text("response").notNull(),
  trade: varchar("trade", { length: 256 }), // Optional: specific to a trade
  painPoint: varchar("painPoint", { length: 256 }), // Optional: specific to a pain point
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CallConsoleSettings = typeof callConsoleSettings.$inferSelect;
export type InsertCallConsoleSettings = typeof callConsoleSettings.$inferInsert;

export type TrackerEntry = typeof trackerEntries.$inferSelect;
export type InsertTrackerEntry = typeof trackerEntries.$inferInsert;

export type TradeBenchmark = typeof tradeBenchmarks.$inferSelect;
export type InsertTradeBenchmark = typeof tradeBenchmarks.$inferInsert;

export type ObjectionResponse = typeof objectionResponses.$inferSelect;
export type InsertObjectionResponse = typeof objectionResponses.$inferInsert;

// TODO: Add your tables here