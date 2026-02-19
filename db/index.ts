import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { join } from "path";

// Use absolute path to ensure database is always found
const dbPath = join(process.cwd(), "database.db");

// Create database connection
const sqlite = new Database(dbPath);

// Enable foreign keys
sqlite.pragma("foreign_keys = ON");

// Always ensure tables exist - create them if they don't
// Check if tables exist by trying to query them
function ensureTables() {
  try {
    sqlite.prepare("SELECT 1 FROM players LIMIT 1").get();
  } catch {
    // Tables don't exist, create them
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player1_id INTEGER NOT NULL REFERENCES players(id),
        player2_id INTEGER NOT NULL REFERENCES players(id),
        set1_p1 INTEGER NOT NULL,
        set1_p2 INTEGER NOT NULL,
        set2_p1 INTEGER NOT NULL,
        set2_p2 INTEGER NOT NULL,
        set3_p1 INTEGER,
        set3_p2 INTEGER,
        winner_id INTEGER NOT NULL REFERENCES players(id),
        created_at INTEGER NOT NULL
      );
    `);
  }
}

// Initialize tables on module load
ensureTables();

export const db = drizzle(sqlite, { schema });
