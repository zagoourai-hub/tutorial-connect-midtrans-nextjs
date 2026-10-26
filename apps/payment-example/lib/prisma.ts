import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

export function createDatabase(url: string) {
  if (!url.startsWith("file:")) throw new Error("Contoh ini hanya menggunakan SQLite lokal.");
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
}

const globalDatabase = globalThis as typeof globalThis & { paymentDatabase?: PrismaClient };

export function getDatabase() {
  globalDatabase.paymentDatabase ??= createDatabase(process.env.DATABASE_URL ?? "file:./prisma/dev.db");
  return globalDatabase.paymentDatabase;
}
