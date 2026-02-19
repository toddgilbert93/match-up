import { pgTable, text, integer, serial, timestamp } from "drizzle-orm/pg-core";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;
