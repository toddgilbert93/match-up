import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const players = sqliteTable("players", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const matches = sqliteTable("matches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  player1Id: integer("player1_id")
    .notNull()
    .references(() => players.id),
  player2Id: integer("player2_id")
    .notNull()
    .references(() => players.id),
  set1P1: integer("set1_p1").notNull(),
  set1P2: integer("set1_p2").notNull(),
  set2P1: integer("set2_p1").notNull(),
  set2P2: integer("set2_p2").notNull(),
  set3P1: integer("set3_p1"),
  set3P2: integer("set3_p2"),
  winnerId: integer("winner_id")
    .notNull()
    .references(() => players.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;
