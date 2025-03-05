import * as SQLite from "expo-sqlite";
import { Phrase } from "../types";

let db: SQLite.SQLiteDatabase;
const dbName = "harumal.db";

/**
 * Initializes and returns the database instance
 */
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;

  try {
    db = await SQLite.openDatabaseAsync(dbName);
    return db;
  } catch (error) {
    console.error("Error opening database:", error);
    throw error;
  }
};

export const setupDatabase = async () => {
  try {
    const db = await getDatabase();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS phrases (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        korean TEXT NOT NULL, 
        romanization TEXT NOT NULL, 
        english TEXT NOT NULL, 
        category TEXT NOT NULL,
        favorite INTEGER DEFAULT 0
      );
    `);

    if (db) {
      console.log("📥 Inserting initial phrases...");
      await insertPhrases();
    } else {
      console.log("✅ Database initialized (existing data retained)");
    }
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
};

/**
 * Executes a SQL query with optional parameters
 */
const executeQuery = async <T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> => {
  try {
    const database = await getDatabase();
    return await database.getAllAsync(query, params);
  } catch (error) {
    console.error(`❌ Query Error: ${query}`, error);
    return [];
  }
};

/**
 * Inserts phrases into the database if not already present
 */
export const insertPhrases = async () => {
  try {
    const count = (await db.getFirstAsync(
      "SELECT COUNT(*) as count FROM phrases"
    )) as { count: number };
    if (count.count > 0) {
      console.log("⚠️ Phrases already exist, skipping insertion.");
      return;
    }

    const phrases = [
      ["안녕하세요?", "Annyeonghaseyo?", "Hello", "Greetings"],
      ["감사합니다!", "Gamsahamnida!", "Thank you", "Polite Phrases"],
    ];
    await db.runAsync(
      "INSERT INTO phrases (korean, romanization, english, category) VALUES " +
        phrases.map(() => "(?, ?, ?, ?)").join(", "),
      phrases.flat()
    );

    console.log("✅ Phrases inserted successfully!");
  } catch (error) {
    console.error("❌ Error inserting phrases:", error);
  }
};

/**
 * Fetches all phrases from the database
 */
export const getPhrases = async (): Promise<Phrase[]> => {
  const phrases = await executeQuery("SELECT * FROM phrases");
  console.log("NUMBER OF PHRASES: ", phrases.length);
  return phrases;
};

/**
 * Fetches all favorite phrases
 */
export const getFavoritePhrases = async (): Promise<Phrase[]> => {
  return await executeQuery("SELECT * FROM phrases WHERE favorite = 1");
};

/**
 * Toggles a phrase's favorite status
 */
export const toggleFavorite = async (phraseId: number) => {
  await executeQuery(
    "UPDATE phrases SET favorite = NOT favorite WHERE id = ?",
    [phraseId]
  );
};

/**
 * Removes a phrase from favorites
 */
export const removeFavorite = async (phraseId: number) => {
  await executeQuery("UPDATE phrases SET favorite = 0 WHERE id = ?", [
    phraseId,
  ]);
};

/**
 * Removes all favorite phrases
 */
export const removeAllFavorites = async () => {
  await executeQuery("UPDATE phrases SET favorite = 0 WHERE favorite = 1");
};

/**
 * Verifies stored data
 */
export const verifyData = async () => {
  const data = await getPhrases();
  console.log("📊 Phrases in DB:", data);
};

/**
 * Checks if the 'phrases' table exists
 */
export const checkTableExists = async () => {
  const result = await executeQuery(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='phrases'"
  );
  console.log("✅ Table exists:", result.length > 0);
};
