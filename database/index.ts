import * as SQLite from 'expo-sqlite';
import * as FileSystem from "expo-file-system";
import { Phrase } from '../types';

let db: SQLite.SQLiteDatabase;

const dbName = "harumal.db"; // Change this to match your actual DB name
const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

export const setupDatabase = async () => {
    try {
            // Check if the database file exists
    const dbInfo = await FileSystem.getInfoAsync(dbPath);

    if (dbInfo.exists) {
      console.log("Deleting existing database...");
      await FileSystem.deleteAsync(dbPath, { idempotent: true });
      console.log("Database deleted successfully.");
    }
        db = await SQLite.openDatabaseAsync('harumal.db');
        await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS phrases (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          korean TEXT NOT NULL, 
          romanization TEXT NOT NULL, 
          english TEXT NOT NULL, 
          category TEXT NOT NULL,
          favorite INTEGER DEFAULT 0
        );
      `);
        console.log("✅ Database initialized");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};

export const insertPhrases = async () => {
    try {
        await db.runAsync(
            'INSERT INTO phrases (korean, romanization, english, category) VALUES (?, ?, ?, ?)',
            '안녕하세요?', 'Annyeonghaseyo?', 'Hello', 'Greetings'
        );
        await db.runAsync(
            'INSERT INTO phrases (korean, romanization, english, category) VALUES (?, ?, ?, ?)',
            '감사합니다!', 'Gamsahamnida!', 'Thank you', 'Polite Phrases'
        );
        console.log("✅ Phrases inserted");
    } catch (error) {
        console.error("Error inserting phrases:", error);
    }
};

export const getPhrases = async (): Promise<Phrase[] | []> => {
    try {
        const data: Awaited<Phrase[] | []> = await db.getAllAsync('SELECT * FROM phrases');
        return data;
    } catch (error) {
        console.error("Error fetching phrases:", error);
        return [];
    }
};

export const verifyData = async () => {
    const data = await db.getAllAsync('SELECT * FROM phrases');
    console.log("Data in 'phrases' table:", data);
};


export const checkTableExists = async () => {
    const result = await db.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='phrases'"
    );
    console.log("Table exists:", result);
};

export const toggleFavorite = async (phraseId: number) => {
    await db.runAsync(
        "UPDATE phrases SET favorite = NOT favorite WHERE id = ?",
        [phraseId]
    );
};
