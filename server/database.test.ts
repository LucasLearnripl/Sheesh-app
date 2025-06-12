// server/database.ts — FAKE in-memory database for testing in Bolt

import { Kysely, Dialect } from 'kysely'

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

// 👇 fake dialect that returns nothing but prevents errors
class NoOpDialect implements Dialect {
  async destroy(): Promise<void> {}
  async init(): Promise<void> {}
  createAdapter() {
    return { supportsReturning: () => false }
  }
  createDriver() {
    return { init: async () => {}, acquireConnection: async () => ({
      beginTransaction: async () => {},
      commitTransaction: async () => {},
      rollbackTransaction: async () => {},
      executeQuery: async () => ({ rows: [] }),
      release: async () => {}
    }) }
  }
  createQueryCompiler() {
    return {
      compileQuery: () => ({ sql: '', parameters: [] }),
      compileMutation: () => ({ sql: '', parameters: [] })
    }
  }
  createIntrospector() {
    return { getSchemas: async () => [], getTables: async () => [] }
  }
}

export const db = new Kysely<DatabaseSchema>({
  dialect: new NoOpDialect()
})
