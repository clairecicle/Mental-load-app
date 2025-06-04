import sqlite3 from "sqlite3"
import { open, type Database } from "sqlite"
import path from "path"
import fs from "fs"

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), ".data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, "mental-load.db")

// Database singleton to prevent multiple connections
let dbInstance: Database | null = null

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance

  // Open the database connection
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  // Enable foreign keys
  await dbInstance.exec("PRAGMA foreign_keys = ON")

  return dbInstance
}

// Helper function to run SQL with parameters
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = await getDb()
  return db.all<T>(sql, params)
}

// Helper function for single result
export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  const db = await getDb()
  return db.get<T>(sql, params)
}

// Helper function for inserts/updates
export async function execute(sql: string, params: any[] = []): Promise<number> {
  const db = await getDb()
  const result = await db.run(sql, params)
  return result.lastID || 0
}

// Helper function to check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  const result = await queryOne<{ count: number }>(
    `SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name=?`,
    [tableName],
  )
  return result?.count === 1
}
