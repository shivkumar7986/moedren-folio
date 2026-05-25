import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/portfolio";

console.log("⏳ Connecting to database and running migrations...");

const migrationClient = postgres(connectionString, { max: 1 });
const db = drizzle(migrationClient);

try {
  await migrate(db, { migrationsFolder: path.join(__dirname, "../drizzle") });
  console.log("✅ Migrations completed successfully!");
} catch (error) {
  console.error("❌ Migration failed:", error);
  process.exit(1);
} finally {
  await migrationClient.end();
}
