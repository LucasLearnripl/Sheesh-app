import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import path from 'path';

export interface DatabaseSchema {
  users: {
    id: number;
    username: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    password: string | null;
    display_name: string | null;
    avatar_url: string | null;
    created_at: string;
    is_private: number;
  };
  groups: {
    id: number;
    name: string;
    description: string | null;
    created_by: number;
    is_private: number;
    join_code: string | null;
    created_at: string;
  };
  group_members: {
    id: number;
    group_id: number;
    user_id: number;
    joined_at: string;
  };
  screentime_entries: {
    id: number;
    user_id: number;
    date: string;
    minutes: number;
    category_breakdown: string | null;
    uploaded_at: string;
  };
}

const dataDir = process.env.DATA_DIRECTORY || './data';
const databasePath = path.join(dataDir, 'database.sqlite');

console.log(`📊 Database path: ${databasePath}`);

const sqliteDb = new Database(databasePath);
console.log('✅ SQLite database connected successfully');

export const db = new Kysely<DatabaseSchema>({
  dialect: new SqliteDialect({
    database: sqliteDb,
  }),
  log: ['query', 'error']
});

console.log('✅ Database connection established');