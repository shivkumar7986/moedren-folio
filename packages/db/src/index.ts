import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // We don't throw immediately to allow static analysis / build time resolution when env is not fully injected,
  // but we warn and provide a mock/lazy initialization if needed.
  console.warn("⚠️ Warning: DATABASE_URL environment variable is missing.");
}

const client = postgres(connectionString || "postgresql://postgres:password@localhost:5432/portfolio");
export const db = drizzle(client, { schema });

export * from "./schema";
