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
          favorite INTEGER DEFAULT 0, 
          usage_count INTEGER DEFAULT 0, 
          is_custom INTEGER DEFAULT 0, 
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const count = await getPhraseCount();
    if (count === 0) {
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
    throw error;
  }
};

/**
 * Inserts phrases into the database if not already present
 */
export const insertPhrases = async () => {
  try {
    const phrases = [
      ["죄송합니다.", "Joesonghamnida.", "I'm sorry", "Apologies"],
      [
        "이름이 뭐예요?",
        "Ireumi mwoyeyo?",
        "What is your name?",
        "Basic Conversation",
      ],
      [
        "제 이름은 ... 입니다.",
        "Je ireumeun ... imnida.",
        "My name is ...",
        "Basic Conversation",
      ],
      ["잘 지내세요?", "Jal jinaeseyo?", "How are you?", "Greetings"],
      ["잘 지내요.", "Jal jinaeyo.", "I'm doing well.", "Responses"],
      ["좋은 아침이에요!", "Joeun achimieyo!", "Good morning!", "Greetings"],
      ["안녕히 주무세요.", "Annyeonghi jumuseyo.", "Good night.", "Farewell"],
      [
        "좋은 하루 보내세요!",
        "Joeun haru bonaeseyo!",
        "Have a nice day!",
        "Polite Phrases",
      ],
      [
        "이것은 얼마예요?",
        "Igeoseun eolmayeyo?",
        "How much is this?",
        "Shopping",
      ],
      [
        "화장실 어디에 있어요?",
        "Hwajangsil eodie isseoyo?",
        "Where is the bathroom?",
        "Travel",
      ],
      ["이거 주세요.", "Igeo juseyo.", "Please give me this.", "Shopping"],
      [
        "매운 음식 좋아하세요?",
        "Maeun eumsik joahaseyo?",
        "Do you like spicy food?",
        "Food",
      ],
      [
        "물을 한 잔 주세요.",
        "Mureul han jan juseyo.",
        "Please give me a glass of water.",
        "Restaurant",
      ],
      [
        "한국 음식 좋아해요.",
        "Hanguk eumsik joahaeyo.",
        "I like Korean food.",
        "Food",
      ],
      [
        "한국어를 배워요.",
        "Hangukeoreul baewoyo.",
        "I am learning Korean.",
        "Education",
      ],
      [
        "천천히 말해주세요.",
        "Cheoncheonhi malhaejuseyo.",
        "Please speak slowly.",
        "Requests",
      ],
      [
        "다시 말해주세요.",
        "Dasi malhaejuseyo.",
        "Please say that again.",
        "Requests",
      ],
      [
        "영어 할 줄 아세요?",
        "Yeongeo hal jul aseyo?",
        "Can you speak English?",
        "Basic Conversation",
      ],
      ["도와주세요!", "Dowajuseyo!", "Help me!", "Emergencies"],
      [
        "병원에 가야 해요.",
        "Byeongwone gaya haeyo.",
        "I need to go to the hospital.",
        "Emergencies",
      ],
      [
        "택시를 불러 주세요.",
        "Taeksireul bulleo juseyo.",
        "Please call a taxi.",
        "Travel",
      ],
      [
        "지하철역 어디예요?",
        "Jihacheollyeok eodiyeyo?",
        "Where is the subway station?",
        "Travel",
      ],
      [
        "버스 정류장은 어디예요?",
        "Beoseu jeongryujangeun eodiyeyo?",
        "Where is the bus stop?",
        "Travel",
      ],
      ["카드 돼요?", "Kadeu dwaeyo?", "Do you accept cards?", "Shopping"],
      ["현금만 돼요?", "Hyeongeumman dwaeyo?", "Is it cash only?", "Shopping"],
      [
        "사진 찍어도 돼요?",
        "Sajin jjigeodo dwaeyo?",
        "Can I take a photo?",
        "Travel",
      ],
      ["길을 잃었어요.", "Gireul ilheosseoyo.", "I'm lost.", "Emergencies"],
      ["천만에요!", "Cheonmaneyo!", "You're welcome!", "Polite Phrases"],
      [
        "어디에서 왔어요?",
        "Eodieseo wasseoyo?",
        "Where are you from?",
        "Basic Conversation",
      ],
      [
        "저는 ...에서 왔어요.",
        "Jeoneun ...eseo wasseoyo.",
        "I am from ...",
        "Basic Conversation",
      ],
      ["몇 시예요?", "Myeot siyeyo?", "What time is it?", "Basic Conversation"],
      [
        "지금 몇 시예요?",
        "Jigeum myeot siyeyo?",
        "What time is it now?",
        "Basic Conversation",
      ],
      ["내일 봐요!", "Naeil bwayo!", "See you tomorrow!", "Farewell"],
      ["다음에 봐요!", "Daeume bwayo!", "See you next time!", "Farewell"],
      ["맛있게 드세요!", "Masitge deuseyo!", "Enjoy your meal!", "Food"],
      ["건배!", "Geonbae!", "Cheers!", "Celebrations"],
      [
        "여기 앉아도 돼요?",
        "Yeogi anjado dwaeyo?",
        "Can I sit here?",
        "Basic Conversation",
      ],
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
  return await executeQuery("SELECT * FROM phrases");
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

/**
 * Fetches the count of phrases in the database
 */
const getPhraseCount = async (): Promise<number> => {
  const result = await executeQuery<{ count: number }>(
    "SELECT COUNT(*) as count FROM phrases"
  );
  return result[0]?.count || 0;
};
